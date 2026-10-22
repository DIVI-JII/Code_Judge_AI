import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Problem } from './types';
import { PROBLEMS as DEFAULT_PROBLEMS } from './problemsData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error event captured:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Gets all problems from Firestore. If Firestore is empty, auto-seeds them from the default list.
 */
export async function getProblemsFromDB(): Promise<Problem[]> {
  const colPath = 'problems';
  try {
    const querySnapshot = await getDocs(collection(db, colPath));
    const list: Problem[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Problem);
    });

    if (list.length !== DEFAULT_PROBLEMS.length) {
      console.log('Problems count mismatch in cloud db. Syncing or returning current client-side default problems.');
      return DEFAULT_PROBLEMS;
    }
    
    // Always merge in-memory default challenge test cases to ensure the latest hidden 
    // and public test case definitions are correctly loaded on the client, even if database records are older.
    const mergedList = list.map((dbItem) => {
      const localItem = DEFAULT_PROBLEMS.find(p => p.id === dbItem.id);
      if (localItem) {
        return {
          ...dbItem,
          publicTestCases: localItem.publicTestCases || dbItem.publicTestCases,
          hiddenTestCases: localItem.hiddenTestCases || dbItem.hiddenTestCases,
        };
      }
      return dbItem;
    });

    return mergedList;
  } catch (error) {
    console.warn('Unable to retrieve problems from Cloud Firestore. Falling back to local client-side defaults.', error);
    return DEFAULT_PROBLEMS;
  }
}

/**
 * Helper to recursivly remove undefined fields so Firestore doesn't reject them
 */
function removeUndefinedProperties<T extends Record<string, any>>(obj: T): any {
  const clean: any = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) {
      continue;
    }
    if (val !== null && typeof val === 'object' && val.constructor?.name === 'Object') {
      clean[key] = removeUndefinedProperties(val);
    } else if (Array.isArray(val)) {
      clean[key] = val.map(item => 
        (item !== null && typeof item === 'object' && item.constructor?.name === 'Object') 
          ? removeUndefinedProperties(item) 
          : item
      );
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

/**
 * Saves or updates a problem in Firestore.
 */
export async function saveProblemToDB(problem: Problem): Promise<void> {
  const docPath = `problems/${problem.id}`;
  try {
    const docRef = doc(db, 'problems', problem.id);
    const sanitized = removeUndefinedProperties({
      ...problem,
      updatedAt: serverTimestamp()
    });
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Deletes a problem from Firestore.
 */
export async function deleteProblemFromDB(problemId: string): Promise<void> {
  const docPath = `problems/${problemId}`;
  try {
    const docRef = doc(db, 'problems', problemId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

/**
 * Saves a code submission log in Firestore.
 */
export async function saveSubmissionToDB(
  submissionId: string, 
  payload: {
    userId: string;
    problemId: string;
    langId: string;
    code: string;
    verdict: string;
    passedCount: string;
    runtime?: string;
    memory?: string;
  }
): Promise<void> {
  const docPath = `submissions/${submissionId}`;
  try {
    const docRef = doc(db, 'submissions', submissionId);
    const sanitized = removeUndefinedProperties({
      ...payload,
      id: submissionId,
      submittedAt: serverTimestamp()
    });
    await setDoc(docRef, sanitized);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Synchronizes the local challenges.json with the Cloud Firestore problems database.
 * Erases any old problems that are not part of challenges.json, and inserts/updates new ones.
 * Automatically ran when an authorized operator/developer logs in.
 */
export async function syncChallengesWithDB(): Promise<{
  addedCount: number;
  deletedCount: number;
  total: number;
}> {
  const colPath = 'problems';
  try {
    console.log('[Database Sync] Fetching existing problems from Cloud Firestore to sync...');
    const querySnapshot = await getDocs(collection(db, colPath));
    const dbProblemIds: string[] = [];
    querySnapshot.forEach((docSnap) => {
      dbProblemIds.push(docSnap.id);
    });

    const localIds = DEFAULT_PROBLEMS.map(p => p.id);
    let deletedCount = 0;

    // 1. Delete obsolete items
    for (const id of dbProblemIds) {
      if (!localIds.includes(id)) {
        await deleteProblemFromDB(id);
        deletedCount++;
        console.log(`[Database Sync] Erased obsolete problem from cloud database: ${id}`);
      }
    }

    // 2. Insert or update active ones
    let addedCount = 0;
    for (const p of DEFAULT_PROBLEMS) {
      await saveProblemToDB(p);
      addedCount++;
      console.log(`[Database Sync] Synced problem: ${p.title} (${p.id})`);
    }

    console.log(`[Database Sync] Success! Synced ${addedCount} problems. Removed ${deletedCount} obsoletes.`);
    return {
      addedCount,
      deletedCount,
      total: DEFAULT_PROBLEMS.length
    };
  } catch (error) {
    console.error('[Database Sync] Failed to synchronize:', error);
    handleFirestoreError(error, OperationType.WRITE, 'problems/sync-job');
  }
}





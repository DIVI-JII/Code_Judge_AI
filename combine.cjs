const fs = require('fs');
const path = require('path');

const part1 = require('./build_problems_db_part1.cjs');
const part2 = require('./build_problems_db_part2.cjs');
const part3 = require('./build_problems_db_part3.cjs');

const db = {
  problems: [
    ...part1,
    ...part2,
    ...part3
  ]
};

const jsonContent = JSON.stringify(db, null, 2);

const outputPaths = [
  path.join(__dirname, 'leetcode_clone_db.json'),
  path.join(__dirname, 'leetcode_challenges_database.json')
];

outputPaths.forEach(p => {
  fs.writeFileSync(p, jsonContent, 'utf8');
  console.log(`Successfully wrote ${p}`);
});

console.log(`Total Problems Processed: ${db.problems.length}`);
console.log(`Easy: ${db.problems.filter(p => p.difficulty === 'Easy').length}`);
console.log(`Medium: ${db.problems.filter(p => p.difficulty === 'Medium').length}`);
console.log(`Hard: ${db.problems.filter(p => p.difficulty === 'Hard').length}`);

import fs from 'fs';
import PDFDocument from 'pdfkit';

function buildPDF() {
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
  });

  const outputPath = './CodeJudge_AI_Documentation.pdf';
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // --- Theme Colors ---
  const primaryColor = '#4c1d95'; // Dark Violet
  const accentColor = '#8b5cf6'; // Medium Violet
  const textColor = '#1f2937'; // Slate Dark Gray
  const lightBg = '#f5f3ff'; // Light Violet/Gray
  const subtitleColor = '#4b5563'; // Muted grayish-slate
  const alertBg = '#fef2f2';
  const alertBorder = '#f87171';
  const alertTextColor = '#991b1b';

  // --- Title & Header Banner ---
  doc
    .rect(0, 0, 595.28, 140) // A4 width is 595.28, height is 841.89
    .fill(primaryColor);

  doc
    .fillColor('#ffffff')
    .font('Helvetica-Bold')
    .fontSize(24)
    .text('CodeJudge AI', 50, 45)
    .fontSize(14)
    .font('Helvetica')
    .text('Official Platform Documentation & Architectural Blueprint', 50, 78);

  // Accent horizontal rule below banner
  doc
    .strokeColor(accentColor)
    .lineWidth(3)
    .moveTo(0, 140)
    .lineTo(595.28, 140)
    .stroke();

  // Reset text color for body
  let currentY = 170;

  // --- Section Helper ---
  const addSectionTitle = (title: string) => {
    currentY += 15;
    doc
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .fontSize(15)
      .text(title, 50, currentY);
    
    currentY += 22;
    doc
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .moveTo(50, currentY)
      .lineTo(545, currentY)
      .stroke();
    
    currentY += 12;
  };

  // --- Section 1: Overview ---
  addSectionTitle('1. Platform Overview');
  doc
    .fillColor(textColor)
    .font('Helvetica')
    .fontSize(10.5)
    .text(
      'CodeJudge AI is a high-fidelity, distraction-free LeetCode-style local programming analysis and practice platform. It equips engineers with a modern, eyesafe integrated developer workplace to hone logic skills, trigger mock test simulations, and monitor historical performance metrics securely.',
      50,
      currentY,
      { width: 495, align: 'justify', lineGap: 4 }
    );
  
  currentY += 65;

  // --- Section 2: Core Capabilities ---
  addSectionTitle('2. Implemented Capabilities & Architecture');
  
  const capabilities = [
    {
      title: 'Persistent Database Integration (Cloud Firestore)',
      desc: 'Configured deep connections with active, persistent cloud databases to serve initial programming suites dynamically on start.'
    },
    {
      title: 'Google & Zero-Trust Authentication',
      desc: 'Configured standards-compliant sign-ins with Google to distinguish accounts and securely sync scores.'
    },
    {
      title: 'High-Contrast Dashboard & Modern Slate Theme',
      desc: 'Created a dark-mode-first ambient experience with precise padding, sleek transition tags, and responsive UI status signals.'
    },
    {
      title: 'Real-Time Submission Logs',
      desc: 'Tracks complete diagnostics including status (Solved/Attempted/Unattempted), error states, compile feedback, and temporal state updates.'
    }
  ];

  capabilities.forEach(cap => {
    doc
      .fillColor(accentColor)
      .font('Helvetica-Bold')
      .fontSize(10.5)
      .text('• ' + cap.title, 60, currentY);
    
    currentY += 14;
    
    doc
      .fillColor(textColor)
      .font('Helvetica')
      .fontSize(9.5)
      .text(cap.desc, 70, currentY, { width: 475, align: 'left' });
    
    currentY += 24;
  });

  // Page break for the remaining parts to maintain absolute breathing room
  doc.addPage();
  currentY = 50;

  // --- Section 3: Current State ---
  addSectionTitle('3. Current Technical State');
  doc
    .fillColor(textColor)
    .font('Helvetica')
    .fontSize(10.5)
    .text(
      'To provide ultimate reliability and safeguard core user workflows, the application environment has been pristine-hardened:\n\n' +
      '1. Clean Core Operations: All fragile experimental manual import processes have been replaced with standard, verified database workflows.\n' +
      '2. Absolute Data Sanity: The interface resolves challenges purely against standard official challenges compiled in the cloud database/challenges.json.\n' +
      '3. Flawless Verification: Strict compilation rules were verified and compiled successfully under Vite and React 19+ systems.',
      50,
      currentY,
      { width: 495, lineGap: 5 }
    );

  currentY += 120;

  // --- Section 4: Leftover Things / Deferred Roadmap ---
  addSectionTitle('4. Roadmap & Future Scope (Currently Leftover / Not Done)');

  // Draw an info/alert block for what is left
  doc
    .rect(50, currentY, 495, 115)
    .fill(alertBg)
    .strokeColor(alertBorder)
    .lineWidth(1)
    .stroke();

  doc
    .fillColor(alertTextColor)
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('⚠️ DEFERRED OR PENDING FUNCTIONALITY', 65, currentY + 15);

  doc
    .font('Helvetica')
    .fontSize(10)
    .text(
      '• Customized Challenges: The user-facing capability to import custom external workspace challenge definitions or customized coding worksheets is not functional yet.\n\n' +
      '• Custom Test Scenarios: Adding custom inputs/expected results on the fly directly inside the workspace to execute logic on real-time transient inputs is currently deferred.',
      65,
      currentY + 38,
      { width: 465, lineGap: 4 }
    );

  currentY += 135;

  // --- Footer Metadata ---
  doc
    .strokeColor('#e5e7eb')
    .lineWidth(1)
    .moveTo(50, currentY)
    .lineTo(545, currentY)
    .stroke();

  currentY += 15;
  doc
    .fillColor(subtitleColor)
    .font('Helvetica-Oblique')
    .fontSize(8.5)
    .text('Generated dynamically for: divyasanthigandhi@gmail.com', 50, currentY, { width: 495, align: 'center' });

  doc.end();
  console.log('PDF rendered successfully to: ' + outputPath);
}

buildPDF();

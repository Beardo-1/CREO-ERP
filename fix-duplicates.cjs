const fs = require('fs');

console.log('Starting duplicate key fix...');

try {
  let content = fs.readFileSync('src/content/app.content.ts', 'utf8');
  console.log('File read successfully, length:', content.length);

  const originalLength = content.length;

  // Simple approach: remove the problematic duplicate sections manually
  // Based on the build errors, we need to remove these specific duplicates:

  // Find and remove the second occurrence of downloadReport
  const downloadReportPattern = /downloadReport: \{\s*en: "Download Report",\s*ar: "تحميل التقرير"\s*\}/g;
  const downloadMatches = [...content.matchAll(downloadReportPattern)];
  console.log('Found downloadReport entries:', downloadMatches.length);

  if (downloadMatches.length > 1) {
    // Remove all but the first occurrence
    for (let i = downloadMatches.length - 1; i >= 1; i--) {
      const match = downloadMatches[i];
      const start = match.index;
      const end = start + match[0].length;
      // Also remove the comma if present
      let actualEnd = end;
      if (content[end] === ',' || content[end] === '\n') {
        actualEnd = end + 1;
      }
      content = content.substring(0, start) + content.substring(actualEnd);
    }
    console.log('Removed duplicate downloadReport entries');
  }

  // Similar approach for other duplicates
  const patterns = [
    { name: 'overdue', pattern: /overdue: \{\s*en: "Overdue",\s*ar: "متأخر"\s*\}/g },
    { name: 'high', pattern: /high: \{\s*en: "High",\s*ar: "عالي"\s*\}/g },
    { name: 'medium', pattern: /medium: \{\s*en: "Medium",\s*ar: "متوسط"\s*\}/g },
    { name: 'low', pattern: /low: \{\s*en: "Low",\s*ar: "منخفض"\s*\}/g },
    { name: 'allStatus', pattern: /allStatus: \{\s*en: "All Status",\s*ar: "جميع الحالات"\s*\}/g },
    { name: 'active', pattern: /active: \{\s*en: "Active",\s*ar: "نشط"\s*\}/g },
    { name: 'viewDetails', pattern: /viewDetails: \{\s*en: "View Details",\s*ar: "عرض التفاصيل"\s*\}/g },
    { name: 'scheduled', pattern: /scheduled: \{\s*en: "Scheduled",\s*ar: "مجدولة"\s*\}/g },
    { name: 'completed', pattern: /completed: \{\s*en: "Completed",\s*ar: "مكتملة"\s*\}/g },
    { name: 'actions', pattern: /actions: \{\s*en: "Actions",\s*ar: "الإجراءات"\s*\}/g }
  ];

  patterns.forEach(({ name, pattern }) => {
    const matches = [...content.matchAll(pattern)];
    if (matches.length > 1) {
      console.log(`Found ${matches.length} ${name} entries, removing duplicates...`);
      // Remove all but the first occurrence (working backwards to maintain indices)
      for (let i = matches.length - 1; i >= 1; i--) {
        const match = matches[i];
        const start = match.index;
        const end = start + match[0].length;
        // Look for comma and newline to remove
        let actualEnd = end;
        if (content.substring(end, end + 2) === ',\n') {
          actualEnd = end + 2;
        } else if (content[end] === ',') {
          actualEnd = end + 1;
        }
        content = content.substring(0, start) + content.substring(actualEnd);
      }
    }
  });

  // Clean up any extra commas and whitespace
  content = content.replace(/,(\s*\})/g, '$1');
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  fs.writeFileSync('src/content/app.content.ts', content);
  console.log('File written successfully! Reduced from', originalLength, 'to', content.length, 'characters');
  console.log('Duplicate keys fixed successfully!');
} catch (error) {
  console.error('Error:', error);
} 
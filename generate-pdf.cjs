const puppeteer = require('puppeteer');
const fs = require('fs');
const { marked } = require('marked');

async function generatePDF() {
  try {
    // Read the markdown file
    const markdownContent = fs.readFileSync('CREO_vs_Competitors_Analysis.md', 'utf8');
    
    // Convert markdown to HTML
    const htmlContent = marked(markdownContent);
    
    // Create full HTML document with styling
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CREO vs Competitors Analysis</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 5px;
            margin-top: 30px;
        }
        h3 {
            color: #34495e;
            margin-top: 25px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
            font-size: 12px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .emoji {
            font-size: 14px;
        }
        blockquote {
            border-left: 4px solid #3498db;
            margin: 0;
            padding-left: 20px;
            font-style: italic;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
        }
        pre {
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
        @page {
            margin: 1in;
            size: A4;
        }
        @media print {
            body {
                max-width: none;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

    // Launch browser and create PDF
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: 'CREO_vs_Competitors_Analysis.pdf',
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%;">CREO vs Competitors Analysis</div>',
      footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
    });
    
    await browser.close();
    
    console.log('✅ PDF generated successfully: CREO_vs_Competitors_Analysis.pdf');
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
  }
}

generatePDF(); 
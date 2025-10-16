# 🔧 Google Apps Script Fix - Wissensdatenbank API

## 🐛 Problem
The API is returning **empty articles array** but navigation is working fine.

**API Response:**
```json
{
  "articles": [],          // ❌ EMPTY!
  "navigation": [...]      // ✅ Working
}
```

## 🎯 Root Cause
Looking at your Apps Script screenshot, the issue is likely:
1. **Articles array is initialized empty** and never populated
2. **ARTICLE_INDEX constant** might not be configured correctly
3. **Document parsing logic** is not extracting the articles from Google Docs

## ✅ Complete Fix

### Step 1: Open Your Google Apps Script
1. Go to: https://script.google.com
2. Open your project: `modual-website-datasheet-dc-dev`
3. Find the `doGet()` function

### Step 2: Update Your Script

Replace your entire script with this corrected version:

```javascript
// ===========================
// CONFIGURATION
// ===========================

// 📄 Add your Google Doc IDs here
const ARTICLE_DOCS = {
  "installation-guide": "YOUR_GOOGLE_DOC_ID_1",
  "benutzerhandbuch": "YOUR_GOOGLE_DOC_ID_2",
  "troubleshooting": "YOUR_GOOGLE_DOC_ID_3",
  // Add more articles here
};

// ===========================
// MAIN FUNCTION
// ===========================

function doGet(e) {
  try {
    // Build articles array
    const articles = [];
    
    // Extract each article from its Google Doc
    for (const [articleId, docId] of Object.entries(ARTICLE_DOCS)) {
      try {
        const doc = DocumentApp.openById(docId);
        const body = doc.getBody();
        const title = doc.getName();
        
        // Convert Google Doc to HTML
        const htmlContent = convertDocToHtml(body);
        
        // Determine category from navigation
        const category = getCategoryForArticle(articleId);
        
        articles.push({
          id: articleId,
          title: title,
          category: category,
          content: htmlContent,
          searchKeywords: extractSearchKeywords(htmlContent)
        });
        
      } catch (docError) {
        Logger.log(`Error loading doc ${articleId}: ${docError.message}`);
      }
    }
    
    // Build navigation structure
    const navigation = [
      {
        title: "Getting Started",
        children: [
          { id: "installation-guide", title: "Installationsanleitung", icon: "book" },
          { id: "benutzerhandbuch", title: "Benutzerhandbuch", icon: "file-text" }
        ]
      },
      {
        title: "Support",
        children: [
          { id: "troubleshooting", title: "Fehlerbehebung", icon: "tool" }
        ]
      }
    ];
    
    // Return JSON response
    const response = {
      articles: articles,
      navigation: navigation
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log(`Error in doGet: ${error.message}`);
    
    // Return error response
    const errorResponse = {
      articles: [],
      navigation: [],
      error: error.message
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===========================
// HELPER FUNCTIONS
// ===========================

function convertDocToHtml(body) {
  let html = '';
  const paragraphs = body.getParagraphs();
  
  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];
    const text = para.getText();
    
    if (!text.trim()) continue;
    
    const heading = para.getHeading();
    
    if (heading === DocumentApp.ParagraphHeading.HEADING1) {
      html += `<h1>${text}</h1>\n`;
    } else if (heading === DocumentApp.ParagraphHeading.HEADING2) {
      html += `<h2>${text}</h2>\n`;
    } else if (heading === DocumentApp.ParagraphHeading.HEADING3) {
      html += `<h3>${text}</h3>\n`;
    } else {
      html += `<p>${text}</p>\n`;
    }
  }
  
  // Process tables
  const tables = body.getTables();
  for (let i = 0; i < tables.length; i++) {
    html += convertTableToHtml(tables[i]);
  }
  
  return html;
}

function convertTableToHtml(table) {
  let html = '<table class="docs-table">\n';
  
  for (let row = 0; row < table.getNumRows(); row++) {
    html += '<tr>';
    const tableRow = table.getRow(row);
    
    for (let col = 0; col < tableRow.getNumCells(); col++) {
      const cell = tableRow.getCell(col);
      const cellText = cell.getText();
      
      if (row === 0) {
        html += `<th>${cellText}</th>`;
      } else {
        html += `<td>${cellText}</td>`;
      }
    }
    
    html += '</tr>\n';
  }
  
  html += '</table>\n';
  return html;
}

function getCategoryForArticle(articleId) {
  const categoryMap = {
    "installation-guide": "Installation",
    "benutzerhandbuch": "Bedienung",
    "troubleshooting": "Support"
  };
  
  return categoryMap[articleId] || "Allgemein";
}

function extractSearchKeywords(htmlContent) {
  // Remove HTML tags
  const text = htmlContent.replace(/<[^>]*>/g, ' ');
  
  // Extract unique words (minimum 4 characters)
  const words = text.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length >= 4);
  
  return [...new Set(words)].join(' ');
}
```

### Step 3: Get Your Google Doc IDs

For each documentation article:

1. Open the Google Doc (e.g., "Website-Docu-Test-Datenblatt_SerieBasic-DC_11_DE_v3.0")
2. Copy the **Document ID** from the URL:
   ```
   https://docs.google.com/document/d/YOUR_DOC_ID_HERE/edit
                                     ^^^^^^^^^^^^^^^^^
                                     This is your Doc ID
   ```
3. Add it to the `ARTICLE_DOCS` object:
   ```javascript
   const ARTICLE_DOCS = {
     "datenblatt-basic-11": "1ABC123...",  // Replace with actual ID
     "installation-guide": "1DEF456...",
     // etc.
   };
   ```

### Step 4: Configure Permissions

1. In Apps Script, click **▶ Run** to test the `doGet` function
2. Grant permissions when prompted:
   - ✅ Allow access to Google Docs
   - ✅ Allow external requests

### Step 5: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Settings:
   - **Type**: Web app
   - **Execute as**: Me
   - **Who has access**: Anyone
3. Click **Deploy**
4. Copy the **Web app URL**

### Step 6: Update Your Website

If the API URL changed, update `wissensdatenbank.js` line 2:

```javascript
const DOCS_API_URL = 'YOUR_NEW_WEB_APP_URL_HERE';
```

## 🧪 Testing

### Test 1: Direct API Call
Open this URL in your browser:
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

You should see:
```json
{
  "articles": [
    {
      "id": "datenblatt-basic-11",
      "title": "Datenblatt Serie Basic 11",
      "category": "Produkte",
      "content": "<h1>Datenblatt...</h1>",
      "searchKeywords": "..."
    }
  ],
  "navigation": [...]
}
```

### Test 2: Website
1. Open `wissensdatenbank.html`
2. Check browser console (F12):
   ```
   ✅ Docs data loaded successfully
   📚 Number of articles: 3
   ```
3. Articles should now display!

## 🔍 Debugging Tips

### If still empty:

1. **Check Apps Script Logs**:
   - Go to Apps Script
   - Click **Executions** tab
   - Look for errors

2. **Test Individual Docs**:
   ```javascript
   function testDocAccess() {
     const docId = "YOUR_DOC_ID";
     const doc = DocumentApp.openById(docId);
     Logger.log(doc.getName());
     Logger.log(doc.getBody().getText());
   }
   ```

3. **Check Permissions**:
   - Make sure the script has access to your Google Docs
   - Try sharing the docs with "Anyone with link can view"

4. **Clear Website Cache**:
   - Open browser console
   - Run: `window.modualDocsDebug.clearCache()`
   - Reload page

## 📋 Checklist

- [ ] Update ARTICLE_DOCS with real Google Doc IDs
- [ ] Test script in Apps Script editor
- [ ] Grant necessary permissions
- [ ] Deploy as web app
- [ ] Test API URL directly
- [ ] Clear browser cache
- [ ] Reload wissensdatenbank.html
- [ ] Verify articles appear

## 🆘 Still Having Issues?

If articles still don't appear:

1. Open browser console (F12)
2. Look for error messages
3. Check the response from the API
4. Verify Google Doc IDs are correct
5. Make sure docs are accessible (not in Trash, have correct permissions)

---

**Your Current API URL:**
```
https://script.google.com/macros/s/AKfycbze2YcwvdF3DkglLEPcPdnBiMN0RNRhR6e-Mzekl7rZO8Y-010EvS62dCtOELgIV4a2jQ/exec
```

This should be returning articles after you fix the script! 🚀

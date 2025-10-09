# Reusable Components

This directory contains reusable header and footer components for the modual website.

## Files

- **header.html** - Navigation header with mega menu
- **footer.html** - Footer with company info, links, and social media
- **loader.js** - JavaScript utility to dynamically load components

## Usage

### 1. Add Component Placeholders

In your HTML page, add placeholder elements where you want the header and footer:

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <!-- Your meta tags, styles, etc. -->
    <link rel="stylesheet" href="styles.css">
    <script src="https://unpkg.com/feather-icons"></script>
</head>
<body>
    <!-- Header Placeholder -->
    <div id="header-placeholder"></div>

    <!-- Your page content -->
    <section>
        <h1>Your Content</h1>
    </section>

    <!-- Footer Placeholder -->
    <div id="footer-placeholder"></div>

    <!-- Load Components -->
    <script src="components/loader.js"></script>
    
    <!-- Your other scripts -->
    <script src="script.js"></script>
</body>
</html>
```

### 2. File Structure

Make sure your project structure looks like this:

```
/
├── index.html
├── your-page.html
├── styles.css
├── script.js
└── components/
    ├── header.html
    ├── footer.html
    ├── loader.js
    └── README.md
```

### 3. That's It!

The components will automatically load when the page loads. The loader script:
- Fetches the header and footer HTML
- Inserts them into the placeholders
- Initializes Feather icons
- Sets up mega menu functionality

## Benefits

✅ **Consistency** - Same header/footer across all pages
✅ **Easy Updates** - Edit once, applies everywhere  
✅ **Clean Code** - No copy-pasted HTML
✅ **Maintainability** - Single source of truth

## Example

See `template-example.html` for a working example.

## Troubleshooting

**Components not loading?**
- Make sure you're running a local server (not opening files directly)
- Check browser console for errors
- Verify file paths are correct relative to your HTML file

**Icons not showing?**
- Ensure Feather icons is loaded: `<script src="https://unpkg.com/feather-icons"></script>`
- Check that `feather.replace()` is called after components load

**Mega menu not working?**
- Ensure `script.js` is loaded after `loader.js`
- Check that `initMegaMenu()` function exists in your script.js

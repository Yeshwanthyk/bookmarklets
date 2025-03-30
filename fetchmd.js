// Markdown Converter Bookmarklet
// This bookmarklet converts the content of a webpage to Markdown and copies it to clipboard
(function () {
  // Create a script element to load the TurndownJS library
  let script = document.createElement('script');
  script.src = 'https://unpkg.com/turndown/dist/turndown.js';

  // Once the library is loaded, execute the conversion
  script.onload = function () {
    // Initialize TurndownService with custom configuration options
    const turndownService = new TurndownService({
      headingStyle: 'atx',          // Use # style headings
      hr: '---',                    // Horizontal rule format
      bulletListMarker: '-',        // Use - for bullet lists
      codeBlockStyle: 'fenced',     // Use ``` for code blocks
      emDelimiter: '*'              // Use * for emphasis
    });

    // Add custom rule to handle code blocks
    turndownService.addRule('codeBlocks', {
      filter: ['pre', 'code'],
      replacement: function (content, node) {
        return '\n```\n' + node.textContent + '\n```\n';
      }
    });

    // Add custom rule to handle line breaks
    turndownService.addRule('lineBreaks', {
      filter: 'br',
      replacement: function () {
        return '\n';
      }
    });

    // Add custom rule to handle lists
    turndownService.addRule('lists', {
      filter: ['ul', 'ol'],
      replacement: function (content) {
        return '\n' + content + '\n';
      }
    });

    // Try to find the main content of the page using common selectors
    let mainContent = document.querySelector('main') ||
      document.querySelector('article') ||
      document.querySelector('.content') ||
      document.body;

    // Convert the HTML to markdown
    let markdown = turndownService.turndown(mainContent);

    // Clean up code blocks to preserve indentation
    markdown = markdown.replace(/```[\s\S]*?```/g, function (match) {
      return match.replace(/^(\s*)(.*)$/gm, '$1$2');
    });

    // Copy the markdown to clipboard
    navigator.clipboard.writeText(markdown).catch(() => {
      // Fallback method if clipboard API fails
      let textArea = document.createElement('textarea');
      textArea.value = markdown;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    });

    // Show a success notification
    let notification = document.createElement('div');
    notification.textContent = '✓ Markdown copied';
    notification.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#4caf50;color:white;padding:10px 20px;border-radius:4px;z-index:9999;';
    document.body.appendChild(notification);

    // Remove the notification after 2 seconds
    setTimeout(() => notification.remove(), 2000);
  };

  // Add the TurndownJS script to the document
  document.head.appendChild(script);
})();

// content.js

// Extract and send image URLs to the background script
const imageUrls = Array.from(document.getElementsByTagName('img')).map(img => img.src);
chrome.runtime.sendMessage({ type: "sendImages", images: imageUrls });

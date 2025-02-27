// content.js
// This script will run in the context of web pages
// It can be used to extract domain-related information from websites

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractDomainData') {
    // Extract domain data from the current page
    // This is just a placeholder for actual implementation
    const pageData = {
      url: window.location.href,
      title: document.title,
      // Additional data could be scraped here
    };
    
    sendResponse({ success: true, data: pageData });
  }
  return true;
});

// Optional: Add functionality to detect expired domain lists on certain websites
// and provide a quick way to filter them based on user's criteria
document.addEventListener('DOMContentLoaded', () => {
  // Check if current page contains expired domain lists
  const isDomainListPage = 
    window.location.href.includes('expireddomains.net') || 
    window.location.href.includes('domainhunter.com');
  
  if (isDomainListPage) {
    // Notify the background script that we're on a domain list page
    chrome.runtime.sendMessage({
      action: 'onDomainListPage',
      url: window.location.href
    });
    
    // Add a floating button to enable quick filtering
    const filterButton = document.createElement('div');
    filterButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 15px;
      background-color: #4285f4;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-weight: bold;
    `;
    filterButton.textContent = 'Apply Domain Filters';
    
    filterButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });
    
    document.body.appendChild(filterButton);
  }
});

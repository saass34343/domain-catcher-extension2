// popup.js
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const startScanButton = document.getElementById('startScan');
  const clearResultsButton = document.getElementById('clearResults');
  const resultsCount = document.getElementById('resultsCount');
  const domainList = document.getElementById('domainList');
  
  // Load saved domains
  loadDomains();
  
  // Add event listeners
  startScanButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0].url.includes('expireddomains.net')) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "startScan"});
      } else {
        alert('Please navigate to member.expireddomains.net/domains/pendingdelete/ first');
      }
    });
  });
  
  clearResultsButton.addEventListener('click', function() {
    chrome.storage.local.set({domains: []}, function() {
      loadDomains();
    });
  });
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "domainsFound") {
      chrome.storage.local.get(['domains'], function(result) {
        let domains = result.domains || [];
        domains = domains.concat(request.domains);
        // Remove duplicates
        domains = [...new Set(domains)];
        chrome.storage.local.set({domains: domains}, function() {
          loadDomains();
        });
      });
    }
  });
  
  // Function to load domains from storage
  function loadDomains() {
    chrome.storage.local.get(['domains'], function(result) {
      const domains = result.domains || [];
      resultsCount.textContent = domains.length + ' domains found';
      
      domainList.innerHTML = '';
      domains.forEach(function(domain) {
        const domainItem = document.createElement('div');
        domainItem.className = 'domain-item';
        domainItem.textContent = domain;
        domainList.appendChild(domainItem);
      });
    });
  }
});

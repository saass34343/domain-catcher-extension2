// popup.js
document.addEventListener('DOMContentLoaded', function() {
  const startSearchButton = document.getElementById('start-search');
  const resultsContainer = document.getElementById('results');
  const loader = document.getElementById('loader');
  
  startSearchButton.addEventListener('click', function() {
    // Get filter values
    const svMin = parseInt(document.getElementById('sv-min').value) || 10;
    const svMax = parseInt(document.getElementById('sv-max').value) || 9999;
    const cpcMax = parseFloat(document.getElementById('cpc-max').value) || 1;
    const minLength = parseInt(document.getElementById('min-length').value) || 8;
    const maxLength = parseInt(document.getElementById('max-length').value) || 24;
    const adultFilter = document.getElementById('adult-filter').checked;
    
    // Show loading indicator
    loader.style.display = 'block';
    resultsContainer.innerHTML = '';
    
    // Send message to background script with search criteria
    chrome.runtime.sendMessage({
      action: 'searchDomains',
      filters: {
        svMin,
        svMax,
        cpcMax,
        minLength,
        maxLength,
        adultFilter,
        tlds: ['.net', '.co'],
        charactersOnly: true
      }
    }, function(response) {
      // Hide loading indicator
      loader.style.display = 'none';
      
      if (response && response.domains && response.domains.length > 0) {
        // Display results
        resultsContainer.innerHTML = '';
        response.domains.forEach(domain => {
          const domainItem = document.createElement('div');
          domainItem.className = 'domain-item';
          
          domainItem.innerHTML = `
            <div class="domain-name">${domain.name}</div>
            <div class="domain-stats">
              <span>SV: ${domain.sv}</span>
              <span>CPC: $${domain.cpc.toFixed(2)}</span>
              <span>Avail: ${domain.available ? 'Yes' : 'No'}</span>
            </div>
          `;
          
          resultsContainer.appendChild(domainItem);
        });
      } else {
        // No results found
        resultsContainer.innerHTML = '<div class="no-results">No matching domains found</div>';
      }
    });
  });
});

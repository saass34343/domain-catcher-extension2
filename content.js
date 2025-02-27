// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "startScan") {
    scanDomains();
  }
});

function scanDomains() {
  // Get all domain rows from the table
  const domainRows = document.querySelectorAll('table.base1 tbody tr');
  const matchedDomains = [];

  domainRows.forEach(row => {
    // Extract domain name
    const domainNameElement = row.querySelector('td.field_domain a');
    if (!domainNameElement) return;
    
    const domainName = domainNameElement.textContent.trim();
    
    // Filter by length (8-24 characters)
    if (domainName.length < 8 || domainName.length > 24) return;
    
    // Check if it contains only letters, numbers, and hyphens (no adult terms check is basic here)
    if (!/^[a-zA-Z0-9-]+$/.test(domainName)) return;
    
    // Look for adult keywords (basic check)
    const adultTerms = ['sex', 'porn', 'adult', 'xxx', 'nude', 'naked'];
    if (adultTerms.some(term => domainName.toLowerCase().includes(term))) return;
    
    // Extract SV (Search Volume)
    const svElement = row.querySelector('td.field_searchvolume');
    const svText = svElement ? svElement.textContent.trim() : '0';
    const sv = parseInt(svText.replace(/,/g, '')) || 0;
    
    // Check SV criteria (10-9999)
    if (sv < 10 || sv > 9999) return;
    
    // Extract CPC
    const cpcElement = row.querySelector('td.field_avgcpc');
    const cpcText = cpcElement ? cpcElement.textContent.trim() : '0';
    const cpc = parseFloat(cpcText.replace('$', '')) || 0;
    
    // Check CPC criteria (up to $1)
    if (cpc > 1) return;
    
    // Check if it's a .net or .co domain
    const tldMatch = domainName.match(/\.(net|co)$/i);
    if (!tldMatch) return;
    
    // Check .com availability (would need checking the detailed page)
    // Note: This is a simplified check. For a more accurate check,
    // you would need to open each domain page.
    const comAvailableElement = row.querySelector('td.field_statuscom');
    const comAvailable = comAvailableElement ? comAvailableElement.textContent.trim() === 'available' : false;
    
    if (!comAvailable) return;
    
    // Domain matches all criteria
    matchedDomains.push(domainName);
  });

  // Send matched domains to popup
  if (matchedDomains.length > 0) {
    chrome.runtime.sendMessage({
      action: "domainsFound",
      domains: matchedDomains
    });
  }
  
  // Alert user
  alert(`Scan complete! Found ${matchedDomains.length} domains matching your criteria.`);
}

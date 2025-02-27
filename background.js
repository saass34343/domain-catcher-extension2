// background.js
// Dictionary of adult content keywords to filter out
const adultKeywords = [
  'sex', 'porn', 'adult', 'xxx', 'nude', 'naked', 'casino', 'gambling',
  'bet', 'escort', 'dating', 'mature', 'viagra', 'cialis', 'drug'
];

// API endpoints for domain data (you'll need to replace these with actual APIs)
const DOMAIN_API = {
  EXPIRED_DOMAINS: 'https://api.expireddomains.net/v1/expired',
  DOMAIN_METRICS: 'https://api.domainmetrics.com/v1/metrics',
  DOMAIN_AVAILABILITY: 'https://api.domainchecker.com/v1/check'
};

// Function to check if a domain contains adult content
function containsAdultContent(domainName) {
  return adultKeywords.some(keyword => 
    domainName.toLowerCase().includes(keyword)
  );
}

// Function to check if domain contains only characters (no numbers)
function containsOnlyCharacters(domainName) {
  // Remove TLD and check if the domain name contains only letters
  const domainWithoutTld = domainName.split('.')[0];
  return /^[a-zA-Z]+$/.test(domainWithoutTld);
}

// Main function to search for domains based on criteria
async function searchExpiredDomains(filters) {
  try {
    // In a real extension, you would make API calls to get expired domains
    // For this example, we'll simulate some sample domains
    
    // Sample domain data (in a real extension, this would come from API)
    const sampleDomains = [
      { name: 'businessgrowth.net', sv: 1200, cpc: 0.85, available: true },
      { name: 'marketinghelp.co', sv: 850, cpc: 0.65, available: true },
      { name: 'softwaretools.net', sv: 2500, cpc: 0.95, available: false },
      { name: 'travelplanner.co', sv: 3400, cpc: 0.75, available: true },
      { name: 'healthadvice.net', sv: 4200, cpc: 0.88, available: true },
      { name: 'learningcenter.co', sv: 980, cpc: 0.55, available: true },
      { name: 'cookingrecipes.net', sv: 7500, cpc: 0.92, available: false },
      { name: 'sportstips.co', sv: 1800, cpc: 0.78, available: true },
      { name: 'investmenthelp.net', sv: 5600, cpc: 0.98, available: true },
      { name: 'photographyguide.co', sv: 1250, cpc: 0.70, available: true },
      { name: 'educationportal.net', sv: 3800, cpc: 0.82, available: false },
      { name: 'jobsearchhelp.co', sv: 4500, cpc: 0.87, available: true },
      { name: 'petcaretips.net', sv: 2200, cpc: 0.72, available: true },
      { name: 'fashiontrends.co', sv: 8300, cpc: 0.94, available: false },
      { name: 'homedecorideas.net', sv: 3100, cpc: 0.68, available: true }
    ];
    
    // Filter domains based on criteria
    const filteredDomains = sampleDomains.filter(domain => {
      // Check TLD
      const tld = '.' + domain.name.split('.').pop();
      const hasTld = filters.tlds.includes(tld);
      
      // Check SV range
      const hasValidSV = domain.sv >= filters.svMin && domain.sv <= filters.svMax;
      
      // Check CPC
      const hasValidCPC = domain.cpc <= filters.cpcMax;
      
      // Check domain length
      const domainWithoutTld = domain.name.split('.')[0];
      const hasValidLength = 
        domainWithoutTld.length >= filters.minLength && 
        domainWithoutTld.length <= filters.maxLength;
      
      // Check if contains only characters if required
      const isValidCharacters = !filters.charactersOnly || containsOnlyCharacters(domain.name);
      
      // Check for adult content if filter is enabled
      const isNotAdult = !filters.adultFilter || !containsAdultContent(domain.name);
      
      return hasTld && hasValidSV && hasValidCPC && hasValidLength && 
             isValidCharacters && isNotAdult;
    });
    
    return { success: true, domains: filteredDomains };
  } catch (error) {
    console.error('Error searching for domains:', error);
    return { success: false, error: error.message };
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'searchDomains') {
    // Call the search function with filters
    searchExpiredDomains(request.filters).then(result => {
      sendResponse(result);
    });
    
    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});

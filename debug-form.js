// Add this to your browser console to debug form submission
window.debugFormSubmission = function() {
  // Override the form submit handler to add debugging
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    console.log('🔍 API Request:', args[0], args[1]?.body ? JSON.parse(args[1].body) : 'No body');
    return originalFetch.apply(this, args).then(response => {
      console.log('🔍 API Response:', response.status, response.statusText);
      return response.text().then(text => {
        console.log('🔍 Response body:', text);
        try {
          return { ...response, text: () => Promise.resolve(text), json: () => Promise.resolve(JSON.parse(text)) };
        } catch {
          return { ...response, text: () => Promise.resolve(text) };
        }
      });
    }).catch(error => {
      console.error('❌ API Error:', error);
      throw error;
    });
  };
  
  console.log('✅ Form debugging enabled. Try submitting the form now.');
  console.log('📋 Check console for API request/response details');
}

console.log('🔧 To enable form debugging, run: debugFormSubmission()');

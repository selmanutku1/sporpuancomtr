const fetch = require('node-fetch');

async function check() {
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return console.log('no key');
  
  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.photos'
    },
    body: JSON.stringify({
      textQuery: 'macfit istanbul'
    })
  });
  const data = await response.json();
  console.log(data);
}
check();

const http = require('http');

http.get('http://localhost:3000/tesis/ChIJ0yRtwEOFwxQRyknoOUlR6uY', { headers: { 'Accept': 'text/html' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data.slice(0, 1500));
  });
});

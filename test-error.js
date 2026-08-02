const express = require('express');
const app = express();
app.post('/error', (req, res) => {
  throw new Error("Test error");
});
app.listen(3001, () => console.log('started'));

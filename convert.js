const sharp = require('sharp');
sharp('public/og-image.svg')
  .png()
  .toFile('public/og-image.png')
  .then(info => console.log('Converted:', info))
  .catch(err => console.error(err));

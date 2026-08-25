const http = require('http');

// Wait a second and make request
setTimeout(() => {
  http.get('http://localhost:3000/limitless/html/layout_6/full/sac_novo_chamado.html', (res) => {
    console.log('STATUS:', res.statusCode);
    console.log('CONTENT-TYPE:', res.headers['content-type']);
    res.on('data', (chunk) => {
      console.log('BODY SNIPPET:', chunk.toString().slice(0, 100));
      process.exit(0);
    });
  }).on('error', (e) => {
    console.error('ERROR:', e.message);
    process.exit(1);
  });
}, 1000);

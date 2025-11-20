const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/produtos/seed',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta:', data);
  });
});

req.on('error', (error) => {
  console.error('Erro:', error);
});

req.end();

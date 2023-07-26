const http = require('http');
const app2 = require('./app2');

const port = process.env.PORT || 4000;

const server = http.createServer(app2);

server.listen(port);

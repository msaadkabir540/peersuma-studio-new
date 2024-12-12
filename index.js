const express = require('express');
const compression = require('compression');
const app = express();
const path = require('path');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const dbConnection = require('./config/database');
const corsOption = {
  origin: '*',
  credentials: true,
  exposedHeaders: ['authorization'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(compression());

app.use(cors(corsOption));
app.use('/api/', require('./app/app'));

app.use('/public', express.static(path.join(__dirname, './public')));

app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

const server = http.createServer(app);

const setPort = process.env.PORT || 8080;

dbConnection().then(() => {
  server.listen(setPort, () =>
    console.log(`Template is running on PORT # ${setPort}`)
  );
});

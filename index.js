const express = require('express');
const createPDF = require('./src/create-pdf.js');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json()); // for parsing application/json
app.use(cors())
const fs = require('fs');

app.get('/healthcheck', (req,res) => {
  res.status(200);
  res.send("Healthcheck good")
});

app.listen(port, () => {
  console.log(`Rezhelp backend listening at http://localhost:${port}`);
});
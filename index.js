'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');

const WebSocket = require('ws');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

let connectedClients = [];
let audioStream = [];

wss.on('connection', function (ws) {
  console.log("Connected");
  connectedClients.push(ws);
  ws.on("message", (data) => {
    audioStream.push(data);
    connectedClients.forEach((client, i) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      } else {
        connectedClients.splice(i, 1);
      }
    });
  });
  ws.on("close", () => {
    console.log("Closing Client");
    audioStream.push(null); // Signal the end of the stream
  });
});

server.listen(8080, function () {
  console.log('Listening on http://0.0.0.0:8080');
});

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
        client.send(data);

    });
  });
  ws.on("close", () => {
    console.log("Closing Client");
    audioStream.push(null); // Signal the end of the stream
  });
});

server.listen(80, function () {
  console.log('Listening on http://0.0.0.0:8080');
});

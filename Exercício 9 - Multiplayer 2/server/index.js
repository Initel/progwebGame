const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const Datauri = require('datauri');
const datauri = new Datauri();

app.use(express.static(path.join(__dirname, '../public')));

let players = {};

function setupAuthoritativePhaser() {
  JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true
  }).then((dom) => {
    // polyfill createObjectURL used by some libs
    dom.window.URL.createObjectURL = (blob) => {
      if (blob) {
        // datauri expects buffer in a Symbol property for blobs created by node-canvas/jsdom
        try {
          const buf = blob[Object.getOwnPropertySymbols(blob)[0]]._buffer;
          return datauri.format(blob.type, buf).content;
        } catch (e) {
          return '';
        }
      }
      return '';
    };
    dom.window.URL.revokeObjectURL = () => {};

    // inject io into the window so server-side Phaser can access sockets
    dom.window.io = io;

    // expose a callback so the DOM can signal when Phaser finished loading
    dom.window.gameLoaded = () => {
      // start listening only after authoritative Phaser is up
      server.listen(8081, function () {
        console.log(`Listening on ${server.address().port}`);
      });
    };
  }).catch((err) => {
    console.error('Error setting up authoritative Phaser:', err && err.message);
  });
}

setupAuthoritativePhaser();

// Serve root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

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

function setupAuthoritativePhaser() {
  JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true
  }).then((dom) => {
    // Polyfill para createObjectURL
    dom.window.URL.createObjectURL = (blob) => {
      if (blob) {
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

    // Injeta io no window para o Phaser server-side acessar
    dom.window.io = io;

    // Callback quando o Phaser carregar
    dom.window.gameLoaded = () => {
      server.listen(8081, function () {
        console.log(`🚀 Servidor rodando na porta ${server.address().port}`);
        console.log(`🎮 Acesse: http://localhost:${server.address().port}`);
      });
    };
  }).catch((err) => {
    console.error('❌ Erro ao configurar Phaser autoritativo:', err && err.message);
  });
}

setupAuthoritativePhaser();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

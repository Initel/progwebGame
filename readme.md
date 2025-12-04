# 🚀 Space Battle - Jogo Multiplayer Autoritativo

Jogo multiplayer de naves espaciais com servidor autoritativo usando Phaser 3, Socket.IO e Node.js.

## 📋 O que é um Servidor Autoritativo?

Diferente de jogos peer-to-peer, neste modelo:
- **Servidor** controla toda a lógica do jogo e física
- **Clientes** apenas enviam inputs e recebem atualizações
- **Previne trapaças** pois o cliente não pode modificar o estado do jogo
- **Sincronização** garantida entre todos os jogadores

## 🎮 Como Funciona

1. **Cliente**: Envia apenas inputs (setas pressionadas)
2. **Servidor**: Processa física, colisões e lógica
3. **Servidor**: Envia estado atualizado para todos os clientes
4. **Clientes**: Renderizam o que recebem do servidor

## 📁 Estrutura do Projeto

```
├── server/
│   ├── index.js                           # Servidor Express + Socket.IO
│   └── authoritative_server/
│       ├── index.html                     # HTML para Phaser headless
│       ├── js/
│       │   └── game.js                    # Lógica autoritativa do jogo
│       └── assets/                        # Imagens para servidor
│           ├── spaceShips_001.png
│           ├── enemyBlack5.png
│           └── star_gold.png
├── public/
│   ├── index.html                         # Interface do cliente
│   ├── js/
│   │   └── game.js                        # Cliente Phaser
│   └── assets/                            # Imagens para cliente
│       ├── spaceShips_001.png
│       ├── enemyBlack5.png
│       └── star_gold.png
└── package.json
```

## 🛠️ Instalação

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Assets

**IMPORTANTE**: Você precisa das imagens do jogo!

#### Opção A: Baixar do Phaser

J´´a tem um mas pode substituir a vontade

#### Opção B: Usar Placeholders
Se não tiver as imagens, o jogo vai criar retângulos coloridos no lugar.

**Copie as imagens para AMBAS as pastas**:
- `public/assets/`
- `server/authoritative_server/assets/`

### 3. Iniciar o Servidor

```bash
npm start
```

### 4. Abrir no Navegador

Abra várias abas em: `http://localhost:8081`

Cada aba será um jogador diferente!

## 🎯 Como Jogar

- **⬆️ Seta para Cima**: Acelerar nave
- **⬅️ Seta Esquerda**: Rotacionar para esquerda
- **➡️ Seta Direita**: Rotacionar para direita
- **⭐ Objetivo**: Coletar estrelas para marcar pontos

### Times
- 🔵 **Time Azul**: Jogadores aleatórios
- 🔴 **Time Vermelho**: Jogadores aleatórios

Cada vez que você coleta uma estrela, seu time ganha **10 pontos**!

## 🔧 Tecnologias Utilizadas

- **Phaser 3**: Engine de jogo HTML5
- **Socket.IO**: Comunicação em tempo real
- **Express**: Servidor web
- **JSDOM**: DOM virtual para rodar Phaser no servidor
- **Canvas**: Renderização headless no servidor

## 📡 Arquitetura de Rede

```
┌─────────────┐         Input          ┌──────────────┐
│  Cliente 1  │ ──────────────────────> │              │
└─────────────┘                         │              │
                                        │   Servidor   │
┌─────────────┐         Input          │  Autoritativo│
│  Cliente 2  │ ──────────────────────> │              │
└─────────────┘                         │   (Phaser    │
                                        │   Headless)  │
┌─────────────┐         Input          │              │
│  Cliente 3  │ ──────────────────────> │              │
└─────────────┘                         └──────────────┘
                                               │
      ┌────────────────────────────────────────┘
      │              Estado do Jogo
      │         (Posições, Rotações,
      │          Placar, Estrela)
      ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Cliente 1  │       │  Cliente 2  │       │  Cliente 3  │
│   Renderiza │       │   Renderiza │       │   Renderiza │
└─────────────┘       └─────────────┘       └─────────────┘
```

## Eventos Socket.IO

### Cliente → Servidor
- `playerInput`: Envia estado das teclas (left, right, up)

### Servidor → Cliente
- `currentPlayers`: Estado inicial de todos os jogadores
- `newPlayer`: Novo jogador entrou
- `disconnect`: Jogador saiu
- `playerUpdates`: Atualização de posições (60 FPS)
- `updateScore`: Placar atualizado
- `starLocation`: Nova posição da estrela

## Troubleshooting

### Servidor não inicia
```bash
# Verifique se a porta 8081 está livre
lsof -i :8081

# Mude a porta em server/index.js se necessário
server.listen(3000, ...)
```

### Imagens não aparecem
- Verifique se as imagens estão em **ambas** as pastas de assets
- Verifique o console do navegador para erros 404

### Lag ou dessincronia
- O servidor processa a 60 FPS por padrão
- Em redes lentas, pode haver pequeno delay
- Isso é normal em jogos multiplayer

### Canvas não compila (Windows)
```bash
# Instale ferramentas de build do Windows
npm install --global windows-build-tools

# Ou use WSL (Windows Subsystem for Linux)
```

## 📚 Recursos Úteis

- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [Socket.IO Docs](https://socket.io/docs/v4/)
- [Tutorial Original](https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-1/)
---

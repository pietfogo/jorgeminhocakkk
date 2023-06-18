// Música ambiente
const bgMusic = new Audio("audio/bg-music.mp3");
bgMusic.volume = 0.023;
bgMusic.loop = true;

// Background do game
const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");
const box = 32;

// A minhoca
const wormHeadRight = new Image(32,32); wormHeadRight.src = "img/lerdao2.png";
const wormHeadDown = new Image(32,32); wormHeadDown.src = "img/lerdao2.png";
const wormHeadLeft = new Image(32,32); wormHeadLeft.src = "img/lerdao3.png";
const wormHeadUp = new Image(32,32); wormHeadUp.src = "img/lerdao4.png";
const wormBody = new Image(32,32); wormBody.src = "img/lerdao1.png";
const worm = [];
worm[0] = {
    x: box,
    y: box,
}
// Direção inicial da minhoca
let direction = "right";

// A maçã
const appleImage = new Image(32,32);
appleImage.src = "img/5938006.png";
const apple = {
    x: 8 * box,
    y: 8 * box,
}
// Efeito sonoro de maçã mordida
const appleAudio = new Audio("audio/biting-apple.mp3");
appleAudio.playbackRate = 2;
// Contador das maçãs comidas
let appleCount = 0;

// Div oculta Game-Over
const gameOver = document.querySelector(".game-over");
const wormScream = new Audio("audio/AiAi.mp3");
const victorySong = new Audio("audio/victory.mp3");

// Funções que desenham os elementos do jogo
function createBG() {
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, 16 * box, 16 * box);
}

function createWorm() {
    for (let i = 0; i < worm.length; i++) {
        if (i == 0 && direction == "right") context.drawImage(wormHeadRight, worm[i].x, worm[i].y, box, box);
        if (i == 0 && direction == "down") context.drawImage(wormHeadDown, worm[i].x, worm[i].y, box, box);
        if (i == 0 && direction == "left") context.drawImage(wormHeadLeft, worm[i].x, worm[i].y, box, box);
        if (i == 0 && direction == "up") context.drawImage(wormHeadUp, worm[i].x, worm[i].y, box, box);
        if (i != 0) context.drawImage(wormBody, worm[i].x, worm[i].y, box, box);
    }
}

function createFood() {
    context.drawImage(appleImage, apple.x, apple.y, box, box);
}

// Função chamada quando a minhoca pega uma maçã
function grabbedFood() {
    // Efeito sonoro de maçã mordida
    appleAudio.play()
    // Colocando a maçã em outro ponto aleatório
    apple.x = Math.floor(Math.random() * 15 + Math.random()) * box;
    apple.y = Math.floor(Math.random() * 15 + Math.random()) * box;
    // Loop para impedir que a maçã apareça em um espaço ocupado pela minhoca
    for (let i = 0; i < worm.length; i++) {
        if (apple.x == worm[i].x && apple.y == worm[i].y) {
            apple.x = Math.floor(Math.random() * 15 + Math.random()) * box;
            apple.y = Math.floor(Math.random() * 15 + Math.random()) * box;
            i = 0;
        }
    }
    // Adiciona +1 no contador de maçãs
    appleCount++;
    // Aumentando a dificuldade do game até chegar em 50ms
    if (interval > 50) {
        interval -= 10;
        clearInterval(game);
        game = setInterval(startGame, interval);
    } else if (appleCount == 40) {
    // Else da Vitória! Zerando o Game!! Parabéns!!!
        clearInterval(game);
        victorySong.play();
        bgMusic.pause();
        gameOver.classList.add("victory");
        gameOver.innerHTML = `
            <h2 class="titulo">Parabéns! &#129351</h2>
            <p class="subtitulo">O Jorge comeu <span>40</span> maçãs</p>
            <button id="btn" onclick="restartGame()">Jogar de novo</button>
        `;
    }
}

// Função que determina as teclas pressionadas e inicia a música de fundo
document.addEventListener('keydown', newDirection);
function newDirection(event) {
    if (event.keyCode == 37 && direction != "right") direction = "left";
    if (event.keyCode == 38 && direction != "down") direction = "up";
    if (event.keyCode == 39 && direction != "left") direction = "right";
    if (event.keyCode == 40 && direction != "up") direction = "down";
    if (event.keyCode == 38 || event.keyCode == 40) bgMusic.play();
}

// Função que executa o jogo
function startGame() {
    // Resetando a posição da minhoca quando ela passa as bordas
    if (worm[0].x > 15 * box) worm[0].x = 0;
    if (worm[0].x < 0) worm[0].x = 15 * box;
    if (worm[0].y > 15 * box) worm[0].y = 0;
    if (worm[0].y < 0) worm[0].y = 15 * box;
    // Loop para checar se a minhoca se chocou com ela mesma
    for (let i = 1; i < worm.length; i++) {
        if (worm[0].x == worm[i].x && worm[0].y == worm[i].y) {
            clearInterval(game);
            wormScream.play();
            bgMusic.pause();
            gameOver.innerHTML = `
                <h2 class="titulo">Game Over &#128557</h2>
                <p class="subtitulo">O Jorge comeu apenas <span>${appleCount}</span> picas</p>
                <button id="btn" onclick="restartGame()">Tentar de novo</button>
                <img src="img/jorgefotolerdaokkk.jpg">
            `;
            return;
        }
    }
    // Executando as funções que desenham os elementos do jogo
    createBG();
    createWorm();
    createFood();
    // Coordenadas da minhoca
    let wormX = worm[0].x;
    let wormY = worm[0].y;
    if (direction == "right") wormX += box;
    if (direction == "left") wormX -= box;
    if (direction == "up") wormY -= box;
    if (direction == "down") wormY += box;
    // Condição que determinam se a minhoca pegou ou não a comida
    if (worm[0].x == apple.x && worm[0].y == apple.y) grabbedFood();
    else worm.pop();
    // Adicionar uma nova posição no começo do Array
    const newPosition = {
        x: wormX,
        y: wormY,
    }
    worm.unshift(newPosition);
}
// Chama a função que executa o game
let interval = 250;
let game = setInterval(startGame, interval);

// Tentar de novo
function restartGame() {
    document.location.reload();
}
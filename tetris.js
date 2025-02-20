const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(30, 30);

const ROWS = 20;
const COLS = 10;
const colors = [null, "red", "blue", "green", "yellow", "purple", "cyan", "orange"];

let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
document.getElementById("best-score").innerText = bestScore;

const pieces = [
    [[1, 1, 1], [0, 1, 0]], // T-piece
    [[0, 2, 2], [2, 2, 0]], // S-piece
    [[3, 3, 0], [0, 3, 3]], // Z-piece
    [[4, 4], [4, 4]], // Square
    [[0, 5, 0, 0], [5, 5, 5, 0]], // L-piece
    [[6, 0, 0], [6, 6, 6]], // J-piece
    [[0, 0, 7, 0], [7, 7, 7, 7]] // I-piece
];

function createMatrix(w, h) {
    return Array.from({ length: h }, () => new Array(w).fill(0));
}

const arena = createMatrix(COLS, ROWS);

const player = {
    position: { x: 4, y: 0 },
    matrix: pieces[Math.floor(Math.random() * pieces.length)],
};

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                context.strokeStyle = "black";
                context.strokeRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.position);
}

function collide(arena, player) {
    return player.matrix.some((row, y) =>
        row.some((value, x) =>
            value !== 0 && (arena[y + player.position.y] && arena[y + player.position.y][x + player.position.x]) !== 0
        )
    );
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.position.y][x + player.position.x] = value;
            }
        });
    });
}

function rotate(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

function playerMove(dir) {
    player.position.x += dir;
    if (collide(arena, player)) {
        player.position.x -= dir;
    }
}

function playerRotate() {
    const oldMatrix = player.matrix;
    player.matrix = rotate(player.matrix);
    if (collide(arena, player)) {
        player.matrix = oldMatrix;
    }
}

function playerDrop() {
    player.position.y++;
    if (collide(arena, player)) {
        player.position.y--;
        merge(arena, player);
        clearRows();
        playerReset();
        updateScore();
    }
}

function playerReset() {
    player.matrix = pieces[Math.floor(Math.random() * pieces.length)];
    player.position.y = 0;
    player.position.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        score = 0;
    }
}

function clearRows() {
    for (let y = arena.length - 1; y >= 0; y--) {
        if (arena[y].every(value => value !== 0)) {
            arena.splice(y, 1);
            arena.unshift(new Array(COLS).fill(0));
            updateScore(100);
        }
    }
}

function updateScore(points = 10) {
    score += points;
    document.getElementById("score").innerText = score;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
        document.getElementById("best-score").innerText = bestScore;
    }
}

function update(time = 0) {
    playerDrop();
    draw();
    setTimeout(() => requestAnimationFrame(update), 500);
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") playerMove(-1);
    else if (event.key === "ArrowRight") playerMove(1);
    else if (event.key === "ArrowDown") playerDrop();
    else if (event.key === "ArrowUp") playerRotate();
});

playerReset();
update();

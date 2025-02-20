const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(30, 30);

const ROW = 20;
const COL = 10;

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

const arena = createMatrix(COL, ROW);

const pieces = [
    [[1, 1, 1], [0, 1, 0]],
    [[0, 2, 2], [2, 2, 0]],
    [[3, 3, 0], [0, 3, 3]],
    [[4, 4], [4, 4]],
    [[0, 5, 0, 0], [5, 5, 5, 0]],
    [[6, 0, 0], [6, 6, 6]],
    [[0, 0, 7], [7, 7, 7]]
];

const player = {
    position: { x: 5, y: 0 },
    matrix: pieces[Math.floor(Math.random() * pieces.length)],
    score: 0,
};

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = "red";
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

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.position.y][x + player.position.x] = value;
            }
        });
    });
}

function collide(arena, player) {
    for (let y = 0; y < player.matrix.length; y++) {
        for (let x = 0; x < player.matrix[y].length; x++) {
            if (
                player.matrix[y][x] !== 0 &&
                (arena[y + player.position.y] &&
                    arena[y + player.position.y][x + player.position.x]) !== 0
            ) {
                return true;
            }
        }
    }
    return false;
}

function playerMove(dir) {
    player.position.x += dir;
    if (collide(arena, player)) {
        player.position.x -= dir;
    }
}

function playerRotate() {
    const pos = player.position.x;
    let offset = 1;
    rotate(player.matrix);
    while (collide(arena, player)) {
        player.position.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, false);
            player.position.x = pos;
            return;
        }
    }
}

function rotate(matrix, clockwise = true) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (clockwise) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function drop() {
    player.position.y++;
    if (collide(arena, player)) {
        player.position.y--;
        merge(arena, player);
        playerReset();
    }
    draw();
}

function playerReset() {
    player.matrix = pieces[Math.floor(Math.random() * pieces.length)];
    player.position.y = 0;
    player.position.x = Math.floor(COL / 2) - Math.floor(player.matrix[0].length / 2);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
    }
}

function update() {
    drop();
    draw();
    setTimeout(update, 500);
}

playerReset();
update();

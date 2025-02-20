const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(30, 30);

const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
];

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = "red";
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(matrix, {x: 5, y: 5});
}

draw();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player properties
let player = {
    x: 50,
    y: 175,
    size: 50,
    speed: 5,
    color: "cyan"
};

// Track key presses
let keys = {};
window.addEventListener("keydown", (e) => keys[e.code] = true);
window.addEventListener("keyup", (e) => keys[e.code] = false);

function update() {
    // 1. Movement Logic
    if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
    if (keys["ArrowDown"] && player.y < canvas.height - player.size) player.y += player.speed;
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x < canvas.width - player.size) player.x += player.speed;

    // 2. Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear screen
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);

    requestAnimationFrame(update);
}

update();

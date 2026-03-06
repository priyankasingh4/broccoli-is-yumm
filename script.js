const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let balloons = [];
let score = 0;
let timeLeft = 60; // 60 second time limit
let gameOver = false;

// Countdown timer function
const timer = setInterval(() => {
    if (timeLeft > 0) {
        timeLeft--;
    } else {
        gameOver = true;
        clearInterval(timer); // Stop the timer when it hits 0
    }
}, 1000);

const periods = ["Math", "Science", "English", "History", "Art", "PE", "Music", "Computer"];

class Balloon {
    constructor() {
        this.radius = Math.random() * 25 + 35;
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.y = canvas.height + this.radius;
        this.speed = Math.random() * 1.5 + 1;
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        this.period = periods[Math.floor(Math.random() * periods.length)];
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.period, this.x, this.y);
    }
}

canvas.addEventListener("mousedown", (e) => {
    if (gameOver) return; // Disable clicking when game is over

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let i = balloons.length - 1; i >= 0; i--) {
        let b = balloons[i];
        let dist = Math.sqrt((mouseX - b.x) ** 2 + (mouseY - b.y) ** 2);
        if (dist < b.radius) {
            balloons.splice(i, 1);
            score++;
            break; 
        }
    }
});

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        if (Math.random() < 0.02) balloons.push(new Balloon());

        balloons.forEach((b, index) => {
            b.update();
            b.draw();
            if (b.y + b.radius < 0) balloons.splice(index, 1);
        });
    } else {
        // Game Over Screen
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2 + 40);
    }

    // Draw Score & Time (Always visible)
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 20, 30);
    ctx.fillText("Time: " + timeLeft + "s", 20, 60);

    requestAnimationFrame(update);
}

update();

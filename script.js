const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let balloons = [];
let score = 0;

class Balloon {
    constructor() {
        this.radius = Math.random() * 20 + 20;
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.y = canvas.height + this.radius;
        this.speed = Math.random() * 2 + 1;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

// Handle Clicks
canvas.addEventListener("mousedown", (e) => {
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

    // Spawn balloons
    if (Math.random() < 0.03) balloons.push(new Balloon());

    balloons.forEach((b, index) => {
        b.update();
        b.draw();
        // Remove if off screen
        if (b.y + b.radius < 0) balloons.splice(index, 1);
    });

    // Draw Score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    requestAnimationFrame(update);
}

update();

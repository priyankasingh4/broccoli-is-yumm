const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let balloons = [];
let splatters = [];
let score = 0;
let timeLeft = 60;
let gameOver = false;
const periods = ["Math", "Science", "English", "History", "Art", "PE", "Music", "Computer"];
let targetPeriod = periods[Math.floor(Math.random() * periods.length)];

// Timer Countdown
const timer = setInterval(() => {
    if (timeLeft > 0) {
        timeLeft--;
    } else {
        gameOver = true;
        clearInterval(timer);
    }
}, 1000);

// Splatter Effect Class
class Splatter {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: 0,
                y: 0,
                size: Math.random() * 8 + 4,
                speedX: (Math.random() - 0.5) * 10,
                speedY: (Math.random() - 0.5) * 10,
                alpha: 1
            });
        }
    }
    update() {
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.alpha -= 0.02;
        });
        this.particles = this.particles.filter(p => p.alpha > 0);
    }
    draw() {
        this.particles.forEach(p => {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(this.x + p.x, this.y + p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;
    }
}

class Balloon {
    constructor() {
        this.radius = Math.random() * 20 + 35;
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.y = canvas.height + this.radius;
        this.speed = Math.random() * 1.5 + 1;
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        this.period = periods[Math.floor(Math.random() * periods.length)];
    }
    update() { this.y -= this.speed; }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.period, this.x, this.y);
    }
}

canvas.addEventListener("mousedown", (e) => {
    if (gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let i = balloons.length - 1; i >= 0; i--) {
        let b = balloons[i];
        let dist = Math.sqrt((mouseX - b.x) ** 2 + (mouseY - b.y) ** 2);
        if (dist < b.radius) {
            // Add Splatter
            splatters.push(new Splatter(b.x, b.y));
            
            // Logic for Targeting
            if (b.period === targetPeriod) {
                score++;
                targetPeriod = periods[Math.floor(Math.random() * periods.length)];
            }
            balloons.splice(i, 1);
            break; 
        }
    }
});

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        if (Math.random() < 0.02) balloons.push(new Balloon());
        balloons.forEach((b, i) => {
            b.update(); b.draw();
            if (b.y + b.radius < 0) balloons.splice(i, 1);
        });
    } else {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    }

    // Update Splatters
    splatters.forEach((s, i) => {
        s.update(); s.draw();
        if (s.particles.length === 0) splatters.splice(i, 1);
    });

    // UI
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
    ctx.fillText("Time: " + timeLeft + "s", 20, 60);
    ctx.fillStyle = "yellow";
    ctx.fillText("TARGET: " + targetPeriod, 20, 90);

    requestAnimationFrame(update);
}
update();

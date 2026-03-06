const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let balloons = [];
let score = 0;

// List of middle school periods
const periods = ["Math", "Science", "English", "History", "Art", "PE", "Music", "Computer"];

class Balloon {
    constructor() {
        this.radius = Math.random() * 25 + 35; // Slightly larger to fit text
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.y = canvas.height + this.radius;
        this.speed = Math.random() * 1.5 + 1;
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        // Pick a random period name
        this.period = periods[Math.floor(Math.random() * periods.length)];
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        // Draw Balloon circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Draw Period Name text
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.period, this.x, this.y);
    }
}

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

    if (Math.random() < 0.02) balloons.push(new Balloon());

    balloons.forEach((b, index) => {
        b.update();
        b.draw();
        if (b.y + b.radius < 0) balloons.splice(index, 1);
    });

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 50, 30);

    requestAnimationFrame(update);
}

update();

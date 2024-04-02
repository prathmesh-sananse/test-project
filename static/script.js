const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
 
let particlesArray;
let pointer = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80),
};
 
// window.addEventListener("mousemove", function (e) {
//     pointer.x = e.x;
//     pointer.y = e.y;
// });
 
// create particle class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
 
    // method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = "#444";
        ctx.fill();
    }
 
    // check particle position, check pointer position, move particle, draw particle
    update() {
        // check if particle is still within the canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
 
        // check collision direction - pointer position / particle position
        let dx = pointer.x - this.x;
        let dy = pointer.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < pointer.radius + this.size) {
            if (pointer.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 5; // Decreased movement speed
            }
            if (pointer.x > this.x && this.x > this.size * 10) {
                this.x -= 5; // Decreased movement speed
            }
            if (pointer.y > this.y && this.y < canvas.height - this.y * 10) {
                this.y += 5; // Decreased movement speed
            }
            if (pointer.y < this.y && this.y > this.y * 10) {
                this.y -= 5; // Decreased movement speed
            }
        }
 
        // move particles
        this.x += this.directionX / 3; // Decreased movement speed
        this.y += this.directionY / 3; // Decreased movement speed
 
        // draw a particle
        this.draw();
    }
}
 
// create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 8500;
    for (let i = 0; i < numberOfParticles * 2; i++) {
        let size = Math.random() * 5 + 1;
        let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
        let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
        let directionX = Math.random() * 2 - 1; // Decreased particle speed
        let directionY = Math.random() * 2 - 1; // Decreased particle speed
        let color = "#444";
        particlesArray.push(
            new Particle(x, y, directionX, directionY, size, color)
        );
    }
}
 
// animate loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}
 
// check if particles are close enough to draw a line between them
function connect() {
    let opacityValue = 0.5; // Decreased opacity
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance =
                (particlesArray[a].x - particlesArray[b].x) *
                    (particlesArray[a].x - particlesArray[b].x) +
                (particlesArray[a].y - particlesArray[b].y) *
                    (particlesArray[a].y - particlesArray[b].y);
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - distance / 15000;
                ctx.strokeStyle = `rgba(0,0,0, ${opacityValue})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}
 
window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    pointer.radius = (canvas.width / 70) * (canvas.height / 70);
    init();
});
 
// window.addEventListener("mouseout", function () {
//     pointer.x = null;
//     pointer.y = null;
// });
 
init();
animate();
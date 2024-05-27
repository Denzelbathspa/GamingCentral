const canvas = document.getElementById('fantasyCanvas');
const ctx = canvas.getContext('2d');
const particles = [];
const leavesImg = new Image();
leavesImg.src = 'leaves.png'; // Path to your leaves image

let isInteractive = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

class Particle {
    constructor(type) {
        this.type = type;
        if (this.type === 'dot') {
            this.x = random(0, canvas.width);
            this.y = random(0, canvas.height);
            this.radius = random(1, 4);
            this.color = `hsl(${random(160, 220)}, 70%, 50%)`;
            this.speed = random(1, 3);
            this.angle = random(0, Math.PI * 2);
            this.moveTimer = random(1000, 3000); // Time before changing direction
            this.moveCounter = 0; // Counter to track time
            this.moveDirection = random(0, Math.PI * 2); // Initial move direction
        } else if (this.type === 'leaf') {
            this.x = random(0, canvas.width);
            this.y = -30;
            this.width = 30; // Adjust size of the leaf
            this.height = 30; // Adjust size of the leaf
            this.speed = random(1, 3);
            this.rotation = random(0, Math.PI * 2);
            this.spinSpeed = random(-0.05, 0.05); // Adjust spin speed
            this.horizontalOscillation = random(-2, 2); // Adjust horizontal oscillation
            this.isBlurry = Math.random() < 0.5; // Randomly determine if the leaf is blurry
            this.tail = []; // Array to store points of the tail
            this.maxTailLength = 100; // Maximum number of points in the tail
            this.tailOpacityDecay = 0.01; // Rate of opacity decay for tail points
            
            // Additional properties for mouse button state and leaf speed
            this.isMousePressed = false;
            this.normalSpeed = this.speed; // Store the normal speed of the leaf
            this.boostedSpeed = this.normalSpeed * 3; // Define the boosted speed when mouse button is pressed
        }
    }

    update() {
        if (this.type === 'dot') {
            this.moveCounter++;
            if (this.moveCounter >= this.moveTimer) {
                this.moveDirection = random(0, Math.PI * 2); // Change move direction
                this.moveTimer = random(1000, 3000); // Reset move timer
                this.moveCounter = 0; // Reset move counter
            }
            this.x += Math.cos(this.moveDirection) * this.speed;
            this.y += Math.sin(this.moveDirection) * this.speed;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.x = random(0, canvas.width);
                this.y = random(0, canvas.height);
                this.moveDirection = random(0, Math.PI * 2);
            }
        } else if (this.type === 'leaf') {
            this.x += this.horizontalOscillation * Math.cos(this.y / 50); // Horizontal oscillation
            this.y += this.speed; // Fall down
            this.rotation += this.spinSpeed; // Add spin to the leaf

            // Update tail points
            this.tail.unshift({ x: this.x + 10, y: this.y + 10, opacity: 1 }); // Add new point to the beginning of the tail
            if (this.tail.length > this.maxTailLength) {
                this.tail.pop(); // Remove oldest point if tail exceeds maximum length
            }
            this.tail.forEach(point => {
                point.opacity -= this.tailOpacityDecay;
                if (point.opacity < 0) {
                    this.tail.pop(); // Remove faded-out point from tail
                }
            });

            // Reset position if leaf falls off the screen
            if (this.y > canvas.height + 400) {
                this.y = -this.height; // Reset y position above the screen
                this.x = random(0, canvas.width); // Reset x position randomly within canvas width
                this.tail = []; // Reset tail
            }
        }
    }

    draw() {
        if (this.type === 'dot') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        } else if (this.type === 'leaf') {
            ctx.save();
            if (this.isBlurry) {
                ctx.filter = 'blur(100px)'; // Apply blur effect
            }
            // Draw leaf
            ctx.restore();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            this.tail.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`; // Set color and opacity of tail
            ctx.lineWidth = 2; // Adjust thickness of tail
            ctx.stroke();
            ctx.closePath();
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.rotation);
            ctx.drawImage(leavesImg, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }
    
    // Method to handle mouse button press
    handleMouseDown() {
        this.isMousePressed = true;
        this.speed = this.boostedSpeed; // Increase the leaf speed when mouse button is pressed
    }

    // Method to handle mouse button release
    handleMouseUp() {
        this.isMousePressed = false;
        this.speed = this.normalSpeed; // Reset the leaf speed to normal when mouse button is released
    }
}



function createParticles() {
    for (let i = 0; i < 500; i++) {
        particles.push(new Particle('dot'));
    }
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle('leaf'));
    }
}

function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(updateParticles);
}

function toggleInteractive() {
    isInteractive = !isInteractive;
    particles.filter(particle => particle.type === 'leaf').forEach(leaf => {
        leaf.followMouse = isInteractive;
    });
}

let mouseX = 0;
let mouseY = 0;

// Add event listener for mouse move
canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// Add event listener for mouse click to toggle interactive mode
canvas.addEventListener('click', toggleInteractive);

createParticles();
updateParticles();

// Add event listener for window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles.length = 0; // Clear existing particles
    createParticles();
});

// Add event listeners for mouse button press and release
window.addEventListener('mousedown', () => {
    particles.forEach(particle => {
        if (particle.type === 'leaf') {
            particle.handleMouseDown();
        }
    });
});

window.addEventListener('mouseup', () => {
    particles.forEach(particle => {
        if (particle.type === 'leaf') {
            particle.handleMouseUp();
        }
    });
});

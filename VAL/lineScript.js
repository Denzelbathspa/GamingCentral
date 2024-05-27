// Some variables
const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions to cover the entire window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to store information about each line
const lines = [];

// Array of available colors for lines
const lineColors = ['#fd4556', '#bd3944', '#53212b', '#fffbf5'];

// Function to generate a random number between min and max
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Function to create a new line
function createLine(x, y) {
    const length = random(10_000, 1_000); // Adjust line length
    const width = random(0.1, 3);
    const speed = random(1, 3);
    const angle = random(0, Math.PI * 2); // Random angle in radians
    const color = lineColors[Math.floor(random(0, lineColors.length))]; // Random color

    lines.push({ x, y, length, width, speed, angle, color });
}

// Function to draw a line
function drawLine(line) {
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.width;
    ctx.beginPath();
    ctx.moveTo(line.x, line.y);
    ctx.lineTo(line.x + Math.cos(line.angle) * line.length, line.y + Math.sin(line.angle) * line.length);
    ctx.stroke();
}

// Function to update line positions and redraw the canvas
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Update and draw lines
    lines.forEach((line, index) => {
        // Draw the line
        drawLine(line);

        // Update line position
        line.x += Math.cos(line.angle) * line.speed;
        line.y += Math.sin(line.angle) * line.speed;

        // Loop line to opposite side if it goes out of bounds
        if (line.x < 0) {
            line.x = canvas.width;
        } else if (line.x > canvas.width) {
            line.x = 0;
        }
        if (line.y < 0) {
            line.y = canvas.height;
        } else if (line.y > canvas.height) {
            line.y = 0;
        }
    });

    requestAnimationFrame(update); // Loop the animation
}


// Function to handle mouse click event
function handleClick(event) {
    const x = event.clientX;
    const y = event.clientY;
    createLine(x, y);
}

// Add event listener for mouse click on the canvas
canvas.addEventListener('click', handleClick);

// Function to create initial lines
function createInitialLines() {
    for (let i = 0; i < 100; i++) { // Adjust the number of initial lines as needed
        const x = random(0, canvas.width);
        const y = random(0, canvas.height);
        createLine(x, y);
    }
}

// Start the animation
update();

// Create initial lines
createInitialLines();

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
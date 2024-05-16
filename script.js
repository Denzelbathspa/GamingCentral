// Some variables
const canvas = document.getElementById('snowfallCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions to cover the entire window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to store information about each snowflake
const snowflakes = [];

// Function to generate a random number between min and max
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Function to create a new snowflake
function createSnowflake() {
    const radius = random(2, 5);
    const x = random(0, canvas.width);
    const y = -radius;
    const dx = random(-0.5, 0.5);
    const dy = random(1, 3);
    const color = '#FFFFFF';

    snowflakes.push({ x, y, radius, dx, dy, color });
}

// Function to draw a snowflake
function drawSnowflake(snowflake) {
    ctx.beginPath();
    ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
    ctx.fillStyle = snowflake.color;
    ctx.fill();
    ctx.closePath();
}

// Function to update snowflake positions and redraw the canvas
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    snowflakes.forEach(snowflake => {
        // Update snowflake position
        snowflake.x += snowflake.dx;
        snowflake.y += snowflake.dy;

        // Check if snowflake is below the canvas
        if (snowflake.y - snowflake.radius > canvas.height) {
            snowflake.y = -snowflake.radius; // Move snowflake to the top
            snowflake.x = random(0, canvas.width); // Randomize horizontal position
        }

        // Draw the snowflake
        drawSnowflake(snowflake);
    });

    requestAnimationFrame(update); // Loop the animation
}

// Function to handle mouse click event
function handleClick(event) {
    const explosionSize = 50;
    const explosionCount = 10;

    for (let i = 0; i < explosionCount; i++) {
        const x = event.clientX + random(-explosionSize, explosionSize);
        const y = event.clientY + random(-explosionSize, explosionSize);
        snowflakes.push({ x, y, radius: random(2, 5), dx: random(-0.5, 0.5), dy: random(1, 3), color: '#FFFFFF' });
    }
}

// Create initial snowflakes
for (let i = 0; i < 100; i++) {
    createSnowflake();
}

// Start the animation
update();

// Add event listener for mouse click
window.addEventListener('click', handleClick);

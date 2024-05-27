// Some variables
const canvas = document.getElementById('rippleCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions to cover the entire window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to store information about each ripple
const ripples = [];

// Function to generate a random number between min and max
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Function to create a new ripple
function createRipple(x, y) {
    const radius = 0;
    const maxRadius = random(30, 80); // Increase max radius for more pronounced ripples
    const alpha = 1;
    const fadeRate = 0.005; // Decrease fade rate for longer-lasting ripples

    ripples.push({ x, y, radius, maxRadius, alpha, fadeRate });
}

// Function to draw a ripple
function drawRipple(ripple) {
    ctx.beginPath();
    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.alpha * 0.5})`;
    ctx.stroke();
    ctx.closePath();
}

// Function to draw subtle wave lines in the background
function drawWaveLines() {
    const waveCount = 5; // Number of wave lines
    const waveGap = canvas.height / waveCount; // Vertical gap between wave lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Color and opacity of the wave lines

    for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
            const y = waveGap * i + Math.sin((x + Date.now() / 50) / 50) * 20;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.closePath();
    }
}

// Function to update ripple positions and redraw the canvas
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw wave lines in the background
    drawWaveLines();

    ripples.forEach((ripple, index) => {
        // Update ripple position
        ripple.radius += 0.5;
        ripple.alpha -= ripple.fadeRate;

        // Remove ripple if it's fully faded
        if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
            ripples.splice(index, 1);
        }

        // Draw the ripple
        drawRipple(ripple);
    });

    requestAnimationFrame(update); // Loop the animation
}

// Function to handle mouse click event
function handleClick(event) {
    createRipple(event.clientX, event.clientY);
}

// Function to create random ripples at intervals
function createRandomRipples() {
    setInterval(() => {
        createRipple(random(0, canvas.width), random(0, canvas.height));
    }, 200); // Adjust the interval time as needed
}

// Start the animation
update();

// Start creating random ripples
createRandomRipples();

// Function to handle mouse hover event
let hoverTimer;
function handleHover(event) {
    clearTimeout(hoverTimer); // Clear previous timer
    hoverTimer = setTimeout(() => {
        createRipple(event.clientX, event.clientY);
    }, 5); // Adjust the delay time as needed
}

// Add event listener for mouse hover
window.addEventListener('mousemove', handleHover);

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
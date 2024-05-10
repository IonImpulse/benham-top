const canvas = document.getElementById('top');
const ctx = canvas.getContext('2d');
const offscreenCanvas = document.createElement('canvas');
const offCtx = offscreenCanvas.getContext('2d');
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;

let animationFrameId = null;
let angle = 0;
let running = false;

function updateTopParameters() {
    generateTop();
    console.log(document.getElementById('rpm').value);
}

function generateTop() {
    const num_sections = parseInt(document.getElementById('num_sections').value, 10) ?? 1;
    const num_stripes = parseInt(document.getElementById('num_stripes').value, 10) ?? 1;
    const stripe_width = parseFloat(document.getElementById('stripe_width').value) ?? .5;

    const radius = offscreenCanvas.width / 2;
    const center_x = offscreenCanvas.width / 2;
    const center_y = offscreenCanvas.height / 2;

    // Clear previous drawing
    offCtx.fillStyle = 'white';
    offCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // Draw the static part of the top
    offCtx.fillStyle = 'black';
    offCtx.beginPath();
    offCtx.arc(center_x, center_y, radius, Math.PI, 2 * Math.PI, false);
    offCtx.fill();

    const section_angle_size = Math.PI / num_sections;
    const section_height = radius / num_sections;
    const stripe_height = section_height / num_stripes * stripe_width;

    for (let i = 0; i < num_sections; i++) {
        for (let j = 0; j < num_stripes; j++) {
            const angle_start = i * section_angle_size;
            const angle_end = (i + 1) * section_angle_size;

            let radius_top_stripe = radius - (section_height * i) - (section_height / num_stripes) * j;
            let radius_bottom_stripe = radius_top_stripe - stripe_height;

            offCtx.beginPath();
            offCtx.arc(center_x, center_y, radius_top_stripe, angle_start, angle_end);
            offCtx.arc(center_x, center_y, radius_bottom_stripe, angle_end, angle_start, true);
            offCtx.closePath();
            offCtx.fillStyle = 'black';
            offCtx.fill();
        }
    }
}

function drawRotated() {
    const rpm = parseInt(document.getElementById('rpm').value, 10) ?? 0;
    const increment = 2 * Math.PI * rpm / 3600; // Convert RPM to radians per frame
    angle += increment;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear main canvas
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.drawImage(offscreenCanvas, 0, 0);
    ctx.restore();

    animationFrameId = requestAnimationFrame(drawRotated);
}

function spinTop() {
    if (running) return;

    running = true;
    drawRotated();
}

function stopTop() {
    if (!running) return;

    running = false;
    cancelAnimationFrame(animationFrameId);
}

document.getElementById('start').addEventListener('click', spinTop);
document.getElementById('stop').addEventListener('click', stopTop);

// Attach update events to input changes
document.getElementById('num_sections').addEventListener('change', updateTopParameters);
document.getElementById('num_stripes').addEventListener('change', updateTopParameters);
document.getElementById('stripe_width').addEventListener('change', updateTopParameters);
document.getElementById('rpm').addEventListener('change', updateTopParameters);

// Initial setup and draw
generateTop();
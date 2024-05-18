const colors = ["#FF5733", "#33FF57", "#3357FF", "#FFD700", "#9400D3"];
const matrix = [
    [1, .5, -.5, 0, 0],
    [-.5, 1, -.5, 0, 0],
    [.5, .5, .2, 0, 0],
    [0, 0, 1, 1, .5],
    [0, 0, 0, 1, .1]
];

const particlesArray = [];

function main() {
    console.log('DOM content loaded');
    // Select the canvas element and set its context
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Particle class definition
    class Particle {
        constructor(x, y, color, velocity, colorIndex) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.velocity = velocity;
            this.colorIndex = colorIndex;
        }

        // Draw method to render the particle
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 4, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Update method to change the particle's position
        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            // Check for boundary collisions
            if (this.x > canvas.width) {
                this.x = 0;
            }
            if (this.x < 0) {
                this.x = canvas.width;
            }
            if (this.y > canvas.height) {
                this.y = 0;
            }
            if (this.y < 0) {
                this.y = canvas.height;
            }

            for (let i = 0; i < particlesArray.length; i++) {
                const part = particlesArray[i];
                if (part === this) {
                    continue; // Skip comparing with itself
                }
                const distance = calculateDistance(this.x, this.y, part.x, part.y);
                if (distance < 20) { // Adjust the threshold distance as needed
                    let dx = part.x - this.x;
                    let dy = part.y - this.y;
                    if (distance < 5) {
                        dx *= distance * -0.5;
                        dy *= distance * -0.5;
                        this.velocity.x += dx / 500
                        this.velocity.y += dy / 500
                    } else {
                        this.velocity.x += dx / 600 * matrix[this.colorIndex][part.colorIndex]; // Adjust the force factor as needed
                        this.velocity.y += dy / 600 * matrix[this.colorIndex][part.colorIndex]; // Adjust the force factor as needed
                    }
                }
            }
            // Apply damping to slow down the velocity
            this.velocity.x *= 0.99; // Adjust the damping factor as needed
            this.velocity.y *= 0.99; // Adjust the damping factor as needed
        }

    }

    function calculateDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function calcVol(x) {
        const a = 1;
        return Math.max(0, -Math.abs(x * a - (a * 2)) + a);
    }


    // Initialize particles
    function init() {
        particlesArray.length = 0;
        const numberOfParticles = 1000;
        for (let i = 0; i < numberOfParticles; i++) {
            const x = Math.random() * innerWidth;
            const y = Math.random() * innerHeight;
            const randomIndex = Math.floor(Math.random() * colors.length);
            const color = colors[randomIndex];
            const velocity = {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            };
            particlesArray.push(new Particle(x, y, color, velocity, randomIndex));
        }

        // Output the generated matrix
        console.log(matrix);
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });
    }

    // Initialize and start the animation
    init();
    animate();
}

// Run the main function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', main);

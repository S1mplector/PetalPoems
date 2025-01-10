// Set up the canvas
const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

// Reference the blur overlay
const blurOverlay = document.querySelector('.blur-overlay');

// Reference the welcome text
const welcomeText = document.querySelector('.welcome-text')

// Show the blur overlay after a delay (e.g., 5 seconds)
setTimeout(() => {
  blurOverlay.style.opacity = 1; // Fade in the overlay

  // Show the welcome text after the frosted glass animation
  setTimeout(() => {
    welcomeText.style.opacity = 1; // Fade in the welcome text
  }, 1000); // Delay for the welcome text fade-in (1 second after overlay)
}, 2000); // 5-second delay for the overlay appearance

// Array of 9 petal images
const petalImages = [];
for (let i = 1; i <= 9; i++) {
  const petalImg = new Image();
  petalImg.src = `img/petal${i}.png`; // Make sure your images are named petal1.png, petal2.png, ..., petal9.png
  petalImages.push(petalImg);
}

let mouseX = 0;
let mouseY = 0;

// Constant wind effect variables (wind from upper left corner)
const windX = -0.5;  // Wind strength in the X direction (constant from left)
const windY = 0.2;   // Wind strength in the Y direction (constant, making petals fall gently)

// Array to hold petals
const petals = [];
const petalCount = 100; // Number of petals

// Wait for all images to load before starting the animation
let imagesLoaded = 0;
petalImages.forEach(petalImg => {
  petalImg.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === petalImages.length) {
      // Once all images are loaded, create the petals and start the animation
      createPetals();
      animate();
    }
  };
});

// Create petals with random properties
function createPetals() {
  for (let i = 0; i < petalCount; i++) {
    petals.push(createPetal());
  }
}

// Generate random properties for each petal
function createPetal() {
  return {
    x: Math.random() * canvas.width,
    y: -Math.random() * canvas.height, // Start from above the canvas
    speedX: Math.random() * 3 - 1.5,
    speedY: Math.random() * 1 + 1, // Gradual falling speed
    size: Math.random() * 25 + 15, // Random size between 15 and 40
    opacity: 1, // Start with full opacity
    rotationSpeed: Math.random() * 0.05 + 0.01, // Speed at which the petal twists
    rotationAngle: 0, // Initial rotation angle
    fadeSpeed: Math.random() * 0.005 + 0.002, // Slower fading speed
    imageIndex: Math.floor(Math.random() * 9) // Randomly choose one of the 9 petal images
  };
}

// Update petal positions, including interaction with mouse position, wind, and smooth disappearance
function updatePetals() {
  petals.forEach(petal => {
    // Apply wind and fall effect
    petal.x += petal.speedX + windX;
    petal.y += petal.speedY + windY;

    // Calculate the distance from the mouse
    const deltaX = mouseX - petal.x;
    const deltaY = mouseY - petal.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Make the attraction subtler by reducing the multiplier
    const attractionStrength = 0.003; // Subtle attraction (lower number = subtler effect)

    // Make the attraction stronger over a larger area
    if (distance < 300) {  // Larger area of attraction (increased from 100 to 300)
      const moveX = deltaX * attractionStrength;  // Move petal towards the cursor
      const moveY = deltaY * attractionStrength;
      petal.x += moveX;
      petal.y += moveY;
    }

    // Petal twists due to wind
    petal.rotationAngle += petal.rotationSpeed;

    // Fade-out effect: gradually decrease opacity as the petal falls
    if (petal.y > canvas.height / 2) {
      // Start fading when the petal is halfway down the screen
      petal.opacity -= petal.fadeSpeed;
    }

    // Reset the petal once it becomes fully transparent
    if (petal.opacity <= 0) {
      petal.opacity = 1; // Reset opacity
      petal.y = -petal.size; // Reset to above the canvas
      petal.x = Math.random() * canvas.width; // Random X position
      petal.imageIndex = Math.floor(Math.random() * 9); // Choose a new random image
    }

    // Reset petal position if it goes off the canvas vertically
    if (petal.y > canvas.height) {
      petal.y = -petal.size; // Reset to the top if it goes off the bottom
      petal.x = Math.random() * canvas.width; // Random X position
      petal.speedY = Math.random() * 1 + 1; // Reset fall speed
      petal.imageIndex = Math.floor(Math.random() * 9); // Choose a new random image
    }
  });
}

// Draw all the petals with rotation and fading effect
function drawPetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  petals.forEach(petal => {
    ctx.save(); // Save the current context before applying transformations
    ctx.globalAlpha = petal.opacity; // Set opacity based on petal's property
    
    // Move the origin to the center of the petal for rotation
    ctx.translate(petal.x + petal.size / 2, petal.y + petal.size / 2);
    
    // Rotate the petal based on its current rotation angle
    ctx.rotate(petal.rotationAngle);

    // Draw the selected petal image from the petalImages array
    ctx.drawImage(petalImages[petal.imageIndex], -petal.size / 2, -petal.size / 2, petal.size, petal.size);

    ctx.restore(); // Restore the context to the original state
  });
}

// Animation loop
function animate() {
  updatePetals();
  drawPetals();
  requestAnimationFrame(animate);
}

// Resize canvas when the window is resized
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Update mouse position when it moves
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});



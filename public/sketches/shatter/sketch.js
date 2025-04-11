let shaderProgram;
let numPlanesSlider, planeSizeSlider;
let numPlanes = 8000;
let planeSize = 1000;
let amplitude = 20;
let noiseScale = 0.01;
let timeOffset = 0;

let faceImage;

function preload() {
  shaderProgram = loadShader('waveVert.vert', 'waveFrag.frag');
  faceImage = loadImage('face.jpg'); // Load your image here
}

function preload() {
  shaderProgram = loadShader('waveVert.vert', 'waveFrag.frag');
}

function setup() {
  createCanvas(512, 512, WEBGL);
  canvas.parent("shatter-container"); // Mount to custom DOM node
  noStroke();
  background(0);
  noLoop(); // Stop automatic looping

  // Create slider for numPlanes
  numPlanesSlider = createSlider(1000, 20000, numPlanes, 100);
  numPlanesSlider.position(10, height + 10); // Position below the canvas
  numPlanesSlider.style('width', '200px');
  
  // Create label for numPlanes slider
  let numPlanesLabel = createDiv('Number of Planes');
  numPlanesLabel.position(numPlanesSlider.x * 2 + numPlanesSlider.width, height + 5); // Position next to slider

  // Create slider for planeSize
  planeSizeSlider = createSlider(100, 2000, planeSize, 50);
  planeSizeSlider.position(10, height + 40); // Position below the first slider
  planeSizeSlider.style('width', '200px');

  // Create label for planeSize slider
  let planeSizeLabel = createDiv('Plane Size');
  planeSizeLabel.position(planeSizeSlider.x * 2 + planeSizeSlider.width, height + 35); // Position next to slider

  // Focus the canvas for key detection
//   canvas = document.querySelector('canvas');
  canvas.focus();
}

function draw() {
  background(0);
  shader(shaderProgram); // Activate the shader
  directionalLight(255, 255, 255, 1, 1, 0); // Light for 3D depth

  // Update numPlanes and planeSize from slider values
  numPlanes = numPlanesSlider.value();
  planeSize = planeSizeSlider.value();

  // Pass uniform variables to the shader
  shaderProgram.setUniform('uTime', timeOffset);
  shaderProgram.setUniform('uAmplitude', amplitude);
  shaderProgram.setUniform('uNoiseScale', noiseScale);

  for (let i = 0; i < numPlanes; i++) {
    push();
    
    // Randomly position each plane around the viewer within a spherical volume
    let x = random(-300, 300);
    let y = random(-300, 300);
    let z = random(-300, 300);
    translate(x, y, z);
    
    // Random orientation for each plane
    rotateX(random(TWO_PI));
    rotateY(random(TWO_PI));
    rotateZ(random(TWO_PI));

    // Draw a plane using the shader for vertex manipulation
    plane(planeSize, planeSize);
    
    pop();
  }
}

// Function to handle key presses
function keyPressed() {
  if (key === 's' || key === 'S') {
    console.log("Saving canvas...");
    saveCanvas('shatter_frame_' + nf(frameCount, 3), 'png');
  }
  if (key === ' ') { // Space bar to advance the animation
    console.log("Moving to next frame...");
    timeOffset += 0.01; // Increment time to move the animation forward
    redraw(); // Manually update the canvas
  }
}

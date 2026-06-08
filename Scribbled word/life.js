var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

// Canvas drawing + fading effect
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let lastX = null;
let lastY = null;
const strokes = [];
const FADE_DURATION = 1500;

window.addEventListener('mousemove', (e) => {
  // Store in page coordinates so strokes stay fixed to the document
  const px = e.clientX + window.scrollX;
  const py = e.clientY + window.scrollY;
  if (lastX === null) {
    lastX = px;
    lastY = py;
    return;
  }
  strokes.push({ x1: lastX, y1: lastY, x2: px, y2: py, t: Date.now() });
  lastX = px;
  lastY = py;
});

window.addEventListener('mouseleave', () => {
  lastX = null;
  lastY = null;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = Date.now();

  // Drop strokes older than 7 seconds
  while (strokes.length && now - strokes[0].t > FADE_DURATION) {
    strokes.shift();
  }

  // Offset by scroll so page-coordinate strokes render correctly on the fixed canvas
  ctx.save();
  ctx.translate(-window.scrollX, -window.scrollY);

  for (const s of strokes) {
    const alpha = 1 - (now - s.t) / FADE_DURATION;
    ctx.beginPath();
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
    ctx.strokeStyle = `rgba(51, 51, 51, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  ctx.restore();
  requestAnimationFrame(draw);
}
draw();
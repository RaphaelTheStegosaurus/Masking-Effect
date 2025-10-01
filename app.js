const container = document.querySelector(".container");
const revealer = document.querySelector(".revealer");
const secretSpot = document.querySelector(".secret-spot");
const successMessage = document.querySelector(".success-message");
let isFound = false;
const RADIUS = 50;
revealer.style.height = `${RADIUS * 2}px`;
revealer.style.width = `${RADIUS * 2}px`;
function getCoords(_event, _container) {
  const rect = _container.getBoundingClientRect();
  let clientX, clientY;
  if (_event.touches && _event.touches.length > 0) {
    clientX = _event.touches[0].clientX;
    clientY = _event.touches[0].clientY;
  } else {
    clientX = _event.clientX;
    clientY = _event.clientY;
  }
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  return { x, y };
}
function checkDiscovery(lupaX, lupaY) {
  if (isFound) return;
  const secretRect = secretSpot.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const secretX = secretRect.left - containerRect.left;
  const secretY = secretRect.top - containerRect.top;
  const secretWidth = secretRect.width;
  const secretHeight = secretRect.height;
  const isOverSecret =
    lupaX >= secretX &&
    lupaX <= secretX + secretWidth &&
    lupaY >= secretY &&
    lupaY <= secretY + secretHeight;
  if (isOverSecret) {
    isFound = true;
    secretSpot.setAttribute("data-found", "true");
    successMessage.classList.add("visible");
  }
}

function updateRevealer(_event) {
  _event.preventDefault();
  const { x, y } = getCoords(_event, container);

  revealer.style.top = `${y - RADIUS}px`;
  revealer.style.left = `${x - RADIUS}px`;
  checkDiscovery(x, y);
}
container.addEventListener("mousemove", updateRevealer);
container.addEventListener("mouseenter", updateRevealer);
container.addEventListener("touchmove", updateRevealer, { passive: false });
container.addEventListener("touchstart", updateRevealer, { passive: false });

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("filter");
  const container = canvas.parentElement;
  const ctx = canvas.getContext("2d");
  const filterColor = "#0c0c0c";

  function drawFilter() {
    ctx.fillStyle = filterColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  function resizeCanvas() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    drawFilter();
  }
  resizeCanvas();
  function lensRevealer(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFilter();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  let isMouseDown = false;
  canvas.addEventListener("mousedown", (event) => {
    isMouseDown = true;
    lensRevealer(event.offsetX, event.offsetY);
  });
  canvas.addEventListener("mousemove", (event) => {
    if (isMouseDown) {
      lensRevealer(event.offsetX, event.offsetY);
    }
  });
  canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
  });
  canvas.addEventListener("mouseleave", () => {
    isMouseDown = false;
  });
  canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    isTouching = true;
    const coords = getCoords(event, canvas);
    lensRevealer(coords.x, coords.y);
  });
  canvas.addEventListener("touchmove", (event) => {
    if (!isTouching) return;
    event.preventDefault();
    const coords = getCoords(event, canvas);
    lensRevealer(coords.x, coords.y);
  });
  canvas.addEventListener("touchend", () => {
    isTouching = false;
  });
  canvas.addEventListener("touchcancel", () => {
    isTouching = false;
  });
});

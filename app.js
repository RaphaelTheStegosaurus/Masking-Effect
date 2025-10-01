const container = document.querySelector(".container");
const revealer = document.querySelector(".revealer");
const secretSpot = document.querySelector(".secret-spot");
const successMessage = document.querySelector(".success-message");
const radius = 50;
let isFound = false;
function hideRevealer() {
  //   const hiddenMaskValue = `radial-gradient(circle 50px at -100px -100px, black 100%, transparent 100%)`;
  //   revealer.style.setProperty("-webkit-mask-image", hiddenMaskValue);
  //   revealer.style.setProperty("mask-image", hiddenMaskValue);
}

function getCoords(e) {
  const rect = container.getBoundingClientRect();
  let clientX, clientY;
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
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
    // revealer.style.pointerEvents = "none";
  }
}

function updateRevealer(e) {
  e.preventDefault();
  const { x, y } = getCoords(e);
  //   const maskValue = `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 100%, transparent 100%)`;
  //   revealer.style.setProperty("-webkit-mask-image", maskValue);
  //   revealer.style.setProperty("mask-image", maskValue);
  checkDiscovery(x, y);
}
container.addEventListener("mousemove", updateRevealer);
container.addEventListener("mouseenter", updateRevealer);
// container.addEventListener("mouseleave", hideRevealer);
container.addEventListener("touchmove", updateRevealer, { passive: false });
container.addEventListener("touchstart", updateRevealer, { passive: false });
// container.addEventListener("touchend", hideRevealer);
// container.addEventListener("touchcancel", hideRevealer);
// hideRevealer();
//FUNCIONAL BY REVEALER
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("filter");
  const container = canvas.parentElement;
  const ctx = canvas.getContext("2d");
  const filterColor = "#C0C0C0";

  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  function drawFilter() {
    ctx.fillStyle = filterColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  drawFilter();
  function lensRevealer(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFilter();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }
  function getTouchCoords(event) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    return { x, y };
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
    event.preventDefault(); // Evita el scroll/zoom del navegador
    isTouching = true;
    const coords = getTouchCoords(event);
    lensRevealer(coords.x, coords.y);
  });
  canvas.addEventListener("touchmove", (event) => {
    if (!isTouching) return;
    event.preventDefault();
    const coords = getTouchCoords(event);
    lensRevealer(coords.x, coords.y);
  });
  canvas.addEventListener("touchend", () => {
    isTouching = false;
  });
  canvas.addEventListener("touchcancel", () => {
    isTouching = false;
  });
});

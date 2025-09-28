const container = document.querySelector(".container");
const revealer = document.querySelector(".revealer");
const secretSpot = document.querySelector(".secret-spot");
const successMessage = document.querySelector(".success-message");
const radius = 50;
let isFound = false;
/**
 * 💡 Usa getBoundingClientRect() para calcular la posición
 * del cursor (o toque) relativa al contenedor.
 * Esto es crucial para que funcione sin importar dónde esté el contenedor
 * en la página.
 */
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

    revealer.style.pointerEvents = "none";
  }
}

function updateRevealer(e) {
  e.preventDefault();
  const { x, y } = getCoords(e);
  const maskValue = `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 100%, transparent 100%)`;
  revealer.style.setProperty("-webkit-mask-image", maskValue);
  revealer.style.setProperty("mask-image", maskValue);
  checkDiscovery(x, y);
}
container.addEventListener("mousemove", updateRevealer);
container.addEventListener("mouseenter", updateRevealer);
container.addEventListener("touchmove", updateRevealer, { passive: false });
container.addEventListener("touchstart", updateRevealer, { passive: false });

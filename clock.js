// The page's only script: live clocks in the header, plus closing the phone menu after a tap.
const clocks = document.querySelectorAll("time[data-tz]");

function tick() {
  const now = new Date();
  for (const el of clocks) {
    const zone = el.dataset.tz === "local" ? undefined : el.dataset.tz;
    el.textContent = now.toLocaleTimeString("en-GB", { timeZone: zone, hour12: false });
    el.dateTime = now.toISOString();
  }
}

tick();
setInterval(tick, 1000);

document.querySelector(".menu").addEventListener("click", () => {
  document.getElementById("menu").checked = false;
});

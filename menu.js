// The page's only script: closes the phone menu after a link in it is tapped.
document.querySelector(".menu").addEventListener("click", () => {
  document.getElementById("menu").checked = false;
});

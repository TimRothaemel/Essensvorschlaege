console.log("darkmode.js wurde geladen!");
let darkmode = localStorage.getItem("darkmode");
const themeSwitch = document.getElementById("theme-switch");
const enableDarkmode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
};

const disableDarkmode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", "inactive");
};

// Prüfen, ob Darkmode aktiv sein sollte
if (darkmode === "active") enableDarkmode();

themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem("darkmode"); // Erneut abrufen
  darkmode !== "active" ? enableDarkmode() : disableDarkmode();
});

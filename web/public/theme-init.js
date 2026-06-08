/* No-flash theme init. Parser-blocking (first in <body>), runs before paint.
   Resolves light | dark | sensor from localStorage('mt-theme') or OS preference. */
(function () {
  try {
    var c = document.documentElement.classList;
    // Mark JS available so scroll-reveal content can hide-then-animate.
    // Without this class, .reveal content stays fully visible (no-JS safe).
    c.add("js");
    var t = localStorage.getItem("mt-theme");
    c.remove("light", "dark", "sensor-view");
    if (t === "dark") c.add("dark");
    else if (t === "sensor") c.add("sensor-view");
    else if (t === "light") c.add("light");
    else c.add(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  } catch (e) {}
})();

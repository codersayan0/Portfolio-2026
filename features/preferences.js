/* Apply saved theme before first paint. */
(() => { try { document.documentElement.dataset.theme=localStorage.getItem("portfolio-theme")==="light"?"light":"dark"; } catch {} })();

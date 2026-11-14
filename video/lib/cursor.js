// Injected into every page: a visible cursor that follows Playwright's mouse,
// a ripple on click, and hidden scrollbars. The position survives navigations.
(() => {
  const KEY = "__demo_cursor_pos";
  function install() {
    if (document.getElementById("__demo_cursor")) return;
    const style = document.createElement("style");
    style.textContent = `
      ::-webkit-scrollbar { display: none; }
      html { scrollbar-width: none; }
      #__demo_cursor {
        position: fixed; left: 0; top: 0; width: 14px; height: 14px; margin: -7px 0 0 -7px;
        border-radius: 50%; background: rgba(234, 88, 12, 0.25); border: 1.5px solid rgba(234, 88, 12, 0.55);
        pointer-events: none; z-index: 2147483647;
        transition: transform 120ms ease, background 120ms ease;
      }
      #__demo_cursor.down { transform: scale(0.75); background: rgba(234, 88, 12, 0.45); }
      .__demo_ripple {
        position: fixed; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%;
        border: 2px solid rgba(234, 88, 12, 0.5); pointer-events: none; z-index: 2147483646;
        animation: __demo_ripple 600ms ease-out forwards;
      }
      @keyframes __demo_ripple { to { transform: scale(3); opacity: 0; } }`;
    document.head.appendChild(style);

    const cursor = document.createElement("div");
    cursor.id = "__demo_cursor";
    const place = (x, y) => {
      cursor.style.left = x + "px";
      cursor.style.top = y + "px";
    };
    try {
      const pos = JSON.parse(sessionStorage.getItem(KEY) || "null");
      place(pos ? pos.x : innerWidth / 2, pos ? pos.y : innerHeight / 2);
    } catch {
      place(innerWidth / 2, innerHeight / 2);
    }
    document.body.appendChild(cursor);

    addEventListener("mousemove", (e) => {
      place(e.clientX, e.clientY);
      try { sessionStorage.setItem(KEY, JSON.stringify({ x: e.clientX, y: e.clientY })); } catch {}
    }, true);
    addEventListener("mousedown", (e) => {
      cursor.classList.add("down");
      const r = document.createElement("div");
      r.className = "__demo_ripple";
      r.style.left = e.clientX + "px";
      r.style.top = e.clientY + "px";
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 700);
    }, true);
    addEventListener("mouseup", () => cursor.classList.remove("down"), true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
})();

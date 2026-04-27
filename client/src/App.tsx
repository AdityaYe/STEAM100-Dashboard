import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/layouts/MainLayout";
import { useEffect, useState } from "react";
import { useAuth } from "./features/auth/AuthContext";

type Theme = "light" | "dark" | "retro";

function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const { authLoading } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme;
    
    const initial = saved || "light";

    setTheme(initial);
    applyTheme(initial);
  }, []);

  const applyTheme = (t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
  };

  const changeTheme = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
  };

  useEffect(() => {
  const burn =
    document.getElementById(
      "cursor-burn"
    );

  if (!burn) return;

  burn.className =
    "cursor-burn";

  const move = (
    e: MouseEvent
  ) => {
    burn.style.left =
      `${e.clientX - 75}px`;

    burn.style.top =
      `${e.clientY - 75}px`;
  };

  window.addEventListener(
    "mousemove",
    move
  );

  return () =>
    window.removeEventListener(
      "mousemove",
      move
    );
}, []);

if (authLoading) {
  return null;
}

  return (
    <>
    <div id="cursor-dot" className="arrow"></div>
    
    <div className="theme-switcher">

  {/* LIGHT */}
  <button
    type="button"
    onClick={() => changeTheme("light")}
    className={`theme-key theme-btn--light ${
      theme === "light" ? "active" : ""
    }`}
    aria-label="Light Theme"
    title="Light Theme"
  >
    <img
      src={
        theme === "light"
          ? "/icons/blue-sun.png"
          : "/icons/white-sun.png"
      }
      alt=""
    />
  </button>

  {/* DARK */}
  <button
    type="button"
    onClick={() => changeTheme("dark")}
    className={`theme-key theme-btn--dark ${
      theme === "dark" ? "active" : ""
    }`}
    aria-label="Dark Theme"
    title="Dark Theme"
  >
    <img
      src={
        theme === "dark"
          ? "/icons/blue-moon.png"
          : theme === "light"
          ? "/icons/soft-blue-moon.png"
          : "/icons/white-moon.png"
      }
      alt=""
    />
  </button>

  {/* RETRO */}
  <button
    type="button"
    onClick={() => changeTheme("retro")}
    className={`theme-key theme-btn--retro ${
      theme === "retro" ? "active" : ""
    }`}
    aria-label="Retro Theme"
    title="Retro Theme"
  >
    <span className="crt-ring"></span>

    <img
      src={
        theme === "retro"
          ? "/icons/light-crt.png"
          : "/icons/dark-crt.png"
      }
      alt=""
    />
  </button>

</div>
    
    <Routes>
      <Route path="/" element={<MainLayout />}>
      <Route index element={<Dashboard />}/>
      <Route path="favorites" element={<Dashboard />}/>
      </Route>
    </Routes>
  </>
  );
}
export default App;
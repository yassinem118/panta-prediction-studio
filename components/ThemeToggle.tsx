"use client";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [t, setT] = useState<"light" | "dark">("dark");
  useEffect(() => { setT(document.documentElement.dataset.theme === "light" ? "light" : "dark"); }, []);
  const flip = () => {
    const n = t === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = n;
    try { localStorage.setItem("theme", n); } catch {}
    setT(n);
  };
  return <button className="chip" onClick={flip} aria-label="Switch color theme">{t === "dark" ? "Light mode" : "Dark mode"}</button>;
}

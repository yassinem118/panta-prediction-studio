"use client";
import { useEffect } from "react";
export function Toast({ children, onDone }: { children: React.ReactNode; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 7000); return () => clearTimeout(t); }, [onDone]);
  return <div className="toast" role="status">{children}</div>;
}

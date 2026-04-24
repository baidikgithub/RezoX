"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConfigProvider, Switch, theme as antdTheme } from "antd";
import { BulbOutlined, MoonOutlined } from "@ant-design/icons";
import FloatingChat from "./FloatingChat";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/insights", label: "Insights" },
  { href: "/predict", label: "Predict" },
  { href: "/admin", label: "Admin" }
];

type ThemeMode = "light" | "dark";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem("rezox-theme");
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setThemeMode(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.dataset.theme = themeMode;
    root.classList.toggle("dark", themeMode === "dark");
    window.localStorage.setItem("rezox-theme", themeMode);
  }, [themeMode, ready]);

  const antdConfig = useMemo(
    () => ({
      algorithm: themeMode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: "#6366f1",
        borderRadius: 12
      }
    }),
    [themeMode]
  );

  return (
    <ConfigProvider theme={antdConfig}>
      <div className="app-shell">
        <header className="app-header">
          <div className="app-header-inner">
            <Link href="/" className="brand">
              <div className="brand-mark">R</div>
              <span>RezoX AI</span>
            </Link>

            <div className="header-actions">
              <nav className="app-nav">
                {navItems.map(item => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`app-nav-link ${active ? "active" : ""}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="theme-switch">
                <BulbOutlined />
                <Switch
                  checked={themeMode === "dark"}
                  onChange={checked => setThemeMode(checked ? "dark" : "light")}
                  checkedChildren={<MoonOutlined />}
                  unCheckedChildren={<BulbOutlined />}
                  aria-label="Toggle light and dark mode"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="app-main">
          <div className="page-container">{children}</div>
        </main>

        <footer className="app-footer">
          RezoX ©{new Date().getFullYear()} - Built with AI and Machine Learning
        </footer>

        <FloatingChat />
      </div>
    </ConfigProvider>
  );
}

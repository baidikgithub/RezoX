"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Badge, Button, ConfigProvider, Dropdown, Switch, theme as antdTheme } from "antd";
import { BellOutlined, BulbOutlined, CloseOutlined, LogoutOutlined, MenuOutlined, MoonOutlined, UserOutlined } from "@ant-design/icons";
import FloatingChat from "./FloatingChat";
import MotionShell from "./MotionShell";
import ScrollEffects from "./ScrollEffects";
import PropertyCompareDrawer from "./PropertyCompareDrawer";
import { useAuth } from "../lib/useAuth";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/listings", label: "Listings", icon: "🏢" },
  { href: "/insights", label: "Insights", icon: "📊" },
  { href: "/predict", label: "Predict", icon: "🔮" },
  { href: "/profile", label: "Profile", icon: "👤" }
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
  const router = useRouter();
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [ready, setReady] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, hydrate, signout } = useAuth();
  const publicAuthPage = pathname === "/signin" || pathname === "/signup" || pathname === "/forgot-password" || pathname === "/reset-password";
  const showProtectedChrome = Boolean(user) && !publicAuthPage;

  useEffect(() => {
    const initial = getInitialTheme();
    setThemeMode(initial);
    hydrate();
    setReady(true);
  }, [hydrate]);

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

  async function handleSignout() {
    await signout();
    router.push("/signin");
  }

  return (
    <ConfigProvider theme={antdConfig}>
      <div className="app-shell">
        <ScrollEffects />
        <header className="app-header">
          <div className="app-header-inner">
            <Link href="/" className="brand">
              <div className="brand-mark">R</div>
              <span>RezoX AI</span>
            </Link>

            <div className="header-actions">
              {showProtectedChrome && (
                <button
                  className="hamburger-btn"
                  onClick={() => setMobileNavOpen(true)}
                  aria-label="Open navigation menu"
                >
                  <MenuOutlined />
                </button>
              )}
              {showProtectedChrome && (
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
              )}

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
              {showProtectedChrome && <PropertyCompareDrawer />}
              {!publicAuthPage && (
                <Dropdown
                  menu={{
                    items: user
                      ? [
                          { key: "profile", label: <Link href="/profile">Profile</Link>, icon: <UserOutlined /> },
                          { key: "admin", label: <Link href="/admin">Workspace</Link>, disabled: user.role === "buyer" },
                          { key: "logout", label: "Sign out", icon: <LogoutOutlined />, onClick: handleSignout }
                        ]
                      : [
                          { key: "signin", label: <Link href="/signin">Sign in</Link> },
                          { key: "signup", label: <Link href="/signup">Create account</Link> }
                        ]
                  }}
                >
                  <Button shape="circle" className="magnetic-btn" aria-label="Account menu">
                    <Avatar size={28} icon={<UserOutlined />} src={user?.avatar} />
                  </Button>
                </Dropdown>
              )}
              {showProtectedChrome && (
                <Badge dot>
                  <Button shape="circle" icon={<BellOutlined />} aria-label="Notifications" />
                </Badge>
              )}
            </div>
          </div>
        </header>

        <main className="app-main">
          <div className="page-container">
            <MotionShell>{children}</MotionShell>
          </div>
        </main>

        <footer className="app-footer">
          RezoX ©{new Date().getFullYear()} - Built with AI and Machine Learning
        </footer>

        {showProtectedChrome && <FloatingChat />}

        {/* Mobile Navigation Drawer */}
        {showProtectedChrome && mobileNavOpen && (
          <>
            <div className="mobile-menu-overlay" onClick={() => setMobileNavOpen(false)} />
            <div className="mobile-nav-drawer">
              <div className="mobile-nav-header">
                <div className="brand">
                  <div className="brand-mark">R</div>
                  <span>RezoX AI</span>
                </div>
                <button
                  className="hamburger-btn"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close navigation menu"
                  style={{ display: "flex" }}
                >
                  <CloseOutlined />
                </button>
              </div>
              {navItems.map(item => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mobile-nav-link ${active ? "active" : ""}`}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </ConfigProvider>
  );
}

// LoginPage.tsx
import React, { useState } from "react";

// Replace with your property image URL or import
const propertyImageUrl = "your-image-url.jpg";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      background: "#f5f5f5"
    }}>
      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 32px 0 32px"
      }}>
        <button style={{
          border: "1px solid #243B6A",
          background: "#fff",
          borderRadius: "24px",
          padding: "8px 24px",
          fontWeight: 500,
          cursor: "pointer"
        }}>
          &#8592; Back to Homepage
        </button>
        <div style={{ fontWeight: 700, fontSize: 20 }}>
          <span role="img" aria-label="propbot" style={{ marginRight: 8 }}>🏠</span>PropBot
        </div>
        <button style={{
          border: "none",
          background: "#243B6A",
          color: "#fff",
          borderRadius: "24px",
          padding: "8px 24px",
          fontWeight: 500,
          cursor: "pointer"
        }}>
          About Us &rarr;
        </button>
      </header>

      {/* Content */}
      <div style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
        {/* Login Card */}
        <div style={{
          background: "#fff",
          padding: "40px 36px",
          borderRadius: "24px",
          boxShadow: "0 2px 12px rgba(40,60,80,0.1)",
          width: 400,
          marginRight: 40
        }}>
          <h2 style={{
            fontWeight: 700,
            fontSize: 32,
            marginBottom: 32,
            textAlign: "center"
          }}>Log In</h2>
          <form>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 600 }}>Email Address</label>
              <input
                type="email"
                placeholder="Enter Your Email Id"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1.5px solid #243B6A",
                  marginTop: 8
                }}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontWeight: 600 }}>Password</label>
              <input
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1.5px solid #243B6A",
                  marginTop: 8
                }}
              />
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                Remember Me
              </label>
              <a
                href="#"
                style={{ color: "#ED7272", fontSize: 13, textDecoration: "none" }}
              >
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                margin: "24px 0 12px 0",
                background: "#243B6A",
                color: "#fff",
                border: "none",
                borderRadius: "24px",
                fontWeight: 600,
                fontSize: 20,
                padding: "12px 0",
                cursor: "pointer"
              }}>
              Log In
            </button>
          </form>
          <div style={{
            textAlign: "center",
            color: "#A0A0A0",
            fontSize: 14,
            margin: "18px 0 10px 0"
          }}>
            OR CONTINUE WITH
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            marginBottom: "20px"
          }}>
            <button style={{
              border: "none", background: "none", cursor: "pointer"
            }}>
              {/* Replace with actual icon/image */}
              <span style={{ fontSize: 28 }}></span>
            </button>
            <button style={{
              border: "none", background: "none", cursor: "pointer"
            }}>
              <span style={{ fontSize: 28, color: "#1877f3" }}>f</span>
            </button>
            <button style={{
              border: "none", background: "none", cursor: "pointer"
            }}>
              <span style={{ fontSize: 28, color: "#EA4335" }}>G</span>
            </button>
          </div>
          <div style={{ textAlign: "center", fontSize: 14 }}>
            Doesn't have an account?{" "}
            <a href="#" style={{
              color: "#243B6A",
              fontWeight: 600,
              textDecoration: "none"
            }}>
              Create One
            </a>
          </div>
        </div>
        {/* Property Image */}
        <div style={{
          borderRadius: "32px",
          overflow: "hidden",
          width: 500,
          height: 420,
          boxShadow: "0 2px 12px rgba(40,60,80,0.14)"
        }}>
          <img
            src={propertyImageUrl}
            alt="property"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import { useState } from "react";
import { api } from "../api/API";
import { useNavigate, Link } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    borderRadius: 18,
    padding: 40,
    boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
  },
  h1: { margin: 0, marginBottom: 24, textAlign: "center", fontSize: 34 },
  label: { fontWeight: 600, marginBottom: 6, display: "block" },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #d1d5db",
    fontSize: 16,
    outline: "none",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "white",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 8,
  },
  footer: { textAlign: "center", marginTop: 18, fontSize: 14 },
  link: { color: "#4f46e5", fontWeight: 700, textDecoration: "none" },
  error: { color: "#dc2626", marginTop: 8, marginBottom: 0 },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.endsWith("@stud.ase.ro")) {
      setErr("Folosește email instituțional @stud.ase.ro");
      return;
    }

    try {
      const { data } = await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/notes");
    } catch {
      setErr("Autentificare eșuată");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.h1}>Autentificare</h1>

        <form onSubmit={submit}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nume@stud.ase.ro"
          />

          <label style={styles.label}>Parolă</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <p style={styles.error}>{err}</p>}

          <button style={styles.button} type="submit">
            Autentificare
          </button>
        </form>

        <div style={styles.footer}>
          Nu ai cont?{" "}
          <Link style={styles.link} to="/register">
            Înregistrare
          </Link>
        </div>
      </div>
    </div>
  );
}

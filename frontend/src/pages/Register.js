import { useState } from "react";
import { api } from "../api/API";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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
      await api.post("/auth/register", {
        email: normalizedEmail,
        password,
        fullName,
      });

      navigate("/login");
    } catch {
      setErr("Înregistrare eșuată");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Înregistrare</h1>

        <form onSubmit={submit}>
          <label>Nume complet</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label>Email</label>
          <input
            placeholder="nume@stud.ase.ro"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Parolă</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <p style={{ color: "red" }}>{err}</p>}

          <button type="submit">Creează cont</button>
        </form>

        <div className="auth-footer">
          Ai deja cont? <Link to="/login">Autentificare</Link>
        </div>
      </div>
    </div>
  );
}

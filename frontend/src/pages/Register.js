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
        } catch (e2) {
            setErr(e2?.response?.data?.message || "Register eșuat");
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: "40px auto" }}>
            <h2>Register</h2>

            <form onSubmit={submit}>
                <label>Nume complet</label>
                <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: "100%" }}
                />

                <br /><br />

                <label>Email</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nume@stud.ase.ro"
                    style={{ width: "100%" }}
                />

                <br /><br />

                <label>Parolă</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%" }}
                />

                <br /><br />

                {err && <p style={{ color: "red" }}>{err}</p>}

                <button type="submit">Creează cont</button>
            </form>

            <p style={{ marginTop: 12 }}>
                Ai cont? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

import { useState } from "react";
import { api } from "../api/API";
import { useNavigate, Link } from "react-router-dom";

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
            if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/notes");
        } catch (e2) {
            setErr(e2?.response?.data?.message || "Login eșuat");
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: "40px auto" }}>
            <h2>Login</h2>

            <form onSubmit={submit}>
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

                <button type="submit">Autentificare</button>
            </form>

            <p style={{ marginTop: 12 }}>
                Nu ai cont? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

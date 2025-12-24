import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      <p>Ești logat. Acum poți gestiona notițele, materiile și grupurile.</p>

      {user && <pre>{user}</pre>}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate("/notes")}>
          Notițele mele
        </button>

        <button
          style={{ marginLeft: 10 }}
          onClick={() => navigate("/groups")}
        >
          Grupurile mele
        </button>
      </div>

      <br />

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}

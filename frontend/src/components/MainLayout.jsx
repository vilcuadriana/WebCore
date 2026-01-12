import { Link, useNavigate } from "react-router-dom";

/**
 * Componenta MainLayout
 * Reprezintă layout-ul principal al aplicației după autentificare.
 *
 * Conține:
 *  - sidebar-ul de navigare
 *  - zona principală de conținut
 *
 * Este reutilizată de paginile:
 *  - Dashboard
 *  - Notes
 *  - Groups
 */
export default function MainLayout({ title, children }) {
  const navigate = useNavigate();

  return (
    <div className="layout">
      {/* Sidebar - navigare principală */}
      <aside className="sidebar">
        {/* Titlul aplicației */}
        <h2>📚 StudyNotes</h2>

        {/* Link-uri de navigare */}
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/notes">Notițe</Link>
          <Link to="/groups">Grupuri</Link>
        </nav>

        {/* Buton de logout */}
        <button
          className="secondary"
          style={{ marginTop: "auto" }}
          onClick={() => {
            // Șterge datele de autentificare
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Redirecționează către pagina de login
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>

      {/* Conținutul principal al paginii */}
      <main className="content">
        {/* Titlul paginii */}
        <h1>{title}</h1>

        {/* Conținutul specific fiecărei pagini */}
        {children}
      </main>
    </div>
  );
}

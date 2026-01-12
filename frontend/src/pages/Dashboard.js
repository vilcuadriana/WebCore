import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";

/**
 * Componenta Dashboard
 * Reprezintă pagina principală a utilizatorului autentificat.
 *
 * Oferă acces rapid către:
 *  - notițe
 *  - grupuri de studiu
 */
export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <MainLayout title="Dashboard">
      {/* Grid cu acțiuni rapide */}
      <div className="grid">
        {/* Card pentru navigare către notițe */}
        <div className="action-card" onClick={() => navigate("/notes")}>
          <h3>📘 Notițe</h3>
          <p>Crează, editează și organizează notițele tale.</p>
        </div>

        {/* Card pentru navigare către grupuri */}
        <div className="action-card" onClick={() => navigate("/groups")}>
          <h3>👥 Grupuri</h3>
          <p>Colaborează cu colegii în grupuri de studiu.</p>
        </div>
      </div>
    </MainLayout>
  );
}

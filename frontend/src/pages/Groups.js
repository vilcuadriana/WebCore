import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/API";
import MainLayout from "../components/MainLayout";

/**
 * Componenta Groups
 * Permite utilizatorului autentificat să:
 *  - vadă grupurile din care face parte
 *  - creeze un grup nou
 *  - intre într-un grup prin click
 */
export default function Groups() {
  // Lista grupurilor utilizatorului
  const [groups, setGroups] = useState([]);

  // Pentru navigare către pagina unui grup
  const navigate = useNavigate();

  /**
   * Încarcă grupurile utilizatorului din backend
   */
  const loadGroups = async () => {
    try {
      const { data } = await api.get("/groups");
      setGroups(data);
    } catch (error) {
      console.error("Eroare la încărcarea grupurilor", error);
    }
  };

  /**
   * Creează un grup nou
   * Backend-ul așteaptă: { name }
   */
  const createGroup = async () => {
    const name = prompt("Introdu numele grupului de studiu");
    if (!name || !name.trim()) return;

    try {
      // Creează grupul
      const { data: group } = await api.post("/groups", {
        name: name.trim(),
      });

      // Întreabă dacă vrea să invite pe cineva
      const invite = window.confirm(
        "Grup creat cu succes. Vrei să inviți un coleg?"
      );

      if (invite) {
        const email = prompt("Introdu email-ul colegului (@stud.ase.ro)");
        if (email && email.trim()) {
          await api.post(`/groups/${group.id}/invite`, {
            email: email.trim().toLowerCase(),
          });
          alert("Invitație trimisă");
        }
      }

      // Reîncarcă lista grupurilor
      loadGroups();
    } catch (error) {
      console.error("Eroare la crearea grupului", error);
      alert("Eroare la crearea grupului");
    }
  };

  // Se apelează la montarea componentei
  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <MainLayout title="👥 Grupurile mele">
      {/* Card pentru acțiuni */}
      <div className="card">
        <button onClick={createGroup}>➕ Creează grup</button>
      </div>

      {/* Afișare grupuri */}
      <div className="grid">
        {groups.map((g) => (
          <div
            className="action-card"
            key={g.id}
            onClick={() => navigate(`/groups/${g.id}`)}
            style={{ cursor: "pointer" }}
          >
            <h3>{g.name}</h3>
            <p>Grup de studiu colaborativ</p>
          </div>
        ))}
      </div>

      {/* Mesaj dacă nu există grupuri */}
      {groups.length === 0 && (
        <p className="text-muted">
          Nu faci parte din niciun grup de studiu.
        </p>
      )}
    </MainLayout>
  );
}

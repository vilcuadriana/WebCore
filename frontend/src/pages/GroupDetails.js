import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/API";
import ReactMarkdown from "react-markdown";
import MainLayout from "../components/MainLayout";

/**
 * Pagina unui grup de studiu.
 * Afișează notițele tuturor membrilor grupului.
 * Permite ștergerea grupului (doar owner).
 */
export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);

  /**
   * Încarcă notițele grupului
   */
  const loadNotes = useCallback(async () => {
    try {
      const { data } = await api.get(`/groups/${id}/notes`);
      setNotes(data);
    } catch (error) {
      console.error("Eroare la încărcarea notițelor", error);
    }
  }, [id]);

  /**
   * Șterge grupul (doar owner)
   */
  const deleteGroup = async () => {
    if (!window.confirm("Sigur vrei să ștergi grupul?")) return;

    try {
      await api.delete(`/groups/${id}`);
      navigate("/groups");
    } catch (error) {
      console.error("Eroare la ștergerea grupului", error);
      alert("Nu s-a putut șterge grupul");
    }
  };

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return (
    <MainLayout title="👥 Grup de studiu">
      <button className="secondary" onClick={deleteGroup}>
        🗑 Șterge grup
      </button>

      <div className="notes-grid">
        {notes.map((n) => (
          <div className="note-card" key={n.id}>
            <h3>{n.title}</h3>
            <p className="text-muted">✍ {n.User.fullName}</p>
            <ReactMarkdown>{n.contentMarkdown}</ReactMarkdown>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <p className="text-muted">
          Niciun membru nu a adăugat încă notițe.
        </p>
      )}
    </MainLayout>
  );
}

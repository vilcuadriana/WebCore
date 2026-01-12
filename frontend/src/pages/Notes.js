import { useEffect, useState } from "react";
import { api } from "../api/API";
import ReactMarkdown from "react-markdown";
import MainLayout from "../components/MainLayout";

/**
 * Componenta Notes
 * Permite utilizatorului să creeze și să gestioneze notițele personale.
 *
 * Design-ul este gândit pentru studenți:
 *  - formular clar, ușor de folosit
 *  - afișare notițe în format grid
 *  - lizibilitate crescută
 */
export default function Notes() {
  /* =====================
     STATE
  ===================== */

  // Lista notițelor utilizatorului
  const [notes, setNotes] = useState([]);

  // Datele formularului de creare notiță
  const [title, setTitle] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");

  /* =====================
     FUNCȚII
  ===================== */

  /**
   * Încarcă notițele din backend
   */
  const loadNotes = async () => {
    try {
      const { data } = await api.get("/notes");
      setNotes(data);
    } catch (error) {
      console.error("Eroare la încărcarea notițelor", error);
    }
  };

  /**
   * Creează o notiță nouă
   */
  const submit = async (e) => {
    e.preventDefault();

    // Validare minimă
    if (!title.trim()) return;

    try {
      await api.post("/notes", {
        title,
        contentMarkdown,
      });

      // Reset formular
      setTitle("");
      setContentMarkdown("");

      // Reîncarcă notițele
      loadNotes();
    } catch (error) {
      console.error("Eroare la salvarea notiței", error);
    }
  };

  /* =====================
     EFFECTS
  ===================== */

  // Se apelează o singură dată la montarea componentei
  useEffect(() => {
    loadNotes();
  }, []);

  /* =====================
     RENDER
  ===================== */

  return (
    <MainLayout title="📘 Notițele mele">
      {/* Descriere scurtă */}
      <p className="text-muted" style={{ marginBottom: 24 }}>
        Creează și organizează materialele tale de studiu într-un mod simplu și eficient.
      </p>

      {/* =====================
          FORMULAR CREARE NOTIȚĂ
      ===================== */}
      <div className="card">
        <h2>✍️ Creează o notiță</h2>

        <form onSubmit={submit} className="note-form">
          <input
            placeholder="Titlu notiță"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows={6}
            placeholder="Scrie conținutul notiței (Markdown)"
            value={contentMarkdown}
            onChange={(e) => setContentMarkdown(e.target.value)}
          />

          <button type="submit">➕ Adaugă notiță</button>
        </form>
      </div>

      {/* =====================
          LISTĂ NOTIȚE
      ===================== */}
      <div className="notes-grid">
        {notes.map((note) => (
          <div className="note-card" key={note.id}>
            <h3>{note.title}</h3>

            {/* Randare conținut Markdown (preview) */}
            <ReactMarkdown>
              {note.contentMarkdown.length > 200
                ? note.contentMarkdown.slice(0, 200) + "..."
                : note.contentMarkdown}
            </ReactMarkdown>
          </div>
        ))}
      </div>

      {/* Mesaj afișat dacă nu există notițe */}
      {notes.length === 0 && (
        <p className="text-muted">Nu ai creat încă nicio notiță.</p>
      )}
    </MainLayout>
  );
}

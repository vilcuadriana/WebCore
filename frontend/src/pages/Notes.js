import { useEffect, useState } from "react";
import { api } from "../api/API";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import TagSelector from "../components/TagSelector";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [showShared, setShowShared] = useState(false);

  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const [title, setTitle] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [shareEmails, setShareEmails] = useState({});
  const [filesByNote, setFilesByNote] = useState({});
  const [attachmentsByNote, setAttachmentsByNote] = useState({});

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  const loadNotes = async () => {
    try {
      const { data } = await api.get("/notes");
      setNotes(data);
    } catch {
      setErr("Nu pot încărca notițele.");
    }
  };

  const loadSharedNotes = async () => {
    try {
      const { data } = await api.get("/notes/shared/with-me");
      setSharedNotes(data);
    } catch {
      setErr("Nu pot încărca notițele partajate.");
    }
  };

  const loadTags = async () => {
    try {
      const { data } = await api.get("/tags");
      setTags(data);
    } catch {}
  };

  useEffect(() => {
    loadNotes();
    loadTags();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContentMarkdown("");
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      await api.put(`/notes/${editingId}`, { title, contentMarkdown });
    } else {
      await api.post("/notes", { title, contentMarkdown });
    }

    resetForm();
    loadNotes();
  };

  const onEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContentMarkdown(note.contentMarkdown);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi notița?")) return;
    await api.delete(`/notes/${id}`);
    loadNotes();
  };

  const shareNote = async (noteId) => {
    const email = shareEmails[noteId];
    if (!email) return alert("Introdu un email");

    await api.post(`/notes/${noteId}/share`, {
      email: email.trim().toLowerCase(),
    });

    alert("Notiță partajată");
    setShareEmails((p) => ({ ...p, [noteId]: "" }));
  };


  const loadAttachments = async (noteId) => {
    const { data } = await api.get(`/attachments/note/${noteId}`);
    setAttachmentsByNote((p) => ({ ...p, [noteId]: data }));
  };


  const baseNotes = showShared ? sharedNotes : notes;

  const filteredNotes = baseNotes.filter((n) => {
    const text = `${n.title} ${n.contentMarkdown}`.toLowerCase();
    const matchesSearch = !search || text.includes(search.toLowerCase());
    const matchesTag =
      !selectedTag || (n.Tags && n.Tags.some((t) => t.id === Number(selectedTag)));

    return matchesSearch && matchesTag;
  });


  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>{showShared ? "Notițe partajate" : "Notițele mele"}</h2>

        <div>
          <button
            onClick={() => {
              if (!showShared) loadSharedNotes();
              setShowShared(!showShared);
            }}
          >
            {showShared ? "Notițele mele" : "Partajate cu mine"}
          </button>

          <button onClick={() => navigate("/dashboard")} style={{ marginLeft: 8 }}>
            Înapoi
          </button>
        </div>
      </div>

      {err && <p style={{ color: "red" }}>{err}</p>}

      {!showShared && (
        <form onSubmit={onSubmit} style={{ border: "1px solid #ddd", padding: 12 }}>
          <h3>{editingId ? "Editează notița" : "Adaugă notiță"}</h3>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titlu"
            style={{ width: "100%" }}
          />

          <br /><br />

          <textarea
            rows={6}
            value={contentMarkdown}
            onChange={(e) => setContentMarkdown(e.target.value)}
            placeholder="Conținut (Markdown)"
            style={{ width: "100%" }}
          />

          <br /><br />

          <button type="submit">
            {editingId ? "Salvează" : "Creează"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm} style={{ marginLeft: 8 }}>
              Anulează
            </button>
          )}
        </form>
      )}

      <hr />

      <div style={{ display: "flex", gap: 12 }}>
        <input
          placeholder="Caută notiță..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />

        <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
          <option value="">Toate tag-urile</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <br />

      {filteredNotes.map((n) => (
        <div key={n.id} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <b>{n.title}</b>

            {!showShared && (
              <div>
                <button onClick={() => onEdit(n)}>Edit</button>
                <button onClick={() => onDelete(n.id)} style={{ marginLeft: 8 }}>
                  Delete
                </button>
              </div>
            )}
          </div>

          {!showShared && (
            <TagSelector
              noteId={n.id}
              onSaved={() => {
                loadTags();
                loadNotes();
              }}
            />
          )}

          {!showShared && (
            <div style={{ marginTop: 10 }}>
              <input
                placeholder="email@stud.ase.ro"
                value={shareEmails[n.id] || ""}
                onChange={(e) =>
                  setShareEmails((p) => ({ ...p, [n.id]: e.target.value }))
                }
              />
              <button onClick={() => shareNote(n.id)} style={{ marginLeft: 6 }}>
                Partajează
              </button>
            </div>
          )}

          {!showShared && (
            <div style={{ marginTop: 10 }}>
              <input
                type="file"
                onChange={(e) =>
                  setFilesByNote((p) => ({ ...p, [n.id]: e.target.files?.[0] }))
                }
              />

              <button
                onClick={async () => {
                  const file = filesByNote[n.id];
                  if (!file) return;

                  const form = new FormData();
                  form.append("file", file);

                  await api.post(`/attachments/note/${n.id}`, form);
                  loadAttachments(n.id);
                }}
              >
                Upload
              </button>

              <button onClick={() => loadAttachments(n.id)}>
                Vezi atașamente
              </button>

              <ul>
                {(attachmentsByNote[n.id] || []).map((a) => (
                  <li key={a.id}>
                    <a href={a.url} target="_blank" rel="noreferrer">
                      {a.originalName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ReactMarkdown>{n.contentMarkdown}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}

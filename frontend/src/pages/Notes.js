import { useEffect, useState } from "react";
import { api } from "../api/API";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [contentMarkdown, setContentMarkdown] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [filesByNote, setFilesByNote] = useState({});
    const [attachmentsByNote, setAttachmentsByNote] = useState({});


    const navigate = useNavigate();

    const loadNotes = async () => {
        setErr("");
        setLoading(true);
        try {
            const { data } = await api.get("/notes");
            setNotes(data);
        } catch (e) {
            setErr(e?.response?.data?.message || "Nu pot încărca notițele.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotes();
    }, []);

    const resetForm = () => {
        setTitle("");
        setContentMarkdown("");
        setEditingId(null);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");

        if (!title.trim()) {
            setErr("Titlul este obligatoriu.");
            return;
        }

        try {
            if (editingId) {
                await api.put(`/notes/${editingId}`, { title, contentMarkdown });
            } else {
                await api.post("/notes", { title, contentMarkdown });
            }
            resetForm();
            loadNotes();
        } catch (e2) {
            setErr(e2?.response?.data?.message || "Eroare la salvare.");
        }
    };

    const onEdit = (note) => {
        setEditingId(note.id);
        setTitle(note.title || "");
        setContentMarkdown(note.contentMarkdown || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onDelete = async (id) => {
        if (!window.confirm("Sigur vrei să ștergi notița?")) return;
        setErr("");
        try {
            await api.delete(`/notes/${id}`);
            loadNotes();
        } catch (e) {
            setErr(e?.response?.data?.message || "Eroare la ștergere.");
        }
    };
    const loadAttachments = async (noteId) => {
        const { data } = await api.get(`/attachments/note/${noteId}`);
        setAttachmentsByNote((prev) => ({ ...prev, [noteId]: data }));
    };


    return (
        <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Notițe</h2>
                <button onClick={() => navigate("/dashboard")}>Înapoi</button>
            </div>

            {err && <p style={{ color: "red" }}>{err}</p>}

            <form onSubmit={onSubmit} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
                <h3>{editingId ? "Editează notița" : "Adaugă notiță"}</h3>

                <label>Titlu</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: "100%" }}
                    placeholder="Ex: Seminar 3 - JWT"
                />

                <br /><br />

                <label>Conținut (Markdown)</label>
                <textarea
                    value={contentMarkdown}
                    onChange={(e) => setContentMarkdown(e.target.value)}
                    rows={7}
                    style={{ width: "100%" }}
                    placeholder="Scrie notița aici..."
                />

                <br /><br />

                <button type="submit">{editingId ? "Salvează" : "Creează"}</button>
                {editingId && (
                    <button type="button" onClick={resetForm} style={{ marginLeft: 8 }}>
                        Anulează
                    </button>
                )}
            </form>

            <hr style={{ margin: "24px 0" }} />

            <h3>Lista notițelor</h3>

            {loading ? (
                <p>Se încarcă...</p>
            ) : notes.length === 0 ? (
                <p>Nu ai notițe încă.</p>
            ) : (
                notes.map((n) => (
                    <div
                        key={n.id}
                        style={{
                            border: "1px solid #eee",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 10,
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                            <b>{n.title}</b>
                            <div>
                                <button onClick={() => onEdit(n)}>Edit</button>
                                <button onClick={() => onDelete(n.id)} style={{ marginLeft: 8 }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed #ddd" }}>
                            <b>Atașamente</b>
                            <div style={{ marginTop: 8 }}>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        setFilesByNote((prev) => ({ ...prev, [n.id]: file }));
                                    }}
                                />

                                <button
                                    style={{ marginLeft: 8 }}
                                    onClick={async () => {
                                        try {
                                            const file = filesByNote[n.id];
                                            if (!file) return alert("Alege un fișier.");

                                            const form = new FormData();
                                            form.append("file", file);

                                            await api.post(`/attachments/note/${n.id}`, form, {
                                                headers: { "Content-Type": "multipart/form-data" },
                                            });


                                            await loadAttachments(n.id);
                                            alert("Atașament încărcat!");
                                        } catch (e) {
                                            alert(e?.response?.data?.message || "Eroare la upload");
                                        }
                                    }}
                                >
                                    Upload
                                </button>

                                <button
                                    style={{ marginLeft: 8 }}
                                    onClick={() => loadAttachments(n.id)}
                                >
                                    Vezi atașamente
                                </button>
                            </div>

                            <ul style={{ marginTop: 10 }}>
                                {(attachmentsByNote[n.id] || []).map((a) => (
                                    <li key={a.id}>
                                        <a href={a.url} target="_blank" rel="noreferrer">
                                            {a.originalName}
                                        </a>

                                        <button
                                            style={{ marginLeft: 8 }}
                                            onClick={async () => {
                                                try {
                                                    await api.delete(`/attachments/${a.id}`);
                                                    await loadAttachments(n.id);
                                                } catch (e) {
                                                    alert(e?.response?.data?.message || "Eroare la ștergere");
                                                }
                                            }}
                                        >
                                            Șterge
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <ReactMarkdown>
                            {n.contentMarkdown}
                        </ReactMarkdown>
                    </div>

                ))
            )}
        </div>
    );
}

 import { useEffect, useState, useCallback } from "react";
import { api } from "../api/API";
import ReactMarkdown from "react-markdown";
import MainLayout from "../components/MainLayout";

// TAGS
import {
  getTags,
  createTag,
  setTagsForNote,
  getTagsForNote,
} from "../api/tagApi";

// ATTACHMENTS
import {
  uploadAttachment,
  getAttachmentsForNote,
  deleteAttachment,
} from "../api/attachmentApi";

// IMPORTS
import {
  addImport,
  getImportsForNote,
  deleteImport,
} from "../api/importApi";


  export default function Notes() {
  /* ===================== STATE ===================== */

  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tags, setTags] = useState([]);

  // 🔴 LIPSEA – acum există
  const [attachments, setAttachments] = useState([]);
  const [imports, setImports] = useState([]);

  // formular
  const [title, setTitle] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // UI
  const [showForm, setShowForm] = useState(false);

  // filtre
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterTags, setFilterTags] = useState([]);

  // upload / import
  const [file, setFile] = useState(null);
  const [importUrl, setImportUrl] = useState("");

  // editare
  const [editingId, setEditingId] = useState(null);

  /* ===================== LOADERS ===================== */

  const loadNotes = useCallback(async () => {
    const { data } = await api.get("/notes");
    setNotes(data);
  }, []);

  const loadSubjects = useCallback(async () => {
    const { data } = await api.get("/subjects");
    setSubjects(data);
  }, []);

  const loadTags = useCallback(async () => {
    const data = await getTags();
    setTags(data);
  }, []);

      /* ===================== CRUD ===================== */

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let noteId;

    if (editingId) {
      await api.put(`/notes/${editingId}`, {
        title,
        contentMarkdown,
        subjectId: subjectId || null,
      });
      noteId = editingId;
    } else {
      const { data } = await api.post("/notes", {
        title,
        contentMarkdown,
        subjectId: subjectId || null,
      });
      noteId = data.id;
    }

    await setTagsForNote(noteId, selectedTags);

    resetForm();
    loadNotes();
  };

  const startCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const startEdit = async (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContentMarkdown(note.contentMarkdown);
    setSubjectId(note.SubjectId || "");

    const noteTags = await getTagsForNote(note.id);
    setSelectedTags(noteTags.map((t) => t.id));

    setAttachments(await getAttachmentsForNote(note.id));
    setImports(await getImportsForNote(note.id));

    setShowForm(true);
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi notița?")) return;
    await api.delete(`/notes/${id}`);
    loadNotes();
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContentMarkdown("");
    setSubjectId("");
    setSelectedTags([]);
    setAttachments([]);
    setImports([]);
    setFile(null);
    setImportUrl("");
    setShowForm(false);
  };


      /* ===================== TAGS ===================== */

  const addTag = async () => {
    const name = prompt("Nume tag");
    if (!name) return;
    await createTag(name);
    loadTags();
  };

  const toggleTag = (id) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleFilterTag = (id) => {
    setFilterTags((prev) =>
      prev.includes(id)
        ? prev.filter((t) => t !== id)
        : [...prev, id]
    );
  };


      /* ===================== ATTACHMENTS ===================== */

  const uploadFileHandler = async () => {
    if (!file || !editingId) return;
    await uploadAttachment(editingId, file);
    setAttachments(await getAttachmentsForNote(editingId));
    setFile(null);
  };


   /* ===================== IMPORT ===================== */

  const handleImportHandler = async () => {
    if (!importUrl || !editingId) return;

    let type = "link";
    if (importUrl.includes("youtube")) type = "youtube";
    if (importUrl.toLowerCase().endsWith(".pdf")) type = "pdf";

    await addImport(editingId, importUrl, type);
    setImports(await getImportsForNote(editingId));
    setImportUrl("");
  };
    /* ===================== FILTER ===================== */

  const filteredNotes = notes.filter((n) => {
    const textMatch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.contentMarkdown.toLowerCase().includes(search.toLowerCase());

    const subjectMatch = filterSubject
      ? n.SubjectId === Number(filterSubject)
      : true;

    const tagMatch =
      filterTags.length > 0
        ? n.Tags?.some((t) => filterTags.includes(t.id))
        : true;

    return textMatch && subjectMatch && tagMatch;
  });

    /* ===================== EFFECT ===================== */

     useEffect(() => {
    loadNotes();
    loadSubjects();
    loadTags();
  }, [loadNotes, loadSubjects, loadTags]);

    /* ===================== RENDER ===================== */

    return (
      <MainLayout title="📘 Notițele mele">
       {/* 🟦 ZONA 1 – HEADER */}
<div className="page-header">
  <div>
    <h1>Notițele mele</h1>
    <p className="text-muted">
      Organizează notițele pe materii și tag-uri
    </p>
  </div>

  {!showForm && (
    <button onClick={() => setShowForm(true)}>
      ➕ Creează notiță
    </button>
  )}
</div>
{/* 🟨 ZONA 2 – FILTRARE */}
<div className="card">
  <div style={{ display: "grid", gap: "16px" }}>
    <input
      placeholder="🔍 Caută text..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <select
      value={filterSubject}
      onChange={(e) => setFilterSubject(e.target.value)}
    >
      <option value="">— Toate materiile —</option>
      {subjects.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>

    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {tags.map((t) => {
        const active = filterTags.includes(t.id);
        return (
          <span
            key={t.id}
            onClick={() => toggleFilterTag(t.id)}
            style={{
              padding: "6px 12px",
              borderRadius: "999px",
              cursor: "pointer",
              background: active ? "#4f46e5" : "#e5e7eb",
              color: active ? "white" : "#111827",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            #{t.name}
          </span>
        );
      })}
    </div>
  </div>
</div>
{showForm && (
  <div className="card">
    <h2>{editingId ? "✏️ Editează notița" : "➕ Creează notiță"}</h2>

    <form onSubmit={submit} className="note-form">
      <input
        placeholder="Titlu"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* MATERIE */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label>📚 Materie</label>
          <button
            type="button"
            className="secondary"
            onClick={async () => {
              const name = prompt("Nume materie");
              if (!name) return;
              await api.post("/subjects", { name });
              loadSubjects();
            }}
          >
            ➕ Materie
          </button>
        </div>

        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          <option value="">— Fără materie —</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* TAG-URI */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label>🏷 Tag-uri</label>
          <button
            type="button"
            className="secondary"
            onClick={addTag}
          >
            ➕ Tag
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {tags.map((t) => (
            <span
              key={t.id}
              onClick={() => toggleTag(t.id)}
              style={{
                padding: "6px 12px",
                borderRadius: "999px",
                cursor: "pointer",
                background: selectedTags.includes(t.id)
                  ? "#4f46e5"
                  : "#e5e7eb",
                color: selectedTags.includes(t.id)
                  ? "white"
                  : "#111827",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              #{t.name}
            </span>
          ))}
        </div>
      </div>

      {/* MARKDOWN */}
      <textarea
        rows={6}
        placeholder="Conținut (Markdown)"
        value={contentMarkdown}
        onChange={(e) => setContentMarkdown(e.target.value)}
      />

      {contentMarkdown && (
        <div className="markdown-preview">
          <ReactMarkdown>{contentMarkdown}</ReactMarkdown>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px" }}>
        <button type="submit">💾 Salvează</button>
        <button
          type="button"
          className="secondary"
          onClick={resetForm}
        >
          ✖ Renunță
        </button>
      </div>
    </form>
  </div>
)}
{showForm && editingId && (
  <div className="card">
    <h3>📎 Atașamente</h3>

    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
    <button onClick={uploadFileHandler}>Upload</button>

    <ul>
      {attachments.map((a) => (
        <li key={a.id}>
          <a href={a.url} target="_blank" rel="noreferrer">
            {a.originalName}
          </a>
          <button
            className="secondary"
            onClick={async () => {
              await deleteAttachment(a.id);
              setAttachments(await getAttachmentsForNote(editingId));
            }}
          >
            🗑
          </button>
        </li>
      ))}
    </ul>

    <hr />

    <h3>🔗 Import extern</h3>
    <input
      placeholder="Link YouTube / PDF"
      value={importUrl}
      onChange={(e) => setImportUrl(e.target.value)}
    />
    <button onClick={handleImportHandler}>Import</button>

    <ul>
      {imports.map((i) => (
        <li key={i.id}>
          <a href={i.url} target="_blank" rel="noreferrer">
            {i.type === "youtube" && "🎥 "}
            {i.type === "pdf" && "📄 "}
            {i.url}
          </a>
          <button
            className="secondary"
            onClick={async () => {
              await deleteImport(i.id);
              setImports(await getImportsForNote(editingId));
            }}
          >
            🗑
          </button>
        </li>
      ))}
    </ul>
  </div>
)}
<div className="notes-grid">
  {filteredNotes.map((n) => (
    <div key={n.id} className="note-card">
      <h3>{n.title}</h3>

      <p className="text-muted">
        {n.contentMarkdown.slice(0, 120)}
        {n.contentMarkdown.length > 120 && "..."}
      </p>

      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <button onClick={() => startEdit(n)}>✏️</button>
        <button
          className="secondary"
          onClick={() => deleteNote(n.id)}
        >
          🗑
        </button>
      </div>
    </div>
  ))}
</div>

{filteredNotes.length === 0 && (
  <p className="text-muted">Nu există notițe pentru filtrul ales.</p>
)}

      </MainLayout>
    );
  }

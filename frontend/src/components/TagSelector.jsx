import { useEffect, useState } from "react";
import {
  getTags,
  createTag,
  setTagsForNote,
  getTagsForNote,
} from "../api/tagApi";

export default function TagSelector({ noteId, onSaved }) {
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    load();
  }, [noteId]);

  const load = async () => {
    const all = await getTags();
    setTags(all);

    if (noteId) {
      const noteTags = await getTagsForNote(noteId);
      setSelected(noteTags.map((t) => t.id));
    }
  };

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const save = async () => {
    await setTagsForNote(noteId, selected);
    if (onSaved) onSaved();
  };

  const addTag = async () => {
    if (!newTag.trim()) return;

    await createTag(newTag.trim());
    setNewTag("");

    await load();
    if (onSaved) onSaved(); // 🔥 EXTREM DE IMPORTANT
  };

  return (
    <div style={{ marginTop: 10 }}>
      <b>Tag-uri</b>

      <div>
        {tags.map((t) => (
          <label key={t.id} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={selected.includes(t.id)}
              onChange={() => toggle(t.id)}
            />
            {t.name}
          </label>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        <input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Tag nou"
        />
        <button onClick={addTag} style={{ marginLeft: 6 }}>
          +
        </button>
        <button onClick={save} style={{ marginLeft: 6 }}>
          Salvează
        </button>
      </div>
    </div>
  );
}

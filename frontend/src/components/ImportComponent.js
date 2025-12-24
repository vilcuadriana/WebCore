import { useState } from "react";
import { api } from "../api/API";

export default function ImportComponent({ subjectId, onImported }) {
  const [content, setContent] = useState("");

  const importContent = async () => {
    if (!content.trim()) return;

    await api.post("/imports", {
      rawText: content,
      subjectId,
    });

    setContent("");
    onImported && onImported();
    alert("Conținut importat");
  };

  return (
    <div style={{ marginTop: 10 }}>
      <b>Import conținut extern</b>
      <textarea
        rows={4}
        placeholder="Lipește text din YouTube / Kindle / conferință"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%" }}
      />
      <button onClick={importContent} style={{ marginTop: 6 }}>
        Import
      </button>
    </div>
  );
}

import { useState } from "react";
import { api } from "../api/API";

export default function ShareNote({ noteId }) {
  const [email, setEmail] = useState("");

  const share = async () => {
    if (!email.trim()) return;
    await api.post(`/notes/${noteId}/share`, { email });
    alert("Notiță partajată");
    setEmail("");
  };

  return (
    <div style={{ marginTop: 10 }}>
      <input
        placeholder="email coleg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={share} style={{ marginLeft: 6 }}>
        Partajează
      </button>
    </div>
  );
}

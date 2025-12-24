import { useEffect, useState } from "react";
import { api } from "../api/API";
import { useNavigate } from "react-router-dom";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    const { data } = await api.get("/groups");
    setGroups(data);
  };

  const createGroup = async () => {
    const name = prompt("Nume grup");
    if (!name) return;

    await api.post("/groups", { name });
    load();
  };

  const invite = async (groupId) => {
    const email = prompt("Email coleg (@stud.ase.ro)");
    if (!email) return;

    await api.post(`/groups/${groupId}/invite`, { email });
    alert("Invitație trimisă");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Grupurile mele</h2>

      <button onClick={createGroup}>Creează grup</button>
      <button onClick={() => navigate("/dashboard")} style={{ marginLeft: 8 }}>
        Înapoi
      </button>

      <hr />

      {groups.map((g) => (
        <div key={g.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <b>{g.name}</b>
          <br />
          <button onClick={() => invite(g.id)}>Invită membru</button>
        </div>
      ))}
    </div>
  );
}

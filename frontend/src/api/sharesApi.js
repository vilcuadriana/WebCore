import { api } from "./API";

export const shareNote = async (noteId, email) => {
  await api.post(`/notes/${noteId}/share`, { email });
};

export const getSharedNotes = async () => {
  const { data } = await api.get("/notes/shared/with-me");
  return data;
};

import { api } from "./API";

/**
 * Partajează o notiță cu un coleg
 * permission: "view" | "edit"
 */
export const shareNote = async (noteId, email, permission = "view") => {
  await api.post(`/notes/${noteId}/share`, {
    email,
    permission,
  });
};

export const getSharedNotes = async () => {
  const { data } = await api.get("/notes/shared/with-me");
  return data;
};
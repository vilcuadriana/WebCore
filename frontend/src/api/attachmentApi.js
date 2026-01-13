import { api } from "./API";

/**
 * Upload atașament pentru o notiță
 */
export const uploadAttachment = async (noteId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  await api.post(`/attachments/note/${noteId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Listare atașamente pentru notiță
 */
export const getAttachmentsForNote = async (noteId) => {
  const { data } = await api.get(`/attachments/note/${noteId}`);
  return data;
};

/**
 * Ștergere atașament
 */
export const deleteAttachment = async (id) => {
  await api.delete(`/attachments/${id}`);
};

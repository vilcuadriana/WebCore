import { api } from "./API";

/**
 * Creează un import (YouTube / link / text)
 */
export const addImport = async ({ url, rawText, subjectId }) => {
  const { data } = await api.post("/imports", {
    url,
    rawText,
    subjectId,
  });
  return data;
};

/**
 * Importuri pentru o notiță
 */
export const getImportsForNote = async (noteId) => {
  const { data } = await api.get(`/imports/note/${noteId}`);
  return data;
};

/**
 * Ștergere import
 */
export const deleteImport = async (id) => {
  await api.delete(`/imports/${id}`);
};

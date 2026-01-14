import { api } from "./API";

export const addImport = async (noteId, url, type) => {
  await api.post(`/imports/note/${noteId}`, {
    url,
  });
};

export const getImportsForNote = async (noteId) => {
  const { data } = await api.get(`/imports/note/${noteId}`);
  return data;
};

export const deleteImport = async (id) => {
  await api.delete(`/imports/${id}`);
};

import { api } from "./API";

export const getTags = async () => {
  const { data } = await api.get("/tags");
  return data;
};

export const createTag = async (name) => {
  const { data } = await api.post("/tags", { name });
  return data;
};

export const setTagsForNote = async (noteId, tagIds) => {
  await api.post(`/notes/${noteId}/tags`, { tagIds });
};

export const getTagsForNote = async (noteId) => {
  const { data } = await api.get(`/notes/${noteId}/tags`);
  return data;
};

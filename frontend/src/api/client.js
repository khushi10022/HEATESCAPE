import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const client = axios.create({ baseURL: API_BASE });

export async function fetchCities() {
  const res = await client.get('/api/cities');
  return res.data;
}

export async function fetchZones(cityId) {
  const res = await client.get(`/api/cities/${cityId}/zones`);
  return res.data;
}

export async function fetchZone(cityId, zoneId) {
  const res = await client.get(`/api/cities/${cityId}/zones/${zoneId}`);
  return res.data;
}

export async function fetchMaterials() {
  const res = await client.get('/api/materials');
  return res.data;
}

export async function fetchZoneCooling(cityId, zoneId) {
  const res = await client.get(`/api/cities/${cityId}/zones/${zoneId}/cooling`);
  return res.data;
}

export async function fetchModelMeta(cityId) {
  const res = await client.get(`/api/cities/${cityId}/model-meta`);
  return res.data;
}

export async function sendChatMessage(message, cityId, history = []) {
  const res = await client.post('/api/chat', {
    message,
    city_id: cityId,
    history,
  });
  return res.data;
}

import { Store } from './config.js';

export async function apiGet(action, params={}) {
  if(!Store.api) throw new Error('Configure a URL da API nas Configurações.');
  const url = new URL(Store.api);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k,v])=> url.searchParams.set(k,v));
  const r = await fetch(url.toString(), { method:'GET' });
  if(!r.ok) throw new Error('Falha na requisição GET');
  return r.json();
}

export async function apiPost(payload) {
  if(!Store.api) throw new Error('Configure a URL da API nas Configurações.');
  const r = await fetch(Store.api, { method:'POST', body:JSON.stringify(payload) });
  if(!r.ok) throw new Error('Falha na requisição POST');
  return r.json();
}

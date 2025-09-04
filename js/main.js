import { Store, toast, today } from './config.js';
import { apiGet } from './api.js';
import { fillTreinoSerieSelectors, renderEntryRows } from './ui.js';
import { saveLastWeights, loadLastWeights, clearZeroWeights } from './weights.js';
import { saveHistory, loadHistory } from './history.js';

export let PLAN = [];

// ========= Load Plan =========
async function loadPlan(){
  const res = await apiGet('plan');
  if(!res.ok) throw new Error(res.error||'Falha ao obter plano');
  PLAN = res.plan || [];
  fillTreinoSerieSelectors();
}

// ========= Events =========
document.getElementById('btn-settings').addEventListener('click', ()=> {
  const s = document.getElementById('section-settings');
  s.style.display = s.style.display === 'none' ? 'block' : 'none';
  if(s.style.display === 'block') document.getElementById('inp-api').value = Store.api;
});

document.getElementById('btn-save-api').addEventListener('click', ()=> {
  const url = document.getElementById('inp-api').value.trim();
  if(!/^https:\/\//.test(url)) { toast('Informe uma URL válida iniciando com https://'); return; }
  Store.api = url; toast('URL salva.');
});

document.getElementById('btn-test-api').addEventListener('click', async ()=> {
  try{ await loadPlan(); toast('Conexão OK. Plano carregado.'); }
  catch(err){ toast('Falha: '+ err.message); }
});

document.getElementById('btn-reload').addEventListener('click', async ()=> {
  try{ await loadPlan(); toast('Plano recarregado.'); }
  catch(err){ toast('Falha ao recarregar: '+ err.message); }
});

document.getElementById('btn-generate').addEventListener('click', ()=>{ renderEntryRows(); });
document.getElementById('btn-clear-zeros').addEventListener('click', clearZeroWeights);
document.getElementById('btn-save').addEventListener('click', ()=>{ saveHistory().catch(err => toast('Erro: '+err.message)); });
document.getElementById('btn-load-history').addEventListener('click', ()=>{ loadHistory().catch(err => toast('Erro: '+err.message)); });
document.getElementById('btn-clear-filter').addEventListener('click', ()=> {
  document.getElementById('inp-date-filter').value = '';
  loadHistory().catch(err => toast('Erro: '+err.message));
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('show');
});

document.getElementById('btn-reload-mobile').addEventListener('click', () => {
  mobileMenu.classList.remove('show');
  document.getElementById('btn-reload').click();
});

document.getElementById('btn-settings-mobile').addEventListener('click', () => {
  mobileMenu.classList.remove('show');
  document.getElementById('btn-settings').click();
});

// Input-step
document.querySelectorAll('.input-step').forEach(div => {
  const input = div.querySelector('input');
  div.querySelector('.minus').addEventListener('click', ()=> {
    input.stepDown(); input.dispatchEvent(new Event('input'));
  });
  div.querySelector('.plus').addEventListener('click', ()=> {
    input.stepUp(); input.dispatchEvent(new Event('input'));
  });
});

// ========= Init =========
(async function init(){
  document.getElementById('inp-date').value = today();
  document.getElementById('inp-date-filter').value = '';
  if(Store.api){
    try{
      await loadPlan();
      await loadHistory();
    } catch(err){
      toast('Configurar API: '+err.message);
    }
  } else {
    toast('Abra Configurações e cole a URL do Web App');
  }
})();

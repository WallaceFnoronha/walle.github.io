import { apiPost, apiGet } from './api.js';
import { PLAN } from './main.js';
import { toast } from './config.js';
import { renderHistory } from './ui.js';
import { showSummaryModal } from './modal.js'; // <-- import modal

export async function generateWorkoutSummary(newRows) {
  const treino = newRows[0]?.TREINO;
  const serie = newRows[0]?.SERIE;
  if (!treino) return [];

  const res = await apiGet('history', { treino, serie });
  if (!res.ok) return ['Não foi possível gerar resumo.'];
  const history = res.history || [];

  const lastSession = history
    .filter(r => r.EXERCICIO && Number(r.PESO))
    .reduce((acc, r) => {
      if (!acc[r.EXERCICIO] || new Date(r.DATA) > new Date(acc[r.EXERCICIO].DATA)) {
        acc[r.EXERCICIO] = r;
      }
      return acc;
    }, {});

  const messages = newRows.map(r => {
    const last = lastSession[r.EXERCICIO];
    if (last && last.PESO) {
      const delta = Number(r.PESO) - Number(last.PESO);
      if (delta > 0) return `<p style="color:#4caf50;">✅ <strong>${r.EXERCICIO}</strong>: você aumentou <strong>${delta}kg</strong> desde o último treino!</p>`;
      if (delta < 0) return `<p style="color:#f44336;">⚠️ <strong>${r.EXERCICIO}</strong>: peso menor que última vez (-<strong>${Math.abs(delta)}kg</strong>)</p>`;
      return `<p style="color:#2196f3;">💪 <strong>${r.EXERCICIO}</strong>: mesma carga que o último treino</p>`;
    } else {
      return `<p style="color:#ff9800;">✨ <strong>${r.EXERCICIO}</strong>: primeira vez registrado!</p>`;
    }
  });

  return messages;
}

export async function saveHistory() {
  const date = document.getElementById('inp-date').value;
  const treino = document.getElementById('sel-treino').value;
  const serie = document.getElementById('sel-serie').value;
  const trs = Array.from(document.querySelectorAll('#tbl-entry tbody tr'));
  const rows = trs.map(tr => {
    const exercicio = tr.getAttribute('data-exercicio');
    const peso = tr.querySelector('.inp-peso').value;
    const obs = tr.querySelector('.inp-obs').value;
    const meta = PLAN.find(r => r['EXERCICIO'] === exercicio);
    return {
      DATA: date,
      TREINO: treino,
      SERIE: serie,
      EXERCICIO: exercicio,
      SERIES: meta ? meta['SERIES'] : '',
      REPETICOES: meta ? meta['REPETICOES'] : '',
      PESO: peso || '',
      OBS: obs || ''
    };
  }).filter(r => r.PESO !== '' && Number(r.PESO) >= 0);

  if (!rows.length) { toast('Nada para salvar (todos vazios).'); return; }

  const res = await apiPost({ rows });
  if (res.ok) {
    toast(`✅ ${res.inserted || rows.length} lançamentos salvos!`);
    loadHistory();

    const summary = await generateWorkoutSummary(rows);
    if (summary.length) showSummaryModal(summary); // modal colorido
  }

  else { toast('Erro ao salvar: ' + (res.error || '')); }
}


export async function loadHistory() {
  const date = document.getElementById('inp-date-filter').value;
  const res = await apiGet('history', date ? { date } : {});
  if(!res.ok) throw new Error(res.error || 'Falha ao obter histórico');
  renderHistory(res.history || []);
}


// Lanche metro 

// 1. Peito de peru/ Queijo Prato/ Patê de ervas/ Alface e tomate  R$139,00
// 2. Salame Italiano / Provolone/ Patê de Azeitonas / Alface e tomate R$158,00
// 3. Salpicão de Frango/ Peito de Peru/ Alface e tomate R$118

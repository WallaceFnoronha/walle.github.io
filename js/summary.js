import { apiGet } from './api.js';

let chartSummary = null;

// Comparar com último treino da mesma categoria
export async function renderSummary(treino, serie, rows) {
  const res = await apiGet('history', { treino, serie });
  const last = res.history?.slice(-1) || [];

  let story = '';
  const labels = [];
  const dataPeso = [];
  const dataReps = [];
  const bgColors = [];

  rows.forEach(r => {
    const prev = last.find(l => l.EXERCICIO === r.EXERCICIO);
    const pesoAtual = Number(r.PESO || 0);
    const repsAtual = Number(r.REPETICOES || 0);
    const pesoPrev = prev ? Number(prev.PESO || 0) : 0;
    const repsPrev = prev ? Number(prev.REPETICOES || 0) : 0;

    labels.push(r.EXERCICIO);
    dataPeso.push(pesoAtual);
    dataReps.push(repsAtual);
    bgColors.push(pesoAtual > pesoPrev ? 'var(--ok)' : pesoAtual < pesoPrev ? 'var(--warn)' : 'var(--muted)');

    if(pesoPrev) {
      if(pesoAtual > pesoPrev) story += `✅ ${r.EXERCICIO}: você aumentou ${pesoAtual - pesoPrev} kg desde o último treino.<br>`;
      else if(pesoAtual < pesoPrev) story += `⚠️ ${r.EXERCICIO}: peso menor que o último treino.<br>`;
      else story += `➖ ${r.EXERCICIO}: manteve o mesmo peso.<br>`;
    } else {
      story += `⭐ ${r.EXERCICIO}: primeiro registro para este exercício.<br>`;
    }
  });

  document.getElementById('summary-story').innerHTML = story;
  document.getElementById('section-summary').style.display = 'block';

  // Renderizar gráfico
  const ctx = document.getElementById('chart-summary').getContext('2d');
  if(chartSummary) chartSummary.destroy();
  chartSummary = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Peso (kg)', data: dataPeso, backgroundColor: bgColors },
        { label: 'Reps', data: dataReps, backgroundColor: 'var(--accent)' }
      ]
    },
    options: { responsive:true, plugins:{ legend:{ position:'top' } }, scales:{ y:{ beginAtZero:true } } }
  });
}

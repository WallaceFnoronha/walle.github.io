export function saveLastWeights() {
  const weights = {};
  document.querySelectorAll('#tbl-entry tbody tr').forEach(tr => {
    const ex = tr.dataset.exercicio;
    const val = tr.querySelector('.inp-peso').value;
    if(val) weights[ex] = val;
  });
  localStorage.setItem('lastWeights', JSON.stringify(weights));
}

export function loadLastWeights() {
  const weights = JSON.parse(localStorage.getItem('lastWeights') || '{}');
  document.querySelectorAll('#tbl-entry tbody tr').forEach(tr => {
    const ex = tr.dataset.exercicio;
    if(weights[ex]) tr.querySelector('.inp-peso').value = weights[ex];
  });
}

export function clearZeroWeights(){
  document.querySelectorAll('.inp-peso').forEach(inp => { if(!inp.value || Number(inp.value) === 0) inp.value = ''; });
}

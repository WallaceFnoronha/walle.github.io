// ========= Modal =========
const summaryModal = document.getElementById('summaryModal');
const summaryContent = document.getElementById('summaryContent');
const closeSummaryModal = document.getElementById('closeSummaryModal');

export function showSummaryModal(messages){
  summaryContent.innerHTML = messages.map(m => `<p>${m}</p>`).join('');
  summaryModal.style.display = 'block';
}

closeSummaryModal.onclick = () => {
  summaryModal.style.display = 'none';
};

window.onclick = (event) => {
  if (event.target === summaryModal) summaryModal.style.display = 'none';
};

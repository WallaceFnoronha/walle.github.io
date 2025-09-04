// ========= Config =========
export const Store = {
  get api(){ return localStorage.getItem('API_URL') || ''; },
  set api(v){ localStorage.setItem('API_URL', v || ''); }
};

export function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.display = 'block';
  setTimeout(()=> t.style.display = 'none', 2600);
}

export function today(){
  const d = new Date();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${d.getFullYear()}-${m}-${day}`;
}

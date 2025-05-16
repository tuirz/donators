document.addEventListener('DOMContentLoaded', () => {
  // RÉCUPÈRE LES ÉLÉMENTS DU DOM POUR LES STATS
  const stats = ['count','total','average','top'].reduce((o,k)=>{o[k]=document.getElementById('stat-'+k);return o;},{});
  // FORMATE EN EUROS
  const fmt = n => isNaN(parseFloat(n)) ? '-' : parseFloat(n).toLocaleString('fr-FR',{minimumFractionDigits:2})+' €';
  // AFFICHE LES STATS
  function showStats() {
    let dons;
    try { dons = JSON.parse(localStorage.getItem('donators'))||[]; } catch { dons = []; }
    const valid = Array.isArray(dons) ? dons.filter(d=>d&&d.amount&&!isNaN(parseFloat(d.amount))&&d.name) : [];
    if (!dons.length) return stats.count&&(stats.count.textContent=stats.total=stats.average='-'),stats.top&&(stats.top.innerHTML='<div class="text-2xl text-red-500">No data</div>');
    if (!valid.length) return stats.count&&(stats.count.textContent='0'),stats.total&&(stats.total.textContent='0 €'),stats.average&&(stats.average.textContent='0 €'),stats.top&&(stats.top.innerHTML='<div class="text-2xl text-red-500">No valid data</div>');
    const total = valid.reduce((s,d)=>s+parseFloat(d.amount),0), avg=total/valid.length, top=valid.reduce((a,d)=>parseFloat(d.amount)>parseFloat(a.amount)?d:a,valid[0]);
    stats.count&&(stats.count.textContent=valid.length);
    stats.total&&(stats.total.textContent=fmt(total));
    stats.average&&(stats.average.textContent=fmt(avg));
    stats.top&&(stats.top.innerHTML=`<img class="dashboard-top-img w-20 h-20 rounded-full object-cover border-4 border-green-200 shadow mb-3" src="${top.picture||top.pic||'images/user-2.png'}" alt="${top.name||'Donator'}"><div class="dashboard-top-name font-bold text-lg text-gray-900 mb-1 text-center">${top.name||'-'}</div><div class="dashboard-top-amount text-green-600 font-extrabold text-2xl">${fmt(top.amount)}</div>`);
  }
  showStats();
});

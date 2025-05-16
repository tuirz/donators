document.addEventListener('DOMContentLoaded', () => {
  const API = 'https://randomuser.me/api/?results=50&nat=us,gb,ca,au';
  const donatorsList = document.getElementById('donators-list');
  const searchInput = document.getElementById('search-input');
  // 
  let donators = [], gender = 'all', sort = null;
  // ENTRE 10 ET 1000
  const rand = () => (Math.random() * 990 + 10).toFixed(2);
  // EURO
  const fmt = a => parseFloat(a).toLocaleString('fr-FR', {minimumFractionDigits:2}) + ' €';

  // AFFICHAGE DONATEURS
  const render = () => {
    let list = donators
      // FILTRE GENRE
      .filter(d => gender === 'all' || d.gender === gender)
      // FILTRE RECHERCHE
      .filter(d => !searchInput.value.trim() || d.name.toLowerCase().includes(searchInput.value.trim().toLowerCase()));
    // FILTRE TRI
    if (sort) {
      const s = {
        'amount-asc': (a, b) => a.amount - b.amount,
        'amount-desc': (a, b) => b.amount - a.amount,
        'name-asc': (a, b) => a.name.localeCompare(b.name),
        'name-desc': (a, b) => b.name.localeCompare(a.name)
      };
      list = [...list].sort(s[sort]);
    }
    // GENERE CARDS
    donatorsList.innerHTML = list.map(d => `
      <div class="flex flex-col items-center justify-between bg-white rounded-2xl border border-gray-200 shadow-md p-8 aspect-square max-w-xs mx-auto w-full">
        <div class='font-bold text-xl mb-2 text-center text-green-600'>${fmt(d.amount)}</div>
        <img src="${d.picture}" alt="${d.name}" class="w-24 h-24 rounded-full object-cover border-2 border-white shadow mb-4" />
        <div class="flex-1 flex flex-col items-center justify-center w-full">
          <div class="font-bold text-lg text-gray-900 mb-2 text-center">${d.name}</div>
          <div class="flex items-center text-gray-500 text-sm mb-1 w-full justify-center">
            <span class="truncate">${d.city}, <span class="font-semibold">${d.country}</span></span>
          </div>
          <div class="flex items-center text-gray-400 text-sm w-full justify-center">
            <span class="truncate">${d.phone}</span>
          </div>
        </div>
      </div>
    `).join('');
  };

  // LISTENERS GENRE
  ['all', 'male', 'female'].forEach(g => {
    const el = document.getElementById('filter-' + g);
    if (el) el.onclick = e => { e.preventDefault(); gender = g; render(); };
  });
  // LISTENERS TRIS
  ['amount-asc', 'amount-desc', 'name-asc', 'name-desc'].forEach(s => {
    const el = document.getElementById('sort-' + s);
    if (el) el.onclick = e => { e.preventDefault(); sort = s; render(); };
  });
  // LISTENER RECHERCHE
  if (searchInput) searchInput.addEventListener('input', render);

  // REFRESH DONATEURS
  fetch(API)
    .then(r => r.json())
    .then(d => {
      donators = d.results.map(u => ({
        name: u.name.first + ' ' + u.name.last,
        picture: u.picture.large,
        city: u.location.city,
        country: u.location.country,
        phone: u.phone,
        gender: u.gender,
        amount: rand()
      }));
      // LOCAL POUR DASHBOARD
      localStorage.setItem('donators', JSON.stringify(donators));
      render();
    })
    .catch(() => {
      donatorsList.innerHTML = '<p class="col-span-full text-center text-red-500">Failed to load donators.</p>';
    });
});
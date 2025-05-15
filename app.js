document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://randomuser.me/api/?results=24&nat=us,gb,ca,au';
    const donatorsList = document.getElementById('donators-list');
    const searchInput = document.getElementById('search-input');
    let allDonators = [], currentGender = 'all', currentSort = null;

    // MATH RANDOM ENTRE 10 & 1000
    const getRandomAmount = () => (Math.random() * 990 + 10).toFixed(2);
    const formatAmount = a => parseFloat(a).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €';

    // APPLIQUE LES FILTRES
    function updateDisplay() {
      let list = allDonators;
      if (currentGender !== 'all') list = list.filter(d => d.gender === currentGender);
      // RECHERCHE
      if (searchInput && searchInput.value.trim() !== '') {
        const q = searchInput.value.trim().toLowerCase();
        list = list.filter(d => d.name.toLowerCase().includes(q));
      }
      if (currentSort) {
        const sorters = {
          'amount-asc': (a, b) => a.amount - b.amount,
          'amount-desc': (a, b) => b.amount - a.amount,
          'name-asc': (a, b) => a.name.localeCompare(b.name),
          'name-desc': (a, b) => b.name.localeCompare(a.name)
        };
        list = [...list].sort(sorters[currentSort]);
      }
      donatorsList.innerHTML = list.map(d => `
        <div class="flex flex-col items-center justify-between bg-white rounded-2xl border border-gray-200 shadow-md p-8 aspect-square max-w-xs mx-auto w-full">
          <div class="text-green-600 font-bold text-xl mb-2 text-center">${formatAmount(d.amount)}</div>
          <img src="${d.picture}" alt="${d.name}" class="w-24 h-24 rounded-full object-cover border-2 border-white shadow mb-4">
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
    }

    // LISTENERS FILTRES
    ['all', 'male', 'female'].forEach(g =>
      document.getElementById('filter-' + g).onclick = e => {
        e.preventDefault();
        currentGender = g;
        updateDisplay();
      }
    );
    ['amount-asc', 'amount-desc', 'name-asc', 'name-desc'].forEach(s =>
      document.getElementById('sort-' + s).onclick = e => {
        e.preventDefault();
        currentSort = s;
        updateDisplay();
      }
    );

    // LISTENER RECHERCHE
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        updateDisplay();
      });
    }

    // GENERE DONATEURS AU CHARGEMENT
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        allDonators = data.results.map(u => ({
          name: `${u.name.first} ${u.name.last}`,
          picture: u.picture.large,
          city: u.location.city,
          country: u.location.country,
          phone: u.phone,
          gender: u.gender,
          amount: getRandomAmount()
        }));
        updateDisplay();
      })
      .catch(() => {
        donatorsList.innerHTML = '<p class="col-span-full text-center text-red-500">Failed to load donators.</p>';
      });
  });
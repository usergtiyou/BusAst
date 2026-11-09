document.addEventListener('DOMContentLoaded', () => {
  
  const themeToggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
  }

  
  const mapElement = document.getElementById('realMap');
  
  if (mapElement && typeof L !== 'undefined') {
   
    const map = L.map('realMap').setView([51.1282, 71.4305], 12);

   
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    
    const locations = [
      {
        title: "✈️ Аэропорт Н. Назарбаев",
        coords: [51.0253, 71.4667],
        stopA: "🚏 Ост. «Международный аэропорт» (Терминалы T1/T2)",
        routesA: "№ 10, 12, 100 Express",
        stopB: "🚏 Ост. «Аэропорт (Прибытие)»",
        routesB: "№ 10, 12, 100 Express"
      },
      {
        title: "🚆 Вокзал «Нұрлы жол»",
        coords: [51.1090, 71.5348],
        stopA: "🚏 Ост. «Вокзал Нұрлы жол» (Эстакада, 2-й уровень)",
        routesA: "№ 2, 11, 14, 32, 48, 50, 60",
        stopB: "🚏 Ост. «Вокзал Нұрлы жол» (Нижний уровень)",
        routesB: "№ 2, 11, 14, 32, 48, 50, 60"
      },
      {
        title: "🚉 Вокзал «Астана-1»",
        coords: [51.1983, 71.4117],
        stopA: "🚏 Ост. «Железнодорожный вокзал» (Привокзальная площадь)",
        routesA: "№ 3, 7, 9, 10, 12, 21, 23, 31, 37, 40",
        stopB: "🚏 Ост. «ул. Гёте / Готвальда»",
        routesB: "№ 3, 7, 9, 10, 12, 21, 23, 31, 37, 40"
      },
      {
        title: "🛍️ ТРЦ «Хан Шатыр»",
        coords: [51.1325, 71.4037],
        stopA: "🚏 Ост. «ТРЦ Хан Шатыр» (пр. Туран)",
        routesA: "№ 10, 12, 29, 32, 46, 51, 303",
        stopB: "🚏 Ост. «ТРЦ Хан Шатыр» (со стороны парка)",
        routesB: "№ 10, 12, 29, 32, 46, 51, 303"
      },
      {
        title: "🌳 Монумент «Байтерек»",
        coords: [51.1283, 71.4305],
        stopA: "🚏 Ост. «Байтерек» (б-р Нұржол)",
        routesA: "№ 12, 18, 28, 35, 70",
        stopB: "🚏 Ост. «МИД РК»",
        routesB: "№ 21, 32, 46, 50"
      },
      {
        title: "🌿 Ботанический сад",
        coords: [51.1158, 71.4285],
        stopA: "🚏 Ост. «Ботанический Сад» (пр. Кабанбай батыра)",
        routesA: "№ 10, 12, 18, 37, 47, 51, 303",
        stopB: "🚏 Ост. «СК Астана Арена» (ул. Улы Дала)",
        routesB: "№ 26, 40, 53"
      },
      {
        title: "🕌 Главная Мечеть",
        coords: [51.0858, 71.4132],
        stopA: "🚏 Ост. «Республиканская Мечеть» (пр. Мангилик Ел)",
        routesA: "№ 15, 15A, 35, 43, 46, 70",
        stopB: "🚏 Ост. «Республиканская Мечеть» (со стороны кольца)",
        routesB: "№ 15, 35, 43, 70"
      }
    ];

    
    locations.forEach(loc => {
      const icon = L.divIcon({
        className: 'custom-map-pin',
        html: loc.title,
        iconSize: [null, 28],
        iconAnchor: [40, 14]
      });

      const marker = L.marker(loc.coords, { icon: icon }).addTo(map);

      
      marker.on('click', () => {
        document.getElementById('modalTitle').textContent = loc.title;
        document.getElementById('modalStopA').textContent = loc.stopA;
        document.getElementById('modalRoutesA').textContent = loc.routesA;
        document.getElementById('modalStopB').textContent = loc.stopB;
        document.getElementById('modalRoutesB').textContent = loc.routesB;
        
        const modal = document.getElementById('routeModal');
        if (modal) modal.classList.add('active');
      });
    });
  }

  
  const statusEl = document.getElementById('liveStatus');
  if (statusEl) {
    const hour = new Date().getHours();
    if (hour >= 23 || hour < 5) {
      statusEl.innerHTML = '🔴 Большинство маршрутов завершили работу';
      statusEl.style.color = '#ef4444';
    } else {
      statusEl.innerHTML = '🟢 Транспорт на линии';
      statusEl.style.color = '#22c55e';
    }
  }

  
  document.addEventListener('keydown', (e) => {
    const searchInput = document.getElementById('routeSearch');
    if (e.key === '/' && searchInput && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === 'Escape') {
      closeRouteModal();
    }
  });

  
  const modalOverlay = document.getElementById('routeModal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeRouteModal();
      }
    });
  }
});




function closeRouteModal() {
  const modal = document.getElementById('routeModal');
  if (modal) modal.classList.remove('active');
}


function switchCity(city) {
  if (city === 'astana') return;

  const names = {
    almaty: 'Алматы (Onay!)',
    shymkent: 'Шымкент (Tolem)',
    other: 'Другие города Казахстана'
  };

  alert(`Раздел «${names[city]}» находится в разработке и появится в ближайших обновлениях!`);
  document.getElementById('citySelect').value = 'astana';
}


window.onscroll = () => {
  const btn = document.getElementById('backToTop');
  if (btn) {
    btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  }
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
(function () {
  // Nomor WhatsApp resmi tim KLIKMEDIS / SIMPUS Nusantara
  var WA = '6289699935552';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Titik puskesmas menyala dari barat ke timur
  var pk = Array.prototype.slice.call(document.querySelectorAll('#pk .pk'));
  if (!reduce && pk.length) {
    pk.forEach(function (d, i) {
      setTimeout(function () {
        d.classList.add('lit');
        setTimeout(function () { d.classList.remove('lit'); }, 700);
      }, 400 + i * 18);
    });
  }

  // Mobile menu toggle
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Tab layar aplikasi
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role=tab]'));
  function select(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
      var panelId = x.getAttribute('aria-controls');
      var panel = document.getElementById(panelId);
      if (panel) panel.hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); var n = tabs[(i + 1) % tabs.length]; select(n); n.focus(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); var p = tabs[(i - 1 + tabs.length) % tabs.length]; select(p); p.focus(); }
    });
  });

  // Filter Wilayah Dinkes
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.df-btn'));
  var dinkesCards = Array.prototype.slice.call(document.querySelectorAll('.dinkes-card'));
  if (filterBtns.length && dinkesCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var region = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        dinkesCards.forEach(function (card) {
          if (region === 'all' || card.getAttribute('data-region') === region) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Tombol bergabung mengisi peran
  document.querySelectorAll('[data-role]').forEach(function (a) {
    a.addEventListener('click', function () {
      var peranEl = document.getElementById('peran');
      if (peranEl) peranEl.value = a.getAttribute('data-role');
    });
  });

  // Formulir Pendaftaran / Permintaan Demo
  var leadForm = document.getElementById('lead');
  if (leadForm) {
    var sendBtn = document.getElementById('send');
    if (!WA && sendBtn) sendBtn.textContent = 'Siapkan pesan';
    var text = '';

    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
      };
      var err = document.getElementById('err');
      var nama = v('nama');
      var kontak = v('kontak');

      if (!nama || !kontak) {
        err.textContent = 'Mohon lengkapi nama dan nomor WhatsApp Anda.';
        return;
      }

      // Validasi nomor telepon
      var cleanPhone = kontak.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 8) {
        err.textContent = 'Mohon masukkan nomor WhatsApp aktif yang valid.';
        return;
      }
      err.textContent = '';

      text = 'Halo tim SIMPUS Nusantara, saya ingin meminta demo aplikasi dan informasi kemitraan.\n'
        + '\n• Nama: ' + nama
        + '\n• WhatsApp: ' + kontak
        + '\n• Mewakili: ' + v('peran')
        + '\n• Daerah: ' + (v('daerah') || '-')
        + '\n• Kebutuhan/Catatan: ' + (v('pesan') || '-');

      var out = document.getElementById('out');
      if (out) out.textContent = text;
      var act = document.getElementById('result-actions');
      if (act) {
        act.innerHTML = '';
        if (WA) {
          var waUrl = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
          var a = document.createElement('a');
          a.className = 'btn btn-primary';
          a.href = waUrl;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = 'Kirim ke WhatsApp (' + WA + ')';
          act.appendChild(a);

          // Buka window WhatsApp otomatis
          window.open(waUrl, '_blank');
        } else {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'btn btn-dark';
          b.textContent = 'Salin pesan';
          var st = document.createElement('span');
          st.className = 'status';
          st.setAttribute('role', 'status');
          b.addEventListener('click', function () {
            try {
              navigator.clipboard.writeText(text).then(function () {
                st.textContent = 'Tersalin. Kirim ke WhatsApp tim KLIKMEDIS.';
              }, function () {
                st.textContent = 'Blok teks di atas lalu salin manual.';
              });
            } catch (x) {
              st.textContent = 'Blok teks di atas lalu salin manual.';
            }
          });
          act.appendChild(b);
          act.appendChild(st);
        }
      }
      var res = document.getElementById('result');
      if (res) res.classList.add('show');
    });
  }
})();

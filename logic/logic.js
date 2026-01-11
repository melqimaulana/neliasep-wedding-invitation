
/* =========================================================
   ANIMATION ON SCROLL
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("section").forEach(section => {
    section.querySelectorAll("[data-item]").forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  const observer = new IntersectionObserver(
    entries => entries.forEach(e =>
      e.target.classList.toggle("show", e.isIntersecting)
    ),
    { threshold: 0.15, rootMargin: "0px 0px -12% 0px" }
  );

  document.querySelectorAll("[data-item]").forEach(i => observer.observe(i));
});

/* =========================================================
   SAVE TO GOOGLE CALENDAR
========================================================= */
document.getElementById("saveDateBtn")?.addEventListener("click", () => {
  const url =
    "https://www.google.com/calendar/render?action=TEMPLATE" +
    "&text=Wedding+of+Neli+%26+Asep" +
    "&details=Akad+%26+Resepsi+Pernikahan" +
    "&location=Indonesia" +
    "&dates=20260115T020000Z/20260115T060000Z";

  window.open(url, "_blank");
});

/* =========================================================
   COUNTDOWN
========================================================= */
const weddingDate = new Date(2026, 0, 15, 8, 0).getTime();

// ⬇⬇ TAMBAHKAN DI SINI
const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

if (days && hours && minutes && seconds) {
  setInterval(() => {
    const diff = weddingDate - Date.now();
    if (diff < 0) return;

    days.textContent = Math.floor(diff / 86400000);
    hours.textContent = Math.floor(diff / 3600000) % 24;
    minutes.textContent = Math.floor(diff / 60000) % 60;
    seconds.textContent = Math.floor(diff / 1000) % 60;
  }, 1000);
}


/* =========================================================
   TOGGLE HADIAH
========================================================= */
const toggleBtn = document.getElementById("toggleGift");
const giftContent = document.getElementById("giftContent");
let giftOpen = false;

toggleBtn?.addEventListener("click", () => {
  if (!giftContent) return;

  giftOpen = !giftOpen;
  giftContent.classList.toggle("max-h-0");
  giftContent.classList.toggle("opacity-0");
  giftContent.classList.toggle("translate-y-4");
  giftContent.classList.toggle("max-h-[3000px]");
  giftContent.classList.toggle("opacity-100");
  giftContent.classList.toggle("translate-y-0");

  toggleBtn.textContent = giftOpen ? "❌ Tutup Hadiah" : "🎁 Kirim Hadiah";
});


/* =========================================================
   COPY REKENING
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const text = btn.closest("[data-item]").querySelector(".rekening").textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        const old = btn.textContent;
        btn.textContent = "✔ Tersalin";
        setTimeout(() => btn.textContent = old, 1500);
      } catch {
        alert("Copy gagal");
      }
    });
  });
});

/* =========================================================
   USER IDENTIFIER (LOCAL)
========================================================= */
const userId =
  localStorage.getItem("userId") ||
  (() => {
    const id = crypto.randomUUID();
    localStorage.setItem("userId", id);
    return id;
  })();


/* =========================================================
   🔥 FIREBASE CONFIG
========================================================= */
const firebaseConfig = {
  apiKey: "AIzaSyD5K0DB9dZCSfoEOTTyhS7z7uiIPqCZCpM",
  authDomain: "neli-asep-wedding-invitation.firebaseapp.com",
  databaseURL: "https://neli-asep-wedding-invitation-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "neli-asep-wedding-invitation",
  storageBucket: "neli-asep-wedding-invitation.firebasestorage.app",
  messagingSenderId: "670051582080",
  appId: "1:670051582080:web:f15efffce4f0ea0d402665",
  measurementId: "G-BKT3JHFNEY"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const komentarRef = db.ref("komentar");

/* =========================================================
   KOMENTAR REALTIME
========================================================= */
const namaInput = document.getElementById("nama");
const ucapanInput = document.getElementById("ucapan");
const statusSelect = document.getElementById("status");
const commentList = document.getElementById("commentList");

function render(snapshot) {
  commentList.innerHTML = "";
  let hadir = 0, tidak = 0;

  snapshot.forEach(child => {
    const c = child.val();
    const id = child.key;

    if (c.status === "hadir") hadir++;
    if (c.status === "tidak") tidak++;

    const replies = c.replies
      ? Object.values(c.replies).map(r => `
        <div class="flex gap-3 mt-3 ml-10">
          <div class="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs">
            ${r.nama[0].toUpperCase()}
          </div>
          <div class="bg-white border rounded-xl px-3 py-2 w-full">
            <p class="text-xs font-semibold">${r.nama}</p>
            <p class="text-sm">${r.ucapan}</p>
          </div>
        </div>`).join("")
      : "";

    commentList.innerHTML += `
      <div class="flex gap-3">
        <div class="w-10 h-10 bg-[#1c2b4a] text-white rounded-full flex items-center justify-center">
          ${c.nama[0].toUpperCase()}
        </div>
        <div class="bg-gray-100 rounded-xl px-4 py-3 w-full">
          <p class="font-semibold text-sm">
            ${c.nama}
            <span class="text-xs text-gray-400 ml-1">
              ${c.status === "hadir" ? "✔ Hadir" : "✖ Tidak Hadir"}
            </span>
          </p>
          <p class="text-sm mt-1">${c.ucapan}</p>

          <div class="flex gap-4 text-xs text-gray-400 mt-2">
            <span>${c.waktu}</span>
            <button onclick="toggleReply('${id}')" class="text-blue-500">Balas</button>
           ${c.ownerId === userId ? `
  <button onclick="hapusKomentar('${id}')" class="text-red-500">
    Hapus
  </button>
` : ""}

          </div>

          <div id="reply-${id}" class="hidden mt-3">
            <input id="replyName-${id}" class="w-full border rounded px-3 py-2 text-xs mb-2" placeholder="Nama">
            <textarea id="replyText-${id}" rows="2" class="w-full border rounded px-3 py-2 text-xs mb-2"></textarea>
            <button onclick="kirimBalasan('${id}')" class="text-xs bg-[#ffd1a8] px-4 py-1.5 rounded">
              Kirim Balasan
            </button>
          </div>

          ${replies}
        </div>
      </div>`;
  });

  hadirCount.textContent = hadir;
  tidakCount.textContent = tidak;
}

/* =========================================================
   ACTIONS
========================================================= */
function kirimUcapan() {
  if (!namaInput.value || !ucapanInput.value || !statusSelect.value) {
    return alert("Lengkapi data");
  }

  komentarRef.push({
    nama: namaInput.value,
    ucapan: ucapanInput.value,
    status: statusSelect.value,
    waktu: new Date().toLocaleString("id-ID"),
    ownerId: userId, // 
    replies: {}
  });

  namaInput.value = ucapanInput.value = "";
  statusSelect.value = "";
}


function toggleReply(id) {
  document.getElementById(`reply-${id}`)?.classList.toggle("hidden");
}

function kirimBalasan(id) {
  const nama = document.getElementById(`replyName-${id}`).value;
  const text = document.getElementById(`replyText-${id}`).value;
  if (!nama || !text) return;

  komentarRef.child(id).child("replies").push({ nama, ucapan: text });
}

function hapusKomentar(id) {
  if (confirm("Hapus komentar ini?")) {
    komentarRef.child(id).remove();
  }
}

/* =========================================================
   LISTENER REALTIME
========================================================= */
komentarRef.on("value", render);

/* =========================================================
   MUSIC PLAYER (FIXED)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  if (!music || !toggle) return;

  let isPlaying = false;

  function playMusic() {
    music.volume = 0.7;
    music.muted = false;
    music.play().then(() => {
      isPlaying = true;
      toggle.textContent = "⏸";
      toggle.classList.add("music-rotating");
    });
  }

  function pauseMusic() {
    music.pause();
    isPlaying = false;
    toggle.textContent = "▶";
    toggle.classList.remove("music-rotating");
  }

  // autoplay dari cover
  if (localStorage.getItem("playMusic") === "yes") {
    music.muted = true;
    music.play().then(() => {
      music.muted = false;
      playMusic();
    }).catch(() => {
      toggle.textContent = "▶";
    });
  }

  toggle.addEventListener("click", () => {
    isPlaying ? pauseMusic() : playMusic();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("section").forEach(section => {
    const items = section.querySelectorAll("[data-item]");
    items.forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle("show", entry.isIntersecting);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -12% 0px"
    }
  );

  document.querySelectorAll("[data-item]").forEach(item =>
    observer.observe(item)
  );
});

document.getElementById("saveDateBtn").addEventListener("click", function () {
  const title = encodeURIComponent("Wedding of Neli & Asep");
  const details = encodeURIComponent(
    "Akad & Resepsi Pernikahan Neli & Asep"
  );
  const location = encodeURIComponent("Indonesia");

  // format: YYYYMMDDTHHMMSSZ
  const startDate = "20260115T020000Z"; // 15 Jan 2026 09:00 WIB
  const endDate = "20260115T060000Z"; // 15 Jan 2026 13:00 WIB

  const url =
    `https://www.google.com/calendar/render?action=TEMPLATE` +
    `&text=${title}` +
    `&details=${details}` +
    `&location=${location}` +
    `&dates=${startDate}/${endDate}`;

  window.open(url, "_blank");
});

/* =====================
   COUNTDOWN
===================== */

const weddingDate = new Date(2026, 0, 15, 8, 0, 0).getTime();

setInterval(() => {
  const now = Date.now();
  const diff = weddingDate - now;
  if (diff < 0) return;

  days.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  hours.textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
  minutes.textContent = Math.floor((diff / (1000 * 60)) % 60);
  seconds.textContent = Math.floor((diff / 1000) % 60);
}, 1000);

/* =====================
   TOGGLE HADIAH
===================== */
const toggleBtn = document.getElementById("toggleGift");
const giftContent = document.getElementById("giftContent");
let isOpen = false;

toggleBtn?.addEventListener("click", () => {
  isOpen = !isOpen;

  giftContent.classList.toggle("max-h-0");
  giftContent.classList.toggle("opacity-0");
  giftContent.classList.toggle("translate-y-4");

  giftContent.classList.toggle("max-h-[3000px]");
  giftContent.classList.toggle("opacity-100");
  giftContent.classList.toggle("translate-y-0");

  toggleBtn.textContent = isOpen
    ? "❌ Tutup Hadiah"
    : "🎁 Kirim Hadiah";
});

/* =====================
   COPY TO CLIPBOARD
===================== */
document.addEventListener("DOMContentLoaded", () => {
  const copyButtons = document.querySelectorAll(".copy-btn");

  copyButtons.forEach(button => {
    button.addEventListener("click", async () => {
      // ambil teks rekening di kartu yang sama
      const rekeningText = button.closest("[data-item]").querySelector(".rekening").textContent.trim();

      try {
        await navigator.clipboard.writeText(rekeningText);

        const originalText = button.textContent;
        button.textContent = "✔ Tersalin";

        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);

      } catch (err) {
        alert("Browser tidak mendukung copy otomatis");
      }
    });
  });
});



/* =====================
   KOMENTAR
===================== */
const namaInput = document.getElementById("nama");
const ucapanInput = document.getElementById("ucapan");
const statusSelect = document.getElementById("status");
const commentList = document.getElementById("commentList");

let comments = JSON.parse(localStorage.getItem("comments") || "[]");

function render() {
  commentList.innerHTML = "";
  let hadir = 0, tidak = 0;

  comments.forEach(c => {
    if (c.status === "hadir") hadir++;
    if (c.status === "tidak") tidak++;

    const replies = c.replies.map(r => `
      <div class="reply flex gap-3 mt-3 ml-10">
        <div class="w-8 h-8 rounded-full bg-gray-400 text-white
          flex items-center justify-center text-xs">
          ${r.nama[0].toUpperCase()}
        </div>
        <div class="bg-white border rounded-xl px-3 py-2 w-full">
          <p class="text-xs font-semibold text-[#1c2b4a]">${r.nama}</p>
          <p class="text-sm text-gray-700">${r.ucapan}</p>
        </div>
      </div>
    `).join("");

    commentList.innerHTML += `
      <div class="comment flex gap-3">
        <div class="w-10 h-10 rounded-full bg-[#1c2b4a]
          text-white flex items-center justify-center font-semibold">
          ${c.nama[0].toUpperCase()}
        </div>

        <div class="bg-gray-100 rounded-xl px-4 py-3 w-full">
          <p class="font-semibold text-sm text-[#1c2b4a]">
            ${c.nama}
            <span class="text-xs text-gray-400 ml-1">
              ${c.status === "hadir" ? "✔ Hadir" : "✖ Tidak Hadir"}
            </span>
          </p>

          <p class="text-sm text-gray-700 mt-1">${c.ucapan}</p>

          <div class="flex gap-4 text-xs text-gray-400 mt-2">
            <span>${c.waktu}</span>
            <button onclick="toggleReply(${c.id})" class="text-blue-500">Balas</button>
            <button onclick="showDeleteConfirm(${c.id})" class="text-red-500">Hapus</button>
          </div>

          <!-- KONFIRMASI HAPUS -->
          <div id="delete-${c.id}" class="hidden mt-2 text-xs bg-white border rounded-lg px-3 py-2">
            <span class="text-gray-500">Hapus komentar ini?</span>
            <div class="mt-2 flex gap-3">
              <button onclick="hapusKomentar(${c.id})"
                class="text-red-600 font-semibold">Ya</button>
              <button onclick="hideDeleteConfirm(${c.id})"
                class="text-gray-400">Batal</button>
            </div>
          </div>

          <!-- BOX BALASAN (INI YANG TADI HILANG ❗) -->
          <div id="reply-${c.id}" class="hidden mt-3">
            <input id="replyName-${c.id}" placeholder="Nama"
              class="w-full border rounded-lg px-3 py-2 text-xs mb-2">
            <textarea id="replyText-${c.id}" rows="2"
              placeholder="Balasan"
              class="w-full border rounded-lg px-3 py-2 text-xs mb-2"></textarea>
            <button onclick="kirimBalasan(${c.id})"
              class="text-xs bg-[#ffd1a8] px-4 py-1.5 rounded-lg">
              Kirim Balasan
            </button>
          </div>

          ${replies}
        </div>
      </div>
    `;
  });

  hadirCount.textContent = hadir;
  tidakCount.textContent = tidak;
}


function kirimUcapan() {
  if (!namaInput.value || !ucapanInput.value || !statusSelect.value) {
    alert("Lengkapi semua field");
    return;
  }

  comments.unshift({
    id: Date.now(),
    nama: namaInput.value,
    ucapan: ucapanInput.value,
    status: statusSelect.value,
    waktu: "Baru saja",
    replies: []
  });

  localStorage.setItem("comments", JSON.stringify(comments));
  namaInput.value = ucapanInput.value = "";
  statusSelect.value = "";
  render();
}

function toggleReply(id) {
  const box = document.getElementById(`reply-${id}`);
  if (!box) return;
  box.classList.toggle("hidden");
}

function kirimBalasan(id) {
  const name = document.getElementById(`replyName-${id}`).value;
  const text = document.getElementById(`replyText-${id}`).value;
  if (!name || !text) return;

  comments.find(c => c.id === id)
    .replies.push({ nama: name, ucapan: text });

  localStorage.setItem("comments", JSON.stringify(comments));
  render();
}


render();


document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");

  if (!music || !toggle) return;

  let isPlaying = false;

  // cek dari cover
  if (localStorage.getItem("playMusic") === "yes") {
    music.volume = 0.7;
    music.play().then(() => {
      isPlaying = true;
      toggle.textContent = "⏸";
      toggle.classList.add("playing");
    }).catch(() => { });
  }

  toggle.addEventListener("click", () => {
    if (isPlaying) {
      music.pause();
      toggle.textContent = "▶";
      toggle.classList.remove("playing");
    } else {
      music.play();
      toggle.textContent = "⏸";
      toggle.classList.add("playing");
    }
    isPlaying = !isPlaying;
  });
});
function showDeleteConfirm(id) {
  document.getElementById(`delete-${id}`).classList.remove("hidden");
}

function hideDeleteConfirm(id) {
  document.getElementById(`delete-${id}`).classList.add("hidden");
}

function hapusKomentar(id) {
  comments = comments.filter(c => c.id !== id);
  localStorage.setItem("comments", JSON.stringify(comments));
  render();
}


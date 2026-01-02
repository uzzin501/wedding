function copyAccount(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert('계좌번호가 복사되었습니다.'))
    .catch(() => alert('복사에 실패했습니다.'));
}

function setVh() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setVh();
window.addEventListener('resize', setVh);


document.addEventListener('DOMContentLoaded', () => {
  const bgm   = document.getElementById('bgm');
  const btn   = document.getElementById('bgmBtn');
  const toast = document.getElementById('bgmToast');

  if (!bgm || !btn || !toast) return;

  /* ---------- Toast ---------- */
  const showToast = (msg, ms = 1800) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), ms);
  };

  /* ---------- UI ---------- */
  bgm.volume = 0.35;

  const setUi = (playing) => {
  const img = document.getElementById('bgmIcon');
  if (!img) return;

  img.src = playing ? 'volumedown.png' : 'volumeup.png';
  img.alt = playing ? '음악 켜짐' : '음악 꺼짐';

  btn.classList.toggle('on', playing);
};


  /* ---------- 0) 무조건 토스트 ---------- */
  showToast('🔊 배경음악이 재생됩니다');

  /* ---------- 1) 자동재생 시도 ---------- */
  const tryAutoPlay = async () => {
    try {
      await bgm.play();
      setUi(true);
      return true;
    } catch {
      setUi(false);
      return false;
    }
  };

  tryAutoPlay();

  /* ---------- 2) 첫 터치 / 클릭 시 재시도 ---------- */
  const unlock = async () => {
    const ok = await tryAutoPlay();
    if (ok) {
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    }
  };

  document.addEventListener('touchstart', unlock, { passive: true });
  document.addEventListener('click', unlock);

  /* ---------- 3) 버튼 토글 ---------- */
  btn.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      if (bgm.paused) {
        await bgm.play();
        setUi(true);
        showToast('🔊 음악이 재생됩니다');
      } else {
        bgm.pause();
        setUi(false);
        showToast('🔇 음악이 꺼졌어요');
      }
    } catch (err) {
      alert('브라우저 정책으로 재생이 제한될 수 있어요.');
      console.error(err);
    }
  });

  /* ---------- 초기 UI ---------- */
  setUi(false);
});



let photosOpened = false;

document.addEventListener('DOMContentLoaded', () => {
  // --- 오늘 날짜 ---
  const today = new Date();
  const loveStartDate = new Date(2020, 5, 30);
  const loveDays = Math.floor((today - loveStartDate) / (1000*60*60*24));
  document.getElementById('loveDaysText').textContent =
    `${loveDays+1}일 만큼 사랑하고 있습니다. 💖`;

  const weddingDate = new Date(2026, 10, 29);
  const daysLeft = Math.ceil((weddingDate - today) / (1000*60*60*24));
  const caption = document.getElementById('calendarCaption');
  caption.textContent = daysLeft > 0 ? `${daysLeft}일 뒤에 만나요♥` :
                         (daysLeft === 0 ? `오늘이 웨딩데이예요! 🎉` : `웨딩데이가 지났어요!`);

  // --- 사진 초기화 ---
  const photos = document.querySelectorAll('.photo-grid img');
  const btnTop = document.getElementById('photoMoreBtnTop');
  const btnBottom = document.getElementById('photoMoreBtnBottom');

  photos.forEach((img, index) => {
    if (index >= 9) {
      img.dataset.hidden = "true"; // 상태 저장
      img.style.display = "none"; // 숨김
      img.style.filter = "blur(2px) opacity(0.7)";
    } else {
      img.dataset.hidden = "false";
      img.style.display = "block";
      img.style.filter = "none";
    }
  });

  btnTop.style.display = 'block';
  btnBottom.style.display = 'none';
  btnTop.textContent = '∨';
  btnBottom.textContent = '∧';
});

function togglePhotos() {
  const photos = document.querySelectorAll('.photo-grid img');
  const btnTop = document.getElementById('photoMoreBtnTop');
  const btnBottom = document.getElementById('photoMoreBtnBottom');

  photosOpened = !photosOpened;

  photos.forEach((img, index) => {
    if (index >= 9) {
      if (photosOpened) {
        img.style.display = "block";
        img.style.filter = "none";
      } else {
        img.style.display = "none";
        img.style.filter = "blur(2px) opacity(0.7)";
      }
    }
  });

  if (photosOpened) {
    btnTop.style.display = 'none';
    btnBottom.style.display = 'block';
  } else {
    btnTop.style.display = 'block';
    btnBottom.style.display = 'none';
  }
}

// --- 사진 크게보기 뷰어 ---
let currentPhotoIndex = 0;
let photoList = [];

function openViewer(index) {
  photoList = Array.from(document.querySelectorAll('.photo-grid img'));
  currentPhotoIndex = index;

  const viewerImage = document.getElementById('viewerImage');
  viewerImage.src = photoList[index].src;

  document.getElementById('viewerCounter').textContent =
    `${index + 1} / ${photoList.length}`;

  document.getElementById('photoViewer').classList.add('active');
}

function closeViewer() {
  document.getElementById('photoViewer').classList.remove('active');
}

function prevPhoto() {
  if (currentPhotoIndex > 0) {
    currentPhotoIndex--;
    updateViewerImage();
  }
}

function nextPhoto() {
  if (currentPhotoIndex < photoList.length - 1) {
    currentPhotoIndex++;
    updateViewerImage();
  }
}

function updateViewerImage() {
  const viewerImage = document.getElementById('viewerImage');
  const counter = document.getElementById('viewerCounter');

  viewerImage.src = photoList[currentPhotoIndex].src;
  counter.textContent = `${currentPhotoIndex + 1} / ${photoList.length}`;
}

// --- 뷰어 터치 슬라이드 ---
document.addEventListener('DOMContentLoaded', () => {
  let startX = 0;
  const viewer = document.getElementById('photoViewer');
  if (!viewer) return;

  viewer.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
  viewer.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (diff > 50) nextPhoto();
    if (diff < -50) prevPhoto();
  });
});

// --- 안내사항 접기/펼치기 ---
function toggleInfo(header) {
  const infoItem = header.parentElement;
  infoItem.classList.toggle('open');
}

function initFadeUp() {
  const targets = document.querySelectorAll('.fade-up');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initFadeUp();
});

function updateBgLayers(){
  const sections = document.querySelectorAll('.bg-section');

  let current = sections[0];
  const mid = window.innerHeight * 0.5;

  sections.forEach(sec => {
    const r = sec.getBoundingClientRect();
    if (r.top <= mid && r.bottom >= mid) current = sec;
  });

  sections.forEach(sec => {
    const layer = sec.querySelector('.bg-layer');
    if (!layer) return;
    layer.style.opacity = (sec === current) ? '1' : '0';
    layer.style.transition = 'opacity 200ms ease';
  });
}

window.addEventListener('scroll', updateBgLayers, { passive: true });
window.addEventListener('resize', updateBgLayers);
document.addEventListener('DOMContentLoaded', updateBgLayers);

(() => {
  const btn = document.getElementById('menuBtn');
  const panel = document.getElementById('menuPanel');
  const closeBtn = document.getElementById('menuClose');
  const backdrop = document.getElementById('menuBackdrop');

  function openMenu(){
    panel.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
  }

  function closeMenu(){
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
  }

  btn?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);

  // 메뉴 클릭 시 닫고 이동
  panel?.addEventListener('click', (e) => {
    const a = e.target.closest('a.menu-link');
    if (!a) return;
    closeMenu(); // 닫고
    // 기본 anchor 이동은 scroll-behavior:smooth가 처리
  });

  // ESC로 닫기
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

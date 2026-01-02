/* =========================
   계좌 복사
========================= */
function copyAccount(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert('계좌번호가 복사되었습니다.'))
    .catch(() => alert('복사에 실패했습니다.'));
}

/* =========================
   VH 세팅
========================= */
function setVh() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setVh();
window.addEventListener('resize', setVh);

/* =========================
   갤러리 펼침 상태 (전역)
========================= */
let photosOpened = false;

/* =========================
   사진 펼치기/접기 (HTML onclick에서 호출)
========================= */
function togglePhotos() {
  const photos = document.querySelectorAll('.photo-grid img');
  const btnTop = document.getElementById('photoMoreBtnTop');
  const btnBottom = document.getElementById('photoMoreBtnBottom');

  photosOpened = !photosOpened;

  photos.forEach((img, index) => {
    if (index >= 9) {
      img.classList.toggle('hidden', !photosOpened);
    }
  });

  if (btnTop) btnTop.classList.toggle('hidden', photosOpened);
  if (btnBottom) btnBottom.classList.toggle('hidden', !photosOpened);
}

/* =========================
   사진 크게보기 뷰어
========================= */
let currentPhotoIndex = 0;
let photoList = [];

function openViewer(index) {
  photoList = Array.from(document.querySelectorAll('.photo-grid img'));
  currentPhotoIndex = index;

  const viewerImage = document.getElementById('viewerImage');
  const counter = document.getElementById('viewerCounter');
  const viewer = document.getElementById('photoViewer');

  if (!viewerImage || !counter || !viewer) return;

  viewerImage.src = photoList[index].src;
  counter.textContent = `${index + 1} / ${photoList.length}`;
  viewer.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeViewer() {
  const viewer = document.getElementById('photoViewer');
  if (viewer) viewer.classList.remove('active');
  document.body.style.overflow = '';
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
  if (!viewerImage || !counter) return;

  viewerImage.src = photoList[currentPhotoIndex].src;
  counter.textContent = `${currentPhotoIndex + 1} / ${photoList.length}`;
}

function initViewerTouch() {
  const viewer = document.getElementById('photoViewer');
  if (!viewer) return;

  let startX = 0;
  viewer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  viewer.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (diff > 50) nextPhoto();
    if (diff < -50) prevPhoto();
  });
}

/* =========================
   안내사항 접기/펼치기
========================= */
function toggleInfo(header) {
  const infoItem = header.parentElement;
  infoItem.classList.toggle('open');
}

/* =========================
   페이드업(IntersectionObserver)
========================= */
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

/* =========================
   BGM
========================= */
function initBgm() {
  const bgm = document.getElementById('bgm');
  const btn = document.getElementById('bgmBtn');
  const toast = document.getElementById('bgmToast');

  if (!bgm || !btn || !toast) return;

  const showToast = (msg, ms = 1800) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), ms);
  };

  bgm.volume = 0.35;

  const setUi = (playing) => {
    const img = document.getElementById('bgmIcon');
    if (!img) return;
    img.src = playing ? 'volumeup.png' : 'volumedown.png';
    img.alt = playing ? '음악 켜짐' : '음악 꺼짐';
    btn.classList.toggle('on', playing);
  };

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

  showToast('🔊 배경음악이 재생됩니다');
  tryAutoPlay();

  const unlock = async () => {
    const ok = await tryAutoPlay();
    if (ok) {
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    }
  };

  document.addEventListener('touchstart', unlock, { passive: true });
  document.addEventListener('click', unlock);

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

  setUi(false);
}

/* =========================
   DOMContentLoaded (1번만)
========================= */
document.addEventListener('DOMContentLoaded', () => {
  // 1) 연애일/디데이
  const today = new Date();

  const loveStartDate = new Date(2020, 5, 30);
  const loveDays = Math.floor((today - loveStartDate) / (1000 * 60 * 60 * 24));
  const loveEl = document.getElementById('loveDaysText');
  if (loveEl) loveEl.textContent = `${loveDays + 1}일 만큼 사랑하고 있습니다. 💖`;

  const weddingDate = new Date(2026, 10, 29);
  const daysLeft = Math.ceil((weddingDate - today) / (1000 * 60 * 60 * 24));
  const caption = document.getElementById('calendarCaption');
  if (caption) {
    caption.textContent =
      daysLeft > 0 ? `${daysLeft}일 뒤에 만나요♥`
      : (daysLeft === 0 ? `오늘이 웨딩데이예요! 🎉` : `웨딩데이가 지났어요!`);
  }

  // 2) 사진 초기 상태(9장만)
  const photos = document.querySelectorAll('.photo-grid img');
  const btnTop = document.getElementById('photoMoreBtnTop');
  const btnBottom = document.getElementById('photoMoreBtnBottom');

  photos.forEach((img, index) => {
    img.classList.toggle('hidden', index >= 9);
  });

  if (btnTop) btnTop.classList.remove('hidden');
  if (btnBottom) btnBottom.classList.add('hidden');

  // 3) 페이드업
  initFadeUp();

  // 4) 뷰어 터치
  initViewerTouch();

  // 5) 메뉴
  initMenu();

  // 6) BGM
  initBgm();
});

function initMenu() {
  const btn = document.getElementById('menuBtn');
  const panel = document.getElementById('menuPanel');
  const closeBtn = document.getElementById('menuClose');
  const backdrop = document.getElementById('menuBackdrop');

  if (!btn || !panel || !closeBtn || !backdrop) return;

  function openMenu() {
    panel.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;

    // ✅ 메뉴 열릴 때 배경 스크롤 방지(원하면 유지)
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;

    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  // 메뉴 링크 클릭 시: 닫고 이동
  panel.addEventListener('click', (e) => {
    const a = e.target.closest('a.menu-link');
    if (!a) return;
    closeMenu();
    // anchor 이동은 기본 동작 + scroll-behavior:smooth로 처리됨
  });

  // ESC로 닫기
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

function setVh() {
  document.documentElement.style.setProperty(
    '--vh',
    `${window.innerHeight * 0.01}px`
  );
}
setVh();
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);

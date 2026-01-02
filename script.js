/* =========================
   유틸: 토스트
========================= */
function showToast(msg, ms = 1800) {
  const toast = document.getElementById('bgmToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), ms);
}

/* =========================
   계좌 복사 (data-copy 사용)
========================= */
function copyAccount(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert('계좌번호가 복사되었습니다.'))
    .catch(() => alert('복사에 실패했습니다.'));
}

/* =========================
   페이드업
========================= */
function initFadeUp(scroller) {
  const targets = document.querySelectorAll('.fade-up');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    root: scroller || null   // ✅ phone-frame 스크롤 기준
  });

  targets.forEach(el => observer.observe(el));
}

/* =========================
   현재 섹션 bg-layer만 보이게 (phone-frame 기준)
========================= */
function updateBgLayers(scroller) {
  const sections = document.querySelectorAll('.bg-section');
  if (!sections.length) return;

  const rootRect = scroller
    ? scroller.getBoundingClientRect()
    : { top: 0, height: window.innerHeight };

  const mid = rootRect.top + rootRect.height * 0.5;

  let current = sections[0];

  sections.forEach(sec => {
    const r = sec.getBoundingClientRect();
    if (r.top <= mid && r.bottom >= mid) current = sec;
  });

  sections.forEach(sec => {
    const layer = sec.querySelector('.bg-layer');
    if (!layer) return;
    layer.style.opacity = (sec === current) ? '1' : '0';
  });
}

/* =========================
   갤러리 펼치기/접기
========================= */
let photosOpened = false;

function setGalleryState(opened) {
  const photos = document.querySelectorAll('#photoGrid img[data-idx]');
  const btnTop = document.getElementById('photoMoreBtnTop');
  const btnBottom = document.getElementById('photoMoreBtnBottom');

  photosOpened = opened;

  photos.forEach((img, idx) => {
    if (idx >= 9) {
      img.classList.toggle('hidden', !opened);
      img.classList.toggle('is-blur', !opened);
    }
  });

  if (btnTop && btnBottom) {
    btnTop.classList.toggle('hidden', opened);
    btnBottom.classList.toggle('hidden', !opened);
  }
}

/* =========================
   사진 뷰어
========================= */
let currentPhotoIndex = 0;
let photoList = [];

function lockScroll(lock) {
  const scroller = document.getElementById('scroller');
  if (!scroller) return;
  scroller.classList.toggle('lock', !!lock);
}

function openViewer(index) {
  const viewer = document.getElementById('photoViewer');
  const viewerImage = document.getElementById('viewerImage');
  const counter = document.getElementById('viewerCounter');
  if (!viewer || !viewerImage || !counter) return;

  // ✅ "숨김 처리된 것" 제외하고 리스트 구성
  photoList = Array.from(document.querySelectorAll('#photoGrid img[data-idx]'))
    .filter(img => !img.classList.contains('hidden'));

  currentPhotoIndex = Math.max(0, Math.min(index, photoList.length - 1));

  viewerImage.src = photoList[currentPhotoIndex].src;
  counter.textContent = `${currentPhotoIndex + 1} / ${photoList.length}`;

  viewer.classList.add('active');
  viewer.setAttribute('aria-hidden', 'false');

  lockScroll(true);
}

function closeViewer() {
  const viewer = document.getElementById('photoViewer');
  if (!viewer) return;
  viewer.classList.remove('active');
  viewer.setAttribute('aria-hidden', 'true');
  lockScroll(false);
}

function updateViewerImage() {
  const viewerImage = document.getElementById('viewerImage');
  const counter = document.getElementById('viewerCounter');
  if (!viewerImage || !counter) return;
  viewerImage.src = photoList[currentPhotoIndex].src;
  counter.textContent = `${currentPhotoIndex + 1} / ${photoList.length}`;
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
   메뉴
========================= */
function initMenu(scroller) {
  const menuBtn = document.getElementById('menuBtn');
  const panel = document.getElementById('menuPanel');
  const closeBtn = document.getElementById('menuClose');
  const backdrop = document.getElementById('menuBackdrop');
  const links = document.querySelectorAll('.menu-link');

  if (!menuBtn || !panel || !closeBtn || !backdrop) return;

  const open = () => {
    panel.classList.add('open');
    backdrop.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
  };

  const close = () => {
    panel.classList.remove('open');
    backdrop.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  };

  menuBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  links.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      close();
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (!target || !scroller) return;
      scroller.scrollTo({ top: scroller.scrollTop + target.getBoundingClientRect().top - 10, behavior: 'smooth' });
    });
  });
}

/* =========================
   아코디언
========================= */
function initAccordion() {
  document.querySelectorAll('.account-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('open');
    });
  });
}

/* =========================
   BGM
========================= */
function initBgm() {
  const bgm = document.getElementById('bgm');
  const btn = document.getElementById('bgmBtn');
  if (!bgm || !btn) return;

  bgm.volume = 0.35;

  const setUi = (playing) => {
    const img = document.getElementById('bgmIcon');
    if (!img) return;
    img.src = playing ? 'volumedown.png' : 'volumeup.png';
    img.alt = playing ? '음악 켜짐' : '음악 꺼짐';
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
   D-day / Love-day
========================= */
function initDates() {
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
}

/* =========================
   DOM Ready
========================= */
document.addEventListener('DOMContentLoaded', () => {
  const scroller = document.getElementById('scroller');

  // 1) 날짜 텍스트
  initDates();

  // 2) 갤러리 초기(9장만)
  setGalleryState(false);

  // 3) 갤러리 버튼 이벤트
  const btnTop = document.getElementById('photoMoreBtnTop');
  const btnBottom = document.getElementById('photoMoreBtnBottom');
  if (btnTop) btnTop.addEventListener('click', () => setGalleryState(true));
  if (btnBottom) btnBottom.addEventListener('click', () => setGalleryState(false));

  // 4) 갤러리 이미지 클릭 → 뷰어
  const grid = document.getElementById('photoGrid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const img = e.target.closest('img[data-idx]');
      if (!img) return;
      const idx = Number(img.getAttribute('data-idx')) || 0;

      // ✅ 현재 화면에 보이는(숨김 아닌) 인덱스로 변환해서 열기
      const visible = Array.from(document.querySelectorAll('#photoGrid img[data-idx]'))
        .filter(x => !x.classList.contains('hidden'));
      const visibleIndex = visible.findIndex(x => x === img);
      openViewer(visibleIndex >= 0 ? visibleIndex : 0);
    });
  }

  // 5) 뷰어 버튼
  const vClose = document.getElementById('viewerClose');
  const vPrev = document.getElementById('viewerPrev');
  const vNext = document.getElementById('viewerNext');
  if (vClose) vClose.addEventListener('click', closeViewer);
  if (vPrev) vPrev.addEventListener('click', prevPhoto);
  if (vNext) vNext.addEventListener('click', nextPhoto);

  // 뷰어 배경 클릭 닫기
  const viewer = document.getElementById('photoViewer');
  if (viewer) {
    viewer.addEventListener('click', (e) => {
      if (e.target === viewer) closeViewer();
    });
  }

  initViewerTouch();

  // 6) 복사 아이콘(data-copy)
  document.querySelectorAll('.copy-icon[data-copy]').forEach(el => {
    el.addEventListener('click', () => copyAccount(el.dataset.copy));
  });

  // 7) 아코디언
  initAccordion();

  // 8) 메뉴
  initMenu(scroller);

  // 9) 페이드업(스크롤 컨테이너 기준)
  initFadeUp(scroller);

  // 10) 배경 레이어 표시(스크롤 컨테이너 기준)
  const doUpdateBg = () => updateBgLayers(scroller);
  if (scroller) scroller.addEventListener('scroll', doUpdateBg, { passive: true });
  window.addEventListener('resize', doUpdateBg);
  doUpdateBg();

  // 11) BGM
  initBgm();
});

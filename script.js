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
    root: scroller || null
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

  // ✅ 숨김 처리된 것 제외하고 리스트 구성
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
      scroller.scrollTo({
        top: scroller.scrollTop + target.getBoundingClientRect().top - 10,
        behavior: 'smooth'
      });
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
   BGM (최소·정석 버전)
========================= */
function initBgm() {
  const bgm = document.getElementById('bgm');
  const btn = document.getElementById('bgmBtn');
  const icon = document.getElementById('bgmIcon');
  if (!bgm || !btn) return;

  const VOL = 0.35;

  // iOS/인앱 안정 옵션들
  bgm.setAttribute('playsinline', '');
  bgm.preload = 'auto';
  bgm.loop = true;

  const setUi = (playing, muted) => {
    if (icon) icon.src = playing ? 'volumeup.png' : 'volumedown.png';
    // 필요하면 muted 상태를 따로 표시하고 싶으면 여기서 처리 가능
  };

  const tryPlay = async (muted) => {
    try {
      bgm.muted = !!muted;
      bgm.volume = muted ? 0 : VOL;
      await bgm.play();
      return true;
    } catch (e) {
      return false;
    }
  };

  // 1) 로드 직후: 유소리 먼저 시도 → 실패하면 무음 자동재생 시도
  (async () => {
    let ok = await tryPlay(false);
    if (ok) {
      setUi(true, false);
      showToast?.('🔊 배경음악이 재생됩니다');
      return;
    }

    ok = await tryPlay(true);
    if (ok) {
      setUi(true, true);
      showToast?.('🔇 화면을 한번만 터치하면 소리가 켜져요');
      // 소리는 잠겨도 "재생 자체는" 돌아가는 상태
      return;
    }

    setUi(false, true);
    showToast?.('🔇 자동재생이 차단됐어요. 화면을 한 번 터치해 주세요');
  })();

  // 2) 첫 사용자 제스처(스크롤 포함)에서 소리 켜기
  const unlockSound = async () => {
    // 이미 유소리면 해제 필요 없음
    if (!bgm.paused && bgm.muted === false) {
      cleanup();
      return;
    }

    const ok = await tryPlay(false);
    if (ok) {
      setUi(true, false);
      showToast?.('🔊 배경음악이 재생됩니다');
      cleanup();
    }
  };

  const cleanup = () => {
    window.removeEventListener('touchstart', unlockSound, true);
    window.removeEventListener('pointerdown', unlockSound, true);
    window.removeEventListener('click', unlockSound, true);
    window.removeEventListener('scroll', unlockSound, true);
  };

  window.addEventListener('touchstart', unlockSound, true);
  window.addEventListener('pointerdown', unlockSound, true);
  window.addEventListener('click', unlockSound, true);
  window.addEventListener('scroll', unlockSound, true);

  // 3) 버튼 토글
  btn.addEventListener('click', async (e) => {
    e.stopPropagation();

    if (bgm.paused) {
      const ok = await tryPlay(false);
      if (ok) {
        setUi(true, false);
        showToast?.('🔊 음악이 재생됩니다');
      } else {
        // 실패하면 무음이라도
        const ok2 = await tryPlay(true);
        setUi(ok2, true);
        showToast?.(ok2 ? '🔇 무음으로 재생 중이에요' : '🔇 재생이 제한돼요');
      }
      return;
    }

    bgm.pause();
    setUi(false, bgm.muted);
    showToast?.('🔇 음악이 꺼졌어요');
  });

  setUi(false, true);
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
   RSVP 모달
========================= */
function initRsvpModal() {
  const openBtn = document.getElementById("rsvpOpen");
  const modal = document.getElementById("rsvpModal");
  const closeBtn = document.getElementById("rsvpClose");

  const form = document.getElementById("rsvpForm");
  const msg = document.getElementById("rsvpMsg");
  const submitBtn = document.getElementById("rsvpSubmit");

  if (!openBtn || !modal || !closeBtn || !form) return;

  function openModal() {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-lock");
    if (msg) msg.textContent = "";

    setTimeout(() => {
      const first = form.querySelector("input, select, textarea, button");
      if (first) first.focus();
    }, 0);
  }

  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-lock");
    openBtn.focus();
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (msg) msg.textContent = "";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "전송 중…";
    }

    const data = Object.fromEntries(new FormData(form).entries());
    data.createdAt = new Date().toISOString();

    try {
      console.log("RSVP 제출 데이터:", data);

      if (msg) msg.textContent = "전달 완료! 감사합니다 🙂";
      form.reset();

      setTimeout(closeModal, 1500);
    } catch (err) {
      console.error(err);
      if (msg) msg.textContent = "전달에 실패했어요. 잠시 후 다시 시도해 주세요.";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "전달하기";
      }
    }
  });
}

/* =========================
   Hero Video (배경 비디오: 1회 재생 후 마지막 프레임 고정)
========================= */
function initHeroVideoOnceFreeze() {
  const heroVideo = document.getElementById('heroVideo');
  if (!heroVideo) return;

  // 끝나면 마지막 프레임 유지
  heroVideo.addEventListener('ended', () => {
    heroVideo.pause();
    // iOS에서 끝나면 첫 프레임으로 튀는 것 방지
    try { heroVideo.currentTime = Math.max(0, heroVideo.duration - 0.05); } catch {}
  });

  // 클릭/터치하면 처음부터 다시 재생
  const replay = async () => {
    try {
      heroVideo.currentTime = 0;
      await heroVideo.play();
    } catch (e) {
      heroVideo.muted = true;
      heroVideo.play();
    }
  };

  heroVideo.addEventListener('click', replay);
  heroVideo.addEventListener('touchend', replay, { passive: true });

  // 자동재생이 막히는 환경 대비: 첫 제스처에서 재생 재시도
  const unlock = async () => {
    try {
      await heroVideo.play();
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    } catch {}
  };

  document.addEventListener('pointerdown', unlock, { passive: true });
  document.addEventListener('touchstart', unlock, { passive: true });
  document.addEventListener('click', unlock);
}

document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.bg-section.video-section');
  const video = section?.querySelector('video');

  if (!section || !video) return;

  video.addEventListener('play', () => {
    setTimeout(() => {
      section.classList.add('show-overlay');
    }, 3000); // ✅ 5초
  }, { once: true });
});


/* =========================
   DOM Ready
========================= */
document.addEventListener('DOMContentLoaded', () => {
  const scroller = document.getElementById('scroller');

  initDates();
  initRsvpModal();

  // 갤러리 초기(9장만)
  setGalleryState(false);

  // 갤러리 버튼 이벤트
  const btnTop = document.getElementById('photoMoreBtnTop');
  const btnBottom = document.getElementById('photoMoreBtnBottom');
  if (btnTop) btnTop.addEventListener('click', () => setGalleryState(true));
  if (btnBottom) btnBottom.addEventListener('click', () => setGalleryState(false));

  // 갤러리 이미지 클릭 → 뷰어
  const grid = document.getElementById('photoGrid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const img = e.target.closest('img[data-idx]');
      if (!img) return;

      const visible = Array.from(document.querySelectorAll('#photoGrid img[data-idx]'))
        .filter(x => !x.classList.contains('hidden'));
      const visibleIndex = visible.findIndex(x => x === img);
      openViewer(visibleIndex >= 0 ? visibleIndex : 0);
    });
  }

  // 뷰어 버튼
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

  // 복사 아이콘(data-copy)
  document.querySelectorAll('.copy-icon[data-copy]').forEach(el => {
    el.addEventListener('click', () => copyAccount(el.dataset.copy));
  });

  // 아코디언 / 메뉴 / 페이드업
  initAccordion();
  initMenu(scroller);
  initFadeUp(scroller);

  // 배경 레이어 표시
  const doUpdateBg = () => updateBgLayers(scroller);
  if (scroller) scroller.addEventListener('scroll', doUpdateBg, { passive: true });
  window.addEventListener('resize', doUpdateBg);
  doUpdateBg();

  // BGM
  initBgm();

  // ✅ 배경 비디오(1회 재생 후 멈춤)
  initHeroVideoOnceFreeze();
});


// rsvp 불참 선택 시 비활성화
function initRsvpLogic() {
  const attend = document.getElementById('attend');
  const meal = document.getElementById('meal');
  const guests = document.getElementById('guests');
  if (!attend || !meal || !guests) return;

  const sync = () => {
    const off = attend.value === 'no';
    meal.disabled = off;
    guests.disabled = off;
    if (off) {
      meal.value = 'no';
      guests.value = '0';
    }
  };

  attend.addEventListener('change', sync);
  sync();
}
document.addEventListener('DOMContentLoaded', initRsvpLogic);

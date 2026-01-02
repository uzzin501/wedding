function copyAccount(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert('계좌번호가 복사되었습니다.'))
    .catch(() => alert('복사에 실패했습니다.'));
}

const toast = document.getElementById('bgmToast');

const showToast = (msg = '🔊 음악이 재생됩니다', ms = 2000) => {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), ms);
};


// --- BGM ---
document.addEventListener('DOMContentLoaded', () => {
  const bgm = document.getElementById('bgm');
  const btn = document.getElementById('bgmBtn');
  if (!bgm || !btn) return;

  bgm.volume = 0.35;

  const setUi = (playing) => {
    btn.textContent = playing ? '🔈' : '🔊';
    btn.classList.toggle('on', playing);
  };
  

  // 1) 자동재생 "시도" (PC에서 되는 경우도 있고, 모바일은 대부분 막힘)
  const tryAutoPlay = async () => {
    try {
      await bgm.play();
      setUi(true);
      showToast();            // ✅ 추가: 재생 성공 시 2초 토스트
      return true;
    } catch (e) {
      setUi(false);
      return false;
    }
  };

  // 페이지 로드 직후 한 번 시도
  tryAutoPlay();

  // 2) 모바일/정책 대비: 첫 터치/클릭 때 자동으로 다시 한 번 시도
  const unlock = async () => {
    const ok = await tryAutoPlay();
    // 성공하면 이벤트 제거(불필요 반복 방지)
    if (ok) {
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    }
  };

  document.addEventListener('touchstart', unlock, { passive: true });
  document.addEventListener('click', unlock);

  // 3) 버튼으로 켜기/끄기
  btn.addEventListener('click', async (e) => {
    e.stopPropagation(); // 버튼 클릭이 unlock에 중복 영향을 주지 않게
    try {
      if (bgm.paused) {
        await bgm.play();
        setUi(true);
      } else {
        bgm.pause();
        setUi(false);
      }
    } catch (err) {
      // 여기서 실패하면 대부분 파일 경로/서버 문제 또는 브라우저 정책
      alert('재생이 제한될 수 있어요. 파일 경로(audio/bgm.mp3)와 실행 방식(서버에서 열기)을 확인해 주세요.');
      console.error(err);
    }
  });

  // 처음 UI 상태
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
let startX = 0;
const viewer = document.getElementById('photoViewer');

viewer.addEventListener('touchstart', e => startX = e.touches[0].clientX);
viewer.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  if (diff > 50) nextPhoto();
  if (diff < -50) prevPhoto();
});

// --- 안내사항 접기/펼치기 ---
function toggleInfo(header) {
  const infoItem = header.parentElement;
  infoItem.classList.toggle('open');
}


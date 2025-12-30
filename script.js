// 스크롤 애니메이션
const fades = document.querySelectorAll('.fade');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
});

fades.forEach(el => observer.observe(el));

// 카카오 공유
Kakao.init('115d81d0baaa28ba5788fb8a22d643d1');

function shareKakao() {
  Kakao.Link.sendDefault({
    objectType: 'feed',
    content: {
      title: 'OO & OO 결혼식에 초대합니다',
      description: '2026년 5월 10일 오후 2시\n○○웨딩홀',
      imageUrl: 'https://이미지주소.jpg',
      link: {
        mobileWebUrl: window.location.href,
        webUrl: window.location.href,
      },
    },
  });
}

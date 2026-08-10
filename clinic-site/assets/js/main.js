/* =========================================================
   ○○피부과 - 공통 스크립트 (라이브러리 의존 없음)
   ========================================================= */
(function () {
  'use strict';

  var PC = 1200; // 모바일 메뉴 분기점

  /* ----- 1. 팝업 레이어 (24시간 쿠키) ----------------------- */
  (function popupLayer() {
    var layer = document.getElementById('popupLayer');
    if (!layer) return;

    if (document.cookie.indexOf('mainPopupHide=1') > -1) {
      layer.classList.add('is-hide');
      return;
    }

    function close() {
      var today = document.getElementById('popupToday');
      if (today && today.checked) {
        var exp = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = 'mainPopupHide=1; expires=' + exp + '; path=/';
      }
      layer.classList.add('is-hide');
    }

    layer.querySelector('.popup_close').addEventListener('click', close);
    layer.addEventListener('click', function (e) {
      if (e.target === layer) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  })();

  /* ----- 2. 헤더: 스크롤 상태 + 메가메뉴 -------------------- */
  (function header() {
    var hd = document.getElementById('header');
    if (!hd) return;

    var solid = hd.classList.contains('is-solid');

    function onScroll() {
      if (solid) return;
      hd.classList.toggle('is-fixed', window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 메가 드롭다운 (PC) — 서브메뉴를 상위 메뉴 위치에 맞춰 정렬
    var menus = hd.querySelectorAll('.gnb_list > li');

    // #header 가 position:fixed / left:0 이므로 .sub 의 left 는 뷰포트 x 좌표와 같다
    function alignSub() {
      if (window.innerWidth < PC) return;
      menus.forEach(function (li) {
        var sub = li.querySelector('.sub');
        var link = li.querySelector('a');
        if (!sub || !link) return;
        sub.style.left = link.getBoundingClientRect().left + 'px';
      });
    }

    hd.addEventListener('mouseenter', function () {
      if (window.innerWidth < PC) return;
      alignSub();
      hd.classList.add('is-open');
    });
    hd.addEventListener('mouseleave', function () {
      hd.classList.remove('is-open');
    });
    window.addEventListener('resize', alignSub);
  })();

  /* ----- 3. 모바일 메뉴 + 아코디언 -------------------------- */
  (function mobileMenu() {
    var btn = document.querySelector('.gnb_button');
    var gnb = document.querySelector('.gnb');
    if (!btn || !gnb) return;

    btn.addEventListener('click', function () {
      var open = gnb.classList.toggle('is-open');
      btn.classList.toggle('is-active', open);
      document.body.classList.toggle('is-locked', open);
    });

    gnb.querySelectorAll('.gnb_list > li').forEach(function (li) {
      var plus = li.querySelector('.plus');
      var link = li.querySelector('a');
      if (!plus) return;

      function toggle(e) {
        if (window.innerWidth >= PC) return;
        e.preventDefault();
        var isOpen = li.classList.contains('is-open');
        gnb.querySelectorAll('.gnb_list > li').forEach(function (o) {
          o.classList.remove('is-open');
        });
        li.classList.toggle('is-open', !isOpen);
      }
      plus.addEventListener('click', toggle);
      link.addEventListener('click', toggle);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= PC) {
        gnb.classList.remove('is-open');
        btn.classList.remove('is-active');
        document.body.classList.remove('is-locked');
      }
    });
  })();

  /* ----- 4. 메인 비주얼 슬라이더 (페이드 + 오토플레이) ------- */
  (function heroSlider() {
    var slides = document.querySelectorAll('.hero_slide');
    if (!slides.length) return;

    var pagers = document.querySelectorAll('.hero_pager button');
    var idx = 0;
    var timer = null;
    var DURATION = 6000;

    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        s.classList.toggle('is-active', i === idx);
      });
      pagers.forEach(function (p, i) {
        var bar = p.querySelector('i');
        p.classList.remove('is-active');
        bar.style.transition = 'none';
        bar.style.width = '0';
        if (i === idx) {
          void bar.offsetWidth;      // 리플로우 강제 후 진행바 재시작
          bar.style.transition = ''; // CSS 의 6s 트랜지션 복구
          bar.style.width = '';      // is-active 규칙(width:100%)이 적용되도록 인라인 해제
          p.classList.add('is-active');
        }
      });
    }

    function play() {
      stop();
      timer = setInterval(function () { go(idx + 1); }, DURATION);
    }
    function stop() {
      if (timer) clearInterval(timer);
    }

    pagers.forEach(function (p, i) {
      p.addEventListener('click', function () { go(i); play(); });
    });

    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : play();
    });

    go(0);
    play();
  })();

  /* ----- 5. 스크롤 등장 애니메이션 -------------------------- */
  (function scrollReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-on'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-on');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(function (t) { io.observe(t); });
  })();

  /* ----- 6. TOP 버튼 ---------------------------------------- */
  (function topButton() {
    var btn = document.getElementById('btnTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-on', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

})();

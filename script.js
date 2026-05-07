const themes = {
  teal:     { nav: '#1a2b3c', logo: '#4dd9b0', subnav: '#eef7f5', subnavBorder: '#d0e9e3', accent: '#4dd9b0', accentText: '#0f1e2b', subText: '#4a6e65', content: '#f0f7f5', contentText: '#9ab8b0' },
  purple:   { nav: '#1e1535', logo: '#9b7ef8', subnav: '#f0eeff', subnavBorder: '#d8cffa', accent: '#9b7ef8', accentText: '#1a0f3a', subText: '#5a4a80', content: '#f5f2ff', contentText: '#a090c8' },
  navy:     { nav: '#0d1f3c', logo: '#4b9cf5', subnav: '#e8f0fb', subnavBorder: '#c5d8f5', accent: '#4b9cf5', accentText: '#06152a', subText: '#2b5090', content: '#edf3fb', contentText: '#7aaad8' },
  charcoal: { nav: '#1c1c1c', logo: '#f0c040', subnav: '#f2f2f0', subnavBorder: '#ddddd8', accent: '#f0c040', accentText: '#1a1200', subText: '#555550', content: '#f7f7f4', contentText: '#aaa' },
  forest:   { nav: '#0f2518', logo: '#52c76a', subnav: '#edf5ee', subnavBorder: '#c5dfca', accent: '#52c76a', accentText: '#071510', subText: '#2a5530', content: '#eef7ef', contentText: '#7ab88a' },
  rainbow:  null,
};

let currentTheme = themes.teal;

function clearRainbow() {
  document.getElementById('navbar').classList.remove('rainbow');
  document.getElementById('logo').classList.remove('rainbow');
  document.getElementById('subnav').classList.remove('rainbow');
  document.getElementById('content').classList.remove('rainbow');
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('rainbow-link'));
  document.querySelectorAll('.sub-link').forEach(el => el.classList.remove('rainbow-sub'));
  document.querySelectorAll('.badge').forEach(el => el.classList.remove('rainbow-badge'));
}

function applyRainbow() {
  clearRainbow();
  document.getElementById('navbar').classList.add('rainbow');
  document.getElementById('logo').classList.add('rainbow');
  document.getElementById('subnav').classList.add('rainbow');
  document.getElementById('content').classList.add('rainbow');
  document.querySelectorAll('.nav-link').forEach(el => el.classList.add('rainbow-link'));
  document.querySelectorAll('.sub-link').forEach(el => el.classList.add('rainbow-sub'));
  document.querySelectorAll('.badge').forEach(el => el.classList.add('rainbow-badge'));
  // clear any inline styles
  document.querySelectorAll('.nav-link, .sub-link').forEach(el => { el.style.background = ''; el.style.color = ''; });
  document.querySelectorAll('.badge').forEach(el => { el.style.background = ''; el.style.color = ''; });
  document.getElementById('navbar').style.background = '';
  document.getElementById('subnav').style.background = '';
  document.getElementById('content').style.background = '';
  document.getElementById('logo').style.color = '';
}


function applyTheme(t) {
  document.getElementById('navbar').style.background = t.nav;
  document.getElementById('logo').style.color = t.logo;

  const sub = document.getElementById('subnav');
  sub.style.background = t.subnav;
  sub.style.borderBottomColor = t.subnavBorder;

  const content = document.getElementById('content');
  content.style.background = t.content;
  content.style.color = t.contentText;

  document.querySelectorAll('.nav-link.active').forEach(el => {
    el.style.background = t.accent; el.style.color = t.accentText;
  });
  document.querySelectorAll('.nav-link:not(.active)').forEach(el => {
    el.style.background = ''; el.style.color = '';
  });
  document.querySelectorAll('.sub-link.active').forEach(el => {
    el.style.background = t.accent; el.style.color = t.accentText;
  });
  document.querySelectorAll('.sub-link:not(.active)').forEach(el => {
    el.style.background = ''; el.style.color = t.subText;
  });
  document.querySelectorAll('.sub-link .badge').forEach(b => {
    const isActive = b.closest('.sub-link').classList.contains('active');
    b.style.background = isActive ? 'rgba(0,0,0,0.15)' : t.accent;
    b.style.color = t.accentText;
  });
  document.querySelectorAll('.theme-btn.selected').forEach(b => {
    b.style.background = t.accent; b.style.color = t.accentText;
  });
}


function setTheme(name, btn) {
  currentTheme = themes[name];
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.remove('selected');
    b.style.background = ''; b.style.color = '';
  });
  btn.classList.add('selected');
  if (name === 'rainbow') {
    applyRainbow();
  } else {
    clearRainbow();
    applyTheme(currentTheme);
  }
}


function setActive(el) {
  document.querySelectorAll('.nav-link').forEach(e => {
    e.classList.remove('active'); e.style.background = ''; e.style.color = '';
  });
  el.classList.add('active');
  if (currentTheme) {
    el.style.background = currentTheme.accent;
    el.style.color = currentTheme.accentText;
  }
}

function setSubActive(el) {
  document.querySelectorAll('.sub-link').forEach(e => {
    e.classList.remove('active'); e.style.background = ''; e.style.color = currentTheme ? currentTheme.subText : '';
    const b = e.querySelector('.badge');
    if (b && currentTheme) { b.style.background = currentTheme.accent; b.style.color = currentTheme.accentText; }
  });
  el.classList.add('active');
  if (currentTheme) {
    el.style.background = currentTheme.accent;
    el.style.color = currentTheme.accentText;
    const b = el.querySelector('.badge');
    if (b) { b.style.background = 'rgba(0,0,0,0.15)'; b.style.color = currentTheme.accentText; }
  }
}

applyTheme(currentTheme);

 applyTheme(currentTheme);

new Swiper(".mySwiper", {
  
  spaceBetween: 16,
  loop: true,

  autoplay: {
    delay: 3000, // 3 seconds
    disableOnInteraction: false, // keep sliding after user touch
  },

  scrollbar: { 
    el: ".swiper-scrollbar", 
    draggable: true 
  },
});
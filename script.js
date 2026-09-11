const body = document.body;
const nav = document.querySelector('#mainNav');
const themeToggle = document.querySelector('#themeToggle');
const themeColor = document.querySelector('#themeColor');

const updateThemeControl = () => {
  const isDark = body.classList.contains('dark');
  const nextMode = isDark ? 'light' : 'night';
  themeToggle.textContent = isDark ? '☼' : '☾';
  themeToggle.setAttribute('aria-label', `Switch to ${nextMode} mode`);
  themeToggle.title = `Switch to ${nextMode} mode`;
  themeColor.setAttribute('content', isDark ? '#171411' : '#f6f1e8');
};

document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelector('#menuToggle').addEventListener('click', () => {
  nav.classList.toggle('open');
});

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('nzai-theme', body.classList.contains('dark') ? 'dark' : 'light');
  updateThemeControl();
});

if (localStorage.getItem('nzai-theme') === 'dark') body.classList.add('dark');
updateThemeControl();

const navLinks = document.querySelectorAll('#mainNav a');

navLinks.forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const sectionLinks = new Map(
  [...navLinks].map((link) => [document.querySelector(link.getAttribute('href')), link]),
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.remove('active'));
      sectionLinks.get(entry.target)?.classList.add('active');
    });
  },
  { rootMargin: '-35% 0px -55% 0px' },
);

sectionLinks.forEach((_, section) => sectionObserver.observe(section));

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.project').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.type !== filter;
    });
  });
});

const dialog = document.querySelector('#projectDialog');
document.querySelectorAll('[data-modal]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('#dialogTitle').textContent = button.dataset.modal;
    dialog.showModal();
  });
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector('#contactForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const message = document.querySelector('#message').value.trim();
  const subject = encodeURIComponent(`Project enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  document.querySelector('#formStatus').textContent = 'Opening your email app...';
  window.location.href = `mailto:nzaimozecy89@gmail.com?subject=${subject}&body=${body}`;
});
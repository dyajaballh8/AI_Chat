if (getSession()) {
  window.location.href = 'home.html';
}

const form = document.getElementById('signinForm');
const banner = document.getElementById('formBanner');
const submitBtn = document.getElementById('submitBtn');

const fields = {
  identifier: document.getElementById('identifier'),
  password: document.getElementById('password'),
};

const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');

const translations = {
  ar: {
    title: 'تسجيل الدخول — المساعد الذكي',
    welcome: 'أهلاً بيك تاني',
    noAccount: 'لسه معملتش حساب؟',
    signUpNow: 'اعمل واحد دلوقتي',
    identifierLabel: 'اسم المستخدم أو البريد الإلكتروني',
    identifierPlaceholder: 'sara_dev أو you@example.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: 'اكتب كلمة المرور',
    submitBtn: 'دخول',
    submitting: 'بندخل...',
    errEmptyIdentifier: 'اكتب اسم المستخدم أو البريد',
    errEmptyPassword: 'اكتب كلمة المرور',
    errCredentials: 'بيانات الدخول مش صح، تأكد من الاسم وكلمة المرور.'
  },
  en: {
    title: 'Sign In — Smart Assistant',
    welcome: 'Welcome Back',
    noAccount: "Don't have an account?",
    signUpNow: 'Sign up now',
    identifierLabel: 'Username or Email',
    identifierPlaceholder: 'sara_dev or you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    submitBtn: 'Sign In',
    submitting: 'Signing in...',
    errEmptyIdentifier: 'Please enter username or email',
    errEmptyPassword: 'Please enter password',
    errCredentials: 'Incorrect credentials, please check username/email and password.'
  }
};

function applyLanguage(lang) {
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';

  document.querySelectorAll('#langToggle .lang-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });

  const t = translations[lang];
  document.title = t.title;
  document.querySelector('.auth-card__head h2').textContent = t.welcome;
  
  const signUpP = document.querySelector('.auth-card__head p');
  signUpP.innerHTML = `${t.noAccount} <a href="signup.html">${t.signUpNow}</a>`;

  document.querySelector('label[for="identifier"]').textContent = t.identifierLabel;
  document.getElementById('identifier').placeholder = t.identifierPlaceholder;
  document.querySelector('label[for="password"]').textContent = t.passwordLabel;
  document.getElementById('password').placeholder = t.passwordPlaceholder;
  
  if (submitBtn.disabled && submitBtn.textContent !== translations.ar.submitBtn && submitBtn.textContent !== translations.en.submitBtn) {
    submitBtn.textContent = t.submitting;
  } else {
    submitBtn.textContent = t.submitBtn;
  }
}

function applyTheme(theme) {
  localStorage.setItem('theme', theme);
  const isLight = theme === 'light';
  document.documentElement.classList.toggle('light-theme', isLight);
  document.querySelector('#themeToggle .sun-icon').style.display = isLight ? 'none' : 'block';
  document.querySelector('#themeToggle .moon-icon').style.display = isLight ? 'block' : 'none';
}

langToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('.lang-btn');
  if (btn) applyLanguage(btn.dataset.lang);
});

themeToggle.addEventListener('click', () => {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// تهيئة أولية
applyLanguage(localStorage.getItem('lang') || 'ar');
applyTheme(localStorage.getItem('theme') || 'dark');

function setFieldState(name, state, message) {
  const wrap = document.getElementById(`field-${name}`);
  const hint = document.getElementById(`hint-${name}`);
  wrap.classList.remove('has-error', 'is-valid');
  if (state === 'error') wrap.classList.add('has-error');
  if (message !== undefined) hint.textContent = message;
}

function showBanner(message) {
  banner.textContent = message;
  banner.classList.add('is-visible');
}

function hideBanner() {
  banner.classList.remove('is-visible');
}

document.querySelectorAll('.toggle-pw').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    target.type = target.type === 'password' ? 'text' : 'password';
  });
});

[fields.identifier, fields.password].forEach((input) => {
  input.addEventListener('input', () => {
    hideBanner();
    setFieldState(input.id === 'identifier' ? 'identifier' : 'password', 'neutral', '');
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  hideBanner();

  const identifier = fields.identifier.value.trim();
  const password = fields.password.value;
  const lang = localStorage.getItem('lang') || 'ar';
  const t = translations[lang];

  let hasError = false;
  if (!identifier) {
    setFieldState('identifier', 'error', t.errEmptyIdentifier);
    hasError = true;
  }
  if (!password) {
    setFieldState('password', 'error', t.errEmptyPassword);
    hasError = true;
  }
  if (hasError) return;

  submitBtn.disabled = true;
  submitBtn.textContent = t.submitting;

  setTimeout(() => {
    const user = checkCredentials(identifier, password);

    if (!user) {
      showBanner(t.errCredentials);
      submitBtn.disabled = false;
      submitBtn.textContent = t.submitBtn;
      return;
    }

    setSession(user.username);
    window.location.href = 'home.html';
  }, 350);
});

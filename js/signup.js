if (getSession()) {
  window.location.href = 'home.html';
}

const form = document.getElementById('signupForm');
const banner = document.getElementById('formBanner');
const submitBtn = document.getElementById('submitBtn');

const fields = {
  username: document.getElementById('username'),
  email: document.getElementById('email'),
  password: document.getElementById('password'),
  confirm: document.getElementById('confirm'),
};

const strengthBars = document.querySelectorAll('#pwStrength i');
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');

const translations = {
  ar: {
    title: 'إنشاء حساب — المساعد الذكي',
    welcome: 'يلا نبدأ',
    haveAccount: 'عندك حساب؟',
    signInHere: 'سجّل دخول من هنا',
    usernameLabel: 'اسم المستخدم',
    usernamePlaceholder: 'مثلاً: sara_dev',
    usernameHint: 'من 3 لـ 20 حرف، من غير مسافات',
    errEmptyUsername: 'اكتب اسم المستخدم',
    errInvalidUsername: 'من 3 لـ 20 حرف، من غير مسافات أو رموز',
    errTakenUsername: 'الاسم ده مستخدم قبل كده، جرّب واحد تاني',
    validUsername: 'متاح ✓',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',
    errEmptyEmail: 'اكتب بريدك الإلكتروني',
    errInvalidEmail: 'صيغة البريد الإلكتروني مش صح',
    errTakenEmail: 'فيه حساب مسجّل بالبريد ده بالفعل',
    validEmail: 'تمام ✓',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '8 أحرف على الأقل',
    passwordHint: 'لازم تحتوي على حرف ورقم على الأقل',
    errEmptyPassword: 'اكتب كلمة مرور',
    errInvalidPassword: 'لازم 8 أحرف على الأقل، وتحتوي على حرف ورقم',
    validPassword: 'كلمة مرور قوية ✓',
    confirmLabel: 'تأكيد كلمة المرور',
    confirmPlaceholder: 'اكتب كلمة المرور تاني',
    errEmptyConfirm: 'أكّد كلمة المرور',
    errMismatchConfirm: 'كلمتا المرور مش متطابقتين',
    validConfirm: 'متطابقة ✓',
    submitBtn: 'إنشاء الحساب',
    submitting: 'بنجهزلك الحساب...',
    errValidation: 'في حقول محتاجة تعديل قبل ما نكمل.',
    successSignup: 'تم إنشاء الحساب بنجاح، بنوديك للمحادثة...'
  },
  en: {
    title: 'Sign Up — Smart Assistant',
    welcome: "Let's Get Started",
    haveAccount: 'Already have an account?',
    signInHere: 'Sign in here',
    usernameLabel: 'Username',
    usernamePlaceholder: 'e.g. sara_dev',
    usernameHint: '3 to 20 characters, no spaces',
    errEmptyUsername: 'Please enter username',
    errInvalidUsername: '3 to 20 characters, no spaces or symbols',
    errTakenUsername: 'Username is already taken, try another',
    validUsername: 'Available ✓',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@example.com',
    errEmptyEmail: 'Please enter your email',
    errInvalidEmail: 'Invalid email format',
    errTakenEmail: 'An account already exists with this email',
    validEmail: 'Looks good ✓',
    passwordLabel: 'Password',
    passwordPlaceholder: 'At least 8 characters',
    passwordHint: 'Must contain at least a letter and a number',
    errEmptyPassword: 'Please enter a password',
    errInvalidPassword: 'Must be at least 8 characters with a letter and a number',
    validPassword: 'Strong password ✓',
    confirmLabel: 'Confirm Password',
    confirmPlaceholder: 'Enter password again',
    errEmptyConfirm: 'Please confirm your password',
    errMismatchConfirm: 'Passwords do not match',
    validConfirm: 'Passwords match ✓',
    submitBtn: 'Create Account',
    submitting: 'Preparing account...',
    errValidation: 'Some fields need validation before proceeding.',
    successSignup: 'Account created successfully, redirecting to chat...'
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
  
  const signInP = document.querySelector('.auth-card__head p');
  signInP.innerHTML = `${t.haveAccount} <a href="signin.html">${t.signInHere}</a>`;

  document.querySelector('label[for="username"]').textContent = t.usernameLabel;
  document.getElementById('username').placeholder = t.usernamePlaceholder;
  
  document.querySelector('label[for="email"]').textContent = t.emailLabel;
  document.getElementById('email').placeholder = t.emailPlaceholder;

  document.querySelector('label[for="password"]').textContent = t.passwordLabel;
  document.getElementById('password').placeholder = t.passwordPlaceholder;

  document.querySelector('label[for="confirm"]').textContent = t.confirmLabel;
  document.getElementById('confirm').placeholder = t.confirmPlaceholder;

  if (submitBtn.disabled && submitBtn.textContent !== translations.ar.submitBtn && submitBtn.textContent !== translations.en.submitBtn) {
    submitBtn.textContent = t.submitting;
  } else {
    submitBtn.textContent = t.submitBtn;
  }

  // تحديث التلميحات الافتراضية للحقول الفارغة
  if (!fields.username.value) document.getElementById('hint-username').textContent = t.usernameHint;
  if (!fields.password.value) document.getElementById('hint-password').textContent = t.passwordHint;
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
  if (btn) {
    applyLanguage(btn.dataset.lang);
    // إعادة فحص الحقول لتحديث الترجمة في حالة وجود خطأ/صواب
    validateUsername();
    validateEmail();
    validatePassword();
    if (fields.confirm.value) validateConfirm();
  }
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
  if (state === 'valid') wrap.classList.add('is-valid');
  if (message !== undefined) hint.textContent = message;
}

function showBanner(message, type = 'error') {
  banner.textContent = message;
  banner.classList.add('is-visible');
  banner.classList.toggle('is-success', type === 'success');
}

function hideBanner() {
  banner.classList.remove('is-visible');
}

function validateUsername() {
  const value = fields.username.value.trim();
  const lang = localStorage.getItem('lang') || 'ar';
  const t = translations[lang];

  if (!value) {
    setFieldState('username', 'error', t.errEmptyUsername);
    return false;
  }
  if (!isValidUsername(value)) {
    setFieldState('username', 'error', t.errInvalidUsername);
    return false;
  }
  if (findUserByUsername(value)) {
    setFieldState('username', 'error', t.errTakenUsername);
    return false;
  }
  setFieldState('username', 'valid', t.validUsername);
  return true;
}

function validateEmail() {
  const value = fields.email.value.trim();
  const lang = localStorage.getItem('lang') || 'ar';
  const t = translations[lang];

  if (!value) {
    setFieldState('email', 'error', t.errEmptyEmail);
    return false;
  }
  if (!isValidEmail(value)) {
    setFieldState('email', 'error', t.errInvalidEmail);
    return false;
  }
  if (findUserByEmail(value)) {
    setFieldState('email', 'error', t.errTakenEmail);
    return false;
  }
  setFieldState('email', 'valid', t.validEmail);
  return true;
}

function updateStrengthBar(value) {
  const score = passwordScore(value);
  strengthBars.forEach((bar, i) => {
    if (i < score) {
      bar.style.background = score <= 2 ? 'var(--danger)' : score === 3 ? 'var(--accent)' : 'var(--success)';
    } else {
      bar.style.background = 'var(--border)';
    }
  });
}

function validatePassword() {
  const value = fields.password.value;
  const lang = localStorage.getItem('lang') || 'ar';
  const t = translations[lang];

  updateStrengthBar(value);
  if (!value) {
    setFieldState('password', 'error', t.errEmptyPassword);
    return false;
  }
  if (!isValidPassword(value)) {
    setFieldState('password', 'error', t.errInvalidPassword);
    return false;
  }
  setFieldState('password', 'valid', t.validPassword);
  return true;
}

function validateConfirm() {
  const value = fields.confirm.value;
  const lang = localStorage.getItem('lang') || 'ar';
  const t = translations[lang];

  if (!value) {
    setFieldState('confirm', 'error', t.errEmptyConfirm);
    return false;
  }
  if (value !== fields.password.value) {
    setFieldState('confirm', 'error', t.errMismatchConfirm);
    return false;
  }
  setFieldState('confirm', 'valid', t.validConfirm);
  return true;
}

fields.username.addEventListener('input', () => { hideBanner(); validateUsername(); });
fields.email.addEventListener('input', () => { hideBanner(); validateEmail(); });
fields.password.addEventListener('input', () => {
  hideBanner();
  validatePassword();
  if (fields.confirm.value) validateConfirm();
});
fields.confirm.addEventListener('input', () => { hideBanner(); validateConfirm(); });

document.querySelectorAll('.toggle-pw').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    target.type = target.type === 'password' ? 'text' : 'password';
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  hideBanner();

  const okUsername = validateUsername();
  const okEmail = validateEmail();
  const okPassword = validatePassword();
  const okConfirm = validateConfirm();
  const lang = localStorage.getItem('lang') || 'ar';
  const t = translations[lang];

  if (!(okUsername && okEmail && okPassword && okConfirm)) {
    showBanner(t.errValidation);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = t.submitting;

  createUser({
    username: fields.username.value.trim(),
    email: fields.email.value.trim(),
    password: fields.password.value,
  });

  setSession(fields.username.value.trim());
  showBanner(t.successSignup, 'success');
  setTimeout(() => { window.location.href = 'home.html'; }, 700);
});

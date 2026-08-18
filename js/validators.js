// دوال التحقق من البيانات المدخلة

function isValidUsername(value) {
  // اسم المستخدم: 3-20 حرف، حروف وأرقام
  return /^[a-zA-Z0-9_\u0600-\u06FF]{3,20}$/.test(value.trim());
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function passwordScore(value) {
  // حساب قوة كلمة المرور (من 0 لـ 4)
  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-zA-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^a-zA-Z0-9]/.test(value)) score++;
  return score;
}

function isValidPassword(value) {
  // كلمة المرور: 8 أحرف على الأقل تحتوي على حرف ورقم
  return value.length >= 8 && /[a-zA-Z]/.test(value) && /[0-9]/.test(value);
}

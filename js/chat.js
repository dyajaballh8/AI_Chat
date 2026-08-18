const currentUser = getCurrentUser();
if (!currentUser) {
  window.location.href = 'signin.html';
}

const DAHL_API_KEY = 'AQ.Ab8RN6I_Vo-1xkPLOBQ9b9pDsHZ9rv1sA02AlTch48dLjRy-_Q';
const DAHL_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

const AVAILABLE_MODELS = [
  { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash' },
  { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash' },
  { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash Lite' },
];

const translations = {
  ar: {
    title: 'المساعد الذكي — المحادثة',
    brandName: 'المساعد الذكي',
    newChat: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>محادثة جديدة',
    searchPlaceholder: 'دوّر في المحادثات...',
    noChats: 'لسه معملتش أي محادثة',
    noSearchResults: 'مفيش نتايج تطابق البحث',
    labelPinned: 'المثبتة',
    labelChats: 'المحادثات',
    memberSince: 'عضو من',
    connected: '<i></i>متصل',
    welcome: 'أهلاً يا',
    emptyDesc: 'المحادثة بتفتكر كل اللي بتقوله فيها، فتقدر تكمل عليه من غير ما تكرر نفسك.',
    suggestions: [
      { text: 'لخّصلي فكرة الذكاء الاصطناعي في 3 جمل', prompt: 'لخّصلي فكرة الذكاء الاصطناعي في 3 جمل بسيطة' },
      { text: 'خطة لتعلم JavaScript في شهر', prompt: 'اقترح عليا خطة لتعلم JavaScript في شهر' },
      { text: 'ساعدني في كتابة كود', prompt: 'ساعدني في كتابة كود' },
      { text: 'الفرق بين localStorage و sessionStorage', prompt: 'ايه الفرق بين localStorage و sessionStorage؟' }
    ],
    composerPlaceholder: 'اكتب رسالتك للمساعد الذكي...',
    composerNote: 'المساعد الذكي ممكن يغلط أحيانًا، راجع المعلومات المهمة قبل ما تعتمد عليها.',
    roleUser: 'إنت',
    roleAssistant: 'المساعد الذكي',
    copy: 'نسخ',
    copied: 'تم النسخ ✓',
    newChatTitle: 'محادثة جديدة',
    pinTitle: 'تثبيت المحادثة',
    unpinTitle: 'إلغاء التثبيت',
    renameTitle: 'تغيير الاسم',
    deleteTitle: 'حذف المحادثة',
    logoutTitle: 'تسجيل الخروج',
    errorTitle: 'معلش، حصل خطأ وأنا بحاول أرد عليك. اتأكد من اتصالك بالإنترنت وحاول تاني.\n\nتفاصيل تقنية: ',
    systemPrompt: 'إنتَ اسمك المساعد الذكي، مساعد ذكاء اصطناعي يتحدث العربية والإنجليزية بطلاقة. ردودك يجب أن تكون واضحة ومباشرة ومفيدة وبنفس لغة المستخدم.'
  },
  en: {
    title: 'Smart Assistant — Chat',
    brandName: 'Smart Assistant',
    newChat: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>New Chat',
    searchPlaceholder: 'Search chats...',
    noChats: 'No conversations yet',
    noSearchResults: 'No matches found',
    labelPinned: 'Pinned',
    labelChats: 'Conversations',
    memberSince: 'Member since',
    connected: '<i></i>Connected',
    welcome: 'Hello,',
    emptyDesc: 'The conversation remembers everything you say, so you can follow up without repeating yourself.',
    suggestions: [
      { text: 'Summarize AI in 3 sentences', prompt: 'Summarize the concept of AI in 3 simple sentences' },
      { text: 'JavaScript study plan in a month', prompt: 'Suggest a plan to learn JavaScript in a month' },
      { text: 'Help me write code', prompt: 'Help me write code' },
      { text: 'localStorage vs sessionStorage', prompt: 'What is the difference between localStorage and sessionStorage?' }
    ],
    composerPlaceholder: 'Type your message to Smart Assistant...',
    composerNote: 'Smart Assistant can make mistakes, verify important info.',
    roleUser: 'You',
    roleAssistant: 'Smart Assistant',
    copy: 'Copy',
    copied: 'Copied ✓',
    newChatTitle: 'New Chat',
    pinTitle: 'Pin Chat',
    unpinTitle: 'Unpin Chat',
    renameTitle: 'Rename Chat',
    deleteTitle: 'Delete Chat',
    logoutTitle: 'Log Out',
    errorTitle: 'Sorry, an error occurred while trying to respond. Please check your connection and try again.\n\nTechnical details: ',
    systemPrompt: 'You are the Smart Assistant, a helpful AI assistant who speaks Arabic and English fluently. Your responses must be clear, direct, and useful, written in the same language as the user.'
  }
};

const chatScroll = document.getElementById('chatScroll');
const chatInner = document.getElementById('chatInner');
const emptyState = document.getElementById('emptyState');
const emptyStateTitle = document.getElementById('emptyStateWelcome');
const threadList = document.getElementById('threadList');
const threadSearch = document.getElementById('threadSearch');
const threadTitleEl = document.getElementById('threadTitle');
const composerForm = document.getElementById('composerForm');
const composerInput = document.getElementById('composerInput');
const sendBtn = document.getElementById('sendBtn');
const newChatBtn = document.getElementById('newChatBtn');
const logoutBtn = document.getElementById('logoutBtn');
const modelSelect = document.getElementById('modelSelect');
const langToggle = document.getElementById('langToggle');
const themeToggle = document.getElementById('themeToggle');

let threads = getThreads(currentUser.username);
let activeThreadId = threads.length ? threads[0].id : null;
let searchQuery = '';

document.getElementById('userAvatar').textContent = currentUser.username.charAt(0).toUpperCase();
document.getElementById('userName').textContent = currentUser.username;
document.getElementById('userMail').textContent = currentUser.email;

const MODEL_KEY = `sa_model_${currentUser.username}`;

function getSelectedModel() {
  const saved = localStorage.getItem(MODEL_KEY);
  if (saved && AVAILABLE_MODELS.some(m => m.id === saved)) {
    return saved;
  }
  return AVAILABLE_MODELS[0].id;
}

function setSelectedModel(modelId) {
  localStorage.setItem(MODEL_KEY, modelId);
}

AVAILABLE_MODELS.forEach((model) => {
  const opt = document.createElement('option');
  opt.value = model.id;
  opt.textContent = model.label;
  modelSelect.appendChild(opt);
});
modelSelect.value = getSelectedModel();
modelSelect.addEventListener('change', () => setSelectedModel(modelSelect.value));

function applyLanguage(lang) {
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';

  document.querySelectorAll('#langToggle .lang-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });

  const t = translations[lang];
  document.title = t.title;
  document.getElementById('sidebarBrandName').textContent = t.brandName;
  newChatBtn.innerHTML = t.newChat;
  threadSearch.placeholder = t.searchPlaceholder;
  document.getElementById('statusPill').innerHTML = t.connected;
  emptyStateTitle.textContent = `${t.welcome} ${currentUser.username} 👋`;
  document.getElementById('emptyStateDesc').textContent = t.emptyDesc;

  // تحديث الاقتراحات
  const grid = document.querySelector('.suggestion-grid');
  grid.innerHTML = '';
  t.suggestions.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'suggestion-chip';
    btn.textContent = item.text;
    btn.dataset.prompt = item.prompt;
    btn.addEventListener('click', () => {
      composerInput.value = item.prompt;
      sendBtn.disabled = false;
      composerInput.focus();
      autoResize();
    });
    grid.appendChild(btn);
  });

  composerInput.placeholder = t.composerPlaceholder;
  document.getElementById('composerNote').textContent = t.composerNote;
  logoutBtn.title = t.logoutTitle;
  logoutBtn.setAttribute('aria-label', t.logoutTitle);

  const memberSinceStr = new Date(currentUser.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', {
    year: 'numeric',
    month: 'long',
  });
  document.getElementById('userName').title = `${t.memberSince} ${memberSinceStr}`;

  renderSidebar();
  renderMessages();
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

function persistThreads() {
  saveThreads(currentUser.username, threads);
}

function getActiveThread() {
  return threads.find((t) => t.id === activeThreadId) || null;
}

function createThread() {
  const lang = localStorage.getItem('lang') || 'ar';
  const t = translations[lang];
  const thread = {
    id: `t_${Date.now()}`,
    title: t.newChatTitle,
    messages: [],
    pinned: false,
    updatedAt: Date.now(),
  };
  threads.unshift(thread);
  activeThreadId = thread.id;
  persistThreads();
  renderSidebar();
  renderMessages();
}

function selectThread(id) {
  activeThreadId = id;
  renderSidebar();
  renderMessages();
}

function deleteThread(id, evt) {
  evt.stopPropagation();
  threads = threads.filter((t) => t.id !== id);
  persistThreads();
  if (activeThreadId === id) {
    activeThreadId = threads.length ? threads[0].id : null;
  }
  renderSidebar();
  renderMessages();
}

function togglePin(id, evt) {
  evt.stopPropagation();
  const thread = threads.find((t) => t.id === id);
  if (thread) thread.pinned = !thread.pinned;
  persistThreads();
  renderSidebar();
}

function startRename(id, evt) {
  evt.stopPropagation();
  renderSidebar(id);
}

function commitRename(id, newTitle) {
  const thread = threads.find((t) => t.id === id);
  if (thread) {
    const trimmed = newTitle.trim();
    thread.title = trimmed || thread.title;
  }
  persistThreads();
  renderSidebar();
  if (id === activeThreadId) threadTitleEl.textContent = getActiveThread().title;
}

function renderSidebar(renamingId = null) {
  threadList.innerHTML = '';
  const lang = localStorage.getItem('lang') || 'ar';
  const t = translations[lang];

  const query = searchQuery.trim().toLowerCase();
  const filtered = threads.filter((t) => t.title.toLowerCase().includes(query));
  const pinned = filtered.filter((t) => t.pinned);
  const others = filtered.filter((t) => !t.pinned);

  if (threads.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'thread-list__empty';
    empty.textContent = t.noChats;
    threadList.appendChild(empty);
    return;
  }

  if (filtered.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'thread-list__empty';
    empty.textContent = t.noSearchResults;
    threadList.appendChild(empty);
    return;
  }

  function buildSection(label, list) {
    if (list.length === 0) return;
    const heading = document.createElement('p');
    heading.className = 'thread-list__label';
    heading.textContent = label;
    threadList.appendChild(heading);
    list.forEach((thread) => threadList.appendChild(buildThreadItem(thread)));
  }

  function buildThreadItem(thread) {
    const item = document.createElement('div');
    item.className = 'thread-item' + (thread.id === activeThreadId ? ' is-active' : '') + (thread.pinned ? ' is-pinned' : '');
    if (renamingId !== thread.id) {
      item.addEventListener('click', () => selectThread(thread.id));
    }

    const pinIcon = document.createElement('span');
    pinIcon.className = 'pin-icon';
    pinIcon.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.5 5.5L19 9l-4.5 3.5L16 18l-4-3-4 3 1.5-5.5L5 9l5.5-1.5z"/></svg>';
    item.appendChild(pinIcon);

    if (renamingId === thread.id) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'thread-rename-input';
      input.value = thread.title;
      input.addEventListener('click', (e) => e.stopPropagation());
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') input.blur();
        if (e.key === 'Escape') renderSidebar();
      });
      input.addEventListener('blur', () => commitRename(thread.id, input.value));
      item.appendChild(input);
      setTimeout(() => { input.focus(); input.select(); }, 0);
    } else {
      const span = document.createElement('span');
      span.className = 'thread-name';
      span.textContent = thread.title;
      item.appendChild(span);

      const actions = document.createElement('div');
      actions.className = 'thread-item__actions';

      const pinBtn = document.createElement('button');
      pinBtn.type = 'button';
      pinBtn.className = thread.pinned ? 'is-active-toggle' : '';
      pinBtn.setAttribute('aria-label', thread.pinned ? t.unpinTitle : t.pinTitle);
      pinBtn.title = thread.pinned ? t.unpinTitle : t.pinTitle;
      pinBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l1.5 5.5L19 9l-4.5 3.5L16 18l-4-3-4 3 1.5-5.5L5 9l5.5-1.5z"/></svg>';
      pinBtn.addEventListener('click', (e) => togglePin(thread.id, e));

      const renameBtn = document.createElement('button');
      renameBtn.type = 'button';
      renameBtn.setAttribute('aria-label', t.renameTitle);
      renameBtn.title = t.renameTitle;
      renameBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
      renameBtn.addEventListener('click', (e) => startRename(thread.id, e));

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'thread-del';
      delBtn.setAttribute('aria-label', t.deleteTitle);
      delBtn.title = t.deleteTitle;
      delBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>';
      delBtn.addEventListener('click', (e) => deleteThread(thread.id, e));

      actions.appendChild(pinBtn);
      actions.appendChild(renameBtn);
      actions.appendChild(delBtn);
      item.appendChild(actions);
    }

    return item;
  }

  buildSection(t.labelPinned, pinned);
  buildSection(others.length ? `${t.labelChats} (${others.length})` : t.labelChats, others);
}

threadSearch.addEventListener('input', () => {
  searchQuery = threadSearch.value;
  renderSidebar();
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderMessages() {
  const thread = getActiveThread();
  const lang = localStorage.getItem('lang') || 'ar';
  const t = translations[lang];
  chatInner.innerHTML = '';

  if (!thread || thread.messages.length === 0) {
    emptyState.style.display = 'block';
    threadTitleEl.textContent = t.newChatTitle;
    return;
  }

  emptyState.style.display = 'none';
  threadTitleEl.textContent = thread.title;

  thread.messages.forEach((msg) => appendMessageEl(msg.role, msg.content, false, msg.time));
  scrollToBottom();
}

function formatTime(timestamp) {
  const lang = localStorage.getItem('lang') || 'ar';
  return new Date(timestamp || Date.now()).toLocaleTimeString(lang === 'en' ? 'en-US' : 'ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function appendMessageEl(role, content, isError = false, time = Date.now()) {
  const lang = localStorage.getItem('lang') || 'ar';
  const t = translations[lang];

  const wrap = document.createElement('div');
  wrap.className = `msg msg--${role}` + (isError ? ' msg--error' : '');

  const avatar = document.createElement('div');
  avatar.className = 'msg__avatar';
  avatar.textContent = role === 'user' ? currentUser.username.charAt(0).toUpperCase() : '✦';

  const body = document.createElement('div');
  body.className = 'msg__body';

  const roleLabel = document.createElement('div');
  roleLabel.className = 'msg__role';
  roleLabel.textContent = role === 'user' ? t.roleUser : t.roleAssistant;

  const textEl = document.createElement('div');
  textEl.className = 'msg__text';
  textEl.setAttribute('dir', 'auto');
  textEl.innerHTML = escapeHtml(content);

  const meta = document.createElement('div');
  meta.className = 'msg__meta';

  const timeEl = document.createElement('span');
  timeEl.className = 'msg__time';
  timeEl.textContent = formatTime(time);
  meta.appendChild(timeEl);

  if (role === 'assistant' && !isError) {
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = t.copy;
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(content).then(() => {
        copyBtn.textContent = t.copied;
        setTimeout(() => { copyBtn.textContent = t.copy; }, 1500);
      });
    });
    meta.appendChild(copyBtn);
  }

  body.appendChild(roleLabel);
  body.appendChild(textEl);
  body.appendChild(meta);
  wrap.appendChild(avatar);
  wrap.appendChild(body);
  chatInner.appendChild(wrap);

  return wrap;
}

function scrollToBottom() {
  chatScroll.scrollTop = chatScroll.scrollHeight;
}

async function callDahl(messages) {
  const lang = localStorage.getItem('lang') || 'ar';
  const t = translations[lang];
  const cleanMessages = messages.map(({ role, content }) => ({ role, content }));

  const payload = {
    model: getSelectedModel(),
    messages: [{ role: 'system', content: t.systemPrompt }, ...cleanMessages],
  };

  const res = await fetch(DAHL_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DAHL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Dahl API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content;
  if (!reply) throw new Error('الرد جه فاضي من الـ API');
  return reply;
}

async function sendMessage(text) {
  const lang = localStorage.getItem('lang') || 'ar';
  const t = translations[lang];

  let thread = getActiveThread();
  if (!thread) {
    createThread();
    thread = getActiveThread();
  }

  emptyState.style.display = 'none';

  const userTime = Date.now();
  thread.messages.push({ role: 'user', content: text, time: userTime });
  if (thread.messages.length === 1) {
    thread.title = text.length > 32 ? text.slice(0, 32) + '…' : text;
  }
  thread.updatedAt = Date.now();
  persistThreads();
  renderSidebar();
  threadTitleEl.textContent = thread.title;

  appendMessageEl('user', text, false, userTime);
  scrollToBottom();

  const typingWrap = document.createElement('div');
  typingWrap.className = 'msg msg--ai';
  typingWrap.innerHTML =
    `<div class="msg__avatar">✦</div>` +
    `<div class="msg__body"><div class="msg__role">${t.roleAssistant}</div>` +
    `<div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  chatInner.appendChild(typingWrap);
  scrollToBottom();

  try {
    const reply = await callDahl(thread.messages);
    typingWrap.remove();
    const replyTime = Date.now();
    thread.messages.push({ role: 'assistant', content: reply, time: replyTime });
    persistThreads();
    appendMessageEl('assistant', reply, false, replyTime);
  } catch (err) {
    typingWrap.remove();
    appendMessageEl(
      'assistant',
      t.errorTitle + `${err.message}`,
      true
    );
    console.error(err);
  }

  scrollToBottom();
}

function autoResize() {
  composerInput.style.height = 'auto';
  composerInput.style.height = Math.min(composerInput.scrollHeight, 160) + 'px';
}

composerInput.addEventListener('input', () => {
  sendBtn.disabled = composerInput.value.trim().length === 0;
  autoResize();
});

composerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    composerForm.requestSubmit();
  }
});

composerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = composerInput.value.trim();
  if (!text) return;
  composerInput.value = '';
  sendBtn.disabled = true;
  autoResize();
  sendMessage(text);
});

newChatBtn.addEventListener('click', createThread);

logoutBtn.addEventListener('click', () => {
  clearSession();
  window.location.href = 'signin.html';
});

// تهيئة أولية
applyLanguage(localStorage.getItem('lang') || 'ar');
applyTheme(localStorage.getItem('theme') || 'dark');

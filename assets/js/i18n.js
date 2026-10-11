/* About bilingual content is compiled from _data/about_{en,zh}.yml by Jekyll.
   JavaScript only switches already-built text; it does not contain translations.
   Blog, Vibe Coding, Coursework and CV stay English-only. */
(() => {
  'use strict';
  const about = document.body.classList.contains('page-about');
  const dataElement = document.getElementById('yw-about-translations');
  let translations = null;
  if (about && dataElement) {
    try { translations = JSON.parse(dataElement.textContent); }
    catch (error) { console.error('About language data is invalid:', error); }
  }
  let language = 'en';
  const buttons = [...document.querySelectorAll('.language-switch button[data-lang]')];

  function valueAt(data, path) {
    return path.split('.').reduce((value, part) => value == null ? undefined : value[part], data);
  }
  function setLanguage(requested) {
    language = about && translations && requested === 'zh' ? 'zh' : 'en';
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    if (about && translations) {
      const strings = translations[language];
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const value = valueAt(strings, element.dataset.i18n);
        if (typeof value === 'string') element.textContent = value;
      });
      for (const attribute of ['aria-label','title']) {
        document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
          const key = element.getAttribute(`data-i18n-${attribute}`);
          const value = valueAt(strings, key);
          if (typeof value === 'string') element.setAttribute(attribute, value);
        });
      }
      document.title = strings.page_title;
      try { localStorage.setItem('yw-studio-lang',language); } catch (_) {}
    }
    const x = document.querySelector('.social-x');
    const zhihu = document.querySelector('.social-zh');
    if (x) x.hidden = language === 'zh';
    if (zhihu) zhihu.hidden = language !== 'zh';
    buttons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.lang === language)));
    window.dispatchEvent(new CustomEvent('yw:locale',{detail:{lang:language}}));
  }

  window.YouthyLocale = { get: () => language, set: setLanguage };
  buttons.forEach(button => button.addEventListener('click', () => {
    if (button.dataset.lang === 'zh' && !about) {
      try { localStorage.setItem('yw-studio-lang','zh'); } catch (_) {}
      window.location.href = document.querySelector('.wordmark').getAttribute('href');
    } else setLanguage(button.dataset.lang);
  }));
  let preference = null;
  try { preference = localStorage.getItem('yw-studio-lang'); } catch (_) {}
  setLanguage(about && preference === 'zh' ? 'zh' : 'en');
})();

/* Language selection and the static page shell. Content is authored in both languages. */
(() => {
  'use strict';
  const preferenceKey = 'iceland-winter-2026-language';
  const requested = new URLSearchParams(window.location.search).get('lang');
  let saved = null;
  try { saved = localStorage.getItem(preferenceKey); } catch {}
  const language = ['zh', 'en'].includes(requested) ? requested : saved === 'en' ? 'en' : 'zh';
  window.ICELAND_LANG = language;
  if (['zh', 'en'].includes(requested)) {
    try { localStorage.setItem(preferenceKey, language); } catch {}
  }
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  document.documentElement.dataset.language = language;
  document.title = language === 'en'
    ? 'Iceland Winter Map · 5–12 December 2026'
    : '冰岛冬行地图 · 2026.12.05–12';
  if (language === 'en') {
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'A complete Iceland winter road-trip guide for 5–12 December 2026. Explore daily routes, sights, five accommodation bases, optional stops and winter access on an interactive map.');
    for (const element of document.querySelectorAll('[data-en]')) element.textContent = element.dataset.en;
    for (const attribute of ['aria-label', 'placeholder', 'title']) {
      for (const element of document.querySelectorAll(`[data-en-${attribute}]`)) {
        element.setAttribute(attribute, element.getAttribute(`data-en-${attribute}`));
      }
    }
  }
  const toggle = document.getElementById('language-toggle');
  if (toggle) {
    toggle.textContent = language === 'en' ? '中文' : 'English';
    toggle.lang = language === 'en' ? 'zh-CN' : 'en';
    toggle.setAttribute('aria-label', language === 'en' ? 'Switch to Chinese' : 'Switch to English');
    toggle.title = language === 'en' ? '切换为中文' : 'Switch to English';
  }
})();

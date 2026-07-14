import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './en.json'
import vi from './vi.json'

export const SUPPORTED_LANGUAGES = ['en', 'vi'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

const STORAGE_KEY = 'store.language'

function getInitialLanguage(): Language {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'en' || saved === 'vi') return saved
  const browser = navigator.language.toLowerCase()
  if (browser.startsWith('vi')) return 'vi'
  return 'en'
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export function setLanguage(lang: Language): void {
  localStorage.setItem(STORAGE_KEY, lang)
  void i18n.changeLanguage(lang)
  document.documentElement.lang = lang
}

export default i18n
import 'server-only'

const dictionaries = {
    de: () => import('./dictionaries/de.json').then((module) => module.default),
    en: () => import('./dictionaries/en.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'de' | 'en') => dictionaries[locale]()

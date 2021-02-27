import LocalizedStrings from 'react-localization';
import * as en from './translations/en.json'
import * as pl from './translations/pl.json'
import * as de from './translations/de.json'
import * as it from './translations/it.json'
import * as ru from './translations/ru.json'
import * as es from './translations/es.json'
import * as pt from './translations/pt.json'
import * as cn from './translations/cn.json'
import * as fr from './translations/fr.json'
const strings = new LocalizedStrings({
    en: en,
    pl: pl,
    de: de,
    it: it,
    ru: ru,
    es: es,
    pt: pt,
    cn: cn,
    fr: fr
});

export default strings;

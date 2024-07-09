import i18next from 'i18next';
import { createI18nStore } from 'svelte-i18next';
import { en } from './lang_en';

i18next.init({
	lng: 'en',
	resources: {
		en
	}
});

export const i18n = createI18nStore(i18next);

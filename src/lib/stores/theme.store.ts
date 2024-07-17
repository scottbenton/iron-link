import { writable } from 'svelte/store';

export enum ThemeType {
	Light = 'light',
	Dark = 'dark'
}

export const themeStore = writable<{ type: ThemeType | undefined }>({ type: undefined });

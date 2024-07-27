import { writable } from 'svelte/store';

export enum ThemeType {
	Light = 'light',
	Dark = 'dark'
}

export enum ColorScheme {
	Default = 'default',
	Cinder = 'cinder',
	Eidolon = 'eidolon',
	Hinterlands = 'hinterlands',
	Myriad = 'myriad',
	Mystic = 'mystic'
}

export const colorSchemes: ColorScheme[] = [
	ColorScheme.Default,
	ColorScheme.Cinder,
	ColorScheme.Eidolon,
	ColorScheme.Hinterlands,
	ColorScheme.Myriad,
	ColorScheme.Mystic
];

export const themeStore = writable<{ type: ThemeType | undefined; colorScheme: ColorScheme }>({
	type: undefined,
	colorScheme: ColorScheme.Default
});

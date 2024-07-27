import { writable } from 'svelte/store';

export const sidebarStore = writable({
	left: false,
	right: false
});

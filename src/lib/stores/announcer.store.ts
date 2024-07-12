import { writable } from 'svelte/store';

export const announcer = writable<string | null>(null);

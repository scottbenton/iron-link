import { writable } from 'svelte/store';

interface IConfirmationDialogState {
	title: string;
	message: string;
	actions: {
		label: string;
		variant?: 'primary-gradient' | 'primary' | 'secondary' | 'text';
		isDanger?: boolean;
		onClick: (closeDialog: () => void) => void;
	}[];
}
interface IConfirmationDialogStore {
	isOpen: boolean;
	state?: IConfirmationDialogState;
}

export const confirmationDialogStore = writable<IConfirmationDialogStore>({
	isOpen: false
});

export function openConfirmationDialog(state: IConfirmationDialogState) {
	confirmationDialogStore.update((store) => {
		store.isOpen = true;
		store.state = state;
		return store;
	});
}
export function closeDialog() {
	confirmationDialogStore.update((store) => {
		store.isOpen = false;
		return store;
	});
}

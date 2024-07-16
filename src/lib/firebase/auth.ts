import {
	onAuthStateChanged,
	signInAnonymously,
	signOut as signOutFirebase,
	sendSignInLinkToEmail as sendSignInLinkToEmailFirebase,
	signInWithEmailLink,
	isSignInWithEmailLink,
	signInWithPopup,
	GoogleAuthProvider,
	linkWithRedirect,
	linkWithPopup,
	linkWithCredential,
	EmailAuthProvider
} from 'firebase/auth';
import { auth } from './config';
import { writable } from 'svelte/store';
import { initDB } from '$lib/db';

export const authStore = writable<{
	user?: { uid: string; isAnonymous: boolean };
	loading: boolean;
	error?: string;
}>({
	loading: true
});

export function listenToAuth() {
	onAuthStateChanged(
		auth,
		(user) => {
			initDB(user?.uid);
			if (user) {
				authStore.update((store) => {
					store.user = { uid: user.uid, isAnonymous: user.isAnonymous };
					store.loading = false;
					store.error = undefined;
					return store;
				});
			} else {
				authStore.update((store) => {
					store.user = undefined;
					store.loading = false;
					store.error = undefined;
					return store;
				});
			}
		},
		(error) => {
			console.error(error);
			authStore.update((store) => {
				store.loading = false;
				store.error = error.message;
				return store;
			});
		}
	);
}

const googleAuthProvider = new GoogleAuthProvider();
export function signInWithGoogle() {
	return signInWithPopup(auth, googleAuthProvider);
}

export function createGuestAccount() {
	return signInAnonymously(auth);
}
export function sendSignInLinkToEmail(email: string) {
	return new Promise((resolve, reject) => {
		const actionCodeSettings = {
			url: window.location.origin + '/login',
			handleCodeInApp: true
		};

		sendSignInLinkToEmailFirebase(auth, email, actionCodeSettings)
			.then(() => {
				window.localStorage.setItem('auth-email', email);
				resolve(true);
			})
			.catch((error) => {
				console.error(error);
				reject(error);
			});
	});
}

export function completeMagicLinkSignupIfPresent(): Promise<boolean> {
	return new Promise((resolve, reject) => {
		if (isSignInWithEmailLink(auth, window.location.href)) {
			// Additional state parameters can also be passed via URL.
			// This can be used to continue the user's intended action before triggering
			// the sign-in operation.
			// Get the email if available. This should be available if the user completes
			// the flow on the same device where they started it.
			let email = window.localStorage.getItem('auth-email');
			let isLinkingAccount = !!window.localStorage.getItem('auth-link-account');
			if (!email) {
				// User opened the link on a different device. To prevent session fixation
				// attacks, ask the user to provide the associated email again. For example:
				email = window.prompt('Please provide your email for confirmation');
			}
			if (email) {
				const promise =
					isLinkingAccount && auth.currentUser
						? linkWithCredential(
								auth.currentUser,
								EmailAuthProvider.credentialWithLink(email, window.location.href)
							)
						: signInWithEmailLink(auth, email, window.location.href);
				promise
					.then(() => {
						// Clear email from storage.
						window.localStorage.removeItem('auth-email');
						resolve(true);
					})
					.catch((error) => {
						console.error(error);
						reject();
					});
			} else {
				reject('Failed to get your email for sign in.');
			}
		} else {
			resolve(true);
		}
	});
}
export function linkGoogleAccount() {
	if (auth.currentUser === null) {
		return Promise.reject('No user is signed in.');
	}
	return linkWithPopup(auth.currentUser, googleAuthProvider);
}
export function linkEmailAccount(email: string) {
	return new Promise((resolve, reject) => {
		const actionCodeSettings = {
			url: window.location.origin + '/login',
			handleCodeInApp: true
		};

		sendSignInLinkToEmailFirebase(auth, email, actionCodeSettings)
			.then(() => {
				window.localStorage.setItem('auth-email', email);
				window.localStorage.setItem('auth-link-account', 'true');
				resolve(true);
			})
			.catch((error) => {
				console.error(error);
				reject(error);
			});
	});
}

export function signOut() {
	signOutFirebase(auth).catch((error) => {
		console.error(error);
	});
}

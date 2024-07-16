<script lang="ts">
	import {
		authStore,
		createGuestAccount,
		sendSignInLinkToEmail,
		signInWithGoogle
	} from '$lib/firebase/auth';
	import PageLayout from './PageLayout.svelte';
	import { Breakpoints } from '$types/breakpoints';
	import Alert from '$components/common/Alert.svelte';
	import Button from '$components/common/Button.svelte';
	import TextInput from '$components/common/Input/TextInput.svelte';
	import EmailIcon from 'virtual:icons/tabler/mail-opened';
	import EmailSentIcon from 'virtual:icons/tabler/check';
	import GoogleLogo from '$assets/GoogleLogo.svelte';
	import { i18n } from '$lib/i18n';
	import Divider from '$components/common/Divider.svelte';
	import { announcer } from '$lib/stores/announcer.store';
	import { dbStore } from '$lib/db';

	$: googleLoginLoading = false;
	$: googleLoginErrorMessage = undefined as undefined | string;
	const handleGoogleLogin = () => {
		googleLoginLoading = true;
		googleLoginErrorMessage = undefined;
		signInWithGoogle()
			.then(() => {
				googleLoginErrorMessage = undefined;
				googleLoginLoading = false;
			})
			.catch((err) => {
				console.error(err);
				googleLoginErrorMessage = $i18n.t('login.googleLoginError');
				googleLoginLoading = false;
			});
	};

	$: email = '';
	$: emailLoading = false;
	$: emailErrorMessage = undefined as undefined | string;
	$: signInLinkSent = false;
	const handleEmailLogin = () => {
		emailLoading = true;
		emailErrorMessage = undefined;
		sendSignInLinkToEmail(email)
			.then(() => {
				emailErrorMessage = undefined;
				emailLoading = false;
				signInLinkSent = true;
				$announcer = $i18n.t('login.emailButtonSent');
			})
			.catch((err) => {
				console.error(err);
				emailErrorMessage = $i18n.t('login.emailError');
				emailLoading = false;
			});
	};

	$: anonymousAccountCreationLoading = false;
	$: anonymousAccountCreationErrorMessage = undefined as undefined | string;
	const handleAnonymousAccountCreation = () => {
		anonymousAccountCreationLoading = true;
		anonymousAccountCreationErrorMessage = undefined;
		createGuestAccount()
			.then(() => {
				anonymousAccountCreationErrorMessage = undefined;
				anonymousAccountCreationLoading = false;
			})
			.catch((err) => {
				console.error(err);
				anonymousAccountCreationErrorMessage = $i18n.t('login.skipAccountError');
				anonymousAccountCreationLoading = false;
			});
	};

	$: signInLoading = anonymousAccountCreationLoading || emailLoading || googleLoginLoading;
</script>

{#if $authStore.loading}
	<!-- TODO - add a loading bar? -->
{:else if $authStore.error}
	<p>{$authStore.error}</p>
{:else if $authStore.user}
	<slot />
{:else}
	<PageLayout maxWidth={Breakpoints.sm}>
		<h1 class="text-2xl font-title" slot="header">{$i18n.t('login.title')}</h1>
		<div class="stack">
			<Button variant="secondary" disabled={signInLoading} onClick={handleGoogleLogin}>
				{$i18n.t('login.googleLogin')}
				<svelte:fragment slot="endIcon"><GoogleLogo /></svelte:fragment>
			</Button>
			{#if googleLoginErrorMessage}<Alert type="error">{googleLoginErrorMessage}</Alert>{/if}
		</div>
		<Divider>
			{$i18n.t('login.or')}
		</Divider>
		<form class="stack" on:submit|preventDefault={(evt) => handleEmailLogin()}>
			<TextInput
				error={!!emailErrorMessage}
				helperText={emailErrorMessage}
				label={$i18n.t('login.emailLoginInputLabel')}
				id="email"
				bind:value={email}
			/>
			<Button type="submit" variant="secondary" disabled={signInLoading || signInLinkSent}>
				{$i18n.t(signInLinkSent ? 'login.emailButtonSent' : 'login.emailButton')}
				<svelte:fragment slot="endIcon"
					>{#if signInLinkSent}<EmailSentIcon />{:else}<EmailIcon />{/if}</svelte:fragment
				>
			</Button>
		</form>
		<!-- <Divider>
			{$i18n.t('login.or')}
		</Divider>
		<div class="stack">
			<Button variant="secondary" disabled={signInLoading} onClick={handleAnonymousAccountCreation}>
				{$i18n.t('login.skipAccountButton')}
				<svelte:fragment slot="endIcon"><WarningIcon /></svelte:fragment>
			</Button>
			<Alert type="warning">
				{$i18n.t('login.skipAccountCreationWarning')}
			</Alert>
		</div> -->
	</PageLayout>
{/if}

<style lang="scss">
	h2 {
		color: $text-secondary;
	}
	.stack {
		display: flex;
		flex-direction: column;
		gap: $space-4;
		align-items: flex-start;
	}
</style>

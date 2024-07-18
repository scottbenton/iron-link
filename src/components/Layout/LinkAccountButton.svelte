<script lang="ts">
	import LinkAccountIcon from 'virtual:icons/tabler/refresh-off';
	import { authStore, linkEmailAccount, linkGoogleAccount } from '$lib/firebase/auth';
	import IconButton from '$components/IconButton.svelte';
	import { i18n } from '$lib/i18n';
	import Dialog from '$components/common/Dialog/Dialog.svelte';
	import Button from '$components/common/Button.svelte';
	import GoogleLogo from '$assets/GoogleLogo.svelte';
	import Alert from '$components/common/Alert.svelte';
	import Divider from '$components/common/Divider.svelte';
	import EmailIcon from 'virtual:icons/tabler/mail-opened';
	import TextInput from '$components/common/Input/TextInput.svelte';

	$: user = $authStore.user;
	$: isAnonymous = user?.isAnonymous;

	$: googleLoginLoading = false;
	$: googleLoginErrorMessage = undefined as undefined | string;
	const handleGoogleLogin = () => {
		googleLoginLoading = true;
		googleLoginErrorMessage = undefined;
		linkGoogleAccount()
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
	const handleEmailLogin = () => {
		emailLoading = true;
		emailErrorMessage = undefined;
		linkEmailAccount(email)
			.then(() => {
				emailErrorMessage = undefined;
				emailLoading = false;
			})
			.catch((err) => {
				console.error(err);
				emailErrorMessage = $i18n.t('login.emailError');
				emailLoading = false;
			});
	};

	$: signInLoading = googleLoginLoading || emailLoading;
</script>

{#if isAnonymous}
	<Dialog title={$i18n.t('settingsMenu.linkAccount')}>
		<svelte:fragment slot="trigger" let:trigger>
			<IconButton meltAction={trigger} label={$i18n.t('settingsMenu.linkAccount')}>
				<LinkAccountIcon font-size="1.25rem" />
			</IconButton>
		</svelte:fragment>
		<div class="stack">
			<Alert type="info">
				{$i18n.t('login.skipAccountLinkInfo')}
			</Alert>
			<Button variant="secondary" disabled={signInLoading} onClick={handleGoogleLogin}>
				{$i18n.t('login.googleLogin')}
				<svelte:fragment slot="endIcon"><GoogleLogo /></svelte:fragment>
			</Button>
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
			<Button type="submit" variant="secondary" disabled={signInLoading}>
				{$i18n.t('login.emailButton')}
				<svelte:fragment slot="endIcon"><EmailIcon /></svelte:fragment>
			</Button>
		</form>
	</Dialog>
{/if}

<style lang="scss">
	.stack {
		display: flex;
		flex-direction: column;
		gap: $space-4;
		align-items: flex-start;
	}
	.menu {
		z-index: 40;
		display: flex;
		flex-direction: column;
		border-radius: $border-radius;
		background-color: $background-default;
		border: 1px solid $divider;
		padding: $space-2 0;

		.item {
			display: flex;
			align-items: center;
			padding: $space-2 $space-4;
			color: $text-secondary;
			min-width: 12rem;

			cursor: pointer;

			&[data-highlighted] {
				background-color: $gray-200;
			}

			.item-icon {
				color: $text-tertiary;
				margin-right: $space-4;
			}
		}
	}
</style>

<script lang="ts">
	import Menu from '$components/common/Menu/Menu.svelte';
	import MenuItem from '$components/common/Menu/MenuItem.svelte';
	import IconButton from '$components/IconButton.svelte';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';
	import type { RxDocument } from 'rxdb';
	import EditIcon from 'virtual:icons/tabler/user-cog';
	import CharacterPortraitDialog from './CharacterPortraitDialog.svelte';

	export let character: RxDocument<CharacterType>;

	$: portraitDialogOpen = false;
</script>

<Menu>
	<svelte:fragment slot="trigger" let:trigger>
		<IconButton label={$i18n.t('characterSheet.characterSettingsButtonLabel')} meltAction={trigger}
			><EditIcon font-size={'1.25rem'} /></IconButton
		>
	</svelte:fragment>
	<svelte:fragment slot="menu-items" let:item>
		<MenuItem
			meltItem={item}
			onClick={() => {
				portraitDialogOpen = true;
			}}>Change Portrait</MenuItem
		>
		<MenuItem meltItem={item} onClick={() => {}}>Edit Basic Info</MenuItem>
		<MenuItem meltItem={item} onClick={() => {}}>Edit Stats</MenuItem>
		<MenuItem meltItem={item} onClick={() => {}}>Choose Rulesets</MenuItem>
	</svelte:fragment>
</Menu>

<CharacterPortraitDialog {character} bind:open={portraitDialogOpen} />

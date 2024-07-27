<script lang="ts">
	import Menu from '$components/common/Menu/Menu.svelte';
	import MenuItem from '$components/common/Menu/MenuItem.svelte';
	import IconButton from '$components/IconButton.svelte';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';
	import type { RxDocument } from 'rxdb';
	import EditIcon from 'virtual:icons/tabler/user-cog';
	import CharacterPortraitDialog from './CharacterPortraitDialog.svelte';
	import CharacterDetailsDialog from './CharacterDetailsDialog.svelte';
	import CharacterStatsDialog from './CharacterStatsDialog.svelte';
	import CharacterRulesetsDialog from './CharacterRulesetsDialog.svelte';
	import CharacterColorSchemeDialog from './CharacterColorSchemeDialog.svelte';

	export let character: RxDocument<CharacterType>;

	$: portraitDialogOpen = false;
	$: detailsDialogOpen = false;
	$: statsDialogOpen = false;
	$: rulesetDialogOpen = false;
	$: colorSchemeDialogOpen = false;
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
		<MenuItem
			meltItem={item}
			onClick={() => {
				detailsDialogOpen = true;
			}}>Edit Details</MenuItem
		>
		<MenuItem
			meltItem={item}
			onClick={() => {
				statsDialogOpen = true;
			}}>Edit Stats</MenuItem
		>
		<MenuItem
			meltItem={item}
			onClick={() => {
				rulesetDialogOpen = true;
			}}>Choose Rulesets</MenuItem
		>
		<MenuItem
			meltItem={item}
			onClick={() => {
				colorSchemeDialogOpen = true;
			}}>Change Color Scheme</MenuItem
		>
	</svelte:fragment>
</Menu>

<CharacterPortraitDialog {character} bind:open={portraitDialogOpen} />
<CharacterDetailsDialog {character} bind:open={detailsDialogOpen} />
<CharacterStatsDialog {character} bind:open={statsDialogOpen} />
<CharacterRulesetsDialog {character} bind:open={rulesetDialogOpen} />
<CharacterColorSchemeDialog {character} bind:open={colorSchemeDialogOpen} />

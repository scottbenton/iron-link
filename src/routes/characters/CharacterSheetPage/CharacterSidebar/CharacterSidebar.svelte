<script lang="ts">
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';
	import type { RxDocument } from 'rxdb';
	import CharacterOverview from '../components/CharacterOverview.svelte';
	import CharacterStats from '../components/CharacterStats.svelte';
	import CharacterMeters from '../components/CharacterMeters.svelte';
	import OtherRollAffects from '../components/OtherRollAffects.svelte';
	import Debilities from '../components/Debilities.svelte';
	import LegacyTracks from '../components/LegacyTracks.svelte';
	import Experience from '../components/Experience.svelte';

	export let character: RxDocument<CharacterType>;
</script>

<div class="sidebar">
	<h1 class="font-title text-lg">{$i18n.t('characterSheet.characterHeader')}</h1>
	<CharacterOverview {character} />
	<CharacterStats {character} />
	<CharacterMeters {character} />
	<OtherRollAffects {character} />
	<Debilities {character} />
	<LegacyTracks {character} />
	<Experience {character} />
</div>

<style lang="scss">
	.sidebar {
		padding: $space-4;
		// width: 350px; // todo - work out how to make this responsive
	}
</style>

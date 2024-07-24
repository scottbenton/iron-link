<script lang="ts">
	import DebouncedNumberMeter from '$components/datasworn/Rollers/DebouncedNumberMeter.svelte';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';
	import type { RxDocument } from 'rxdb';

	export let character: RxDocument<CharacterType>;

	$: experience = character.experience ?? 0;

	$: character.experience$?.subscribe((exp) => {
		experience = exp ?? 0;
	});
</script>

<div class="experience-section">
	<h2 class="text-xl font-title">{$i18n.t('characterSheet.experienceHeader')}</h2>
	<div class="experience-contents">
		<DebouncedNumberMeter
			label={$i18n.t('characterSheet.unsentExperience')}
			value={experience}
			min={0}
			max={99}
			onChange={(value) =>
				character.incrementalModify((doc) => {
					doc.experience = value;
					return doc;
				})}
		/>
	</div>
</div>

<style lang="scss">
	.experience-section {
		margin-top: $space-4;
		.experience-contents {
			margin-top: $space-1;
		}
	}
</style>

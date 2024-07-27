<script lang="ts">
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { getFileURL } from '$lib/firebase/storage';
	import { onDestroy, type SvelteComponent } from 'svelte';
	import CroppedImage from './CroppedImage.svelte';
	import type { RxDocument } from 'rxdb';

	export let character: RxDocument<CharacterType>;
	export let size: SvelteComponent<CroppedImage>['size'] = 'md';

	$: portrait = character.portrait;
	$: portraitSubscription = character.portrait$?.subscribe((newPortrait) => {
		portrait = newPortrait;
	});
	onDestroy(() => {
		portraitSubscription?.unsubscribe();
	});
	$: imageUrl = undefined as string | undefined;

	$: {
		if (portrait?.filename) {
			getFileURL('characters', character._id, portrait.filename).then((url) => {
				imageUrl = url;
			});
		} else {
			imageUrl = undefined;
		}
	}
</script>

<CroppedImage {imageUrl} {size} settings={portrait?.settings} />

<script lang="ts">
	import Dialog from '$components/common/Dialog/Dialog.svelte';
	import ImageUploadAndCropDialog from '$components/common/Input/ImageUploadAndCropDialog.svelte';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { createId } from '$lib/db/createId';
	import { getFileURL, uploadFile } from '$lib/firebase/storage';
	import type { FileSettings } from '$types/FileSettings.type';
	import type { RxDocument } from 'rxdb';

	export let character: RxDocument<CharacterType>;
	export let open = false;

	$: portrait = character.portrait;
	$: fileUrl = undefined as string | undefined;
	$: {
		if (portrait) {
			getFileURL('characters', character._id, portrait.filename).then((url) => {
				fileUrl = url;
			});
		} else {
			fileUrl = undefined;
		}
	}

	function handlePortraitUpload(file: File, fileSettings: FileSettings) {
		const filenameId = createId();
		const filenameExt = file.name.split('.').pop();
		const filename = `${filenameId}.${filenameExt ?? ''}`;

		const copiedFile = new File([file], filename, {
			type: file.type,
			lastModified: new Date().getTime()
		});

		uploadFile('characters', character._id, copiedFile).then(() => {
			character.incrementalPatch({
				portrait: {
					filename: filename,
					settings: fileSettings
				}
			});
		});
	}
	function handleResize(fileSettings: FileSettings) {
		character.incrementalModify((char) => {
			if (!char.portrait) {
				return char;
			} else {
				char.portrait.settings = fileSettings;
				return char;
			}
		});
	}
	function handlePortraitRemove() {
		character.incrementalPatch({
			portrait: undefined
		});
	}
</script>

<ImageUploadAndCropDialog
	bind:open
	fileSettings={portrait?.settings}
	{fileUrl}
	onUpload={handlePortraitUpload}
	onResize={handleResize}
	onRemove={handlePortraitRemove}
/>

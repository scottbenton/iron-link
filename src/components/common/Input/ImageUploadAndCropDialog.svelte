<script lang="ts">
	import { i18n } from '$lib/i18n';
	import type { FileSettings } from '$types/FileSettings.type';
	import Cropper from 'svelte-easy-crop';
	import Button from '../Button.svelte';
	import Dialog from '../Dialog/Dialog.svelte';
	import UploadIcon from 'virtual:icons/tabler/user-hexagon';

	export let open: boolean | undefined = undefined;
	export let file: File | undefined = undefined;
	export let fileSettings: FileSettings | undefined = undefined;

	let localFile: File | undefined = file;
	let localFileSettings: FileSettings = fileSettings ?? {
		crop: { x: 0, y: 0 },
		zoom: 1
	};

	let cropPercentages = { x: 0, y: 0 };

	export let onUpload: (file: File, fileSettings: FileSettings) => void;
	export let onRemove: () => void;

	let fileInput: HTMLInputElement;

	$: {
		if (open && !localFile) {
			fileInput.click();
		}
	}

	let imageUrl: string | undefined = undefined;
	let reader = new FileReader();
	reader.addEventListener('load', () => {
		if (typeof reader.result === 'string') {
			imageUrl = reader.result;
		}
	});
	$: {
		if (localFile) {
			reader.readAsDataURL(localFile);
		}
	}
</script>

<Dialog bind:open title={$i18n.t('shared.imageUploadDialog.title')}>
	<svelte:fragment slot="trigger" let:trigger>
		<slot name="trigger" {trigger} />
	</svelte:fragment>
	{#if imageUrl}
		<div class="cropper-container">
			<Cropper
				image={imageUrl}
				bind:crop={localFileSettings.crop}
				bind:zoom={localFileSettings.zoom}
				on:cropcomplete={({ detail }) => {
					cropPercentages = {
						x: detail.percent.x,
						y: detail.percent.y
					};
				}}
				aspect={1}
				showGrid={false}
				zoomSpeed={0.5}
			/>
		</div>
	{/if}
	{#if localFile}
		<Button variant={'secondary'} onClick={() => fileInput.click()}>
			{$i18n.t('shared.imageUploadDialog.changeImage')}
		</Button>
	{/if}
	<div class="actions" slot="actions" let:closeDialog>
		<div>
			{#if file}
				<Button
					variant={'text'}
					dangerButton
					onClick={() => {
						onRemove();
						closeDialog();
					}}>{$i18n.t('shared.imageUploadDialog.removeImageButton')}</Button
				>
			{/if}
		</div>
		<div>
			<Button variant={'text'} onClick={() => closeDialog()}>{$i18n.t('shared.cancel')}</Button>
			{#if localFile}
				<Button
					variant={'primary'}
					onClick={() => {
						if (localFile) {
							onUpload(localFile, { zoom: localFileSettings.zoom, crop: cropPercentages });
							closeDialog();
						}
					}}>{$i18n.t('shared.imageUploadDialog.uploadButton')}</Button
				>
			{/if}
		</div>
	</div>
</Dialog>
<input
	type="file"
	bind:this={fileInput}
	hidden
	accept="image/*"
	on:change={(evt) => {
		const files = evt.currentTarget.files;
		if (files && files.length > 0) {
			localFile = files[0];
		} else {
			localFile = undefined;
		}
	}}
/>

<style lang="scss">
	.cropper-container {
		overflow: hidden;
		position: relative;
		min-width: 250px;
		width: 100%;
		aspect-ratio: 1/1;
		background-color: $gray-950;
		border-radius: $border-radius;
		margin-bottom: $space-4;
	}

	.actions {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	@media (min-width: $breakpoint-sm) {
		.cropper-container {
			width: 400px;
		}
	}
</style>

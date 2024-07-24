<script lang="ts">
	import type { FileSettings } from '$types/FileSettings.type';
	import UploadIcon from 'virtual:icons/tabler/user-hexagon';

	const sizes = {
		xs: 64,
		sm: 96,
		md: 128,
		lg: 192,
		xl: 256
	};
	const fontSizes = {
		xs: '1.5rem',
		sm: '1.75rem',
		md: '2rem',
		lg: '2.25rem',
		xl: '2.5rem'
	};

	export let size: keyof typeof sizes = 'md';
	export let image: File | undefined = undefined;
	export let imageUrl: string | undefined = undefined;
	export let settings: FileSettings = {
		crop: { x: 0, y: 0 },
		zoom: 1
	};
	export let DefaultIcon = UploadIcon;

	$: isTaller = true;

	// the crop x and y value refer to the scaled px to from the center of the image to the center of
	// so we need to calculate the margin to center the image
	$: marginTop = -settings.crop.y;
	$: marginLeft = -settings.crop.x;

	$: imageUrl = image ? URL.createObjectURL(image) : undefined;
	$: transformStatement = `transform: translate(${marginLeft}%, ${marginTop}%)`;
</script>

<div
	class="portrait"
	class:empty={!image && !imageUrl}
	style={`width: ${sizes[size]}px; height: ${sizes[size]}px;`}
>
	{#if imageUrl}
		<img
			src={imageUrl}
			alt="Cropped"
			aria-hidden="true"
			width={isTaller ? `${100 * settings.zoom}%` : 'auto'}
			height={isTaller ? 'auto' : `${100 * settings.zoom}%`}
			style={transformStatement}
			on:load={(evt) => {
				isTaller = evt.currentTarget.clientHeight > evt.currentTarget.clientWidth;
			}}
		/>
	{:else}
		<DefaultIcon font-size={fontSizes[size]} stroke-width="1px" />
	{/if}
</div>

<style lang="scss">
	.portrait {
		overflow: hidden;

		display: block;
		background-color: $background-inset-alt;
		color: $text-tertiary;
		border-radius: $border-radius;
		flex-shrink: 0;

		img {
			position: relative;
			max-width: unset;
		}

		&.empty {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>

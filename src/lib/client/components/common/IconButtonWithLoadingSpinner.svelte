<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import { Circle3 } from 'svelte-loading-spinners';
	import IconFa from './IconFa.svelte';

	export let text = 'No text provided';
	export let loading = false;
	export let disabled = false;
	export let icon: IconDefinition | string | null = null;
	export let onClick = () => {};
	export let isPerformanceCritical = false;

	function isUrl(icon: IconDefinition | string | null): icon is string {
		return typeof icon === 'string';
	}

	let _class: string = '';
	export { _class as class };
</script>

<button {disabled} class="btn-primary btn flex items-center gap-2 {_class}" on:click={onClick}>
	{#if icon}
		{#if isUrl(icon)}
			<img class="h-6 w-6" src={icon} alt="icon" />
		{:else}
			<IconFa {icon} class="h-6 w-6" />
		{/if}
	{/if}
	{text}
	{#if loading}
		{#if isPerformanceCritical}
			<div class="text text-base-content">...</div>
		{:else}
			<Circle3 size="24" />
		{/if}
	{/if}
</button>

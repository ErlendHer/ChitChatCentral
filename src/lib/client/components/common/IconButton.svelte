<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import IconFa from './IconFa.svelte';
	import { onEnter } from '$lib/client/utils/eventUtils';

	let _class: string = '';

	export let icon: IconDefinition;
	export let onClick: () => void;
	export { _class as class };
</script>

<div on:click={onClick} on:keydown={onEnter(onClick)} class="cursor-pointer">
	<IconFa {icon} class="h-6 w-6 text-primary hover:text-opacity-75 {_class}" />
</div>

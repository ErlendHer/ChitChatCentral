<script lang="ts">
	import InputErrorMessage from './InputErrorMessage.svelte';

	export let id: string;
	export let labelText: string;
	export let disabled = false;
	export let value: string;
	export let placeholder: string;
	export let validator = (value: string): string | null => null;
	export let isValid = false;
	export let reserveSpaceForErrorMessage = false;
	export let tooltip: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let showErrorMessage = true;

	const initialValue = value;
	let touched = false;

	$: if (value !== initialValue) touched = true;
	$: errorMessage = validator(value);
	$: isValid = !errorMessage;
	$: borderColor = errorMessage ? 'input-error' : '';

	let _class: string = '';
	export { _class as class };
</script>

<div class={_class}>
	<label
		for={id}
		class="label relative text-sm font-medium{tooltip ? ` tooltip tooltip-right` : ''}"
		data-tip={tooltip}>{labelText}</label
	>
	<input
		type="text"
		{id}
		{placeholder}
		{disabled}
		bind:value
		{name}
		class="input-bordered input text-primary-content {borderColor} w-full"
	/>
	{#if errorMessage && touched && showErrorMessage}
		<InputErrorMessage {errorMessage} {reserveSpaceForErrorMessage} />
	{/if}
</div>

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
	export let name: string | undefined = undefined;

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
	<label for={id} class="label relative text-sm font-medium">{labelText}</label>
	<input
		type="password"
		{id}
		{placeholder}
		{disabled}
		{name}
		bind:value
		class="input-bordered input {borderColor} w-full"
	/>
	{#if errorMessage && touched}
		<InputErrorMessage {errorMessage} {reserveSpaceForErrorMessage} />
	{/if}
</div>

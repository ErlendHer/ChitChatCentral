<script lang="ts" context="module">
	export const isFormTouched = writable(false);
</script>

<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { user } from '$lib/client/auth/auth';

	import ChitChatLogo from '$lib/client/components/ChitChatLogo.svelte';
	import { writable } from 'svelte/store';

	$: if ($user && browser) {
		goto('/');
	}
</script>

<div class="flex w-full min-h-full flex-col items-center justify-center">
	<div class="logo flex flex-col items-center gap-2" class:touched={$isFormTouched}>
		<div
			class="text-accent text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl text-center font-[BubbleGumSans]"
		>
			Chit Chat Central
		</div>
		<ChitChatLogo class="w-32 h-32 sm:w-44 sm:h-44 2xl:h-64 2xl:w-64" />
	</div>
	<div class="login-card mb-4 w-full rounded bg-base-200 px-8 pb-8 pt-6 shadow-lg sm:max-w-md">
		<slot />
	</div>
</div>

<style>
	.login-card {
		transition: height 0.3s ease;
	}

	.logo {
		transition: margin-bottom 0.3s ease;
		margin-bottom: -1rem;
	}

	.logo.touched {
		margin-bottom: 0.5rem;
	}
</style>

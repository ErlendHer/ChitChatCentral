<script lang="ts">
	import '../app.postcss';
	import '../fonts.css';

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { listenForAuthChanges, updateUserInfo, user } from '$lib/client/auth/auth';
	import NavBar from '$lib/client/components/NavBar.svelte';
	import { AWSIoTProvider } from '@aws-amplify/pubsub';

	import SimpleLoadingSpinner from '$lib/client/components/common/SimpleLoadingSpinner.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { Amplify, Auth } from 'aws-amplify';
	import { onMount } from 'svelte';
	import awsmobile from '../aws-exports';

	Amplify.configure(awsmobile);

	// Apply plugin with configuration
	Amplify.addPluggable(
		new AWSIoTProvider({
			aws_pubsub_region: 'eu-north-1',
			aws_pubsub_endpoint: 'wss://a1744m7l3kqoyy-ats.iot.eu-north-1.amazonaws.com/mqtt'
		})
	);

	let mounted = false;

	$: if (browser && !$user && mounted) {
		const pageId = $page.route.id;
		if (pageId && !pageId.startsWith('/login')) {
			goto('/login');
		}
	}

	$: if ($user && mounted) updateUserInfo($user);

	onMount(async () => {
		try {
			$user = await Auth.currentAuthenticatedUser();
			if ($user) {
				await updateUserInfo($user);
			}
		} catch (error) {
			$user = null;
		} finally {
			mounted = true;
		}

		listenForAuthChanges();
	});
</script>

<div class="flex h-screen w-full flex-col bg-base-100 relative overflow-y-auto overflow-x-hidden">
	{#if $user}
		<NavBar />
	{/if}
	<div class="flex-1 mx-3 my-2 flex flex-col sm:mx-4 sm:my-4 md:mx-6 md:my-5 lg:mx-12 lg:my-8">
		{#if mounted}
			<slot />
		{:else}
			<div class="flex w-full h-full items-center justify-center">
				<SimpleLoadingSpinner size="large" />
			</div>
		{/if}
	</div>
</div>
<SvelteToast />

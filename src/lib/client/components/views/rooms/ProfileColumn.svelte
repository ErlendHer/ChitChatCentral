<script lang="ts">
	import type { UserInfo as ProfileInfo } from '@cccApi/rooms';
	import SimpleLoadingSpinner from '../../common/SimpleLoadingSpinner.svelte';

	export let profiles: ProfileInfo[];
	export let participantsLoading: boolean;
</script>

<div class="flex-col gap-4 hidden sm:flex flex-shrink-0">
	{#if participantsLoading}
		<div class="flex flex-col gap-2 items-center">
			<SimpleLoadingSpinner size="medium" />
			<div class="text-info font-bold text-lg text-center mb-2">Fetching profiles...</div>
		</div>
	{:else}
		{#each profiles as profile}
			<div class="flex flex-col items-center w-24 md:w-28 lg:w-32">
				<img
					src={profile.profileUrl}
					alt={profile.displayName}
					class="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover"
				/>
				<div class="font-BubbleGumSans text-lg text-center text-accent break-words">
					{profile.displayName}
				</div>
				<slot />
			</div>
		{/each}
	{/if}
</div>

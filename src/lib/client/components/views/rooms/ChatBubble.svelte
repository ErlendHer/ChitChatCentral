<script lang="ts">
	import type { Message } from './messageSync';
	import type { ProfileInfo } from './rooms.types';
	import defaultProfileUrl from '$lib/assets/images/profile-blank.png';

	export let message: Message;
	export let profileMap: Map<string, ProfileInfo>;

	$: profile = profileMap.get(message.username) ?? {
		username: message.username,
		displayName: message.username,
		profileUrl: defaultProfileUrl
	};
</script>

<div class={`flex ${message.isAuthor ? 'justify-end' : ''} mb-2`}>
	<div class="flex items-end max-w-[90%] md:max-w-[85%]">
		{#if !message.isAuthor}
			<img src={profile.profileUrl} alt="profile" class="h-8 w-8 rounded-full mr-2" />
		{/if}
		<div>
			{#if !message.isAuthor}
				<p class="text-gray-600 text-xs">{profile.displayName}</p>
			{/if}
			<div
				class={`py-2 px-3 rounded-t-lg ${
					message.isAuthor ? 'rounded-bl-lg bg-blue-400 text-white' : 'rounded-br-lg bg-gray-100'
				} max-w-md`}
			>
				<p>{message.content}</p>
				<p class={`text-xs ${!message.isAuthor ? 'text-gray-500' : 'text-gray-200'} mt-1`}>
					{new Date(message.timeSent).toLocaleTimeString()}
					{message.localOnly ? '...' : '✔️'}
				</p>
			</div>
		</div>
	</div>
</div>

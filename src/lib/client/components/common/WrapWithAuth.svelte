<script lang="ts">
	import { goto } from '$app/navigation';
	import { user, userInfo, type UserInfo } from '$lib/client/auth/auth';
	import IconButtonWithLoadingSpinner from './IconButtonWithLoadingSpinner.svelte';
	import type { CognitoUser } from '@aws-amplify/auth';

	let curUser: CognitoUser;
	$: if ($user) curUser = $user;

	let curUserInfo: UserInfo;
	$: if ($userInfo) curUserInfo = $userInfo;
</script>

<!-- NOTE: We are circumventing typescript here, user should only be used within the slot! -->
{#if curUser && curUserInfo}
	<slot user={curUser} userInfo={curUserInfo} />
{:else if !curUserInfo}
	<div class="flex flex-col items-center gap-2 w-full">
		<div class="text text-warning text-3xl text-center">Failed to fetch user info</div>
		<!-- $user = $user should trigger a new fetch of user information -->
		<IconButtonWithLoadingSpinner text="Try again" onClick={() => ($user = $user)} />
	</div>
{:else}
	<div class="flex flex-col items-center gap-2 w-full">
		<div class="text text-warning text-3xl text-center">You are not logged in</div>
		<IconButtonWithLoadingSpinner text="Login" onClick={() => goto('/login')} />
	</div>
{/if}

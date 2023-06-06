<script lang="ts">
	import defaultProfileImage from '$lib/assets/images/profile-blank.png';
	import logo from '$lib/assets/logo/logo-512.png';
	import { userInfo } from '../auth/auth';
</script>

<nav class="flex flex-row static bg-base-200 w-screen h-16 p-2">
	<div class="flex flex-row justify-between w-full">
		<a href="/" class="flex flex-row gap-2 h-full items-center">
			<img src={logo} alt="Profile" class="h-full" />
			<div class="font-[BubbleGumSans] text-accent text-2xl hidden sm:block">Chit Chat Central</div>
		</a>
		<a href="/profile" class="flex flex-row gap-2 h-full items-center">
			<img
				src={$userInfo?.profileUrl ?? defaultProfileImage}
				alt="Profile"
				class="w-[48px] h-[48px] object-cover rounded-full"
			/>
			<div class="font-[BubbleGumSans] text-accent text-xl hidden sm:block">Profile</div>
		</a>
	</div>
</nav>

<script lang="ts">
	import IconButtonWithLoadingSpinner from '$lib/client/components/common/IconButtonWithLoadingSpinner.svelte';
	import InputWithErrorMessage from '$lib/client/components/common/InputWithErrorMessage.svelte';
	import PasswordInputWithErrorMessage from '$lib/client/components/common/PasswordInputWithErrorMessage.svelte';
	import InputErrorMessage from '$lib/client/components/common/InputErrorMessage.svelte';
	import { faRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
	import { signIn, signUp } from '$lib/client/auth/auth';
	import type { Result } from '@shared/execution';
	import { openErrorToast } from '$lib/client/toast';
	import { isFormTouched as isFormTouched } from './+layout.svelte';
	import { goto } from '$app/navigation';
	import { validateNotEmpty } from '$lib/client/utils/validator.util';

	let isLogin = true;

	let username = '';
	let email = '';
	let password = '';

	let loading = false;
	let authError: string | undefined = undefined;

	const inputsValid = {
		username: true,
		email: false,
		password: false
	};

	// When we're in login mode, we hide email, make sure to mark it as valid
	$: if (isLogin) {
		inputsValid.email = true;
	}

	$: {
		isLogin;
		authError = undefined;
	}

	const validateEmail = (value: string): string | null => {
		const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (emailRegex.test(value)) {
			return null;
		}
		return 'Invalid email';
	};

	const validatePassword = (value: string): string | null => {
		// Check if password is empty
		if (value.length === 0) {
			return 'Password cannot be empty';
		}

		// Check if password is less than 8 characters
		if (value.length < 8) {
			return 'Password must be at least 8 characters';
		}

		return null;
	};

	async function loginUser(): Promise<Result<void>> {
		return await signIn(username, password);
	}

	async function registerUser(): Promise<Result<void>> {
		const result = await signUp(username, email, password);

		if (result.success) {
			goto(`/login/verifyEmail?${new URLSearchParams({ username, email })}`);
		}

		return result;
	}

	async function authorize() {
		try {
			authError = undefined;
			loading = true;
			let result = await (isLogin ? loginUser() : registerUser());

			if (!result.success) {
				authError = result.error;
				openErrorToast(result.error);
			}
		} finally {
			loading = false;
		}
	}
</script>

<form
	class="w-full"
	on:submit={authorize}
	on:mouseover={() => ($isFormTouched = true)}
	on:focus={() => ($isFormTouched = true)}
>
	<div class="mb-2 text-2xl font-semibold text-base-content">
		{isLogin ? 'Login' : 'Register new user'}
	</div>

	<div class="mb-6 flex flex-col gap-3">
		{#if !isLogin}
			<InputWithErrorMessage
				id="emailInput"
				name="email"
				labelText="Email"
				bind:value={email}
				bind:isValid={inputsValid.email}
				placeholder="name@mail.com"
				class="flex-1"
				validator={isLogin ? validateNotEmpty : validateEmail}
			/>
		{/if}

		<InputWithErrorMessage
			id="usernameInput"
			name="username"
			labelText="Username"
			bind:value={username}
			bind:isValid={inputsValid.username}
			placeholder="username"
			class="flex-1"
			validator={validateNotEmpty}
		/>

		<PasswordInputWithErrorMessage
			id="passwordInput"
			name="password"
			labelText="Password"
			bind:value={password}
			bind:isValid={inputsValid.password}
			placeholder="password"
			class="flex-1"
			validator={isLogin ? validateNotEmpty : validatePassword}
		/>
	</div>

	<div class="flex w-full flex-1 items-center justify-between">
		<IconButtonWithLoadingSpinner
			text={isLogin ? 'Login' : 'Register'}
			icon={isLogin ? faRightToBracket : faUserPlus}
			class="flex-1"
			disabled={!inputsValid.username || !inputsValid.email || !inputsValid.password || loading}
			{loading}
			onClick={authorize}
		/>
	</div>
	{#if authError}
		<div class="mt-2">
			<InputErrorMessage errorMessage={authError} reserveSpaceForErrorMessage={true} />
		</div>
	{/if}
	<!-- Add text "register instead" -->
	<div class="mt-2">
		<button
			class="text-primary font-semibold text-base"
			on:click={() => (isLogin = !isLogin)}
			type="button">{isLogin ? 'Register' : 'Login'} instead</button
		>
	</div>
</form>

<script lang="ts">
	import { resendVerificationCode, verifyEmail } from '$lib/client/auth/auth';
	import IconButtonWithLoadingSpinner from '$lib/client/components/common/IconButtonWithLoadingSpinner.svelte';
	import InputWithErrorMessage from '$lib/client/components/common/InputWithErrorMessage.svelte';
	import { openErrorToast, openSuccessToast } from '$lib/client/toast';
	import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';

	export let data: {
		username: string | undefined;
		email: string | undefined;
		password: string | undefined;
	};

	const username = data.username;
	const email = data.email;

	let verificationCode = '';
	let isValid = false;

	let triedToVerify = false;
	let verifyLoading = false;

	let secondsUntilResendAllowed = 30;
	$: emailResendAllowed = secondsUntilResendAllowed <= 0;
	$: if (isValid && !triedToVerify) verifyEmailWithCode();

	const validateAuthenticationCode = (code: string): string | null => {
		if (code.length === 0) {
			return 'Code cannot be empty';
		}
		if (code.length !== 6) {
			return 'Code must be 6 characters';
		}

		// Make sure code is only numbers
		const codeRegex = /^[0-9]+$/;
		if (!codeRegex.test(code)) {
			return 'Code must only contain numbers';
		}
		return null;
	};

	const verifyEmailWithCode = async () => {
		triedToVerify = true;
		if (!username) {
			return;
		}
		try {
			verifyLoading = true;
			const verifyResult = await verifyEmail(username, verificationCode);

			if (!verifyResult.success) {
				throw new Error(verifyResult.error);
			} else {
				openSuccessToast('Email verified successfully');
			}
		} catch (err) {
			openErrorToast((err as Error).message);
		} finally {
			verifyLoading = false;
		}
	};

	const tryResendVerificationCode = async () => {
		try {
			if (!username) {
				return;
			}
			const resendResult = await resendVerificationCode(username);
			if (!resendResult.success) {
				throw new Error(resendResult.error);
			} else {
				openSuccessToast('Verification code sent successfully');
				secondsUntilResendAllowed = 30;
			}
		} catch (error) {
			openErrorToast((error as Error).message);
		}
	};

	onMount(() => {
		const timer = setInterval(() => {
			if (secondsUntilResendAllowed > 0) {
				secondsUntilResendAllowed--;
			} else {
				clearInterval(timer);
			}
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	});
</script>

{#if !username}
	<div class="text text-lg italic text-warning">
		Something went wrong, failed to retrieve username
	</div>
{:else}
	<div class="flex flex-col gap-2">
		<div class="text text-2xl text-base-content font-semibold">Verify Email</div>
		<p class="text-base-content italic">
			We've sent an email to {email} with a verification code, please enter it below to verify email
		</p>
		<InputWithErrorMessage
			id="verificationCodeInput"
			name="verificationCode"
			labelText="Email Authentication Code"
			placeholder="123456"
			bind:value={verificationCode}
			bind:isValid
			validator={validateAuthenticationCode}
			showErrorMessage={false}
		/>
		<IconButtonWithLoadingSpinner
			text="Verify Email"
			icon={faEnvelope}
			onClick={verifyEmailWithCode}
			disabled={verifyLoading || !isValid}
			loading={verifyLoading}
		/>
		<button
			class="text-primary font-semibold text-base"
			disabled={!emailResendAllowed}
			on:click={tryResendVerificationCode}
			>{!emailResendAllowed
				? `Resend in ${secondsUntilResendAllowed} seconds`
				: 'Resend email'}</button
		>
	</div>
{/if}

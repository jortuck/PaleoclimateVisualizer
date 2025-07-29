<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import '$lib/app.css';
	import { onMount } from 'svelte';
	let { children } = $props();
	type theme = 'light' | 'dark';
	$effect(() => {
		let thm: theme = (localStorage.getItem('theme') as theme) ?? 'dark';
		document.querySelector('html')?.setAttribute('data-theme', thm);
	});
</script>

<div class="flex flex-col max-h-dvh min-h-dvh">
	<Navbar />
	<main class="flex flex-col grow">
		<svelte:boundary>
			{@render children()}
			{#snippet pending()}
				<div
					class="h-full w-full z-50 bg-base-300 absolute top-0 left-0 opacity-80 flex items-center justify-center flex-col space-y-5"
				>
					<h2 class="text-2xl font-bold text-base-content">Loading</h2>
					<span class="loading loading-spinner loading-lg"></span>
				</div>
			{/snippet}
			{#snippet failed(error, reset)}
				test
			{/snippet}
		</svelte:boundary>
	</main>
</div>

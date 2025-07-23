<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte"
	import "$lib/app.css"
	import { onMount } from 'svelte';
	let {children} = $props();
	type theme = 'light' | 'dark'
	onMount(()=>{
		let thm: theme = localStorage.getItem('theme') as theme ?? 'dark'
		document.querySelector("html")?.setAttribute('data-theme',thm);
	})
</script>
<div class="flex flex-col max-h-dvh min-h-dvh">
	<Navbar />
	<main class="flex flex-col grow">
		<svelte:boundary>


			{@render children()}
			{#snippet pending()}

			{/snippet}
			{#snippet failed(error)}
				{error}
			{/snippet}
		</svelte:boundary>
	</main>
</div>

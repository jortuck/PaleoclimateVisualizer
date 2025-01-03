<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte"
	import "../app.css"
	import { onMount } from 'svelte';
	type theme = 'light' | 'dark'
	onMount(()=>{
		let thm: theme = localStorage.getItem('theme') as theme ?? 'dark'
		document.querySelector("html")?.setAttribute('data-theme',thm);
	})
</script>
<div class="flex flex-col max-h-dvh min-h-dvh">
	<Navbar />
	<main class="flex flex-col grow">
			<slot />
	</main>
</div>

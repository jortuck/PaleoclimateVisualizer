<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte"
	import "../app.css"
</script>
<div class="flex max-h-screen flex-col items-stretch min-h-screen">
	<Navbar />
	<main class="flex grow flex-col">
		<slot />
	</main>
</div>

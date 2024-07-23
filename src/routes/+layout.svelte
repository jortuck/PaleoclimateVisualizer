<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte"
	import "../app.css"
</script>
<div class="flex min-h-screen flex-col items-stretch">
	<Navbar />
	<main class="flex grow flex-col">
		<slot />
	</main>
</div>

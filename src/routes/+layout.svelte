<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte"
	import "../app.css"
</script>
<div class="min-h-screen">
	<Navbar />
	<main class="container max-w-8xl mx-auto mt-8">
		<slot />
	</main>
</div>

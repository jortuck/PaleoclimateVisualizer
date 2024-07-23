<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte"
	import "../app.css"
</script>
<div class="min-h-screen">
	<Navbar />
	<main>
		<slot />
	</main>
</div>

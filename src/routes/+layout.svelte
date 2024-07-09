<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte"
	import "../app.css"
</script>
<div>
	<Navbar />
	<main class="container max-w-8xl min-h-screen mx-auto mt-8">
		<slot />
	</main>
</div>

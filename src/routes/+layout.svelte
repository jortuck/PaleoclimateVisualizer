<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte"
	import "../app.css"
</script>
<div class="flex flex-col max-h-dvh min-h-dvh">
	<Navbar />
	<main class="flex flex-col grow">
			<slot />
	</main>
</div>

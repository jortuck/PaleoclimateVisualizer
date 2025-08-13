<script lang="ts">
	import { onMount } from 'svelte';
	import type { DataController } from '$lib/DataController.svelte';
	type Projection = 'EqualEarth' | 'Orthographic';
	type themes = 'light' | 'dark';
	let theme: themes = $state('dark');
	let proj: Projection = $state('EqualEarth');
	let {
		controller
	}: {
		controller: DataController;
	} = $props();
	onMount(() => {
		theme = (localStorage.getItem('theme') as typeof theme) ?? 'dark';
		proj = (localStorage.getItem('projection') as typeof proj) ?? 'EqualEarth';
		controller.projection = proj;
	});
	$effect(() => {
		document.querySelector('html')?.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
		localStorage.setItem('projection', proj);
		controller.projection = proj;
	});
</script>

<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Projection</span>
	</div>
	<select bind:value={proj}>
		<option value="EqualEarth">Equal Earth</option>
		<option value="Orthographic">Orthographic</option>
	</select>
</label>
<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Theme</span>
	</div>
	<select bind:value={theme}>
		<option value="dark">Dark</option>
		<option value="light">Light</option>
	</select>
</label>

<!-- svelte-ignore css_unused_selector -->
<style lang="postcss">
	@reference "$lib//app.css";

	select {
		@apply select select-sm md:select-md w-full;
	}
</style>

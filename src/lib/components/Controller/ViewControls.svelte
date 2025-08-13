<script lang="ts">
	import { onMount } from 'svelte';
	import type { DataController } from '$lib/DataController.svelte';
	type themes = 'light' | 'dark';
	let theme: themes = $state('dark');
	let {
		controller
	}: {
		controller: DataController;
	} = $props();
	onMount(() => {
		theme = (localStorage.getItem('theme') as typeof theme) ?? 'dark';
	});
	$effect(() => {
		document.querySelector('html')?.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	});
</script>

<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Projection</span>
	</div>
	<select bind:value={controller.projection}>
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

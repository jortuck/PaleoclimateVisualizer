<script lang="ts">
	import { onMount } from 'svelte';
	import type { DataController } from '$lib/DataController.svelte';
	type Projection = 'EqualEarth' | 'Orthographic';
	type themes = 'light' | 'dark';
	let theme: themes = $state('dark');
	let showProxies: 'No' | 'Yes' = $state('No');
	let proj: Projection = $state('EqualEarth');
	let {
		controller
	}: {
		controller: DataController;
	} = $props();
	onMount(() => {
		theme = (localStorage.getItem('theme') as typeof theme) ?? 'dark';
		proj = (localStorage.getItem('projection') as typeof proj) ?? 'EqualEarth';
		showProxies = (localStorage.getItem('showProxies') as typeof showProxies) ?? 'No';
		controller.projection = proj;
	});
	$effect(() => {
		document.querySelector('html')?.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
		localStorage.setItem('projection', proj);
		localStorage.setItem('showProxies', showProxies);
		controller.projection = proj;
		controller.showProxies = showProxies;
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
<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Show Proxy Locations</span>
	</div>
	<select bind:value={showProxies}>
		<option value="No">No</option>
		<option value="Yes">Yes</option>
	</select>
</label>
{#if showProxies === 'Yes'}
	<div class="text-center text-sm flex flex-row items-center justify-center space-x-2 flex-wrap">
		<div class="w-3 h-3 bg-[cyan] rounded-full"></div>
		<p>Ice Cores</p>
		<div class="w-3 h-3 bg-[green] rounded-full"></div>
		<p>Tree Cores</p>
		<div class="w-3 h-3 bg-[orange] rounded-full"></div>
		<p>Corals and Sclerosponges</p>
		<div class="w-3 h-3 bg-[red] rounded-full"></div>
		<p>Bivalve</p>
		<div class="w-3 h-3 bg-[purple] rounded-full"></div>
		<p>Lake Cores</p>
		<div class="w-3 h-3 bg-[pink] rounded-full"></div>
		<p>Speleothems</p>
		<div class="w-3 h-3 bg-[blue] rounded-full"></div>
		<p>Marine Cores</p>
	</div>
{/if}

<!-- svelte-ignore css_unused_selector -->
<style lang="postcss">
	@reference "$lib//app.css";

	select {
		@apply select select-sm md:select-md w-full;
	}
</style>

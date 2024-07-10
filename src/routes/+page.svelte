<script lang="ts">
	import { onMount } from 'svelte';
	import Highcharts from 'highcharts/highmaps';
	import GeoHeatmap from 'highcharts/modules/geoheatmap';
	import { csv, json } from 'd3';
	import { PUBLIC_API_HOST } from '$env/static/public';
	let map: any;
	let chart: Highcharts.MapChart;

	let annual: string = $state('trends');
	let year: number = $state(1900);
	let variable: string = $state('psl');
	let model: string = $state('cesm');
	let trendUrl: string = $derived(PUBLIC_API_HOST+"/trends/"+model+"/"+variable);
	let annualUrl: string = $derived(PUBLIC_API_HOST+"/values/"+model+"/"+variable+"/"+year);

	async function  updateMap(){

	}
</script>

<svelte:head>
	<title>Paleoclimate Visualizer</title>
	<meta
		name="description"
		content="Explore interactive visualizations of paleoclimate data reconstructions. Dive into the history of Earth's climate through detailed charts and maps."
	/>
	<meta name="keywords" content="Paleoclimate, Climate, Data Visualization" />
	<meta property="og:title" content="Paleoclimate Visualizer" />
	<meta
		property="og:description"
		content="Explore interactive visualizations of paleoclimate data reconstructions. Dive into the history of Earth's climate through detailed charts and maps."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Paleoclimate Visualizer" />
	<meta property="og:locale" content="en_US" />
</svelte:head>
<a href="{trendUrl}">{trendUrl}</a>
<a href="{annualUrl}">{annualUrl}</a>
<div class="flex flex-row space-x-4">
	<div class="bg-base-200 shadow-md p-4 rounded-md w-full">
		<div class="space-y-2">
			<h1>Settings</h1>
			<div class="flex space-x-5">
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Select a Climate Model</span>
					</div>
					<select class="select select-bordered" bind:value={model}>
						<option value="cesm">CESM</option>
						<option value="hadcm3">HADCM3</option>
						<option value="lens">LENS</option>
						<option value="pace">PACE</option>
					</select>
				</label>
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Select a Variable</span>
					</div>
					<select class="select select-bordered" bind:value={variable}>
						<option value="us">Wind Speed</option>
						<option value="tas">Surface Temperature</option>
						<option value="psl">Surface Pressure</option>
					</select>
				</label>
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Viewing Mode</span>
					</div>
					<select class="select select-bordered" bind:value={annual}>
						<option value="trends">Trends</option>
						<option value="annual">Annual Data</option>
					</select>
				</label>
			</div>
			{#if annual == 'annual'}
				<div class="form-control">
					{year}
					<input type="range" min="1900" max="2005" class="range" bind:value={year} />
				</div>
			{/if}
		</div>
	</div>
</div>

<script lang="ts">
	import Controller from '$lib/components/Controller.svelte';
	import Map from '$lib/components/Map.svelte';
	import { controller, controller as ctr } from '$lib/ControllerState.svelte';
	import type { AvailableDataResponse, MapData, TimeSeriesData } from '$lib/Data';
	import TimeSeries from '$lib/components/TimeSeries.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';

	let data: MapData | null  = null;
	let timeSeriesData: TimeSeriesData | null = null;
	async function updateMap(){
		if (ctr.mode == 'annual') {
			data = await fetch(ctr.annualUrl).then((response) => response.json()) as MapData;
		} else {
			data = await fetch(ctr.trendUrl).then((response) => response.json()) as MapData;
		}
	}
	async function updateTimeSeries(){
		timeSeriesData = await fetch(ctr.timeSeriesUrl).then((response) => response.json()) as TimeSeriesData;
	}
	onMount( async ()=>{
		let availableData = (await fetch(PUBLIC_API_HOST).then((r) =>
			r.json()
		)) as AvailableDataResponse;
		controller.reconstructions = availableData.reconstructions;
		controller.variables = availableData.variables;
		controller.reconstruction = controller.reconstructions[0];
		controller.variable = controller.variables[0];
		controller.startYear = controller.reconstruction.timeStart;
		controller.endYear = controller.reconstruction.timeEnd;
		await updateMap();
		await updateTimeSeries();
	})
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
<div class="flex flex-row grow">
	<div class="p-5 bg-base-200 flex-shrink">
		<Controller updateMapData="{updateMap}" updateTimeSeriesData="{updateTimeSeries}" updateMapAndTimeSeriesData="{async () =>{await updateMap();await updateTimeSeries();}}" />
	</div>
	<div class="flex-1 p-5">
		{#if data!=null}
			<Map dataSet={data} />
		{/if}
		{#if timeSeriesData!=null}
			<TimeSeries timeSeriesData="{timeSeriesData}" />
		{/if}
	</div>
</div>

<style lang="postcss">
    :global(
			.highcharts-title,
			.highcharts-axis-labels > span,
			.highcharts-axis-title,
			.highcharts-legend-item > span
		) {
        @apply !text-base-content;
    }
</style>

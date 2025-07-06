<script lang="ts">
	import Controller from '$lib/components/Controller/Controller.svelte';
	import Map from '$lib/components/Map.svelte';
	import { controller, controller as ctr } from '$lib/ControllerState.svelte';
	import type { AvailableDataResponse, MapData, TimeSeriesData } from '$lib/Data';
	import TimeSeries from '$lib/components/TimeSeries.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';
	let data: MapData | null = $state.raw(null);
	let timeSeriesData: TimeSeriesData | null = $state.raw(null);
	let map: Map | null = $state.raw(null);
	/**
	 * This function is called when a controller change results in a map update.
	 */
	async function updateMap() {
		controller.loading++;
		data = await fetch(ctr.mode == 'annual' ? ctr.annualUrl : ctr.trendUrl).then((response) => response.json()) as MapData;
		controller.loading--;
	}

	async function updateTimeSeries() {
		// adds preset area functionality
		switch (controller.timeSeriesMode){
			case 'asl':
				controller.area = {n:-60,s:-80,start:170, stop:-62}
				break;
			case 'nino':
				controller.area = {n:5,s:-5,start:-170, stop:-120}
				break;
			case 'cww':
				controller.area = {n:-20,s:-70,start:-179, stop:180}
				break;
		}
		if (controller.timeSeriesMode == 'point' && !controller.invalidPoint) {
			timeSeriesData = await fetch(ctr.timeSeriesUrl).then((response) => response.json()) as TimeSeriesData;
			map.updatePoint()
		} else if (!controller.invalidArea) {
			timeSeriesData = await fetch(ctr.timeSeriesAreaUrl).then((response) => response.json()) as TimeSeriesData;
			map.updateRegion()
		}

	}

	onMount(async () => {
		controller.loading++;
		let availableData = (await fetch(PUBLIC_API_HOST).then((r) =>
			r.json()
		)) as AvailableDataResponse;
		controller.reconstructions = availableData.reconstructions;
		controller.reconstruction = controller.reconstructions[0];
		controller.variables = availableData.variables;

		for (let i = 0; i < controller.variables.length; i++) {
			if (controller.variables[i].id === controller.reconstructions[0].variables[0]) {
				controller.variable = controller.variables[i];
				break;
			}
		}

		controller.startYear = controller.reconstruction.timeStart;
		controller.endYear = controller.reconstruction.timeEnd;
		controller.loading--;
		await updateMap();
		await updateTimeSeries();
	});
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
<div class="grid grid-cols-12 grow">
	<aside class="p-5 bg-base-200 hidden lg:block lg:col-span-4 xl:col-span-3">
		<Controller updateMapData={updateMap} updateTimeSeriesData={updateTimeSeries}
								updateMapAndTimeSeriesData={async () =>{await updateMap();await updateTimeSeries();}} />
	</aside>
	<div class="col-span-full lg:col-span-8 xl:col-span-9 grid grid-rows-12">
		{#if controller.loading > 0}
			<div
				class="h-full w-full z-50 bg-base-300 absolute top-0 left-0 opacity-80 flex items-center justify-center flex-col space-y-5"
			>
				<h2 class="text-2xl font-bold text-base-content">Loading</h2>
				<span class="loading loading-spinner loading-lg"></span>
			</div>
		{/if}
		{#if data != null}
			<Map bind:this={map} click={updateTimeSeries} class="row-span-6 lg:row-span-7"  dataSet={data} />
		{/if}
		{#if timeSeriesData != null}
			<TimeSeries timeSeriesData={timeSeriesData} class="row-span-6 lg:row-span-5" />
		{/if}
	</div>
</div>
<dialog bind:this={controller.modal} id="controllerModal" class="modal lg:hidden">
	<div class="modal-box bg-base-300">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
		</form>
		<Controller updateMapData={updateMap} updateTimeSeriesData={updateTimeSeries}
								updateMapAndTimeSeriesData={async () =>{await updateMap();await updateTimeSeries();}} />
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
<style lang="postcss">
    :global(
			.highcharts-title,
			.highcharts-axis-labels > span,
			.highcharts-axis-title,
			.highcharts-legend-item > span
		) {
        @apply !text-base-content lg:text-left text-center;
    }
    :global(.highcharts-container) {
        width:100% !important;
        height:100% !important;
    }
</style>

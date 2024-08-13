<script lang="ts">
	import Controller from '$lib/components/Controller.svelte';
	import Map from '$lib/components/Map.svelte';
	import { controller, controller as ctr } from '$lib/ControllerState.svelte';
	import type { AvailableDataResponse, MapData, TimeSeriesData } from '$lib/Data';
	import TimeSeries from '$lib/components/TimeSeries.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';

	let data: MapData | null =  $state.raw(null);
	let timeSeriesData: TimeSeriesData | null =  $state.raw(null);

	/**
	 * This function is called when a controller change results in a map update.
	 */
	async function updateMap() {
		controller.loading++;
		data = await fetch(ctr.mode == 'annual' ? ctr.annualUrl : ctr.trendUrl).then((response) => response.json()) as MapData;
		controller.loading--;
	}

	async function updateTimeSeries() {
			if(controller.timeSeriesMode == "point" && !controller.invalidPoint){
				timeSeriesData = await fetch(ctr.timeSeriesUrl).then((response) =>  response.json()) as TimeSeriesData;
			}else if(!controller.invalidArea){
				timeSeriesData = await fetch(ctr.timeSeriesAreaUrl).then((response) =>  response.json()) as TimeSeriesData;
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

		for(let i =0; i<controller.variables.length; i++){
			if(controller.variables[i].variable ===controller.reconstructions[0].variables[0]){
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
<div class="flex flex-row grow">
	<div class="p-5 bg-base-200 flex-shrink hidden lg:block">
		<Controller updateMapData={updateMap} updateTimeSeriesData={updateTimeSeries}
								updateMapAndTimeSeriesData={async () =>{await updateMap();await updateTimeSeries();}} />
	</div>
	<div class="flex flex-col flex-shrink w-full relative">
		{#if controller.loading > 0}
			<div
				class="h-full w-full z-50 bg-base-300 absolute top-0 left-0 opacity-80 flex items-center justify-center flex-col space-y-5"
			>
				<h2 class="text-2xl font-bold text-base-content">Loading</h2>
				<span class="loading loading-spinner loading-lg"></span>
			</div>
		{/if}
		{#if data != null}
			<div class="basis-1/2">
				<Map click={updateTimeSeries} class="w-full" dataSet={data} />

			</div>
		{/if}
		{#if timeSeriesData != null}
			<div class="basis-1/2">
				<TimeSeries class="w-full" timeSeriesData={timeSeriesData} />
			</div>
		{/if}
	</div>
</div>
<dialog bind:this={controller.modal} id="controllerModal" class="modal lg:hidden">
	<div class="modal-box bg-base-300">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
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
</style>

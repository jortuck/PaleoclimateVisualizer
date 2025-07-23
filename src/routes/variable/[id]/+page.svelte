<script lang="ts">

	import {page} from "$app/state"
	import Controller from '$lib/components/Controller/Controller.svelte';
	import type { AvailableDataResponse, MapData, TimeSeriesData, VariableMetadata } from '$lib/Data';
	import TimeSeries from '$lib/components/TimeSeries.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import { DataController } from '$lib/DataController.svelte';
	let data: MapData | null = $state.raw(null);
	async function updateMap(){
		console.log("update map");
	}
	async function updateTimeSeries(){
		console.log("update map");
	}
	async function getTimeSeriesData(): Promise<TimeSeriesData> {
		let timeSeriesURL = PUBLIC_API_HOST + '/variables/psl/timeseries';
		let request = await fetch(timeSeriesURL)
		return await request.json() as TimeSeriesData;
	}
	async function getController() {
		const id = page.params.id;
		const request = await fetch(PUBLIC_API_HOST + `/variables/${id}`);
		let data = await request.json();
		if (!request.ok) {
			throw new Error(data.detail);
		}
		data = data as VariableMetadata
		return new DataController(data);
	}
	let ctr: DataController = $state(await getController());
	let timeSeriesData: TimeSeriesData = $state(await getTimeSeriesData());
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
<svelte:boundary>
	<div class="grid grid-cols-12 grow">
			<aside class="p-5 bg-base-200 hidden lg:block lg:col-span-4 xl:col-span-3">
				<Controller controller={ctr} updateMapData={updateMap} updateTimeSeriesData={updateTimeSeries}
										updateMapAndTimeSeriesData={async () =>{await updateMap();await updateTimeSeries();}} />
			</aside>
			<div class="col-span-full lg:col-span-8 xl:col-span-9 grid grid-rows-12">
					<TimeSeries timeSeriesData={timeSeriesData} class="row-span-6 lg:row-span-5" />

			</div>
	</div>
	{#snippet pending()}
		<div
			class="h-full w-full z-50 bg-base-300 absolute top-0 left-0 opacity-80 flex items-center justify-center flex-col space-y-5"
		>
			<h2 class="text-2xl font-bold text-base-content">Loading</h2>
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{/snippet}
	{#snippet failed(error, reset)}
		<div class="p-10 space-y-8">
			<div role="alert" class=" alert alert-error alert-outline w-full text-lg">
				<span>{error}</span>
			</div>
			<a class="btn btn-primary" href="/">Return Home</a>
		</div>
	{/snippet}
</svelte:boundary>

<dialog  id="controllerModal" class="modal lg:hidden">
	<div class="modal-box bg-base-300">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
<style lang="postcss">
    @reference "$lib/app.css";
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
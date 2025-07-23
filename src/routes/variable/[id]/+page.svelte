<script lang="ts">

	import {page} from "$app/state"
	import Controller from '$lib/components/Controller/Controller.svelte';
	import { controller, controller as ctr } from '$lib/ControllerState.svelte';
	import type { AvailableDataResponse, MapData, TimeSeriesData } from '$lib/Data';
	import TimeSeries from '$lib/components/TimeSeries.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';
	let data: MapData | null = $state.raw(null);
	let timeSeriesData: TimeSeriesData | null = $state.raw(null);

	async function updateMap(){
		console.log("update map");
	}
	async function updateTimeSeries(){
		console.log("update map");
	}

	async function getVariable(){
		const id = page.params.id;
		let request = await fetch(PUBLIC_API_HOST+`/variables/${id}`)
		return await request.json();
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
<div class="grid grid-cols-12 grow">
	<svelte:boundary>
		<aside class="p-5 bg-base-200 hidden lg:block lg:col-span-4 xl:col-span-3">
			<Controller variable={await getVariable()} updateMapData={updateMap} updateTimeSeriesData={updateTimeSeries}
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
		</div>
		{#snippet pending()}
		Loading
		{/snippet}
	</svelte:boundary>
</div>
<dialog bind:this={controller.modal} id="controllerModal" class="modal lg:hidden">
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
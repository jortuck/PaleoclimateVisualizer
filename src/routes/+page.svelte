<script lang="ts">
	import Controller from '$lib/components/Controller/Controller.svelte';
	import Map from '$lib/components/Map.svelte';
	import { controller } from '$lib/ControllerState.svelte';
	import type { AvailableDataResponse, MapData, TimeSeriesData } from '$lib/Data';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import { DataController } from '$lib/DataController.svelte';
	import TimeSeries from '$lib/components/TimeSeries.svelte';
	import { onMount } from 'svelte';

	async function getAvailable() {
		let request = await fetch(PUBLIC_API_HOST + '/variables');
		let data = await request.json();
		return new DataController(data as AvailableDataResponse);
	}
	async function setDataController(){
		dataController = await getAvailable();
	}
	let dataController: DataController | null = $state(null);
	onMount(async () => {
		dataController = await getAvailable();
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
<svelte:boundary>
		{#await setDataController()}
			<div
				class="h-full w-full z-50 bg-base-300 absolute top-0 left-0 opacity-80 flex items-center justify-center flex-col space-y-5"
			>
				<h2 class="text-2xl font-bold text-base-content">Loading</h2>
				<span class="loading loading-spinner loading-lg"></span>
			</div>
		{:then value}
			<div class="grid grid-cols-12 grow">

			<aside class="p-5 bg-base-200 hidden lg:block lg:col-span-4 xl:col-span-3">
				<Controller controller={dataController} />
			</aside>
			<div class="col-span-full lg:col-span-8 xl:col-span-9 grid grid-rows-12">
				<Map
					overrideColorBarLimit={dataController.overrideColorBar}
					colorBarLimit={dataController.colorBarLimit}
					bind:point={dataController.timeSeriesPoint}
					showArea={dataController.timeSeriesMode !== 'point'}
					area={dataController.area}
					trendURL={dataController.trendUrl}
					class="row-span-6 lg:row-span-7"
				/>

				<TimeSeries
					unit={dataController.currentVariable.annualUnit}
					startYear={dataController.startYear}
					endYear={dataController.endYear}
					timeSeriesUrl={dataController.timeSeriesUrl}
					class="row-span-6 lg:row-span-5"
				/>
			</div>
			</div>

		{:catch error}
			<div class="p-10 space-y-8">
				<div role="alert" class="alert alert-error alert-outline w-full text-lg">
					<p>
					<span>
						The API that this web application relies on cannot be reached. Please visit the <a
						target="_blank"
						class="underline"
						href="https://status.jortuck.com/status/pv">status page</a
					> for updates.
					</span>
						<br />
						<span>Error Message: {error}</span>
					</p>
				</div>
			</div>
			{/await}
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
	{#snippet pending()}
		<div
			class="h-full w-full z-50 bg-base-300 absolute top-0 left-0 opacity-80 flex items-center justify-center flex-col space-y-5"
		>
			<h2 class="text-2xl font-bold text-base-content">Loading</h2>
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{/snippet}
	{#snippet failed(error)}
		<div class="p-10 space-y-8">
			<div role="alert" class="alert alert-error alert-outline w-full text-lg">
				<p>
					<span>
						The API that this web application relies on cannot be reached. Please visit the <a
							target="_blank"
							class="underline"
							href="https://status.jortuck.com/status/pv">status page</a
						> for updates.
					</span>
					<br />
					<span>Error Message: {error}</span>
				</p>
			</div>
		</div>
	{/snippet}
</svelte:boundary>

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
		width: 100% !important;
		height: 100% !important;
	}
	:global(.highcharts-label.highcharts-legend-title > span) {
		@apply dark:!text-white;
	}
</style>

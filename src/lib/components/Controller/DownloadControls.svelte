<script lang="ts">
	import type { DataController } from '$lib/DataController.svelte';

	let {
		controller
	}: {
		controller: DataController;
	} = $props();
	let timeseriesFormat: 'csv' | 'mat' | 'xls' = $state('csv');
	let move_reference: boolean = $state(true);
	let timeSeriesUrl: string = $derived(
		controller.timeSeriesUrl +
			`&download=${timeseriesFormat}&startYear=${controller.startYear}&endYear=${controller.endYear}&move_reference=${move_reference}`
	);
	let fullUrl: string = $derived(
		controller.trendUrl + '&download=full&move_reference=' + move_reference
	);
	let partialUrl: string = $derived(
		controller.trendUrl + '&download=partial&move_reference=' + move_reference
	);
	let trendUrl: string = $derived(controller.trendUrl + '&download=trend');
</script>

<p>
	Please select your desired anomaly reference period. This reference period will apply to all
	downloads.
</p>
<select class="select" bind:value={move_reference}>
	<option value={false}>1950-1980</option>
	<option value={true}>1979-2005</option>
</select>
<p>
	Below are the download options for the <strong>{controller.currentDataset.name}</strong>
	reconstruction. Switch back to the <strong>Data</strong> tab to change reconstructions.
</p>
<a href={fullUrl} download class="btn btn-primary">Full Reconstruction</a>
<a href={partialUrl} download class="btn btn-primary"
	>Partial Reconstruction ({controller.startYear} - {controller.endYear})</a
>
<a href={trendUrl} download class="btn btn-primary"
	>Pre-Calculated Trends ({controller.startYear} - {controller.endYear})</a
>

<p>
	Below are the download options for downloading the time series {controller.startYear} - {controller.endYear}
	for the
	{#if controller.timeSeriesMode === 'point'}
		point ({controller.timeSeriesPoint.lat},{controller.timeSeriesPoint.lon}).
	{:else}
		area ({controller.area.n},{controller.area.s},{controller.area.start},{controller.area.stop}).
	{/if}
</p>
<div class="join">
	<select class="select join-item" bind:value={timeseriesFormat}>
		<option value="csv">CSV</option>
		<option value="mat">MAT</option>
		<option value="xls">XLS</option>
	</select>
	<div>
		<a download href={timeSeriesUrl} class="btn join-item btn-primary">Download</a>
	</div>
</div>

<style lang="postcss">
	@reference "$lib//app.css";

	select {
		@apply select select-sm md:select-md w-full;
	}
</style>

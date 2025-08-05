<script lang="ts">
	import type { DataController } from '$lib/DataController.svelte';

	let {
		controller
	}: {
		controller: DataController;
	} = $props();
	let fullUrl: string = $derived(controller.trendUrl + '&download=full');
	let partialUrl: string = $derived(controller.trendUrl + '&download=partial');
	let trendUrl: string = $derived(controller.trendUrl + '&download=trend');
</script>

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

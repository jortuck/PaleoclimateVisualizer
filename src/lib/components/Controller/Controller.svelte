<script lang="ts">
	import { controller } from '$lib/ControllerState.svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import ViewControls from '$lib/components/Controller/ViewControls.svelte';
	import DataControls from '$lib/components/Controller/DataControls.svelte';

	let { updateMapData, updateTimeSeriesData, updateMapAndTimeSeriesData }: {
		updateMapData: () => void,
		updateTimeSeriesData: () => void,
		updateMapAndTimeSeriesData: () => void
	} = $props();

	let activeTab: "data"|"view"|"download" = $state("data")
</script>
<div class="space-y-4">
	<h2 class="text-2xl font-bold">Settings</h2>
	<div role="tablist" class="tabs tabs-bordered w-full">
		<button onclick={()=>{activeTab='data'}} value="data" role="tab" class="tab" class:tab-active={activeTab==='data'}>Data</button>
		<button onclick={()=>{activeTab='view'}} value="view" role="tab" class="tab" class:tab-active={activeTab==='view'}>View</button>
		<button onclick={()=>{activeTab='download'}} value="download" role="tab" class="tab hidden" class:tab-active={activeTab==='download'}>Download</button>
	</div>
	<div class="flex flex-col space-y-3">
		{#if activeTab==='view'}
			<ViewControls />
			{:else if activeTab==='data'}
				<DataControls {updateTimeSeriesData} {updateMapData} {updateMapAndTimeSeriesData} />
		{/if}
	</div>
</div>

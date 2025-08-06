<script lang="ts">
	import ViewControls from '$lib/components/Controller/ViewControls.svelte';
	import DataControls from '$lib/components/Controller/DataControls.svelte';
	import type { DataController } from '$lib/DataController.svelte';
	import DownloadControls from '$lib/components/Controller/DownloadControls.svelte';

	let {
		controller
	}: {
		controller: DataController;
	} = $props();
	let activeTab: 'data' | 'view' | 'download' = $state('data');
</script>

<div class="space-y-4">
	<h2 class="text-2xl font-bold">Settings</h2>
	<div role="tablist" class="tabs tabs-box bg-base-300 flex w-full">
		<button
			onclick={() => {
				activeTab = 'data';
			}}
			value="data"
			role="tab"
			class="tab flex-1"
			class:tab-active={activeTab === 'data'}>Data</button
		>
		<button
			onclick={() => {
				activeTab = 'view';
			}}
			value="view"
			role="tab"
			class="tab flex-1"
			class:tab-active={activeTab === 'view'}>View</button
		>
		<button
			onclick={() => {
				activeTab = 'download';
			}}
			value="download"
			role="tab"
			class="tab flex-1"
			class:tab-active={activeTab === 'download'}>Download</button
		>
	</div>
	<div class="flex flex-col space-y-3">
		{#if activeTab === 'view'}
			<ViewControls />
		{:else if activeTab === 'data'}
			<DataControls {controller} />
		{:else if activeTab === 'download'}
			<DownloadControls {controller} />
		{/if}
	</div>
</div>

<script lang="ts">
import { controller } from '$lib/ControllerState.svelte';
import { onMount } from 'svelte';
import { PUBLIC_API_HOST } from '$env/static/public';
import { type AvailableDataResponse, Data, type Reconstruction, type Variable } from '$lib/Data';

let {updateMapData,updateTimeSeriesData} : {updateMapData:() => void, updateTimeSeriesData:() => void} = $props()


let yearsChanged: boolean = $state(false);
let postText: string = $derived(controller.mode == 'trends' ? ' Trend' : '');

let loading: boolean = $state(false);
async function updateMap() {
	updateMapData();
}
async function updateTimeSeries() {
	updateTimeSeriesData();
}
function updateMapAndTimeSeries() {
	updateMapData();
	updateTimeSeriesData();
}
function range(from: number, to: number,) {
	const result: number[] = [];
	let i = from;
	while (i <= to) {
		result.push(i);
		i += 1;
	}
	return result;
}
</script>
<div class="space-y-4">
	<h1>Settings</h1>
	<div class="flex md:space-x-5 md:flex-row flex-col">
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Select a Climate Model</span>
			</div>
			<select
				class="select select-bordered"
				bind:value={controller.reconstruction}
				onchange={updateMap}
				disabled={loading}
			>
				{#each controller.reconstructions as rec}
					<option value={rec}>{rec.name}</option>
				{/each}
			</select>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Select a Variable</span>
			</div>
			<select
				class="select select-bordered"
				bind:value={controller.variable}
				onchange={updateMapAndTimeSeries}
				disabled={loading}
			>
				{#each controller.variables as varb}
					<option value={varb}>{varb.name}{postText}</option>
				{/each}
			</select>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Viewing Mode</span>
			</div>
			<select
				class="select select-bordered"
				bind:value={controller.mode}
				onchange={updateMap}
				disabled={loading}
			>
				<option value="trends">Trends</option>
				<option value="annual">Annual Data</option>
			</select>
		</label>
	</div>
	{#if controller.mode === 'annual'}
		<div class="form-control">
			{controller.year}
			<input
				type="range"
				min="1900"
				max="2005"
				class="range"
				bind:value={controller.year}
				onchange={updateMap}
				disabled={loading}
			/>
		</div>
	{:else}
		<div class="flex flex-row w-full space-x-3">
			<select onchange={()=>{yearsChanged=true}} bind:value={controller.startYear} class="input w-full" disabled={loading}>
				{#each range(controller.reconstruction.timeStart,controller.endYear-1) as i}
					<option value={i}>{i}</option>
				{/each}
			</select>
			<p class="my-auto block align-middle">to</p>
			<select onchange={()=>{yearsChanged=true}} bind:value={controller.endYear} class="input w-full" disabled={loading}>
				{#each range(controller.startYear+1, controller.reconstruction.timeEnd) as i}
					<option value={i}>{i}</option>
				{/each}
			</select>
			<button onclick={()=>{yearsChanged=false; updateMap()}} class="btn btn-primary" disabled={loading||!yearsChanged}>Update Time Range</button>
		</div>
	{/if}
</div>
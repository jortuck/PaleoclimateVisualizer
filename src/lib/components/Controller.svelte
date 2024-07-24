<script lang="ts">
	import { controller } from '$lib/ControllerState.svelte';

	let { updateMapData, updateTimeSeriesData, updateMapAndTimeSeriesData }: {
		updateMapData: () => void,
		updateTimeSeriesData: () => void,
		updateMapAndTimeSeriesData: () => void
	} = $props();


	let yearsChanged: boolean = $state(false);
	let postText: string = $derived(controller.mode == 'trends' ? ' Trend' : '');

	let loading: boolean = $state(false);

	function range(from: number, to: number) {
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
	<h2 class="text-2xl font-bold">Settings</h2>
	<div class="flex flex-col space-y-3">
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Select a Climate Model</span>
			</div>
			<select
				class="select select-bordered"
				bind:value={controller.reconstruction}
				onchange={updateMapData}
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
				onchange={updateMapAndTimeSeriesData}
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
				onchange={updateMapData}
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
				onchange={updateMapData}
				disabled={loading}
			/>
		</div>
	{:else}
		<div class="form-control">
			<div class="label">
				<span class="label-text">Trend Time Range</span>
			</div>
			<div class="flex flex-row w-full md:space-x-3 md:flex-row space-x-2">
				<select onchange={()=>{yearsChanged=true}} bind:value={controller.startYear}
								class="select select-sm md:select-md w-full select-bordered" disabled={loading}>
					{#each range(controller.reconstruction.timeStart, controller.endYear - 1) as i}
						<option value={i}>{i}</option>
					{/each}
				</select>
				<p class="my-auto block align-middle">to</p>
				<select onchange={()=>{yearsChanged=true}} bind:value={controller.endYear}
								class="select select-sm w-full md:select-md select-bordered" disabled={loading}>
					{#each range(controller.startYear + 1, controller.reconstruction.timeEnd) as i}
						<option value={i}>{i}</option>
					{/each}
				</select>
				<button onclick={()=>{yearsChanged=false; updateMapData()}}
								class="btn btn-sm md:btn-md btn-primary"
								disabled={loading||!yearsChanged}>Update
				</button>
			</div>
		</div>
	{/if}
</div>
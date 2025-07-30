<script lang="ts">
	import type { DataController } from '$lib/DataController.svelte';
	import { z } from 'zod';

	let {
		controller
	}: {
		controller: DataController;
	} = $props();

	const pointSchema = z.object({
		lat: z.number().int().max(90).min(-90),
		lon: z.number().int().max(180).min(-180)
	});

	let yearsChanged: boolean = $state(false);
	let pointChanged: boolean = $state(false);
	let areaChanged: boolean = $state(false);
	let point: { lat: number; lon: number } = $state({ ...controller.timeSeriesPoint });
	let invalidPoint: boolean = $derived(
		!pointSchema.safeParse({ lat: point.lat, lon: point.lon }).success
	);

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

<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Select a Climate Model Prior</span>
	</div>
	<select bind:value={controller.currentDataset}>
		{#each controller.datasets.filter( (data) => Object.keys(data.variables).includes(controller.currentVariable.id) ) as dataset}
			<option disabled={!controller.currentVariable.datasets.includes(dataset.id)} value={dataset}
				>{dataset.name}</option
			>
		{/each}
		{#if controller.datasets.filter((data) => !Object.keys(data.variables).includes(controller.currentVariable.id)).length > 0}
			<option disabled>--- Unsupported Models ---</option>
			{#each controller.datasets.filter((data) => !Object.keys(data.variables).includes(controller.currentVariable.id)) as dataset}
				<option disabled={!controller.currentVariable.datasets.includes(dataset.id)} value={dataset}
					>{dataset.name}</option
				>
			{/each}
		{/if}
	</select>
</label>
<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Select a Variable</span>
	</div>
	<select bind:value={controller.currentVariable}>
		{#each controller.variables.filter( (v) => Object.keys(controller.currentDataset.variables).includes(v.id) ) as varb}
			<option
				disabled={!Object.keys(controller.currentDataset.variables).includes(varb.id)}
				value={varb}>{varb.name}</option
			>
		{/each}
		{#if controller.variables.filter((v) => !Object.keys(controller.currentDataset.variables).includes(v.id)).length > 0}
			<option disabled>--- Unsupported Variables ---</option>

			{#each controller.variables.filter((v) => !Object.keys(controller.currentDataset.variables).includes(v.id)) as varb}
				<option
					disabled={!Object.keys(controller.currentDataset.variables).includes(varb.id)}
					value={varb}>{varb.name}</option
				>
			{/each}
		{/if}
	</select>
</label>
<div class="form-control">
	<div class="label">
		<span class="label-text">Time Range</span>
	</div>
	<div class="flex flex-row w-full md:space-x-3 md:flex-row space-x-2">
		<select bind:value={controller.startYear}>
			{#each range(controller.currentDataset.timeStart, controller.endYear - 1) as year}
				<option value={year}>{year}</option>
			{/each}
		</select>
		<p class="my-auto block align-middle">to</p>
		<select bind:value={controller.endYear}>
			{#each range(controller.startYear + 1, controller.currentDataset.timeEnd) as year}
				<option>{year}</option>
			{/each}
		</select>
		<!--		<button class="btn btn-sm md:btn-md btn-primary">Update</button>-->
	</div>
</div>
<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Time Series Mode</span>
	</div>
	<select bind:value={controller.timeSeriesMode}>
		<option value="point">Specific Point</option>
		<option value="asl">Amundsen Sea Low Index</option>
		<option value="nino">Niño3.4 Index</option>
		<option value="cww">Circumpolar Westerly Winds</option>
		<option value="area">Custom Sub Region</option>
	</select>
</label>
<div class="join">
	<input
		class="join-item input"
		type="number"
		inputmode="numeric"
		placeholder="Lat"
		min="-90"
		max="90"
		oninput={() => {
			pointChanged = true;
		}}
		class:input-error={invalidPoint}
		bind:value={point.lat}
	/>
	<input
		class="join-item input"
		placeholder="Lon"
		type="number"
		inputmode="numeric"
		oninput={() => {
			pointChanged = true;
		}}
		class:input-error={invalidPoint}
		bind:value={point.lon}
	/>
	<button
		class="btn btn-sm md:btn-md btn-primary join-item"
		disabled={invalidPoint || !pointChanged}
		onclick={(e) => {
			pointChanged = false;
			controller.timeSeriesPoint = point;
		}}>Update</button
	>
</div>
{#if invalidPoint}
	<p class="text-sm text-error">
		The point you entered is invalid. Make sure the lat is between -90 and 90, and the lon is
		between -180 and 180. Only whole numbers are accepted.
	</p>
{/if}

<!-- svelte-ignore css_unused_selector -->
<style lang="postcss">
	@reference "$lib/app.css";

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}

	input:not([type='range']) {
		@apply input-sm w-full md:input-md;
		-moz-appearance: textfield;
	}

	select {
		@apply select select-sm md:select-md w-full;
	}
</style>

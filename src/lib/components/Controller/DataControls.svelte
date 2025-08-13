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
	const areaSchema = z
		.object({
			n: z.number().int().max(90).min(-90),
			s: z.number().int().max(90).min(-90),
			start: z.number().int().max(180).min(-180),
			stop: z.number().int().max(180).min(-180)
		})
		.refine(
			(data) => {
				return data.s <= data.n;
			},
			{
				message: 's must be less than or equal to n',
				path: ['s']
			}
		);

	let pointChanged: boolean = $state(false);
	let areaChanged: boolean = $state(false);

	let area: { n: number; s: number; start: number; stop: number } = $state({ ...controller.area });
	let point: { lat: number; lon: number } = $state({ ...controller.timeSeriesPoint });
	let year: number = $state(controller.year.valueOf());

	function updateYear() {
		controller.year = year.valueOf();
	}

	let invalidPoint: boolean = $derived(
		!pointSchema.safeParse({ lat: point.lat, lon: point.lon }).success
	);
	let invalidArea: boolean = $derived(
		!areaSchema.safeParse({
			n: area.n,
			s: area.s,
			start: area.start,
			stop: area.stop
		}).success
	);

	// true if using a predefined sub-region
	let preDefSub: boolean = $derived(controller.timeSeriesMode !== 'area');
	function range(from: number, to: number) {
		const result: number[] = [];
		let i = from;
		while (i <= to) {
			result.push(i);
			i += 1;
		}
		return result;
	}
	$effect(() => {
		switch (controller.timeSeriesMode) {
			case 'asl':
				area = { n: -60, s: -80, start: 170, stop: -62 };
				controller.area = { n: -60, s: -80, start: 170, stop: -62 };
				break;
			case 'nino':
				controller.area = { n: 5, s: -5, start: -170, stop: -120 };
				area = { n: 5, s: -5, start: -170, stop: -120 };
				break;
			case 'cww':
				controller.area = { n: -20, s: -70, start: -179, stop: 180 };
				area = { n: -20, s: -70, start: -179, stop: 180 };
				break;
		}
	});

	// watch for data set creating invalid year
	$effect(() => {
		if (controller.startYear < controller.currentDataset.timeStart) {
			controller.startYear = controller.currentDataset.timeStart;
		}
		if (controller.year > controller.currentDataset.timeEnd) {
			controller.year = controller.currentDataset.timeEnd;
			year = controller.currentDataset.timeEnd;
		} else if (controller.year < controller.currentDataset.timeStart) {
			controller.year = controller.currentDataset.timeStart;
			year = controller.currentDataset.timeStart;
		}
	});

	$effect(() => {
		// Update the local 'point' state whenever the controller's point changes,
		// but only if the user isn't actively changing it in the input field.
		if (!pointChanged) {
			point = { ...controller.timeSeriesPoint };
		}
	});
</script>

<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Select a Climate Reconstruction</span>
	</div>
	<select bind:value={controller.currentDataset}>
		{#each controller.datasets.filter( (data) => Object.keys(data.variables).includes(controller.currentVariable.id) ) as dataset}
			<option disabled={!controller.currentVariable.datasets.includes(dataset.id)} value={dataset}
				>{dataset.name}</option
			>
		{/each}
		{#if controller.datasets.filter((data) => !Object.keys(data.variables).includes(controller.currentVariable.id)).length > 0}
			<option disabled>--- Unsupported Reconstructions ---</option>
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
<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Map Mode</span>
	</div>
	<select bind:value={controller.trendMode}>
		<option value="trend">Trends</option>
		<option value="annual">Annual Data</option>
	</select>
</label>
{#if controller.trendMode === 'annual'}
	{year}

	<div class="form-control w-full">
		<input
			bind:value={year}
			type="range"
			min={controller.currentDataset.timeStart}
			max={controller.currentDataset.timeEnd}
			class="range w-full"
			onchange={updateYear}
		/>
	</div>
{/if}
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
{#if controller.timeSeriesMode === 'point'}
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
{:else}
	<div class="flex flex-row w-full md:space-x-3 md:flex-row space-x-2">
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">N°</span>
			</div>
			<input
				onchange={() => {
					areaChanged = true;
				}}
				inputmode="numeric"
				type="number"
				class="input input-sm w-full"
				disabled={preDefSub}
				bind:value={area.n}
			/>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">S°</span>
			</div>
			<input
				onchange={() => {
					areaChanged = true;
				}}
				bind:value={area.s}
				inputmode="numeric"
				type="number"
				class="input input-sm w-full"
				disabled={preDefSub}
			/>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Start Lon</span>
			</div>
			<input
				onchange={() => {
					areaChanged = true;
				}}
				bind:value={area.start}
				inputmode="numeric"
				type="number"
				class="input input-sm w-full"
				disabled={preDefSub}
			/>
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">End Lon</span>
			</div>
			<input
				onchange={() => {
					areaChanged = true;
				}}
				bind:value={area.stop}
				disabled={preDefSub}
				inputmode="numeric"
				type="number"
				class="input input-sm w-full"
			/>
		</label>
	</div>
	<button
		inputmode="numeric"
		class="btn btn-sm btn-primary w-full"
		disabled={preDefSub || invalidArea || !areaChanged}
		onclick={() => {
			controller.area = area;
		}}>Update</button
	>
	{#if invalidArea}
		<p class="text-sm text-error">
			The area you entered is invalid. Make sure N° is greater than S°. N° and S° must be between 90
			and -90. Start Lon and Stop Lon must be between -180 and 180.
		</p>
	{/if}
{/if}
<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Color Bar Settings</span>
	</div>
	<select bind:value={controller.overrideColorBar}>
		<option value={false}>Auto</option>
		<option value={true}>Custom Limit</option>
	</select>
</label>
{#if controller.overrideColorBar}
	<label class="input w-full">
		<span class="label">Limit:</span>
		<input
			type="number"
			inputmode="numeric"
			placeholder="1"
			bind:value={controller.colorBarLimit}
		/>
	</label>
{/if}
<p class="text-neutral-400">Anomalies calculated relative to the 1979-2005 period.</p>

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

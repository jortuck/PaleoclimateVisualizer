<script lang="ts">
	import { controller } from '$lib/ControllerState.svelte';

	let yearsChanged: boolean = $state(false);
	let pointChanged: boolean = $state(false);
	let areaChanged: boolean = $state(false);
	let { updateMapData, updateTimeSeriesData, updateMapAndTimeSeriesData }: {
		updateMapData: () => void,
		updateTimeSeriesData: () => void,
		updateMapAndTimeSeriesData: () => void
	} = $props();
	let loading: boolean = $derived(controller.loading > 0);

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
		if (controller.startYear < controller.reconstruction.timeStart) {
			controller.startYear = controller.reconstruction.timeStart;
		}
	});
</script>
<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Select a Climate Model Prior</span>
	</div>
	<select
		bind:value={controller.reconstruction}
		onchange={updateMapData}
		disabled={loading}
	>
		{#each controller.reconstructions as rec}
			<option disabled="{!rec.variables.includes(controller.variable.id)}"
							value={rec}>{rec.name}</option>
		{/each}
	</select>
</label>
<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Select a Variable</span>
	</div>
	<select
		bind:value={controller.variable}
		onchange={updateMapAndTimeSeriesData}
		disabled={loading}
	>
		{#if controller.variables != null }
			{#each controller.variables as varb}
				<option disabled={!controller.reconstruction.variables.includes(varb.id)}
								value={varb}>{varb.name}</option>
			{/each}
		{/if}
	</select>
</label>
<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Map Mode</span>
	</div>
	<select
		bind:value={controller.mode}
		onchange={updateMapData}
		disabled={loading}
	>
		<option value="trends">Trends</option>
		<option value="annual">Annual Data</option>
	</select>
</label>
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
{/if}
	<div class="form-control">
		<div class="label">
			<span class="label-text">Time Range</span>
		</div>
		<div class="flex flex-row w-full md:space-x-3 md:flex-row space-x-2">
			<select onchange={()=>{yearsChanged=true}} bind:value={controller.startYear}
							disabled={loading}>
				{#each range(controller.reconstruction.timeStart, controller.endYear - 1) as i}
					<option value={i}>{i}</option>
				{/each}
			</select>
			<p class="my-auto block align-middle">to</p>
			<select onchange={()=>{yearsChanged=true}} bind:value={controller.endYear}
							disabled={loading}>
				{#each range(controller.startYear + 1, controller.reconstruction.timeEnd) as i}
					<option value={i}>{i}</option>
				{/each}
			</select>
			<button onclick={()=>{
				yearsChanged=false;
				if(controller.mode==='annual'){
					updateTimeSeriesData()
				}else{
					updateMapAndTimeSeriesData()
				}
			}}
							class="btn btn-sm md:btn-md btn-primary"
							disabled={loading||!yearsChanged}>Update
			</button>
		</div>
	</div>
<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Time Series Mode</span>
	</div>
	<select
		bind:value={controller.timeSeriesMode}
		onchange={updateTimeSeriesData}
		disabled={loading}
	>
		<option value="point">Specific Point</option>
		<option value="asl">Amundsen Sea Low Index</option>
		<option value="nino">Niño3.4 Index</option>
		<option value="cww">Circumpolar Westerly Winds</option>
		<option value="region">Custom Sub Region</option>
	</select>
</label>
{#if controller.timeSeriesMode === "point"}
	<div class="flex flex-row w-full md:space-x-3 md:flex-row space-x-2">
		<input bind:value={controller.point.lat}
					 onchange={()=>{pointChanged=true}}
					 type="number"
					 inputmode="numeric"
					 placeholder="Lat"
					 class:input-error="{controller.invalidPoint}"
					 disabled={loading} />
		<input bind:value={controller.point.lon}
					 placeholder="Lon"
					 onchange={()=>{pointChanged=true}}
					 type="number"
					 inputmode="numeric"
					 class:input-error="{controller.invalidPoint}"
					 disabled={loading} />
		<button onclick={()=>{pointChanged=false; updateTimeSeriesData()}}
						class="btn btn-sm md:btn-md btn-primary"
						disabled={loading||controller.invalidPoint||!pointChanged}>Update
		</button>
	</div>
	{#if controller.invalidPoint}
		<p class="text-sm text-center text-error">The point you entered is invalid. Make sure the lat
			is between -90 and 90, and the lon is
			between -180 and 180. Only whole numbers are accepted.</p>
	{/if}
{:else if controller.timeSeriesMode === "region"}
	<div class="flex flex-row w-full md:space-x-3 md:flex-row space-x-2">
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">N°</span>
			</div>
			<input bind:value={controller.area.n}
						 onchange={()=>{areaChanged=true}}
						 inputmode="numeric"
						 type="number"
						 class="input input-sm w-full select-bordered" disabled={loading} />
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">S°</span>
			</div>
			<input bind:value={controller.area.s}
						 onchange={()=>{areaChanged=true}}
						 inputmode="numeric"
						 type="number"
						 class="input input-sm w-full select-bordered" disabled={loading} />
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Start Lon</span>
			</div>
			<input bind:value={controller.area.start}
						 onchange={()=>{areaChanged=true}}
						 inputmode="numeric"
						 type="number"
						 class="input input-sm w-full select-bordered" disabled={loading} />
		</label>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">End Lon</span>
			</div>
			<input bind:value={controller.area.stop}
						 onchange={()=>{areaChanged=true}}
						 inputmode="numeric"
						 type="number"
						 class="input input-sm w-full select-bordered" disabled={loading} />
		</label>
	</div>
	<button onclick={()=>{areaChanged=false; updateTimeSeriesData()}}
					inputmode="numeric"
					class="btn btn-sm btn-primary w-full"
					disabled={loading||!areaChanged||controller.invalidArea}>Update
	</button>
	{#if controller.invalidArea}
		<p class="text-sm text-center text-error">The area you entered is invalid. Make sure N° is
			greater than S°. N° and S° must be between 90 and -90. Start Lon and Stop Lon
			must be between -180 and 180.</p>
	{/if}
{/if}
<!-- svelte-ignore css_unused_selector -->
<style lang="postcss">
    @reference "../../../app.css";

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }

    input:not([type=range]) {
        @apply input input-sm w-full md:input-md;
        -moz-appearance: textfield;
    }

    select {
        @apply select select-sm md:select-md w-full;
    }
</style>

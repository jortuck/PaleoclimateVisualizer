<script lang="ts">
	import { controller } from '$lib/ControllerState.svelte';
</script>
<label class="form-control w-full">
	<div class="label">
		<span class="label-text">Select a Projection</span>
	</div>
	<select
		bind:value={controller.projection}
	>
		<option value="EqualEarth">Equal Earth</option>
		<option value="Orthographic">Orthographic</option>
	</select>
</label>
<style>
    select {
        @apply select select-sm md:select-md w-full select-bordered;
    }
</style>
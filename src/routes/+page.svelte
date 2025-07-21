<script lang="ts">
	import { PUBLIC_API_HOST } from '$env/static/public';

	async function getVariables(){
		let data = await fetch(PUBLIC_API_HOST+"/variables")
		return await data.json();
	}
</script>
<svelte:head>
	<title>Paleoclimate Visualizer</title>
	<meta
		name="description"
		content="Explore interactive visualizations of paleoclimate data reconstructions. Dive into the history of Earth's climate through detailed charts and maps."
	/>
	<meta name="keywords" content="Paleoclimate, Climate, Data Visualization" />
	<meta property="og:title" content="Paleoclimate Visualizer" />
	<meta
		property="og:description"
		content="Explore interactive visualizations of paleoclimate data reconstructions. Dive into the history of Earth's climate through detailed charts and maps."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Paleoclimate Visualizer" />
	<meta property="og:locale" content="en_US" />
</svelte:head>
	<div class="flex p-10 flex-col space-y-8">
		<h1 class="text-2xl"> Select a Variable To Get Started</h1>
		<div class="flex flex-row gap-8 flex-wrap">
			<svelte:boundary>
				{#each await getVariables() as variable}
					<div class="card w-96 bg-base-300 card-md shadow-sm">
						<div class="card-body">
							<h2 class="card-title">{variable.name}</h2>
							<p>{variable.datasets.length} reconstructions to explore.</p>
							<div class="justify-end card-actions">
								<button class="btn btn-primary">Explore</button>
							</div>
						</div>
					</div>
				{/each}
				{#snippet pending()}
					<div class="skeleton h-40 w-96"></div>
					<div class="skeleton h-40 w-96"></div>
					<div class="skeleton h-40 w-96"></div>
					<div class="skeleton h-40 w-96"></div>
				{/snippet}
				{#snippet failed(error)}
					<div role="alert" class="alert alert-error alert-outline w-full text-lg">
						<span>Error! The API that this web application relies on cannot be reached. Please visit the <a target="_blank" class="underline" href="https://status.jortuck.com/status/pv">status page</a> for updates.</span>
					</div>
				{/snippet}
			</svelte:boundary>

		</div>
	</div>
<style lang="postcss">
    @reference "../app.css";
    :global(
			.highcharts-title,
			.highcharts-axis-labels > span,
			.highcharts-axis-title,
			.highcharts-legend-item > span
		) {
        @apply !text-base-content lg:text-left text-center;
    }
    :global(.highcharts-container) {
        width:100% !important;
        height:100% !important;
    }
</style>

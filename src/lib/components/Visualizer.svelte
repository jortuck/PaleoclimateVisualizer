<script lang="ts">
	import { onMount } from 'svelte';
	import Highcharts from 'highcharts/highmaps';
	import GeoHeatmap from 'highcharts/modules/geoheatmap';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import { Data } from '$lib/Data';
	import type { AvaliableDataResponse, Variable, Reconstruction } from '$lib/Data';
	let map: any;
	let timeseries: any;
	let chart: Highcharts.MapChart;
	let timeSeriesChart: Highcharts.Chart;

	let reconstructions: Reconstruction[] = $state([]);

	let varaibles: Variable[] = $state([]);

	let mode: string = $state('trends');
	let postText: string = $derived(mode == 'trends' ? ' Trend' : '');
	let year: number = $state(1900);
	let startYear: number = $state(1900);
	let endYear: number = $state(2005);
	let lat: number = $state(90);
	let lon: number = $state(90);

	let variable: Variable = $state({
		variable: '',
		colorMap: '',
		name: '',
		nameShort: '',
		trendUnit: '',
		annualUnit: ''
	});

	let reconstruction: Reconstruction = $state({
		reconstruction: '',
		name: '',
		nameShort: '',
		varaibles: null
	});

	let trendUrl: string = $derived(
		PUBLIC_API_HOST +
			'/trends/' +
			reconstruction.reconstruction +
			'/' +
			variable.variable +
			'?startYear=' +
			startYear +
			'&endYear=' +
			endYear
	);
	let annualUrl: string = $derived(
		PUBLIC_API_HOST +
			'/values/' +
			reconstruction.reconstruction +
			'/' +
			variable.variable +
			'/' +
			year
	);
	let timeSeriesUrl: string = $derived(
		PUBLIC_API_HOST + '/timeseries/' + variable.variable + '/' + lat + '/' + lon
	);
	let loading: boolean = $state(true);

	onMount(async () => {
		let avaliableData = (await fetch(PUBLIC_API_HOST).then((r) =>
			r.json()
		)) as AvaliableDataResponse;

		reconstructions = avaliableData.reconstructions;
		varaibles = avaliableData.variables;

		reconstruction = reconstructions[0];
		variable = varaibles[0];

		const topology = await fetch(
			'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
		).then((r) => r.json());
		const antarctica = await fetch(
			'https://code.highcharts.com/mapdata/custom/antarctica.topo.json'
		).then((r) => r.json());

		GeoHeatmap(Highcharts);

		let dataSet: any = await fetch(trendUrl).then((r) => r.json());

		let timeSeriesData: any = await fetch(timeSeriesUrl).then((r) => r.json());

		// line charts
		// @ts-ignore
		timeSeriesChart = Highcharts.chart(timeseries, {
			// @ts-ignore
			chart: {
				backgroundColor: 'transparent'
			},
			title: {
				text: timeSeriesData.name,
				useHTML: true
			},
			yAxis: {
				title: {
					text: 'anomaly',
					useHTML: true
				},
				labels: {
					useHTML: true
				}
			},

			xAxis: {
				accessibility: {
					rangeDescription: 'Range: 1900 to 2005'
				},
				labels: {
					useHTML: true
				}
			},

			plotOptions: {
				series: {
					label: {
						connectorAllowed: true,
						style: {
							color: 'white'
						}
					}
				}
			},
			series: timeSeriesData.values,
			legend: {
				useHTML: true
			}
		});

		// @ts-ignore
		chart = Highcharts.mapChart(map, {
			// @ts-ignore
			chart: {
				backgroundColor: 'transparent',
				zooming: {
					mode: 'xy'
				},
				events: {
					selection: (e: any) => {
						console.log('selection');
						console.log(e);
					}
				}
			},
			title: { text: dataSet.name, useHTML: true },
			colors: ['#058DC7'],
			series: [
				{
					type: 'geoheatmap',
					data: Data.createGeoPoints(dataSet.lats, dataSet.lons, dataSet.values),
					cursor: 'crosshair',
					states: {
						hover: {
							enabled: false
						},
						inactive: { opacity: 1 }
					},
					events: {
						click: (e: any) => {
							console.log(e);
							console.log('Lat: ' + Math.round(e.lat));
							console.log('Lon: ' + Math.round(e.lon));
						}
					},
					interpolation: { enabled: true },
					zIndex: 0
				},
				{
					mapData: antarctica,
					zIndex: 2,
					borderColor: '#000',
					borderWidth: 1,
					states: {
						inactive: { opacity: 1 }
					}
				},
				{
					mapData: topology,
					type: 'map',
					zIndex: 2,
					states: {
						inactive: { opacity: 1 }
					},
					borderColor: '#000',
					borderWidth: 1
				}
			],
			mapView: {
				projection: {
					rotation: [180, 0, 0]
				},
				// fitToGeometry: { good for box focus
				// 	type: 'Polygon',
				// 	coordinates: [
				// 		[
				// 			[-180, 0],
				// 			[90, 0],
				// 			[180, 0],
				// 			[-90, 0]
				// 		]
				// 	]
				// }
			},
			legend:{
				title:{
					text:variable.trendUnit,
				},
				useHTML: true,
				symbolWidth: 350
			},
			mapNavigation: {
				enabled: false
			},
			colorAxis: {
				min: dataSet.min,
				max: dataSet.max,
				stops: dataSet.colorMap,
				labels: {
					useHTML: true,
					format: '{value}'
				}
			}
		});
		loading = false;
	});

	async function updateMap() {
		loading = true;
		let newData: any;
		if (mode == 'annual') {
			newData = await fetch(annualUrl).then((response) => response.json());
		} else {
			newData = await fetch(trendUrl).then((response) => response.json());
		}
	
		// @ts-ignore
		chart.series[0].update({
			data: Data.createGeoPoints(newData.lats, newData.lons, newData.values)
		});
		chart.update({
			colorAxis: {
				min: newData.min,
				max: newData.max,
				stops: newData.colorMap
			},
			title:{ text: newData.name },
			legend:{title:{text: mode=="annual" ? variable.annualUnit : variable.trendUnit}}
		});
		loading = false;
	}
	async function updateMapAndTimeSeries() {
		await updateMap();
		let newTimeSeriesData = await fetch(timeSeriesUrl).then((response) => response.json());
		timeSeriesChart.update({
			series: newTimeSeriesData.values,
			title: { text: newTimeSeriesData.name }
		});
	}
</script>

<div class="flex flex-row space-x-4">
	<div class="bg-base-200 shadow-md p-4 rounded-md w-full mx-2 relative">
		{#if loading}
			<div
				class="h-full w-full z-50 bg-base-300 absolute top-0 left-0 rounded-md opacity-80 flex items-center justify-center flex-col space-y-5"
			>
				<h2 class="text-2xl font-bold text-base-content">Loading</h2>
				<span class="loading loading-spinner loading-lg"></span>
			</div>
		{/if}
		<div class="flex lg:flex-row flex-col lg:justify-center">
			<div bind:this={map}></div>
			<div bind:this={timeseries}></div>
		</div>
		<div class="space-y-2">
			<h1>Settings</h1>
			<div class="flex md:space-x-5 md:flex-row flex-col">
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Select a Climate Model</span>
					</div>
					<select
						class="select select-bordered"
						bind:value={reconstruction}
						onchange={updateMap}
						disabled={loading}
					>
						{#each reconstructions as rec}
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
						bind:value={variable}
						onchange={updateMapAndTimeSeries}
						disabled={loading}
					>
						{#each varaibles as varb}
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
						bind:value={mode}
						onchange={updateMap}
						disabled={loading}
					>
						<option value="trends">Trends</option>
						<option value="annual">Annual Data</option>
					</select>
				</label>
			</div>
			{#if mode == 'annual'}
				<div class="form-control">
					{year}
					<input
						type="range"
						min="1900"
						max="2005"
						class="range"
						bind:value={year}
						onchange={updateMap}
						disabled={loading}
					/>
				</div>
			{:else}
				<div class="form-control">
					<div class="label"><span class="label-text">Start Year {startYear}</span></div>

					<input
						bind:value={startYear}
						type="number"
						min="1900"
						max="2005"
						class="input"
						disabled={loading}
						onchange={updateMap}
					/>
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">End Year {endYear}</span>
					</div>
					<input
						onchange={updateMap}
						bind:value={endYear}
						type="number"
						min={startYear + 1}
						max="2005"
						class="input"
						disabled={loading}
					/>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	:global(
			.highcharts-title,
			.highcharts-axis-labels > span,
			.highcharts-axis-title,
			.highcharts-legend-item > span
		) {
		@apply !text-base-content;
	}
</style>

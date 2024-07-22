<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Highcharts from 'highcharts/highmaps';

	import GeoHeatmap from 'highcharts/modules/geoheatmap';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import { Data } from '$lib/Data';
	import continents from "@highcharts/map-collection/custom/world-continents.topo.json"
	import antarctica from "@highcharts/map-collection/custom/antarctica.topo.json"
	import type { AvaliableDataResponse, Variable, Reconstruction } from '$lib/Data';
	import Controller from '$lib/components/Controller.svelte';
	let map: any;
	let timeseries: any;
	let chart: Highcharts.MapChart;
	let timeSeriesChart: Highcharts.Chart;

	// base state controls, what is avaliable
	let reconstructions: Reconstruction[] = $state([]);
	let varaibles: Variable[] = $state([]);

	// controls of what is viewed
	let mode: string = $state('trends');
	let postText: string = $derived(mode == 'trends' ? ' Trend' : '');
	let year: number = $state(1900);
	let startYear: number = $state(1900);
	let endYear: number = $state(2005);
	let yearsChanged: boolean = $state(false);
	let lat: number = $state(0);
	let lon: number = $state(0);
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
		timeEnd: 0,
		timeStart:0,
		nameShort: '',
		varaibles: null
	});

	// derrived urls for fetching data from api
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
		startYear = reconstruction.timeStart;
		endYear = reconstruction.timeEnd;
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
				animation: false,
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
							lat = Math.round(e.lat);
							lon = Math.round(e.lon);
							if(lon < -180){
								lon = lon+360;
							}
							updateTimeSeries();
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
					mapData: continents,
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
					// rotation: [180, 0, 0]
				}
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
			legend: {
				title: {
					text: variable.trendUnit
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
			title: { text: newData.name },
			legend: { title: { text: mode == 'annual' ? variable.annualUnit : variable.trendUnit } }
		});
		loading = false;
	}
	async function updateMapAndTimeSeries() {
		await updateMap();
		await updateTimeSeries();
	}
	async function updateTimeSeries(){
		let newTimeSeriesData = await fetch(timeSeriesUrl).then((response) => response.json());
		timeSeriesChart.update({
			series: newTimeSeriesData.values,
			title: { text: newTimeSeriesData.name }
		});
	}
	onDestroy(()=>{
		if(typeof timeSeriesChart != 'undefined'){
			timeSeriesChart.destroy();
		}
		if(typeof chart != 'undefined'){
			chart.destroy();
		}
	})
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

<script lang="ts">
	import { onMount } from 'svelte';
	import Highcharts from 'highcharts/highmaps';
	import GeoHeatmap from 'highcharts/modules/geoheatmap';
	import { csv, json, min } from 'd3';
	import { PUBLIC_API_HOST } from '$env/static/public';
	let map: any;
	let timeseries: any;
	let chart: Highcharts.MapChart;
	let timeSeriesChart: Highcharts.Chart;

	let mode: string = $state('trends');
	let postText: string = $derived(mode == "trends" ? "Anomaly Trend":"Anomaly")
	let year: number = $state(1900);
	let variable: string = $state('psl');
	let reconstruction: string = $state('cesm');
	let trendUrl: string = $derived(PUBLIC_API_HOST + '/trends/' + reconstruction + '/' + variable);
	let annualUrl: string = $derived(
		PUBLIC_API_HOST + '/values/' + reconstruction + '/' + variable + '/' + year
	);
	let timeSeriesUrl: string = $derived(
		PUBLIC_API_HOST + '/timeseries/' + variable + '/90/90'
	);

	onMount(async () => {
		const topology = await fetch(
			'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
		).then((response) => response.json());
		const antarctica = await fetch(
			'https://code.highcharts.com/mapdata/custom/antarctica.topo.json'
		).then((response) => response.json());
		GeoHeatmap(Highcharts);
		let dataSet: any = await json(trendUrl);
		let timeseriesData: any = await json(timeSeriesUrl);
		let timeSeriesSeries: any[] = [];
		
		timeseriesData.values.forEach((e: any)=>{
			timeSeriesSeries.push(e)
		})
		

		// line charts
		// @ts-ignore
		timeSeriesChart = Highcharts.chart(timeseries, {
			// @ts-ignore
			chart: {
				backgroundColor: 'transparent'
			},
			title: {
					text: 'Time Series',
					useHTML: true
			},
			yAxis: {
				title: {
					text: 'anomaly',
					useHTML: true
				},
				labels:{
					useHTML: true
				}
			},

			xAxis: {
				accessibility: {
					rangeDescription: 'Range: 1900 to 2005'
				},
				labels:{
					useHTML:true,
				},
			},

			plotOptions: {
				series: {
					label: {
						connectorAllowed: true,
						style:{
							color:"white"
						}
					},
					pointStart: 1900,
				}
			},

			series: timeSeriesSeries,
			legend:{
				useHTML: true
			},
			responsive: {
				rules: [
					{
						condition: {
							maxWidth: 500
						},
						chartOptions: {
							legend: {
								layout: 'horizontal',
								align: 'center',
								verticalAlign: 'bottom'
							}
						}
					}
				]
			}
		});
				
		// @ts-ignore
		chart = Highcharts.mapChart(map, {
			// @ts-ignore
			chart: {
				backgroundColor: 'transparent',
				zooming:{
					mode:"xy",
				},
				events: {
					selection: (e: any) => {
						console.log('selection');
						console.log(e);
					}
				}
			},
			title: { text: reconstruction + ' ' + variable, useHTML: true },
			colors:["#058DC7"],
			series: [
				{
					type: 'geoheatmap',
					data: dataSet.values,
					cursor: 'crosshair',
					states: {
						hover: {
							enabled: false
						},
						inactive: { opacity: 1 }
					},
					events: {
						click: (e: any) => {
							console.log('200');
						}
					},
					interpolation: { enabled: true },
					zIndex: 0
				},
				{
					mapData: antarctica,
					zIndex: 2,
					borderColor:"#000",
					borderWidth:1,
					states: {
						inactive: { opacity: 1 }
					}
				},
				{
					mapData:topology,
					type:"map",
					zIndex: 2,
					states: {
						inactive: { opacity: 1 }
					},
					borderColor:"#000",
					borderWidth:1,
				}
			],
			mapView: {
				projection: {
					rotation: [180, 0, 0]
				}
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
				}
			}
		});
	});

	async function updateMap() {
		chart.title.update({ text: reconstruction + ' ' + variable });
		let newData: any;
		if (mode == 'annual') {
			newData = await fetch(annualUrl).then((response) => response.json());
		} else {
			newData = await fetch(trendUrl).then((response) => response.json());
		}
		console.log(newData)
		// @ts-ignore
		chart.series[0].update({ data: newData.values});
		chart.update({
			colorAxis:{
			min:newData.min,
			max:newData.max,
			stops:newData.colorMap
		}
		})

	}
	async function updateMapAndTimeSeries(){
		await updateMap()
		let newTimeSeriesData =  await fetch(timeSeriesUrl).then((response) => response.json())
		timeSeriesChart.update({series:newTimeSeriesData.values})
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

<div class="flex flex-row space-x-4">
	<div class="bg-base-200 shadow-md p-4 rounded-md w-full mx-2">
		<!-- <a class="link" target="_blank" href={trendUrl}>{trendUrl}</a>
		<a class="link" target="_blank" href={timeSeriesUrl}>{timeSeriesUrl}</a>
		<a class="link" target="_blank" href={annualUrl}>{annualUrl}</a> -->
		<div class="flex lg:flex-row flex-col justify-between">
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
					<select class="select select-bordered" bind:value={reconstruction} onchange={updateMap}>
						<option value="cesm">CESM</option>
						<option value="hadcm3">HADCM3</option>
						<option value="lens">LENS</option>
						<option value="pace">PACE</option>
					</select>
				</label>
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Select a Variable</span>
					</div>
					<select class="select select-bordered" bind:value={variable} onchange={updateMapAndTimeSeries}>
						<option value="us">Wind Speed {postText}</option>
						<option value="tas">Surface Temperature {postText}</option>
						<option value="psl">Surface Pressure {postText}</option>
					</select>
				</label>
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Viewing Mode</span>
					</div>
					<select class="select select-bordered" bind:value={mode} onchange={updateMap}>
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
					/>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	:global(.highcharts-title, .highcharts-axis-labels>span, .highcharts-axis-title, .highcharts-legend-item>span) {
		@apply !text-base-content;
	}
</style>

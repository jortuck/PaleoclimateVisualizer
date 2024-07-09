<script lang="ts">
	import { onMount } from 'svelte';
	import Highcharts from 'highcharts/highmaps';
	import GeoHeatmap from "highcharts/modules/geoheatmap"
	import {csv, json } from "d3"
	let title:string = $state("cesm");
	let map: any;
	let chart: Highcharts.MapChart;

	onMount(async ()=>{
		const topology = await fetch(
			'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
		).then(response => response.json())
		const antarctica = await fetch(
			'https://code.highcharts.com/mapdata/custom/antarctica.topo.json'
		).then(response => response.json());
		GeoHeatmap(Highcharts)

		let ces = await json(`./data/${title}_psl_trends.json`);
		// @ts-ignore
		chart =  Highcharts.mapChart(map,{
			// @ts-ignore
			chart:{
				map:topology,
				backgroundColor:"transparent"
			},
			title:{text:title},
			series:[{
				type:"geoheatmap",
				data:ces,
				cursor:"crosshair",
				states:{
					hover:{
						enabled: false
					},
					inactive: { opacity: 1 },
				},
				interpolation: {enabled: true},
				zIndex:0,
			},{
				mapData:antarctica,
				zIndex:2,
				color:"#000",
				states:{
					inactive: { opacity: 1 },
				},
			},{
				zIndex:2,
				states:{
					inactive: { opacity: 1 },
				},
			}],
			mapView:{
				projection:{
					rotation: [180, 0, 0]
				},
			},
			mapNavigation:{
				enabled:true,
			},
			colorAxis: {
				min: -2.5,
				max: 2.5,
				stops: [
					[0, 'rgba(21, 0, 255,0.9)'],
					[1, 'rgba(255, 0, 0,0.9)']
				],
				labels: {
					style: {
						color: '#ddd'
					}
				}
			},
		});
	})
	async function updateDataSet(){
		chart.title.update({text:title+" reconstruction trends"})
		let newData = await fetch("./data/"+title+"_psl_trends.json").then(response => response.json())
		// @ts-ignore
		chart.series[0].update({data:newData})
	}
</script>
<svelte:head>
	<title>Paleoclimate Visualizer</title>
	<meta name="description" content="Explore interactive visualizations of paleoclimate data reconstructions. Dive into the history of Earth's climate through detailed charts and maps.">
	<meta name="keywords" content="Paleoclimate, Climate, Data Visualization">
	<meta property="og:title" content="Paleoclimate Visualizer">
	<meta property="og:description" content="Explore interactive visualizations of paleoclimate data reconstructions. Dive into the history of Earth's climate through detailed charts and maps.">
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="Paleoclimate Visualizer">
	<meta property="og:locale" content="en_US">
</svelte:head>

<div class="flex flex-row space-x-4">
	<div class="bg-base-200 shadow-md p-4 rounded-md w-full">
		<div bind:this={map}>
		</div>
		<div class="space-y-2">
			<h1>Settings</h1>
			<label class="form-control w-full max-w-xs">
				<div class="label">
				  <span class="label-text">Select a Climate Model</span>
				</div>
				<select class="select select-bordered" bind:value={title} onchange={updateDataSet}>
					<option value="cesm">CESM</option>
					<option value="hadcm3">HADCM3</option>
					<option value="lens">LENS</option>
					<option value="pace">PACE</option>
				</select>
			  </label>
		</div>
	</div>
</div>


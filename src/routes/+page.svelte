<script lang="ts">
	import { onMount } from 'svelte';
	import Highcharts from 'highcharts/highmaps';
	import GeoHeatmap from 'highcharts/modules/geoheatmap';
	import { csv, json } from 'd3';
	import { PUBLIC_API_HOST } from '$env/static/public';
	let map: any;
	let chart: Highcharts.MapChart;

	let mode: string = $state('trends');
	let year: number = $state(1900);
	let variable: string = $state('psl');
	let model: string = $state('cesm');
	let trendUrl: string = $derived(PUBLIC_API_HOST+"/trends/"+model+"/"+variable);
	let annualUrl: string = $derived(PUBLIC_API_HOST+"/values/"+model+"/"+variable+"/"+year);

	onMount(async ()=>{
		const topology = await fetch(
			'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
		).then(response => response.json())
		const antarctica = await fetch(
			'https://code.highcharts.com/mapdata/custom/antarctica.topo.json'
		).then(response => response.json());
		GeoHeatmap(Highcharts)
			
		let dataSet = await json(trendUrl);
		// @ts-ignore
		chart =  Highcharts.mapChart(map,{
			// @ts-ignore
			chart:{
				map:topology,
				backgroundColor:"transparent",
				zooming:{
					type:"xy"
				},
				events:{
					selection:(e: any)=>{
						console.log("selection")
						console.log(e)
					}
				}
			},
			title:{text:model+" "+variable},
			series:[{
				type:"geoheatmap",
				data:dataSet,
				cursor:"crosshair",
				states:{
					hover:{
						enabled: false
					},
					inactive: { opacity: 1 },
				},
				events:{
					click:(e: any)=>{
						console.log("200")
					}
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


	async function  updateMap(){
		chart.title.update({text:model+" "+variable})
		let newData: any;
		if(mode == "annual"){
			newData = await fetch(annualUrl).then(response => response.json())
		}else{
			newData = await fetch(trendUrl).then(response => response.json())
		}
		// @ts-ignore
		chart.series[0].update({data:newData})
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
<a class="link" target="_blank" href="{trendUrl}">{trendUrl}</a>
<a class="link" target="_blank" href="{annualUrl}">{annualUrl}</a>
<div class="flex flex-row space-x-4">
	<div class="bg-base-200 shadow-md p-4 rounded-md w-full">
		<div bind:this={map}>
		</div>
		<div class="space-y-2">
			<h1>Settings</h1>
			<div class="flex space-x-5">
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Select a Climate Model</span>
					</div>
					<select class="select select-bordered" bind:value={model} onchange="{updateMap}">
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
					<select class="select select-bordered" bind:value={variable} onchange="{updateMap}">
						<option value="us">Wind Speed</option>
						<option value="tas">Surface Temperature</option>
						<option value="psl">Surface Pressure</option>
					</select>
				</label>
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Viewing Mode</span>
					</div>
					<select class="select select-bordered" bind:value={mode} onchange="{updateMap}">
						<option value="trends">Trends</option>
						<option value="annual">Annual Data</option>
					</select>
				</label>
			</div>
			{#if mode == 'annual'}
				<div class="form-control">
					{year}
					<input type="range" min="1900" max="2005" class="range" bind:value={year} onchange="{updateMap}" />
				</div>
			{/if}
		</div>
	</div>
</div>

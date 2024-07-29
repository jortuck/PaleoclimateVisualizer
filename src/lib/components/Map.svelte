<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Highcharts from 'highcharts/highmaps';
	import { Data, type MapData, type Variable } from '$lib/Data';
	import antarctica from '@highcharts/map-collection/custom/antarctica.topo.json';
	import continents from '@highcharts/map-collection/custom/world-continents.topo.json';
	import GeoHeatmap from 'highcharts/modules/geoheatmap';
	import { controller } from '$lib/ControllerState.svelte';

	let { dataSet, class: className, click }: {
		dataSet: MapData,
		class: string,
		click:()=>void
	} = $props();

	let map: HTMLElement | null = null;
	let chart: Highcharts.MapChart;

	onMount(async () => {
		GeoHeatmap(Highcharts);

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
					cursor: 'crosshair',
					states: {
						hover: {
							enabled: false
						},
						inactive: { opacity: 1 }
					},
					interpolation: { enabled: true, blur:0 },
					zIndex: 0,
					events: {
						click: (e: any) => {
							let lon = Math.round(e.lon);
							if (lon < -180) {
								lon =lon + 360;
							}
							if(controller.point.lat != Math.round(e.lat) || controller.point.lon!= lon){
								controller.point = {lat:Math.round(e.lat), lon:lon};
								click();
							}
						}
					},
					nullInteraction: false,
				},
				{
					mapData: antarctica,
					zIndex: 2,
					borderColor: '#000',
					borderWidth: 1,
					enableMouseTracking: false,
					states: {
						inactive: { opacity: 1 },
						hover: {enabled: false},
					},
					nullInteraction: false,
				},
				{
					mapData: continents,
					type: 'map',
					zIndex: 2,
					states: {
						inactive: { opacity: 1 },
						hover: {enabled: false},
					},
					enableMouseTracking: false,
					borderColor: '#000',
					borderWidth: 1,
					nullInteraction: false,
				}
			],
			legend: {
				title: {
					text: dataSet.variable
				},
				useHTML: true,
				symbolWidth: 350
			},
			mapNavigation: {
				enabled: true
			},
			mapView:{
				// projection:{
				// 		name: 'Orthographic',
				// 		projectedBounds: 'world'
				// }
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
	});
	onDestroy(() => {
		if (typeof chart != 'undefined') {
			chart.destroy();
		}
	});
	$effect(() => {
		if (typeof chart != 'undefined') {
			// @ts-ignore
			chart.series[0].update({ data: Data.createGeoPoints(dataSet.lats, dataSet.lons, dataSet.values) });
			chart.update({
				colorAxis: {
					min: dataSet.min,
					max: dataSet.max,
					stops: dataSet.colorMap
				},
				title: { text: dataSet.name },
				legend: { title: { text: dataSet.variable } }
			});
		}
	});
</script>
<svelte:window on:resize={()=>{chart.reflow()}} />
<div class="{className}" bind:this={map}></div>

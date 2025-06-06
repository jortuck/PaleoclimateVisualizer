<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	// import * as Highcharts from 'highcharts';
	import * as Highcharts from'highcharts/highmaps'
	import { Data, type MapData, type Variable } from '$lib/Data';
	import antarctica from '@highcharts/map-collection/custom/antarctica.topo.json';
	import continents from '@highcharts/map-collection/custom/world-continents.topo.json';
	import 'highcharts/modules/geoheatmap';
	import { controller } from '$lib/ControllerState.svelte';

	let { dataSet, class: className, click }: {
		dataSet: MapData,
		class: string,
		click: () => void
	} = $props();

	let map: HTMLElement | null = null;
	let chart: Highcharts.MapChart;

	onMount(async () => {

		// @ts-ignore
		chart = Highcharts.mapChart(map, {
			// @ts-ignore
			chart: {
				backgroundColor: 'transparent',
				zooming: {
					mode: 'xy'
				},
				animation: false
			},
			credits: {
				text: 'Gemma O\'Connor'
			},
			plotOptions:{
				map:{
					enableMouseTracking: false,
				},
				mappoint:{
					enableMouseTracking: false,
				},
				series:{
					nullInteraction: false,
					states: {
						hover: {
							enabled: false
						},
						inactive: { opacity: 1 }
					},
				}
			},
			title: { text: dataSet.name, useHTML: true },
			colors: ['#058DC7'],
			series: [
				{
					type: 'geoheatmap',
					cursor: 'crosshair',
					interpolation: { enabled: true, blur: 1 },
					zIndex: 0,
					events: {
						click: (e: any) => {
							let lon = Math.round(e.lon);
							if (lon < -180) {
								lon = lon + 360;
							}
							if (controller.point.lat != Math.round(e.lat) || controller.point.lon != lon) {
								controller.point = { lat: Math.round(e.lat), lon: lon };
								click();
							}
						}
					},
				},
				{
					mapData: antarctica,
					zIndex: 2,
					borderColor: '#000',
					borderWidth: 1,
				},
				{
					mapData: continents,
					type: 'map',
					zIndex: 2,
					borderColor: '#000',
					borderWidth: 1,
				},
				{
					type: 'mappoint',
					dataLabels: {
						crop: true,
						format: '',
						inside: true,
						y: -14,
						style: {
							color: 'contrast',
							textOutline: 'none'
						},
						shape: 'mapmarker',
						borderColor: 'black',
						borderWidth: 1,
						backgroundColor: 'auto'
					},
				},
				{
					type:"map",
					zIndex:7,
					mapData:Highcharts.geojson(Data.createGeoJsonRegion(controller.area.n,controller.area.s,controller.area.start,controller.area.stop)),
					nullColor: "rgba(255,0,0,0.2)",
					borderColor:"red",
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
			mapView: {
				projection: {
					projectedBounds: 'world',
					rotation: [180, 0, 0]
				}
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
		// prevent weird gridded globe when using smaller amounts of lats and lons
		let size = 1;
		if (dataSet.lats.length < 17000) {
			size = 2;
		}

		if (typeof chart != 'undefined') {
			// @ts-ignore
			chart.series[0].update({
				data: Data.createGeoPoints(dataSet.lats, dataSet.lons, dataSet.values),
				colsize: size,
				rowsize: size
			});
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

	$effect(() => {
		chart.update({
			mapView: {
				projection: {
					name: controller.projection,
					projectedBounds: 'world',
					rotation: [180, 0, 0]
				}
			}
		});
	});

	// Sync point/region series visibility with time series mode in controller.
	$effect(() => {
		// @ts-ignore
		chart.series[3].update({
			visible: controller.timeSeriesMode === 'point'
		});
		// @ts-ignore
		chart.series[4].update({
			visible: controller.timeSeriesMode != 'point'
		});
	});

	/**
	 * Tells the map to move the visible point to the controllers current point.
	 * The map does not automatically sync with the controller point to avoid invalid point inputs.
	 * I could look into using effect and checking for an invalid point.
	 */
	export function updatePoint(): void {
		// @ts-ignore
		chart.series[3].update({
			data: [
				{ lat: controller.point.lat, lon: controller.point.lon }
			]
		});
	}

	/**
	 * Tells the map to move the visible region to the controllers current focused area.
	 * The map does not automatically sync with the controller area to avoid invalid point areas.
	 * I could look into using effect and checking for an invalid area.
	 */
	export function updateRegion(): void {
		// @ts-ignore
		chart.series[4].update({
			mapData:Highcharts.geojson(Data.createGeoJsonRegion(controller.area.n,controller.area.s,controller.area.start,controller.area.stop))
		});
	}
</script>
<svelte:window on:resize={()=>{chart.reflow(); chart.redraw()}} />
<div class="{className}" bind:this={map}></div>

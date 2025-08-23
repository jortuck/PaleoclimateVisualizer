<script lang="ts">
	// import * as Highcharts from 'highcharts';
	import * as Highcharts from 'highcharts/highmaps';
	import { Data, type MapData, type Variable } from '$lib/Data';
	import antarctica from '@highcharts/map-collection/custom/antarctica.topo.json';
	import continents from '@highcharts/map-collection/custom/world-continents.topo.json';
	import 'highcharts/modules/geoheatmap';
	import { onMount, untrack } from 'svelte';
	import { UI } from '$lib/DataController.svelte';

	const typeColors = {
		Bivalve: '#1f77b4',
		'Corals and Sclerosponges': '#ff7f0e',
		Other: '#2ca02c'
	};
	const data = [
		{ id: 'PAGES...', lat: 43.6561, lon: -69.8017, type: 'Bivalve' },
		{ id: '09japa...', lat: 27.105833, lon: 142.192222, type: 'Corals and Sclerosponges' },
		{ id: '08puer...', lat: 17.93457, lon: -67.00123, type: 'Corals and Sclerosponges' }
	];

	let defaultColorBarLimit: number = $state(1);
	let {
		trendURL,
		timeSeriesMode,
		projection,
		class: className,
		showArea,
		area,
		colorBarLimit,
		overrideColorBarLimit,
		point = $bindable()
	}: {
		trendURL: string;
		timeSeriesMode: 'point' | 'area' | 'asl' | 'nino' | 'cww';
		projection: 'EqualEarth' | 'Orthographic';
		class: string;
		showArea: boolean;
		colorBarLimit: number;
		overrideColorBarLimit: boolean;
		area: { n: number; s: number; start: number; stop: number };
		point: { lat: number; lon: number };
	} = $props();
	let map: HTMLElement | null = null;
	let chart: Highcharts.MapChart;

	$effect(() => {
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
				text: "Gemma O'Connor"
			},

			plotOptions: {
				map: {
					enableMouseTracking: false
				},
				mappoint: {
					enableMouseTracking: false,

					dataLabels: {
						enabled: false
					}
				},
				series: {
					nullInteraction: false,
					states: {
						hover: {
							enabled: false
						},
						inactive: { opacity: 1 }
					}
				}
			},
			title: { useHTML: true, text: 'Chart Loading' },
			series: [
				{
					type: 'geoheatmap',
					cursor: 'crosshair',
					interpolation: { enabled: true, blur: 1 },
					zIndex: 0,
					events: {
						click: (e: any) => {
							if (timeSeriesMode === 'point') {
								let lon = Math.round(e.lon);
								if (lon < -180) {
									lon = lon + 360;
								}
								if (point.lat != Math.round(e.lat) || point.lon != lon) {
									point = { lat: Math.round(e.lat), lon: lon };
								}
							}
						}
					}
				},
				{
					mapData: antarctica,
					zIndex: 2,
					borderColor: '#000',
					borderWidth: 1
				},
				{
					mapData: continents,
					type: 'map',
					zIndex: 2,
					borderColor: '#000',
					borderWidth: 1,
					visible: true
				},
				{
					type: 'mappoint',
					zIndex: 3,
					marker: {
						lineWidth: 1,
						lineColor: '#000',
						symbol: 'mapmarker',
						radius: 7
					}
				},
				{
					type: 'mappoint',
					visible: false,
					cluster: { enabled: false },
					keys: ['id', 'lat', 'lon', 'type'],
					marker: {
						symbol: 'circle',
						radius: 8
					},
					zIndex: 3,
					showArea: true,
					data: [
						{
							id: 'PAGES2kv2_Ocean2kHR-AtlanticMaineWanamaker2008_Ocn_148:d18O',
							lat: 43.6561,
							lon: -69.8017,
							color: 'cyan',
							type: 'Bivalve'
						},
						{
							id: '09japa01b:ext',
							lat: 27.105833,
							lon: 142.192222,
							type: 'Corals and Sclerosponges'
						},
						{
							id: '08puer01a:ext',
							lat: 17.93457,
							lon: -67.00123,
							type: 'Corals and Sclerosponges'
						}
					]
				},
				{
					type: 'map',
					zIndex: 7,
					nullColor: 'rgba(255,0,0,0.2)',
					borderColor: 'red'
				}
			],
			legend: {
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
				labels: {
					useHTML: true,
					format: '{value}'
				}
			}
		});
		return () => {
			chart.destroy();
		};
	});

	// Sync point/region series visibility with time series mode in controller.
	$effect(() => {
		// @ts-ignore
		chart.series[3].update({
			visible: !showArea
		});
		// @ts-ignore
		chart.series[5].update({
			visible: showArea
		});
	});

	/**
	 * Tells the map to move the visible point to the controllers current point.
	 * The map does not automatically sync with the controller point to avoid invalid point inputs.
	 * I could look into using effect and checking for an invalid point.
	 */
	$effect(() => {
		//@ts-ignore
		chart.series[3].update({
			data: [{ lat: point.lat, lon: point.lon }]
		});
	});

	/**
	 * Tells the map to move the visible region to the controllers current focused area.
	 * The map does not automatically sync with the controller area to avoid invalid point areas.
	 * I could look into using effect and checking for an invalid area.
	 */
	$effect(() => {
		// @ts-ignore
		chart.series[5].update({
			mapData: Highcharts.geojson(Data.createGeoJsonRegion(area.n, area.s, area.start, area.stop))
		});
	});
	$effect(() => {
		chart.update({
			mapView: {
				projection: {
					name: projection,
					projectedBounds: 'world',
					rotation: [180, 0, 0]
				}
			}
		});
	});
	$effect(() => {
		untrack(() => UI.loading++);
		fetch(trendURL).then((response) => {
			response.json().then((data) => {
				const mapData = data as MapData;
				let size = 1;
				if (mapData.lats.length < 17000) {
					size = 2;
				}
				//@ts-ignore
				let limit = untrack(() => {
					defaultColorBarLimit = mapData.bound;
					return defaultColorBarLimit;
				});
				if (!overrideColorBarLimit) {
					chart.update(
						{
							colorAxis: {
								tickPositions: [-limit, -limit / 2, 0, limit / 2, limit]
							}
						},
						false
					);
				}

				chart.series[0].update(
					{
						data: Data.createGeoPoints(mapData.lats, mapData.lons, mapData.values),
						colsize: size,
						rowsize: size
					},
					false
				);
				chart.update(
					{
						colorAxis: {
							stops: mapData.colorMap
						},
						title: { text: mapData.name },
						legend: { title: { text: mapData.variable } }
					},
					false
				);
				chart.redraw(false);
				untrack(() => UI.loading--);
			});
		});
	});
	$effect(() => {
		if (overrideColorBarLimit) {
			chart.update({
				colorAxis: {
					tickPositions: [-colorBarLimit, -colorBarLimit / 2, 0, colorBarLimit / 2, colorBarLimit]
				}
			});
		} else {
			let limit = untrack(() => defaultColorBarLimit);
			chart.update({
				colorAxis: {
					tickPositions: [-limit, -limit / 2, 0, limit / 2, limit]
				}
			});
		}
	});
</script>

<svelte:window
	on:resize={() => {
		chart.reflow();
	}}
/>
<div class={className} bind:this={map}></div>

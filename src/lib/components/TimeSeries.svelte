<script lang="ts">
	import { onMount } from 'svelte';
	import * as Highcharts from 'highcharts';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import type { TimeSeriesData } from '$lib/Data';

	let timeseries: any = $state(null);
	let { class: className, timeSeriesUrl }: { class: string; timeSeriesUrl: string } = $props();
	let chart: Highcharts.Chart;
	let size: any;
	$effect(() => {
		console.log('effect 1');
		chart = Highcharts.chart(timeseries, {
			chart: {
				backgroundColor: 'transparent'
			},
			credits: {
				text: "Gemma O'Connor"
			},
			title: {
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
					marker: {
						enabled: false
					},
					label: {
						connectorAllowed: true,
						style: {
							color: 'white'
						}
					}
				}
			},
			// series: timeSeriesData.values,
			legend: {
				useHTML: true
			}
		});
	});
	$effect(async () => {
		let request = await fetch(timeSeriesUrl);
		let timeSeriesData: TimeSeriesData = (await request.json()) as TimeSeriesData;
		chart.update(
			{
				series: timeSeriesData.values
			},
			true,
			true
		);
		chart.setTitle({ text: timeSeriesData.name });
	});
	// $effect(() => {
	// 	chart.update({ yAxis: { title: { text: controller.variable.annualUnit } } });
	// });
	function adjust() {
		console.log('adjust');
	}
</script>

<svelte:window on:resize={adjust} />
<div class={className} bind:this={timeseries}></div>

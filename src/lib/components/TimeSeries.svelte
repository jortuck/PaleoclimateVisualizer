<script lang="ts">
	import type { TimeSeriesData } from '$lib/Data';
	import { onMount, untrack } from 'svelte';
	import Highcharts from 'highcharts/highmaps';
	import { controller } from '$lib/ControllerState.svelte';

	let timeseries: any;
	let { timeSeriesData, class:className }: { timeSeriesData: TimeSeriesData, class: string} = $props();
	let chart: Highcharts.Chart;
	let size: any;
	onMount(() => {
		chart = Highcharts.chart(timeseries, {
			// @ts-ignore
			chart: {
				backgroundColor: 'transparent',
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
					marker:{
						enabled: false
					},
					label: {
						connectorAllowed: true,
						style: {
							color: 'white'
						}
					}
				},
			},
			series: timeSeriesData.values,
			legend: {
				useHTML: true
			}
		});
	});
	$effect(()=>{
		chart.update({
			series:timeSeriesData.values,

		}, true, true)
		chart.setTitle({ text: timeSeriesData.name });
	})
	$effect(()=>{
		chart.update({yAxis:{title:{text:controller.variable.annualUnit}}})
	})
	function adjust(){
		chart.reflow();
	}
</script>
<svelte:window on:resize={adjust}/>
<div class="{className}" bind:this={timeseries}></div>

<script lang="ts">
	import { onMount } from 'svelte';
	import * as Highcharts from 'highcharts';
	import { controller } from '$lib/ControllerState.svelte';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import type { TimeSeriesData } from '$lib/Data';

	let timeseries: any;
	let { class:className, timeSeriesData}: { class: string, timeSeriesData:TimeSeriesData} = $props();
	let chart: Highcharts.Chart;
	let size: any;

	$effect(() => {
		chart = Highcharts.chart(timeseries, {
			chart: {
				backgroundColor: 'transparent',
			},
			credits:{
				text:"Gemma O'Connor"
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

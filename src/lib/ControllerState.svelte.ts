import type { Reconstruction, Variable } from '$lib/Data';
import { PUBLIC_API_HOST } from '$env/static/public';

class ControllerState {
	mode: string = $state('trends');
	year: number = $state(1900);
	startYear: number = $state(1900);
	endYear: number = $state(2005);
	point:{lat:number, lon:number}=$state.frozen({lat:0,lon:0})
	loading: number = $state(0);
	modal: HTMLDialogElement | null = $state(null);
	variable: Variable = $state({
		variable: '',
		colorMap: '',
		name: '',
		nameShort: '',
		trendUnit: '',
		annualUnit: ''
	});
	reconstruction: Reconstruction = $state({
		reconstruction: '',
		name: '',
		timeEnd: 0,
		timeStart:0,
		nameShort: '',
		variables: null
	});

	reconstructions: Reconstruction[] = $state([]);
	variables: Variable[] = $state([]);

	trendUrl: string = $derived(
		PUBLIC_API_HOST +
		'/trends/' +
		this.reconstruction.reconstruction +
		'/' +
		this.variable.variable +
		'?startYear=' +
		this.startYear +
		'&endYear=' +
		this.endYear
	);
	annualUrl: string = $derived(
		PUBLIC_API_HOST +
		'/values/' +
		this.reconstruction.reconstruction +
		'/' +
		this.variable.variable +
		'/' +
		this.year
	);
	timeSeriesUrl: string = $derived(
		PUBLIC_API_HOST + '/timeseries/' + this.variable.variable + '/' + this.point.lat + '/' + this.point.lon
	);
}

export const controller = new ControllerState();
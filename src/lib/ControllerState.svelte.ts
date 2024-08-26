import type { Reconstruction, Variable } from '$lib/Data';
import { PUBLIC_API_HOST } from '$env/static/public';
import { z } from 'zod';

const pointSchema = z.object({
	lat: z.number().int().max(90).min(-90),
	lon: z.number().int().max(180).min(-180),
})
const areaSchema = z.object({
	n: z.number().int().max(90).min(-90),
	s: z.number().int().max(90).min(-90),
	start: z.number().int().max(180).min(-180),
	stop: z.number().int().max(180).min(-180),
}).refine((data) => {return data.s <= data.n}, {
	message: 's must be less than or equal to n',
	path: ['s'],
})

class ControllerState {
	mode : "trends"|"annual" = $state('trends');
	timeSeriesMode: "point"|"region"|"asl"|"nino"|"cww" = $state("point");
	year: number = $state(1900);
	point:{lat:number, lon:number}=$state({lat:0,lon:-150})
	area:{n:number, s:number, start:number, stop:number}=$state({n:10,s:-50,start:106,stop:150})
	invalidPoint: boolean = $derived(
		!pointSchema.safeParse({lat:this.point.lat,lon:this.point.lon}).success
	)
	invalidArea: boolean = $derived(
		!areaSchema.safeParse({
			n:this.area.n,
			s:this.area.s,
			start:this.area.start,
			stop:this.area.stop
		}).success
	)
	loading: number = $state(0);
	modal: HTMLDialogElement | null = $state(null);
	variable: Variable = $state({
		id: '',
		colorMap: '',
		name: '',
		nameShort: '',
		trendUnit: '',
		annualUnit: ''
	});
	projection:'EqualEarth'| 'Orthographic' = $state('EqualEarth')
	variables: Variable[] = $state([])
	reconstruction: Reconstruction = $state({
		reconstruction: '',
		name: '',
		timeEnd: 0,
		timeStart:0,
		nameShort: '',
		variables: []
	});
	reconstructions: Reconstruction[] = $state([]);
	startYear: number = $state(1900);
	endYear: number = $state(2005);
	trendUrl: string = $derived(
		PUBLIC_API_HOST +
		'/trends/' +
		this.reconstruction.reconstruction +
		'/' +
		this.variable.id +
		'?startYear=' +
		Math.max(this.startYear,this.reconstruction.timeStart) +
		'&endYear=' +
		Math.min(this.endYear,this.reconstruction.timeEnd)
	);
	annualUrl: string = $derived(
		PUBLIC_API_HOST +
		'/values/' +
		this.reconstruction.reconstruction +
		'/' +
		this.variable.id +
		'/' +
		this.year
	);
	timeSeriesUrl: string = $derived(
		PUBLIC_API_HOST + '/timeseries/' + this.variable.id + '/' + this.point.lat + '/' + this.point.lon
	);
	timeSeriesAreaUrl: string = $derived(
		PUBLIC_API_HOST + '/timeseries/' + this.variable.id + '/' + this.area.n + '/' + this.area.s + '/' + this.area.start + '/' + this.area.stop
	);
}

export const controller = new ControllerState();
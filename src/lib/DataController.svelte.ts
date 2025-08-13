import type {
	AvailableDataResponse,
	Dataset,
	DatasetIndividual,
	VariableMetadata
} from '$lib/Data';
import { PUBLIC_API_HOST } from '$env/static/public';

class UIController {
	loading: number = $state(0);

	setLoading() {
		this.loading++;
	}
	stopLoading() {
		this.loading--;
	}
}
export const UI = new UIController();
export class DataController {
	variables: VariableMetadata[];
	datasets: Dataset[];
	currentDataset: Dataset;
	currentVariable: VariableMetadata;
	timeSeriesUrl: string;
	trendUrl: string;
	startYear: number;
	endYear: number;
	year: number;
	projection: 'EqualEarth' | 'Orthographic';
	overrideColorBar: boolean = $state(false);
	colorBarLimit: number = $state(1);
	trendMode: 'trend' | 'annual' = $state('trend');
	timeSeriesMode: 'point' | 'area' | 'asl' | 'nino' | 'cww' = $state('point');
	timeSeriesPoint: { lat: number; lon: number } = $state({ lat: 0, lon: -150 });
	area: { n: number; s: number; start: number; stop: number } = $state({
		n: 10,
		s: -50,
		start: 106,
		stop: 150
	});
	constructor(response: AvailableDataResponse) {
		this.variables = response.variables;
		this.datasets = response.datasets;

		const initialDataset = response.datasets[0];
		const initialVariable = $state(
			response.variables.filter((v) => v.id === Object.keys(initialDataset.variables)[0])[0]
		);
		this.projection = $state(
			(localStorage.getItem('projection') as typeof this.projection) ?? 'EqualEarth'
		);
		this.currentDataset = $state(initialDataset);
		this.currentVariable = $state(initialVariable);
		this.startYear = $state(initialDataset.timeStart);
		this.year = $state(initialDataset.timeStart);
		this.endYear = $state(initialDataset.timeEnd);
		this.timeSeriesUrl = $derived.by(() => {
			if (this.timeSeriesMode === 'point') {
				return `${PUBLIC_API_HOST}/variables/${this.currentVariable.id}/timeseries?lat=${this.timeSeriesPoint.lat}&lon=${this.timeSeriesPoint.lon}`;
			}
			return `${PUBLIC_API_HOST}/variables/${this.currentVariable.id}/timeseries-area?n=${this.area.n}&s=${this.area.s}&start=${this.area.start}&stop=${this.area.stop}`;
		});
		this.trendUrl = $derived.by(() => {
			if (this.trendMode === 'annual') {
				return `${PUBLIC_API_HOST}/variables/${this.currentVariable.id}/trend/${this.currentDataset.id}?startYear=${this.year}&endYear=${this.year}`;
			} else {
				return `${PUBLIC_API_HOST}/variables/${this.currentVariable.id}/trend/${this.currentDataset.id}?startYear=${this.startYear}&endYear=${this.endYear}`;
			}
		});
	}
}

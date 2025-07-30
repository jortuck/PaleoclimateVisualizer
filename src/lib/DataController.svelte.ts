import type {
	AvailableDataResponse,
	Dataset,
	DatasetIndividual,
	VariableMetadata
} from '$lib/Data';
import { PUBLIC_API_HOST } from '$env/static/public';

export class DataController {
	variables: VariableMetadata[];
	datasets: Dataset[];
	currentDataset: Dataset;
	currentVariable: VariableMetadata;
	timeSeriesUrl: string;
	startYear: number;
	endYear: number;
	constructor(response: AvailableDataResponse) {
		this.variables = response.variables;
		this.datasets = response.datasets;

		const initialDataset = response.datasets[0];
		const initialVariable = $state(
			response.variables.filter((v) => v.id === Object.keys(initialDataset.variables)[0])[0]
		);

		this.currentDataset = $state(initialDataset);
		this.currentVariable = $state(initialVariable);
		this.startYear = $state(initialDataset.timeStart);
		this.endYear = $state(initialDataset.timeEnd);
		this.timeSeriesUrl = $derived(
			`${PUBLIC_API_HOST}/variables/${this.currentVariable.id}/timeseries`
		);
	}
}

import type {
	AvailableDataResponse,
	Dataset,
	DatasetIndividual,
	VariableMetadata
} from '$lib/Data';

export class DataController {
	variables: VariableMetadata[];
	datasets: Dataset[];
	currentDataset: Dataset;
	currentVariable: VariableMetadata;
	constructor(response: AvailableDataResponse) {
		this.variables = response.variables;
		this.datasets = response.datasets;

		const initialDataset = response.datasets[0];
		const initialVariable = $state(
			response.variables.filter(
				(v) => v.id === Object.keys(initialDataset.variables)[0]
			)[0]
		);

		this.currentDataset = $state(initialDataset);
		this.currentVariable = $state(initialVariable);
	}

}


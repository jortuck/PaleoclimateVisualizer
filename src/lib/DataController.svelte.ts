import type { DatasetIndividual, VariableMetadata } from '$lib/Data';

export class DataController {
	variable: VariableMetadata;
	currentDataset: DatasetIndividual;
	constructor(variable: VariableMetadata) {
		this.variable = variable;
		this.currentDataset = $state(variable.datasets[0])
	}
}


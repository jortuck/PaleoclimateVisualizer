
export class Data{
    public static createGeoPoints(lats: number[], lons: number[], values: number[]) : number[][]{
        return lats.map((lat, index) => [lons[index], lat, values[index]]);
    }
}
export type Variable = {
    variable: string;
    colorMap: string;
    name: string;
    nameShort: string;
    trendUnit: string;
    annualUnit: string;
}
export type Reconstruction = {
    reconstruction: string;
    name: string;
    nameShort: string;
    timeStart:number;
    timeEnd: number;
    varaibles: Variable[] | null;
}

export type AvaliableDataResponse = {
    reconstructions: Reconstruction[],
    variables: Variable[]
}

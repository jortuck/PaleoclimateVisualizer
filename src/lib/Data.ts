
export class Data{
    public static createGeoPoints(lats: any[], lons: any, values: any) : any[]{
        let result: any = [];
        for (let i :number = 0; i<lats.length; i++){
            result.push({
                "lat":lats[i],
                "lon": lons[i],
                "value":values[i]
            })
        }
        return result;
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

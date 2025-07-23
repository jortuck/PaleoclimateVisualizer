import * as Highcharts from 'highcharts/highmaps';

export class Data{
    /**
     * Converts three arrays of lats, lons, and values to one array filled with child arrays of
     * [lat,lon,value]
     * @param lats
     * @param lons
     * @param values
     */
    public static createGeoPoints(lats: number[], lons: number[], values: number[]) : [number,number,number][]{
        return lats.map((lat, index) => [lons[index], lat, values[index]]);
    }

    private static toDegreesEast(lon:number): number {
        if(lon < 0){
            lon = lon + 360
        }
        return lon;
    }
    private static rangeBetween(start: number, end: number): number[] {
        const result: number[] = [];

        if (start <= end) {
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
        } else {
            for (let i = start; i >= end; i--) {
                result.push(i);
            }
        }

        return result;
    }
    /**
     * Returns a GeoJSON polygon that covers a "square area" defined by the arguments.
     * @param startLat
     * @param endLat
     * @param startLon
     * @param endLon
     */
    public static createGeoJsonRegion(startLat: number, endLat:number, startLon:number, endLon:number){
        startLon = this.toDegreesEast(startLon);
        endLon = this.toDegreesEast(endLon);
        let coordinates: number[][] = []
        let lons: number[];
        if(startLon < endLon){
            lons = this.rangeBetween(Math.min(startLon,endLon),Math.max(startLon,endLon)+1)
        }else if(startLon === endLon){
            lons=[startLon];
        }else{
            lons = [...this.rangeBetween(startLon,361),...this.rangeBetween(0,endLon+1)];
        }
        let lats:number[] = this.rangeBetween(startLat,endLat);
        console.log(lats)
        // top border
        lons.forEach(lon => {
            coordinates.push([lon,startLat]);
        })
        // right border
        lats.forEach(lat => {
            coordinates.push([endLon,lat]);
        })
        lons.reverse().forEach(lon => {
            coordinates.push([lon,endLat]);
        })
        lats.reverse().forEach(lat => {
            coordinates.push([startLon,lat]);
        })
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            [...coordinates, coordinates[0]],
                        ],
                        "type": "Polygon"
                    }
                },

            ]
        }
    }
}
export type Variable = {
    id: string;
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
    variables: string [];
}



export type TimeSeriesData = {
    name: string;
    values: Highcharts.SeriesOptionsType[]
}
export type MapData = {
    min:number,
    max:number,
    name:string,
    variable:string,
    colorMap: [number,string][],
    lats: number[],
    lons: number[],
    values: number[],
}
export type DatasetIndividual = {
	id: string;
	name: string;
	nameShort: string;
	timeStart: number | null;
	timeEnd: number | null;
	path: string;
	type: "default"|"instrumental";
	p_value: string;
	r: string;
};
export type Dataset = {
	id: string;
	name: string;
	nameShort: string;
	variables: Record<string, string>; // variable_id -> file path
	type: string; // assume DatasetType is defined elsewhere
	timeStart: number; // optional with default 0
	timeEnd: number;   // optional with default 0
};
export type VariableMetadata = {
	id: string;
	colorMap: string;
	name: string;
	nameShort: string;
	multiplier: number;
	trendUnit: string;
	annualUnit: string;
	dataset_count: number;
	datasets: string[];
};
export type AvailableDataResponse = {
	variables: VariableMetadata[],
	datasets: Dataset[]
}
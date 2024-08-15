import Highcharts from 'highcharts/highmaps';

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

    /**
     * Returns a GeoJSON polygon that covers a "square area" defined by the arguments.
     * @param startLat
     * @param endLat
     * @param startLon
     * @param endLon
     */
    public static createGeoJsonRegion(startLat: number, endLat:number, startLon:number, endLon:number){
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            [
                                [
                                    startLon,
                                    startLat
                                ],
                                [
                                    endLon,
                                    startLat
                                ],
                                [
                                    endLon,
                                    endLat
                                ],
                                [
                                    startLon,
                                    endLat
                                ],
                                [
                                    startLon,
                                    startLat
                                ]
                            ]
                        ],
                        "type": "Polygon"
                    }
                }
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

export type AvailableDataResponse = {
    reconstructions: Reconstruction[],
    variables: Variable[]
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
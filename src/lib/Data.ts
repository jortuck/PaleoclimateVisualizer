
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
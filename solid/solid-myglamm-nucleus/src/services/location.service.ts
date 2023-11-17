import NucleusAPI from "./nucleusAPI";

class LocationAPI extends NucleusAPI {

    public fetchCountries = (where?: object, limit?: number) => {
        if (!limit) {
            limit = 10;
        }
        const filter = {
            limit,
            where
        };
        return this.NucleusAPI.get(
            `/location-ms/countryLanguageDetails?filter=${JSON.stringify(filter)}`
        );
    }
}

export default LocationAPI
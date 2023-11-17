import NucleusAPI from "./nucleusAPI";

/**
 * AuthAPI Class
 * @extends NucleusAPI
 */

 class AuthAPI extends NucleusAPI {
    public googleSignIn = (id_token: string) => {
        let headers = {};
        headers = {
            "apikey": import.meta.env.NUCLEUS_APIKEY,
        };
        return this.NucleusAPI.post(
            '/nucleusGoogleLogin',
            {
                id_token
            },
            { headers }
        );
    };
}

export default AuthAPI
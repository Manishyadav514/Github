import NucleusAPI from "./nucleusAPI";

class UtilityAPI extends NucleusAPI {
    public uploadImage = (body:FormData) => {
        let headers = {
            "apikey": import.meta.env.NUCLEUS_APIKEY,
            "content-type":"multipart/form-data; boundary=----WebKitFormBoundaryqwvzmIgWW9pMEq6p"
        };
        return this.NucleusAPI.post(
            '/image-upload-ms/services/upload?upload_flag=true&flag=1&sizes=50x50,200x200,400x400,800x800,1200x1200',
            body,
            { headers }
        );
    };
}

export default UtilityAPI
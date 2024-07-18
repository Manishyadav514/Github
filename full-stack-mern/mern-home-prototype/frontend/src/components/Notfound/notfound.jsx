import { Link } from "react-router-dom";

function notfound(){

return(
    <>
    <h3>404 not found</h3>
    <p>Go back to <Link to={"/"} className="text-blue-700 underline">Home</Link></p>
    </>
    
)

}

export default notfound
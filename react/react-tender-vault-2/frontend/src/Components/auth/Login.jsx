import { useState } from "react";
import { useNavigate } from "react-router";
import UtilityAPI from "../../api/utility";

const Login = () => {

  const [bidInfo, email] = useState({});
  const navigate = useNavigate()

  const createTenderHandler = async (event) => {
    event.preventDefault();
    let manaementAPI = new UtilityAPI();
    try {
      const response = await manaementAPI.createTender(bidInfo);
      if (response.success) {
        navigate('/viewbids');
      }
    } catch (error) {
      console.error("API call error:", error);
    }
    email({})
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    bidInfo((prevTenderInfo) => ({
      ...prevTenderInfo,
      [name]: value,
    }));
  };

  return (
    <div className="flex">
      <div className=" hidden lg:block w-1/2 h-screen bg-blue-400">
        <img
          className="object-cover h-full w-full"
          src={"/public/hero2.png"}
        />
      </div>
      <div className="flex lg:w-1/2  sm:w-full  justify-center p-16">
        <div className="flex flex-col gap-4">
          <div className="p-4 m-4">
            <span className='font-mont text-blue-800 text-4xl font-bold'>Tender</span>
            <span className='font-mont text-blue-400 text-4xl font-bold'>Vault</span>
          </div>

          <p className="text-gray-500 ">Existing User? </p>
          <h1 className="font-bold text-3xl font-mono">Login</h1>
          <form onSubmit={createTenderHandler}>
            <div className="flex flex-col gap-8  my-10">
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                  value={bidInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                  value={bidInfo.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="flex mx-10 p-5">
              <p
                className="
            text-gray-500 
            "
              >
                New User ?
              </p>
              <p
                className="text-blue-500 mx-1 hover: cursor-pointer"
                onClick={() => {
                  navigate("/register");
                }}
              >
                {"  "}
                Sign up
              </p>
            </div>

            <button
              type="submit"
              className="py-2 px-10 mx-24 my-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-500 hover:text-white hover:scale-110 duration-300"
            >
              Login
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
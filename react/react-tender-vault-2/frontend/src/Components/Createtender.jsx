import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { getLocalStorageValue } from '../utils/localStorage';
import UtilityAPI from '../api/utility';

const Createtender = () => {
  const [tenderInfo, setTenderInfo] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    bufferTime: 30

  });
  useEffect(() => {
    const user = getLocalStorageValue("user", true);
    console.log(user)
    tenderInfo.email = user?.email || ""
  })

  const showToast = (message, type = 'error') => {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  let navigate = useNavigate();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTenderInfo((prevTenderInfo) => ({
      ...prevTenderInfo,
      [name]: value,
    }));
  };

  const createTenderHandler = async (event) => {
    event.preventDefault();
    let manaementAPI = new UtilityAPI();
    try {
      const response = await manaementAPI.createTender(tenderInfo);
      if (response.success) {
        showToast('Tender Listed Successfully', 'success');
        navigate('/home');
      } else {
        showToast('You are not an admin!!', 'error');
      }
    } catch (error) {
      console.error("API call error:", error);
    }
  };


  return (
    <div>   <Navbar />

      <div className="bg-gray-200 min-h-[90vh] flex flex-col items-center justify-center">

        <div className="bg-white p-8 h-full my-10 rounded-lg shadow-md w-full max-w-lg">
          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-4">Create New Tender</h1>
          <form onSubmit={createTenderHandler}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold">
                Tender Title
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                value={tenderInfo.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold">
                Tender Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                value={tenderInfo.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="startTime" className="block text-gray-700 text-sm font-bold">
                Start Time
              </label>
              <input
                type="date"
                id="startTime"
                name="startTime"
                className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                value={tenderInfo.startTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="endTime" className="block text-gray-700 text-sm font-bold">
                End Time
              </label>
              <input
                type="date"
                id="endTime"
                name="endTime"
                className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                value={tenderInfo.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="bufferTime" className="block text-gray-700 text-sm font-bold">
                buffer Time
              </label>
              <input
                type="number"
                step="1"
                id="bufferTime"
                name="bufferTime"
                className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                value={tenderInfo.bufferTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover-bg-blue-600 focus:outline-none"
            >
              Create Tender
            </button>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Createtender;

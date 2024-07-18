import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UtilityAPI from '../api/utility';
import Navbar from '../Components/Navbar';
const ViewTender = () => {
  const [tenderDetails, setTenderDetails] = useState({});
  const { id } = useParams(); // Extracting the ID from route params
  const navigate = useNavigate()
  useEffect(() => {
    fetchTenderDetails()
  }, [id]);


  const fetchTenderDetails = async () => {
    let manaementAPI = new UtilityAPI();
    try {
      const response = await manaementAPI.fetchTenderByID(id);
      setTenderDetails(response.data)
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  const [bidInfo, setBidInfo] = useState({});

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
    setBidInfo({})
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    bidInfo((prevTenderInfo) => ({
      ...prevTenderInfo,
      [name]: value,
    }));
  };

  return (
    <div>   <Navbar />
      <div className="h-full py-10 bg-gray-200  flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
          <h1 className="mb-4 text-2xl font-semibold text-center text-gray-900">Place Your Bid</h1>
          <div className="mb-20 max-w-md mx-auto bg-white rounded-md overflow-hidden border border-red-400 shadow-lg shadow-red-400">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-2">{tenderDetails.name}</h2>
              <p className="text-gray-600 mb-4">{tenderDetails.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold">Start Time:</p>
                  <p>{new Date(tenderDetails.startTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-semibold">End Time:</p>
                  <p>{new Date(tenderDetails.endTime).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold">Buffer Time:</p>
                <p>{tenderDetails.bufferTime}</p>
              </div>
            </div>
          </div>
          <form onSubmit={createTenderHandler}>
            <div className="mb-4">
              <label htmlFor="bufferTime" className="block text-gray-700 text-sm font-bold">
                Bid amount
              </label>
              <input
                type="number"
                step="1"
                id="bufferTime"
                name="bufferTime"
                min={0}
                className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                value={bidInfo.setBidInfo}
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
    </div>
  );
};

export default ViewTender;

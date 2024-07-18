import { useState, useEffect } from 'react';
import electric from "../img/electric.jpg"
import { useNavigate } from "react-router-dom";
import { formatDate } from '../Components/format';
import Navbar from '../Components/Navbar';
import UtilityAPI from '../api/utility';

const Landing = () => {
  const [tender, setTender] = useState();
  const navigate = useNavigate()

  useEffect(() => {
    getAllTenders()
  }, []);


  const getAllTenders = async () => {
    let manaementAPI = new UtilityAPI();
    try {
      // const response = await manaementAPI.fetchTenderByID("6624b230baac441c3ae23a9f");
      const response = await manaementAPI.fetchTender();
      setTender(response.data)
    } catch (error) {
      console.error("API call error:", error);
    }
  };
  
  return (

    <>
      <div className='flex flex-col w-full'>
        <Navbar />

        <div className='w-screen h-[calc(100vh-5rem)]'>
          <div className="bg-cover bg-[url('/public/hero2.png')] bg-center bg-no-repeat h-full w-full" >
            <div className="container mx-auto flex flex-col my-auto align-middle h-full" >
              <div className='my-auto  mx-auto lg:mx-0 w-10/12 lg:w-2/5'>
                <h1 className="text-5xl mb-4 font-mont font-bold "><span className='font-mont text-6xl text-blue-500 font-bold'>Your tenders</span> your way!</h1>
                <p className="text-2xl mb-8">Navigate the complexities of tenders effortlessly with our management system!</p>
              </div>
            </div>
          </div>
        </div>
        <section>
          <div className="container px-5 py-24 mx-auto">
            <h2 className='text-2xl font-bold text-blue-700 flex justify-center'>View Tender</h2>
            <h1 className='flex justify-center text-4xl	text-gray-900 font-normal mb-12'>Bid your amount and win the tender</h1>
            {
              <div className="w-full flex flex-wrap -m-4 items-center justify-center">
                {
                  tender?.length ? tender.map((items) => (
                    <div key={items._id} className="xl:w-1/4 md:w-1/2 sm:w-5/6 mx-auto lg:mx-0 p-4">
                      <img
                        onClick={() => navigate(`viewtender/${items._id}`)}
                        className="h-[300px] rounded w-full object-cover object-center mb-6  cursor-pointer"
                        src={electric}
                        alt="content"
                      />
                      <h3 className="flex justify-center text-2xl">{items.name}</h3>
                      <h2 className="flex justify-center text-base text-violet-500 mb-4">{items.description}</h2>
                      <p className='text-gray-500'>{`From: ${formatDate(items.startTime)}`}</p>
                      <p className='text-gray-500'>{`To: ${formatDate(items.endTime)}`}</p>
                    </div>
                  )) : <p>no bidding</p>
                }


              </div>
            }
          </div>
        </section>
      </div>
    </>


  )
}

export default Landing
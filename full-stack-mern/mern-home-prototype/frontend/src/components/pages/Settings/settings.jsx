import { useState, useEffect } from "react";
import s from "./settings.module.css";
import axios from "axios";
import { useDevices } from "../../../context/DevicesContext";
import Editdevice from "../../editdevice/editdevice";
import Deletedevice from "../../deletedevice/deletedevice";
import Weatherloc from "../../weatherloc/weatherloc";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

function Settings() {
  const { devices, setDevices } = useDevices();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const baseurl = "http://localhost:3000";
  const [formdata, setformdata] = useState({
    location: "Living Room",
  });

  const handledevicedata = (e) => {
    setformdata({
      ...formdata,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };

  const handledevicesubmit = async (e, formdata) => {
    e.preventDefault();
    // validae the image url for a new device
    function isValidURL() {
      // Regular expression to match a URL pattern
      var urlPattern =
        /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)?([\w-]+\.\w{2,})(\/[\w-]+(\.[\w-]+)*)*\/?(\?\S*)?(#\S*)?$/;

      // Test the input against the regular expression
      return urlPattern.test(formdata.image);
    }

    if (!isValidURL()) {
      alert("Enter a valid url");
      return;
    }

    try {
      const newdevice = {
        name: formdata.name,
        state: false,
        image: formdata.image,
        location: formdata.location,
      };
      // add the new device to the database using the api
      const response = await axios.post(`${baseurl}/adddevice`, newdevice, {
        // add the token to the header for authentication
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setDevices(response.data.devices);
      alert("Device added successfully");
    } catch (error) {
      alert("An error occured while trying to add devices");
      throw error;
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    // get all the devices in the initial mount
    const getDevices = async () => {
      const response = await axios.get(`${baseurl}/devices`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setDevices(response.data.devices);
    };
    getDevices();
  }, []);

  return (
    <div className="settings">
      <h1 className="font-semibold ">Settings</h1>
      <form onSubmit={(e) => handledevicesubmit(e, formdata)}>
        <div class="max-w-2xl bg-white py-2  w-full mt-1">
          <div className="text-[28px] mb-2">Add device</div>

          <div className="grid grid-cols-2 gap-2 max-w-xl m-auto">
            <div className="col-span-2 lg:col-span-1">
              <input
                type="text"
                id="name"
                className="border border-solid border-black rounded-[24px] px-[12px] py-[3px] md:text-[22.5px] w-full"
                onChange={handledevicedata}
                placeholder="Name"
              />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <input
                type="text"
                id="image"
                className="border border-solid border-black rounded-[24px] px-[12px] py-[3px] md:text-[22.5px] w-full"
                onChange={handledevicedata}
                placeholder="image url"
              />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <select
                id="location"
                value={formdata.location}
                className="border border-solid border-black rounded-[24px] px-[12px] py-[3px] md:text-[22.5px] "
                onChange={handledevicedata}
              >
                <option className="md:text-[22.5px]">Living Room</option>
                <option className="md:text-[22.5px]">Bed Room</option>
              </select>
            </div>

            <div className="col-span-2 text-right">
              <button
                disabled={Object.keys(formdata).length !== 3}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded-full text-xs w-full sm:w-14 "
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </form>

      <Editdevice />
      <Deletedevice />
      <Weatherloc />
    </div>
  );
}

export default Settings;

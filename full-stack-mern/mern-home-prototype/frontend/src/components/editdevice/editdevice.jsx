import s from "./editdevice.module.css";
import { useDevices } from "../../context/DevicesContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
function editdevice() {
  const { devices, setDevices } = useDevices();
  const { user } = useAuthContext();

  const [dataLoaded, setDataLoaded] = useState(false);

  const [upformdata, setupformdata] = useState({});
  const baseurl = "http://localhost:3000";

  const updatedevices = async (e, upformdata) => {
    e.preventDefault();

    if (upformdata.property == "location") {
      const str = upformdata.newvalue;
      function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }
      const titlecase = toTitleCase(str);
      if (titlecase !== "Bed Room" && titlecase !== "Living Room") {
        alert("Accepted location values are Bed Room or Living Room");
        return;
      }
      upformdata.newvalue = titlecase;
    } else if (upformdata.property == "image") {
      function isValidURL() {
        // Regular expression to match a URL pattern
        var urlPattern =
          /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)?([\w-]+\.\w{2,})(\/[\w-]+(\.[\w-]+)*)*\/?(\?\S*)?(#\S*)?$/;

        return urlPattern.test(upformdata.newvalue);
      }

      if (!isValidURL()) {
        alert("Enter a valid url");
        return;
      }
    }

    try {
      const update = {
        [upformdata.property]: upformdata.newvalue,
      };
      const response = await axios.put(
        `${baseurl}/updatedevice/${upformdata.deviceid}`,
        update,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setDevices(response.data.devices);
      // console.log(upformdata)
      alert("Device updated successfully");
    } catch (error) {
      throw new Error("An error occurred while updating the device: " + error);
    }
  };

  const handledevicedata = (e) => {
    setupformdata({
      ...upformdata,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };

  useEffect(() => {
    if (devices.length > 0) {
      setDataLoaded(true);
    }
  }, [devices]);

  if (!dataLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <form
        className="grid grid-cols-2 gap-2 max-w-xl m-auto"
        onSubmit={(e) => updatedevices(e, upformdata)}
      >
        <div className="col-span-2 text-left text-[28px]">Update device</div>

        <div className="col-span-2 lg:col-span-1">
          <select
            id="deviceid"
            onChange={handledevicedata}
            className="border border-solid border-black rounded-[24px] px-[12px] py-[3px] md:text-[22.5px] "
            required
          >
            <option value={" "} disabled selected hidden>
              Select device name
            </option>
            {devices.map((device) => (
              <option key={device._id} value={device._id}>
                {device.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <select
            id="property"
            onChange={handledevicedata}
            required
            className="border border-solid border-black rounded-[24px] px-[12px] py-[3px] md:text-[22.5px] "
          >
            <option value={" "} disabled selected hidden>
              Select device property
            </option>
            <option value="name" className="md:text-[22.5px]">
              Name
            </option>
            <option value="location" className="md:text-[22.5px]">
              location
            </option>
            <option value="image" className="md:text-[22.5px]">
              image url
            </option>
          </select>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <input
            type="text"
            id="newvalue"
            onChange={handledevicedata}
            className="border border-solid border-black rounded-[24px] px-[12px] py-[3px] md:text-[22.5px] w-full"
            placeholder="New Value"
          />
        </div>

        <div className="col-span-2 text-right">
          <button
            disabled={Object.keys(upformdata).length !== 3}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded-full text-xs w-full sm:w-14 "
          >
            Update
          </button>
        </div>
      </form>
    </>
  );
}

export default editdevice;

import { useDevices } from "../../context/DevicesContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";

function deletedevice() {
  const { devices, setDevices } = useDevices();
  const [dataLoaded, setDataLoaded] = useState(false);
  const baseurl = "http://localhost:3000";
  const [selectdeletedevice, setSelectDeleteDevice] = useState(" ");
  const { user } = useAuthContext();
  const handledeviceselect = (e) => {
    setSelectDeleteDevice(e.currentTarget.value);
  };

  const handledeletedevices = async (e, selectdeletedevice) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `${baseurl}/deletedevice/${selectdeletedevice}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setDevices(response.data.devices);
      alert("Device deleted successfully");
    } catch (error) {
      console.log("An error occured while deleting devices " + error);
    }
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
        onSubmit={(e) => handledeletedevices(e, selectdeletedevice)}
      >
        <div className="col-span-2 text-left text-[28px]">Delete device</div>

        <div className="col-span-2 lg:col-span-1">
          <select
            id="devicename"
            onChange={handledeviceselect}
            required
            className="border border-solid border-black rounded-[24px] px-[12px] py-[3px] md:text-[22.5px] "
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

        <div className="col-span-2 text-right">
          <button
            disabled={selectdeletedevice == " "}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded-full text-xs w-full sm:w-14 "
          >
            Delete
          </button>
        </div>
      </form>
    </>
  );
}

export default deletedevice;

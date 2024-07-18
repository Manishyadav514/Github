import TEMPCHART from "../../tempchart/Tempchart";
import Dpowercons from "../../dpowercons/dpowercons";
import { useDevices } from "../../../context/DevicesContext";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

function statistics() {
  const { devices, setDevices } = useDevices();
  const baseurl = "http://localhost:3000";
  const [loading, setLoading] = useState("true");
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // if the user is not authenticated, redirect to /login
    if (!user) {
      navigate("/login");
    }

    // get devices to show power consumption
    const getDevices = async () => {
      const response = await axios.get(`${baseurl}/devices`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setDevices(response.data.devices);
      setLoading(false);
    };
    getDevices();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="statistics">
      <h1 className="font-semibold">Statistics</h1>
      {/* Chart showing the weather forecast for the upcoming week */}
      <TEMPCHART />
      <h1 className="font-semibold mt-5">
        Device power consumption (for the current session)
      </h1>
      {devices.map((device) => (
        <Dpowercons
          key={device._id}
          title={"Power consumption - " + device.name}
        />
      ))}
    </div>
  );
}

export default statistics;

import React, { useEffect, useState } from "react";
import { useCoords } from "../../context/CoordsContext";
import { Line } from "react-chartjs-2";
import axios from "axios";
// chart js imports for chart rendering
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TemperatureChart = () => {
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState({});
  const [error, setError] = useState(null);
  const { Coords, setCoords } = useCoords();

  useEffect(() => {
    setError(null);
    const fetchdata = async () => {
      // api request to get the weather forecast for the next 7 days
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${Coords.latitude}&longitude=${Coords.longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        console.log(response.data);
        setChart(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        console.log(error);
      }
    };

    fetchdata();
  }, [Coords]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error {error.message}</p>;
  }

  // chart data

  const data = {
    labels: chart.daily.time.map((x) => x),
    datasets: [
      {
        label: `Max Temperature`,
        data: chart.daily.temperature_2m_max.map((x) => x),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
      {
        label: `Min Temperature`,
        data: chart.daily.temperature_2m_min.map((x) => x),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {},
    legend: {
      labels: {
        fontSize: 25,
      },
    },
  };

  const chartContainerStyle = {
    position: "relative",
    height: "80vh",
    width: "60vw",
  };

  // Render the component
  return (
    <div className="tempchart">
      <div style={chartContainerStyle}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default TemperatureChart;

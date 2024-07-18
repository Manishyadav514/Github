import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import s from "./widgets.module.css";
import { uselocation } from "../../context/locationcontext";
import { useCoords } from "../../context/CoordsContext";

function widgets() {
  const api_key = import.meta.env.VITE_API_KEY;
  const { customLocation, setcustomLocation } = uselocation();
  const [weatherdata, setweatherdata] = useState({});
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(null);
  const [time, settime] = useState(new Date());
  const { Coords, setCoords } = useCoords();

  const intervalTime = 15 * 60 * 1000;
  const intervalTime2 = 1000;

  useEffect(() => {
    // get weather information based on the user's location
    const fetchdata = async (locationdata) => {
      try {
        seterror(null);
        const { latitude, longitude } = locationdata.coords;
        setCoords({ latitude, longitude });
        // api request to get the weather information
        let api_url = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${latitude},${longitude}`;
        // if the user has entered a custom location, get the weather information for that location
        if (customLocation !== " ") {
          const input = customLocation;
          function processInput(input) {
            const trimmedInput = input.trim();
            // Replace consecutive white spaces with a single space
            const cleanedInput = trimmedInput.replace(/\s+/g, " ");
            return cleanedInput;
          }

          const processedInput = processInput(input);

          console.log(processedInput);

          api_url = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${processedInput}`;
        }
        const response = await axios.get(api_url);

        setweatherdata(response.data);
        console.log(response.data);
        setloading(false);
      } catch (error) {
        console.log(error);
        setloading(false);
        if (error.response && error.response.status === 400) {
          seterror(
            new Error("Location not found. Please enter a valid location.")
          );
        } else {
          seterror(error);
        }
      }
    };
    // get the current time
    const timer = setInterval(() => settime(new Date()), 1000);
    // get the user's location
    const coords = navigator.geolocation.getCurrentPosition(fetchdata);
    const api_request = setInterval(() => fetchdata, intervalTime);

    return () => {
      clearInterval(timer);
      clearInterval(api_request);
    };
  }, [customLocation]);

  if (loading) {
    return <p>Loading....</p>;
  }

  if (error) {
    return <p>Error : {error.message}</p>;
  }

  const Time = weatherdata.location.localtime;
  const parts = Time.split(" ");
  const datepart = parts[0];
  const timepart = parts[1];

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  // const adjustedTime = new Date(time.getTime() + cityTimeZoneOffset * 60 * 1000);

  return (
    <div className={s.container}>
      <p className={s.locationname}>Local Time</p>
      <div className={s.timewe}>
        {/* <p className={s.time}>{adjustedTime.toTimeString().slice(0,5)}</p> */}
        <p className={s.time}>{time.toTimeString().slice(0, 5)}</p>
      </div>
      {/* <p className={s.date}>{adjustedTime.toLocaleDateString("en-US", options)}</p>  */}
      <p className={s.date}>{time.toLocaleDateString("en-US", options)}</p>
      <p className={s.locationname}>
        Weather in: {weatherdata.location.country}, {weatherdata.location.name}
      </p>
      <div className="flex items-center justify-around">
        <p className="text-[0.9rem]">{weatherdata.current.condition.text}</p>
        <img className={s.image} src={weatherdata.current.condition.icon}></img>
      </div>
      <div className={s.temp_container}>
        <div className={s.tempicon}>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 30 30"
            className="h-6 w-6 text-white"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.91,19.56c0-0.85,0.2-1.64,0.59-2.38s0.94-1.35,1.65-1.84V5.42c0-0.8,0.27-1.48,0.82-2.03S14.2,2.55,15,2.55
	c0.81,0,1.49,0.28,2.04,0.83c0.55,0.56,0.83,1.23,0.83,2.03v9.92c0.71,0.49,1.25,1.11,1.64,1.84s0.58,1.53,0.58,2.38
	c0,0.92-0.23,1.78-0.68,2.56s-1.07,1.4-1.85,1.85s-1.63,0.68-2.56,0.68c-0.92,0-1.77-0.23-2.55-0.68s-1.4-1.07-1.86-1.85
	S9.91,20.48,9.91,19.56z M11.67,19.56c0,0.93,0.33,1.73,0.98,2.39c0.65,0.66,1.44,0.99,2.36,0.99c0.93,0,1.73-0.33,2.4-1
	s1.01-1.46,1.01-2.37c0-0.62-0.16-1.2-0.48-1.73c-0.32-0.53-0.76-0.94-1.32-1.23l-0.28-0.14c-0.1-0.04-0.15-0.14-0.15-0.29V5.42
	c0-0.32-0.11-0.59-0.34-0.81C15.62,4.4,15.34,4.29,15,4.29c-0.32,0-0.6,0.11-0.83,0.32c-0.23,0.21-0.34,0.48-0.34,0.81v10.74
	c0,0.15-0.05,0.25-0.14,0.29l-0.27,0.14c-0.55,0.29-0.98,0.7-1.29,1.23C11.82,18.35,11.67,18.92,11.67,19.56z M12.45,19.56
	c0,0.71,0.24,1.32,0.73,1.82s1.07,0.75,1.76,0.75s1.28-0.25,1.79-0.75c0.51-0.5,0.76-1.11,0.76-1.81c0-0.63-0.22-1.19-0.65-1.67
	c-0.43-0.48-0.96-0.77-1.58-0.85V9.69c0-0.06-0.03-0.13-0.1-0.19c-0.07-0.07-0.14-0.1-0.22-0.1c-0.09,0-0.16,0.03-0.21,0.08
	                c-0.05,0.06-0.08,0.12-0.08,0.21v7.34c-0.61,0.09-1.13,0.37-1.56,0.85C12.66,18.37,12.45,18.92,12.45,19.56z"
            ></path>
          </svg>
        </div>
        <p className={s.temp}>
          <span className={s.tempp}>Temperature</span>
          <br />
          <span className={s.temp}>{weatherdata.current.temp_c}°C</span>
        </p>
      </div>

      <div className={s.temp_container}>
        <div className={s.tempicon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            className="bi bi-wind"
            viewBox="0 0 16 16"
          >
            {" "}
            <path d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5zm-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2zM0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5z" />{" "}
          </svg>
        </div>
        <p className={s.temp}>
          <span className={s.tempp}>Wind Speed</span>
          <br />
          <span className={s.temp}>{weatherdata.current.wind_kph} km/h</span>
        </p>
      </div>
    </div>
  );
}

export default widgets;

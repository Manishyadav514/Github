import { useEffect, useState } from 'react';
import axios from 'axios';
import './Outpatients.css';
import InpatientDetails from '../components/InpatientDetails';



function Inpatients() {
  const [inpatients, setInpatients] = useState([]);
  

  useEffect(() => {
    axios
      .get('https://fsf22s-8090.csb.app/inpatients')
      .then((response) => setInpatients(response.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">

      <table>
        <thead>
          <tr className="header_row">
            <th>Sr. No.</th>
            <th>Unique ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Patient type</th>
            <th>More </th>

          </tr>
        </thead>

        <tbody>
          {inpatients.map((inpatient, index) => (

            <InpatientDetails inpatient={inpatient} index={index} />
          ))}
        </tbody>
      </table>
      
    </div>
  );
}

export default Inpatients;


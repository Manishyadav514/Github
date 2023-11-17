import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const InpatientDetails = ({ inpatient, index }) => {
  const [openRowIndex, setOpenRowIndex] = useState(null);
  const navigate = useNavigate();
  const handleRowClick = (rowIndex) => {
    setOpenRowIndex(rowIndex === openRowIndex ? null : rowIndex);
  };

  return (
    <>
      <tr key={inpatient._id} style={{ height: '5px' }}>
        <td>{index + 1}</td>
        <td>{inpatient._id}</td>
        <td>{inpatient.name}</td>
        <td>{inpatient.age}</td>
        <td>{inpatient.sex}</td>
        <td>{inpatient.patient_type}</td>
        <td
          onClick={() => handleRowClick(index)}
          style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
        >
          moredetails
        </td>
      </tr>
      {openRowIndex === index && (
        <tr key={`${inpatient._id}-details`}>
          <td align="center" colSpan={7} className="details-row">
            <table>
              <thead>
                <tr className="header_row">
                  <th>Occupation</th>
                  <th>Marital Status</th>
                  <th>Address</th>
                  <th>State</th>
                  <th>Pincode</th>
                  <th>Country</th>
                  <th>Mobile No.</th>
                </tr>
              </thead>
              <tbody>
                <tr key={inpatient._id}>
                  <td>{inpatient.occupation}</td>
                  <td>{inpatient.maritalStatus}</td>
                  <td>{inpatient.address}</td>
                  <td>{inpatient.state}</td>
                  <td>{inpatient.pincode}</td>
                  <td>{inpatient.country}</td>
                  <td>{inpatient.mobileNo}</td>
                </tr>
              </tbody>

            </table>
            <button
              className="square-button"
              onClick={() =>
                navigate(`/opemr/${inpatient._id}`)}
            >
              OP EMR
            </button>
          </td>
        </tr>
      )}
    </>
  );
};

export default InpatientDetails;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const EditableTable = () => {
  // const [data, setData] = useState();
  const location = useLocation();
  
  // useEffect(() => {
  //   fetch(`https://swapi.dev/api/people/${personId}`, {})
  //     .then((res) => res.json())
  //     .then((response) => {
  //       setData(response);
  //       setIsLoading(false);
  //       console.log(`https://swapi.dev/api/people/${personId}`);
  //     })
  //     .catch((error) => console.log(error));
  // }, [personId]);
  const [data, setData] = useState([
    { id: 1, diagnosis: 'Diagnosis 1' },
    { id: 2, diagnosis: 'Diagnosis 2' },
    // Add more data as needed
  ]);

  const handleEdit = (id, newValue) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, diagnosis: newValue } : item
      )
    );
  };
  
  return (
    <table>
      <thead>
        <tr>
          <th>{location.pathname}</th>
          <th>Diagnosis</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td contentEditable onBlur={(e) => handleEdit(item.id, e.target.innerText)}>
              {item.diagnosis}
            </td>
            <td>Edit</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const EditableSection = ({ title }) => {
  const [content, setContent] = useState('');

  const handleContentChange = (e) => {
    setContent(e.target.innerText);
  };

  return (
    <div>
      <h2>{title}</h2>
      <div
        contentEditable
        onBlur={handleContentChange}
        style={{ border: '1px solid #ccc', padding: '10px' }}
      >
        {content}
      </div>
    </div>
  );
};

const YourComponent = () => {
  return (
    <div>
      <EditableTable />
      <EditableSection title="Presenting Complaints" />
      <EditableSection title="Past History" />
      <EditableSection title="Examination" />
      <EditableSection title="Discussion" />
      <EditableSection title="Investigation" />
      <EditableSection title="Previous Medication" />
    </div>
  );
};

export default YourComponent;

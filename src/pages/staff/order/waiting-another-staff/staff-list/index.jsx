import { useEffect, useState } from "react";
import api from "../../../../../config/axios";
import { Divider, message } from "antd";
import "./index.css";
function StaffList({ id }) {
  const [staff, setStaff] = useState([]);
  const fetchStaff = async () => {
    try {
      const response = await api.get(`orders/responsible?orderId=${id}`);
      console.log(response.data?.listEmployee);
      setStaff(response.data?.listEmployee);
    } catch (error) {
      message.error(error);
    }
  };
  useEffect(() => {
    fetchStaff();
  }, []);
  return (
    <div>
      {staff.map((staff) => (
        <ShowStaff key={staff.id} staff={staff} />
      ))}
    </div>
  );
}

const ShowStaff = ({ staff }) => {
  return (
    <div>
      
      <div className="staff-list">
        <div style={{ color: "#e25822" }}>
          <p>Staff ID:</p>
          <p>Name: </p>
          <p>Email: </p>
          <p>Phone: </p>
        </div>
        <div>
          <p>{staff?.id}</p>
          <p>{staff?.name}</p>
          <p>{staff?.email} </p>
          <p>{staff?.phoneNumber} </p>
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default StaffList;

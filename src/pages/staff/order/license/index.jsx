import { useEffect, useState } from "react";
import api from "../../../../config/axios";
import "./index.css";
import { Image } from "antd";
function License({ id }) {
  const [license, setLicense] = useState([]);

  const fetchLicense = async () => {
    try {
      const response = await api.get(`/licence/order-id?id=${id}`);
      console.log(response.data);
      setLicense(response.data);
      console.log(response.data);
    } catch (err) {
      console.log("ERROR", err);
    }
  };
  useEffect(() => {
    fetchLicense();
  }, []);
  return (
    <div>
      {license.map((license, index) => (
        <ShowLicense key={license.id} licenses={license} index={index} />
      ))}
    </div>
  );
}

const ShowLicense = ({ licenses, index }) => {
  return (
    <div>
      <div className="licence">
        <div className="licence-item">
          <p className="color">{index + 1}</p>
          <Image
            className="koi-img"
            src="https://4.bp.blogspot.com/-r30hIrcWmbw/T0Kt9CqP51I/AAAAAAAAAEs/Y2pZvL1bjNQ/s1600/09-28-2011+155.JPG"
            alt=""
          />

          {/* <Image className="koi-img" src={licenses?.imgKoi} alt="" /> */}
          <p>{licenses?.name}</p>
        </div>
        <div className="licence-item">
          <Image
            className="koi-img"
            src="https://4.bp.blogspot.com/-r30hIrcWmbw/T0Kt9CqP51I/AAAAAAAAAEs/Y2pZvL1bjNQ/s1600/09-28-2011+155.JPG"
            alt=""
          />
          <div className="item">
            <p>Size: {licenses?.size}</p>
            <p>Weight: {licenses?.weight}</p>
          </div>
        </div>

        <p>
          Price of Koi: <span className="color"> {licenses?.priceOfKoi}</span>
        </p>
      </div>
    </div>
  );
};

export default License;

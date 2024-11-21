import { useEffect, useState } from "react";
import api from "../../../../config/axios";
import "./index.css";
import { Image } from "antd";

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const sizeOptions = [
  { 
    minSize: 1,
    maxSize: 19.9,
    sizeInCM: "1-19.9", 
    sizeInInch: "0.39 - 7.86", 
    points: 1.25,
    description: "Extra Small"
  },
  { 
    minSize: 20,
    maxSize: 25,
    sizeInCM: "20-25", 
    sizeInInch: "7.87 - 9.84", 
    points: 2,
    description: "Small"
  },
  { 
    minSize: 25.1,
    maxSize: 30,
    sizeInCM: "25.1-30", 
    sizeInInch: "9.85 - 11.81", 
    points: 2.5,
    description: "Small-Medium"
  },
  { 
    minSize: 30.1,
    maxSize: 40,
    sizeInCM: "30.1-40", 
    sizeInInch: "11.82 - 15.75", 
    points: 3,
    description: "Medium"
  },
  { 
    minSize: 40.1,
    maxSize: 44,
    sizeInCM: "40.1-44", 
    sizeInInch: "15.76 - 17.32", 
    points: 5,
    description: "Medium-Large"
  },
  { 
    minSize: 44.1,
    maxSize: 50,
    sizeInCM: "44.1-50", 
    sizeInInch: "17.33 - 19.6", 
    points: 7.5,
    description: "Large"
  },
  { 
    minSize: 50.1,
    maxSize: 55,
    sizeInCM: "50.1-55", 
    sizeInInch: "19.7 - 21.6", 
    points: 9,
    description: "Extra Large"
  },
  { 
    minSize: 55.1,
    maxSize: 65,
    sizeInCM: "55.1-65", 
    sizeInInch: "21.7 - 25.5", 
    points: 14,
    description: "Jumbo"
  },
  {
    minSize: 50,
    maxSize: 60,
    sizeInCM: "50-60 Hirenaga (Butterfly)",
    sizeInInch: "19.7 - 23.4",
    points: 12,
    description: "Butterfly Large"
  },
  {
    minSize: 60.1,
    maxSize: 65,
    sizeInCM: "60.1-65 Hirenaga (Butterfly)",
    sizeInInch: "23.5 - 25.5",
    points: 14,
    description: "Butterfly Extra Large"
  },
  { 
    minSize: 65.1,
    maxSize: 73,
    sizeInCM: "65.1-73",
    sizeInInch: "25.6 - 28.7",
    points: 16,
    description: "Super Jumbo"
  },
  { 
    minSize: 73.1,
    maxSize: 83,
    sizeInCM: "73.1-83",
    sizeInInch: "28.8 - 32.6",
    points: 18,
    description: "Ultra Jumbo"
  }
];

const getSizeDetails = (size) => {
  if (!size) return null;
  
  try {
    // Handle Hirenaga (Butterfly) types first
    if (size.includes('Hirenaga')) {
      return sizeOptions.find(option => option.sizeInCM.includes('Hirenaga'));
    }

    // Extract the first number (minimum size)
    const minSize = parseFloat(size.match(/\d+\.?\d*/)?.[0]);
    if (!minSize) return null;

    // Find the appropriate size range based on minimum size
    const sizeOption = sizeOptions.find(option => {
      if (!option.sizeInCM.includes('Hirenaga')) {
        return minSize >= option.minSize && minSize <= option.maxSize;
      }
      return false;
    });

    return sizeOption;
  } catch (error) {
    console.error('Error parsing size:', error);
    return null;
  }
};

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
  const sizeDetails = getSizeDetails(licenses?.size);

  return (
    <div>
      <div className="licence">
        <div className="licence-item" style={{ width: "300px" }}>
          <p className="color">{index + 1}</p>
          <Image className="koi-img" src={licenses?.imgKoi} alt="" />
          <p>{licenses?.name}</p>
        </div>
        <div className="licence-item">
          <Image className="koi-img" src={licenses?.imgLicense} alt="" />
          <div className="item">
            <p>Size: {sizeDetails ? (
              <div>
                <div style={{ 
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#2c2c2c',
                  marginBottom: '4px'
                }}>
                  {sizeDetails.sizeInCM} cm
                </div>
                <div style={{ 
                  fontSize: '13px',
                  color: '#666',
                  marginBottom: '4px'
                }}>
                  ({sizeDetails.sizeInInch} inch)
                </div>
                <div style={{ 
                  color: '#e25822', 
                  fontSize: '13px',
                  fontStyle: 'italic',
                  fontWeight: '500'
                }}>
                  {sizeDetails.description}
                  {sizeDetails.sizeInCM.includes('Hirenaga') && ' - Butterfly Type'}
                </div>
              </div>
            ) : licenses?.size}</p>
            <p style={{ marginTop: '8px' }}>Weight: {licenses?.weight} kg</p>
          </div>
        </div>

        <div className="licence-item">
          <p>
            Price of Koi: <span className="color">{formatCurrency(licenses?.priceOfKoi)}</span>
          </p>
        </div>
      </div>

      <p>Description: {licenses?.description}</p>

    </div>
  );
};

export default License;

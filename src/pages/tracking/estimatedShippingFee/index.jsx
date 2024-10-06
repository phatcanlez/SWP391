import { Flex, Progress, Select } from "antd";
import "./index.css";
function EstimatedShippingFee() {
  let sizeInCM = [
    "-19.9",
    "20-25",
    "25.1 - 30",
    "30.1 - 40",
    "40.1 - 44",
    "44.1 - 50",
    "50.1 - 55",
    "55.1 - 65",
    "50 - 60 Hirenaga (Butterfly)",
    "60.1 - 65 Hirenaga (Butterfly)",
    "65.1 - 73",
    "73.1 - 83",
  ];
  let sizeInInch = [
    "7.86",
    "7.87 - 9.84",
    "9.85 - 11.81",
    "11.82 - 15.75",
    "15.76 - 17.32",
    "17.33 - 19.6",
    "19.7 - 21.6",
    "21.7 - 25.5",
    "19.7 - 23.4",
    "23.5 - 25.5",
    "25.6 - 28.7",
    "28.8 - 32.6",
  ];

  return (
    <div className="estimatedshippingfee">
      <div className="estimatedshippingfee__title">ESTIMATED SHIPPING FEE</div>
      <div className="estimatedshippingfee__products">
        <div className="estimatedshippingfee__products__left">
          <p className="estimatedshippingfee__products__left__title">
            Start by entering the amount of koi in each size category that you
            wish to ship. Click ‘get estimate’ to update box and shipping
            estimate.
          </p>
        </div>
        <div className="estimatedshippingfee__products__right">
          <div className="estimatedshippingfee__products__right__rectangle">
            Number of box you need
          </div>
          <div className="estimatedshippingfee__products__right__rectangle">
            Total shipping cost
          </div>
          <div className="estimatedshippingfee__products__right__rectangle">
            You can purchase this many more koi, of each size, to fit in the
            same size box shown above
          </div>
        </div>
      </div>
      <div className="estimatedshippingfee__destination">
        <div className="estimatedshippingfee__destination__from">
          <ul>
            <p className="estimatedshippingfee__destination__title">From</p>
            <li>
              <p>Country</p>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select"
                optionFilterProp="label"
              />
            </li>
            <li>
              <p>Province / City</p>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select"
                optionFilterProp="label"
              />
            </li>
            <li>
              <p>Urban district</p>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select"
                optionFilterProp="label"
              />
            </li>
            <li>
              <p>Commune</p>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select"
                optionFilterProp="label"
              />
            </li>
          </ul>
        </div>
        <div className="estimatedshippingfee__destination__to">
          <ul>
            <p className="estimatedshippingfee__destination__title">TO</p>
            <li>
              <p>Country</p>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select"
                optionFilterProp="label"
              />
            </li>
            <li>
              <p>Province / City</p>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select"
                optionFilterProp="label"
              />
            </li>
            <li>
              <p>Urban district</p>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select"
                optionFilterProp="label"
              />
            </li>
            <li>
              <p>Commune</p>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select"
                optionFilterProp="label"
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="estimatedshippingfee__calculating">
        <button type="submit">Tracking</button>
      </div>
    </div>
  );
}

export default EstimatedShippingFee;

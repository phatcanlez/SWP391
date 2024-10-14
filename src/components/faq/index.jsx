import { Button, Dropdown } from "antd";
import "./index.css";

function FAQ() {
  const items = [
    {
      key: "1",
      label: (
        <a target="_blank" rel="noopener noreferrer">
          Compensate 100% of the value of damage to the customer using the cargo
          insurance service. The insured value is up to 100 million / 1 postal
          item
        </a>
      ),
    },
  ];

  return (
    <div>
      <Dropdown
        menu={{
          items,
        }}
        trigger={["click"]}
        placement="bottom"
      >
        <Button>
          How does Viettel Post have a policy of reimbursing goods when goods
          are lost to customers using cargo insurance services?
        </Button>
      </Dropdown>
    </div>
  );
}

export default FAQ;

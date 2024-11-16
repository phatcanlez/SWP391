import { Button, Dropdown } from "antd";
import React from "react";

function CustomerFaqs() {
  const items = [
    {
      key: "1",
      question: " Can I track the status of my koi fish shipment?",
      answer:
        " Yes, you can track your koi fish shipment using the tracking number we provide once your order is processed.",
    },
    {
      key: "2",
      question: "How long does it take to ship koi fish?",
      answer:
        " Shipping usually takes 24 to 48 hours, depending on the distance and weather conditions. Shorter routes may result in faster delivery.",
    },
    {
      key: "3",
      question: "Is there insurance coverage for koi fish during shipping?",
      answer:
        " Yes, we offer insurance to compensate for any damage or loss caused during transportation due to carrier issues.",
    },
    {
      key: "4",
      question: "What should I do if my koi fish arrives weak or dead?",
      answer:
        "Please take photos or videos of the fish's condition and contact us within 24 hours for support and resolution.",
    },
    {
      key: "5",
      question: "How is the shipping cost for koi fish calculated?",
      answer:
        "Shipping fees are based on the size, weight of the fish, and the distance of delivery. We will provide a detailed quote after confirming your order.",
    },
    {
      key: "6",
      question: "What should I prepare before shipping my koi fish?",
      answer:
        " It is recommended to fast your fish for 1-2 days before shipping to minimize water contamination. Also, check the weather forecast to ensure favorable conditions.",
    },
    {
      key: "7",
      question: "Do you offer international shipping for koi fish?",
      answer:
        "Yes, we provide international shipping. However, customers must comply with the import regulations and quarantine requirements of the destination country.",
    },
    {
      key: "8",
      question: "Will koi fish be affected if the shipment is delayed?",
      answer:
        "Our team prioritizes fast delivery. The shipping bags are filled with enough oxygen to sustain the fish for up to 48 hours, ensuring their safety even in case of delays.",
    },
    {
      key: "9",
      question: "Should I prepare a temporary tank when receiving my koi fish?",
      answer:
        "Yes, we recommend preparing a temporary tank with properly treated water to help the koi fish acclimate before transferring them to their main pond.",
    },
  ];

  return (
    <div className="faq bg-w">
      <h5>Frequently Asked Questions</h5>
      {items.map((item) => (
        <Dropdown
          key={item.key}
          menu={{
            items: [
              {
                key: item.key,
                label: <div className="faq-answer">{item.answer}</div>,
              },
            ],
          }}
          trigger={["click"]}
          placement="bottom"
        >
          <Button className="faq-button">{item.question}</Button>
        </Dropdown>
      ))}
    </div>
  );
}

export default CustomerFaqs;

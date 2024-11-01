import {
  Form,
  Input,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Modal,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import { useState, useEffect } from "react";
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import Statistic from "antd/es/statistic/Statistic";
import uploadFile from "../../../../../config/file";

const { Option } = Select;
const { Title, Text } = Typography;

const sizeOptions = [
  { sizeInCM: "-19.9", sizeInInch: "7.86", points: 1.25 },
  { sizeInCM: "20-25", sizeInInch: "7.87 - 9.84", points: 2 },
  { sizeInCM: "25.1 - 30", sizeInInch: "9.85 - 11.81", points: 2.5 },
  { sizeInCM: "30.1 - 40", sizeInInch: "11.82 - 15.75", points: 3 },
  { sizeInCM: "40.1 - 44", sizeInInch: "15.76 - 17.32", points: 5 },
  { sizeInCM: "44.1 - 50", sizeInInch: "17.33 - 19.6", points: 7.5 },
  { sizeInCM: "50.1 - 55", sizeInInch: "19.7 - 21.6", points: 9 },
  { sizeInCM: "55.1 - 65", sizeInInch: "21.7 - 25.5", points: 14 },
  {
    sizeInCM: "50 - 60 Hirenaga (Butterfly)",
    sizeInInch: "19.7 - 23.4",
    points: 12,
  },
  {
    sizeInCM: "60.1 - 65 Hirenaga (Butterfly)",
    sizeInInch: "23.5 - 25.5",
    points: 14,
  },
  { sizeInCM: "65.1 - 73", sizeInInch: "25.6 - 28.7", points: 16 },
  { sizeInCM: "73.1 - 83", sizeInInch: "28.8 - 32.6", points: 18 },
];

function Fish() {
  const [fishCount, setFishCount] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [form] = Form.useForm();
  const [boxCounts, setBoxCounts] = useState({
    small: 0,
    medium: 0,
    large: 0,
    extraLarge: 0,
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [fishImages, setFishImages] = useState({});
  const [licenseImages, setLicenseImages] = useState({});

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleCancel = () => setPreviewOpen(false);

  const handleUpload = async (file) => {
    try {
      const tempUrl = await getBase64(file);
      return tempUrl;
    } catch (error) {
      console.error("Error creating temp URL:", error);
      message.error("Failed to process image");
      return null;
    }
  };

  const getKoiImageProps = (fishIndex) => ({
    name: "imgKoi",
    listType: "picture-card",
    onPreview: handlePreview,
    defaultFileList: fishImages[fishIndex]?.url
      ? [
          {
            uid: "-1",
            name: "Fish Image",
            status: "done",
            url: fishImages[fishIndex].url,
          },
        ]
      : [],
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const tempUrl = await handleUpload(file);
        if (tempUrl) {
          setFishImages((prev) => ({
            ...prev,
            [fishIndex]: {
              url: tempUrl,
              file: file,
            },
          }));
          onSuccess();
        } else {
          onError(new Error("Failed to process image"));
        }
      } catch (error) {
        onError(error);
      }
    },
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} fish image processed successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} fish image processing failed.`);
      }
    },
  });

  const getLicenseImageProps = (fishIndex) => ({
    name: "license",
    listType: "picture-card",
    onPreview: handlePreview,
    defaultFileList: licenseImages[fishIndex]?.url
      ? [
          {
            uid: "-1",
            name: "License Image",
            status: "done",
            url: licenseImages[fishIndex].url,
          },
        ]
      : [],
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const tempUrl = await handleUpload(file);
        if (tempUrl) {
          setLicenseImages((prev) => ({
            ...prev,
            [fishIndex]: {
              url: tempUrl,
              file: file,
            },
          }));
          onSuccess();
        } else {
          onError(new Error("Failed to process image"));
        }
      } catch (error) {
        onError(error);
      }
    },
    onChange(info) {
      if (info.file.status === "done") {
        message.success(
          `${info.file.name} license image processed successfully`
        );
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} license image processing failed.`);
      }
    },
  });

  useEffect(() => {
    // Load saved data when component mounts
    const savedData = localStorage.getItem("fishFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      form.setFieldsValue(parsedData);
      updateSummary(parsedData);
    }
  }, [form]);

  useEffect(() => {
    // Save totalWeight separately for easy access in Price step
    localStorage.setItem("totalWeight", totalWeight.toString());
    console.log("Saving total weight:", totalWeight); // Debug log
  }, [totalWeight]);

  useEffect(() => {
    // Load saved image data when component mounts
    const savedData = localStorage.getItem("fishFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.fishImages) {
        // Khôi phục lại state fishImages
        const restoredFishImages = {};
        Object.entries(parsedData.fishImages).forEach(([key, value]) => {
          restoredFishImages[key] = {
            url: value.url,
            file: value.file,
          };
        });
        setFishImages(restoredFishImages);
      }
      if (parsedData.licenseImages) {
        // Khôi phục lại state licenseImages
        const restoredLicenseImages = {};
        Object.entries(parsedData.licenseImages).forEach(([key, value]) => {
          restoredLicenseImages[key] = {
            url: value.url,
            file: value.file,
          };
        });
        setLicenseImages(restoredLicenseImages);
      }
    }
  }, []);

  const updateSummary = (values) => {
    const newTotalWeight = calculateTotalWeight(values.fishDetails);
    const newBoxCounts = calculateBoxes(values.fishDetails);
    const newFishCount = values.fishDetails?.length || 0;
    const newTotalPrice = calculateTotalPrice(values.fishDetails);

    setTotalWeight(newTotalWeight);
    setBoxCounts(newBoxCounts);
    setFishCount(newFishCount);
    setTotalPrice(newTotalPrice);
  };

  const calculateTotalWeight = (fishDetails) => {
    const total = (fishDetails || []).reduce(
      (sum, fish) => sum + (parseFloat(fish.weight) || 0),
      0
    );
    return parseFloat(total.toFixed(2));
  };

  const calculateBoxes = (fishDetails) => {
    let totalPoints = 0;
    (fishDetails || []).forEach((fish) => {
      const sizeOption = sizeOptions.find(
        (option) => option.sizeInCM === fish.size
      );
      if (sizeOption) {
        totalPoints += sizeOption.points;
      }
    });

    let smallBoxes = 0;
    let mediumBoxes = 0;
    let largeBoxes = 0;
    let extraLargeBoxes = 0;

    // Calculate boxes based on points
    while (totalPoints > 0) {
      if (totalPoints >= 16) {
        extraLargeBoxes++;
        totalPoints -= 16;
      } else if (totalPoints >= 12) {
        largeBoxes++;
        totalPoints -= 12;
      } else if (totalPoints >= 8) {
        mediumBoxes++;
        totalPoints -= 8;
      } else {
        smallBoxes++;
        totalPoints -= 4;
      }
    }

    return {
      small: smallBoxes,
      medium: mediumBoxes,
      large: largeBoxes,
      extraLarge: extraLargeBoxes,
    };
  };

  const calculateTotalPrice = (fishDetails) => {
    const total = (fishDetails || []).reduce(
      (sum, fish) => sum + (parseFloat(fish.price) || 0),
      0
    );
    return parseFloat(total.toFixed(2));
  };

  const handleFormChange = (changedValues, allValues) => {
    updateSummary(allValues);

    // Chuẩn bị dữ liệu ảnh để lưu
    const fishImagesData = {};
    Object.entries(fishImages).forEach(([key, value]) => {
      fishImagesData[key] = {
        url: value.url,
        // Không lưu file object vào localStorage vì nó không thể serialize
        file: null,
      };
    });

    const licenseImagesData = {};
    Object.entries(licenseImages).forEach(([key, value]) => {
      licenseImagesData[key] = {
        url: value.url,
        file: null,
      };
    });

    // Save form data with image URLs
    const dataToSave = {
      ...allValues,
      totalWeight: calculateTotalWeight(allValues.fishDetails),
      boxCounts: calculateBoxes(allValues.fishDetails),
      fishImages: fishImagesData,
      licenseImages: licenseImagesData,
    };

    console.log("Saving form data with images:", dataToSave);
    localStorage.setItem("fishFormData", JSON.stringify(dataToSave));
  };

  const handleRemoveImage = (type, fishIndex) => {
    if (type === "fish") {
      setFishImages((prev) => {
        const newImages = { ...prev };
        delete newImages[fishIndex];
        return newImages;
      });
    } else if (type === "license") {
      setLicenseImages((prev) => {
        const newImages = { ...prev };
        delete newImages[fishIndex];
        return newImages;
      });
    }

    // Update localStorage after removing image
    const savedData = JSON.parse(localStorage.getItem("fishFormData") || "{}");
    const updatedData = {
      ...savedData,
      fishImages: type === "fish" ? { ...fishImages } : savedData.fishImages,
      licenseImages:
        type === "license" ? { ...licenseImages } : savedData.licenseImages,
    };
    localStorage.setItem("fishFormData", JSON.stringify(updatedData));
  };

  return (
    <Form
      form={form}
      onValuesChange={handleFormChange}
      initialValues={JSON.parse(localStorage.getItem("fishFormData") || "{}")}
    >
      <Form.List name="fishDetails">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Card
                key={field.key}
                style={{ marginBottom: 16 }}
                title={`Fish #${index + 1}`}
                extra={
                  <Button
                    onClick={() => remove(field.name)}
                    icon={<DeleteOutlined />}
                    danger
                    shape="circle"
                  />
                }
              >
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item
                      name={[field.name, "weight"]}
                      label={"Weight"}
                      rules={[
                        { required: true, message: "Please enter Weight" },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="Weight (kg)"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={[field.name, "size"]}
                      label={"Size"}
                      rules={[
                        { required: true, message: "Please select Size" },
                      ]}
                    >
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Select size"
                      >
                        {sizeOptions.map((option, index) => (
                          <Option key={index} value={option.sizeInCM}>
                            {option.sizeInCM} cm ({option.sizeInInch} inch)
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={[field.name, "price"]}
                      label={"Price"}
                      rules={[
                        { required: true, message: "Please enter Price" },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="Price ($)"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <FormItem
                      label={"Fish Image"}
                      rules={[
                        { required: true, message: "Please upload fish image" },
                      ]}
                      style={{ display: "inline-block", marginRight: "100px" }}
                    >
                      <Upload {...getKoiImageProps(field.name)}>
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload Fish Image</div>
                        </div>
                      </Upload>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      label={"License Image"}
                      rules={[
                        { required: true, message: "Please upload license" },
                      ]}
                      style={{ display: "inline-block", marginRight: "100px" }}
                    >
                      <Upload {...getLicenseImageProps(field.name)}>
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload License</div>
                        </div>
                      </Upload>
                    </FormItem>
                  </Col>
                </Row>
                <Form.Item name={[field.name, "note"]} label={"Note"}>
                  <TextArea rows={2} />
                </Form.Item>
              </Card>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Fish
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Card style={{ marginTop: 24, backgroundColor: "#f0f2f5" }}>
        <Title level={4}>Order Summary</Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Total Weight"
                value={totalWeight}
                precision={2}
                suffix="kg"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic title="Total Fish" value={fishCount} suffix="fish" />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Total Price"
                value={totalPrice}
                precision={2}
                prefix="$"
              />
            </Card>
          </Col>
        </Row>
        <Title level={5} style={{ marginTop: 16 }}>
          Box Requirements
        </Title>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card size="small">
              <Statistic title="Small Boxes" value={boxCounts.small} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="Medium Boxes" value={boxCounts.medium} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="Large Boxes" value={boxCounts.large} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Extra Large Boxes"
                value={boxCounts.extraLarge}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Preview Modal */}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Form>
  );
}

export default Fish;

import {
  Form,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Typography,
  Modal,
  Image,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import { useState, useEffect } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
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

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

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
  const [fileList, setFileList] = useState([]);

  const handlePreview = async (file) => {
    let previewUrl = file.url;
    if (!previewUrl && file.originFileObj) {
      previewUrl = await getBase64(file.originFileObj);
    }
    setPreviewImage(previewUrl);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleCancel = () => setPreviewOpen(false);

  const getKoiImageProps = (fishIndex) => ({
    name: "imgKoi",
    listType: "picture-card",
    onPreview: handlePreview,
    defaultFileList: fishImages[fishIndex]?.base64
      ? [
          {
            uid: "-1",
            name: "Fish Image",
            status: "done",
            url: `data:image/jpeg;base64,${fishImages[fishIndex].base64}`,
          },
        ]
      : [],
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        console.log("Starting Koi image upload for index:", fishIndex);
        const base64Url = await uploadFile(file);
        if (base64Url) {
          const updatedImages = {
            ...fishImages,
            [fishIndex]: {
              base64: base64Url,
              status: "done",
            },
          };
          setFishImages(updatedImages);

          const savedData = JSON.parse(
            localStorage.getItem("fishFormData") || "{}"
          );
          savedData.fishImages = {
            ...savedData.fishImages,
            [fishIndex]: {
              base64: base64Url,
              status: "done",
            },
          };
          localStorage.setItem("fishFormData", JSON.stringify(savedData));
          console.log("Saved fish images to localStorage");

          // Load lại ảnh sau khi upload
          loadSavedImages();
          onSuccess();
        } else {
          onError(new Error("Failed to process image"));
        }
      } catch (error) {
        console.error("Error in Koi image upload:", error);
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
        console.log("Starting License image upload for index:", fishIndex);
        const base64Url = await uploadFile(file);
        if (base64Url) {
          const updatedImages = {
            ...licenseImages,
            [fishIndex]: {
              base64: base64Url,
              status: "done",
            },
          };
          setLicenseImages(updatedImages);

          const savedData = JSON.parse(
            localStorage.getItem("fishFormData") || "{}"
          );
          savedData.licenseImages = {
            ...savedData.licenseImages,
            [fishIndex]: {
              base64: base64Url,
            },
          };
          localStorage.setItem("fishFormData", JSON.stringify(savedData));
          console.log("Saved license images to localStorage");

          // Load lại ảnh sau khi upload
          loadSavedImages();
          onSuccess();
        } else {
          onError(new Error("Failed to process image"));
        }
      } catch (error) {
        console.error("Error in License image upload:", error);
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

  const loadSavedImages = () => {
    try {
      const savedData = localStorage.getItem("fishFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);

        // Load fish images
        if (parsedData.fishImages) {
          console.log("Found saved fish images:", parsedData.fishImages);
          const restoredFishImages = {};
          Object.entries(parsedData.fishImages).forEach(([key, value]) => {
            if (value && value.base64) {
              restoredFishImages[key] = {
                url: value.base64,
                base64: value.base64,
                status: "done",
              };
            }
          });
          setFishImages(restoredFishImages);
          console.log("Restored fish images:", restoredFishImages);
        }

        // Load license images
        if (parsedData.licenseImages) {
          console.log("Found saved license images:", parsedData.licenseImages);
          const restoredLicenseImages = {};
          Object.entries(parsedData.licenseImages).forEach(([key, value]) => {
            if (value && value.base64) {
              restoredLicenseImages[key] = {
                url: value.base64,
                base64: value.base64,
                status: "done",
              };
            }
          });
          setLicenseImages(restoredLicenseImages);
          console.log("Restored license images:", restoredLicenseImages);
        }
      }
    } catch (error) {
      console.error("Error loading saved images:", error);
    }
  };

  useEffect(() => {
    loadSavedImages();
  }, []);

  useEffect(() => {
    localStorage.setItem("totalWeight", totalWeight.toString());
    console.log("Saving total weight:", totalWeight);
  }, [totalWeight]);

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
    console.log("Form values changed:", changedValues);
    updateSummary(allValues);

    console.log("Current fish images:", fishImages);
    console.log("Current license images:", licenseImages);

    // Lưu ảnh cá
    const fishImagesData = {};
    Object.entries(fishImages).forEach(([key, value]) => {
      if (value && value.url) {
        fishImagesData[key] = {
          url: value.url,
          base64: value.base64,
          status: "done",
        };
      }
    });

    // Lưu ảnh giấy phép
    const licenseImagesData = {};
    Object.entries(licenseImages).forEach(([key, value]) => {
      if (value && value.url) {
        licenseImagesData[key] = {
          url: value.url,
          base64: value.base64,
          status: "done",
        };
      }
    });

    const dataToSave = {
      ...allValues,
      totalWeight: calculateTotalWeight(allValues.fishDetails),
      boxCounts: calculateBoxes(allValues.fishDetails),
      fishImages: fishImagesData,
      licenseImages: licenseImagesData,
      totalPrice: calculateTotalPrice(allValues.fishDetails),
    };

    console.log("Saving data to localStorage:", dataToSave);
    localStorage.setItem("fishFormData", JSON.stringify(dataToSave));

    // Load lại tất cả thông tin
    loadAllData();
  };

  // Thêm hàm mới để load tất cả dữ liệu
  const loadAllData = () => {
    try {
      const savedData = JSON.parse(
        localStorage.getItem("fishFormData") || "{}"
      );

      // Load form values
      form.setFieldsValue(savedData);

      // Load images
      loadSavedImages();

      // Load summary data
      if (savedData.fishDetails) {
        updateSummary(savedData);
      }

      // Load total weight
      if (savedData.totalWeight) {
        setTotalWeight(savedData.totalWeight);
      }

      // Load box counts
      if (savedData.boxCounts) {
        setBoxCounts(savedData.boxCounts);
      }

      // Load fish count
      if (savedData.fishDetails) {
        setFishCount(savedData.fishDetails.length);
      }

      // Load total price
      if (savedData.totalPrice) {
        setTotalPrice(savedData.totalPrice);
      }

      console.log("All data reloaded successfully");
    } catch (error) {
      console.error("Error loading all data:", error);
    }
  };

  // Cập nhật useEffect để load dữ liệu khi component mount
  useEffect(() => {
    loadAllData();
  }, []);

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

    const savedData = JSON.parse(localStorage.getItem("fishFormData") || "{}");
    if (type === "fish") {
      if (savedData.fishImages) {
        delete savedData.fishImages[fishIndex];
      }
    } else if (type === "license") {
      if (savedData.licenseImages) {
        delete savedData.licenseImages[fishIndex];
      }
    }
    localStorage.setItem("fishFormData", JSON.stringify(savedData));
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
                style={{
                  marginBottom: 24,
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                title={
                  <div
                    style={{
                      color: "#e25822",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Fish #{index + 1}
                  </div>
                }
                extra={
                  <Button
                    onClick={() => remove(field.name)}
                    icon={<DeleteOutlined style={{ color: "#fff" }} />}
                    style={{
                      backgroundColor: "#ff4d4f",
                      borderColor: "#ff4d4f",
                    }}
                    shape="circle"
                  />
                }
              >
                <Row gutter={[24, 24]}>
                  <Col span={8}>
                    <Form.Item
                      name={[field.name, "weight"]}
                      label={<span style={{ fontWeight: 500 }}>Weight</span>}
                      rules={[
                        { required: true, message: "Please enter Weight" },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%", borderRadius: "6px" }}
                        placeholder="Weight (kg)"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={[field.name, "size"]}
                      label={<span style={{ fontWeight: 500 }}>Size</span>}
                      rules={[
                        { required: true, message: "Please select Size" },
                      ]}
                    >
                      <Select
                        style={{ width: "100%", borderRadius: "6px" }}
                        placeholder="Select size"
                        dropdownStyle={{ borderRadius: "6px" }}
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
                      label={<span style={{ fontWeight: 500 }}>Price</span>}
                      rules={[
                        { required: true, message: "Please enter Price" },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%", borderRadius: "6px" }}
                        placeholder="Price (VND)"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <FormItem
                      label={
                        <span style={{ fontWeight: 500 }}>Fish Image</span>
                      }
                      rules={[
                        { required: true, message: "Please upload fish image" },
                      ]}
                    >
                      <Upload
                        {...getKoiImageProps(field.name)}
                        onRemove={() => handleRemoveImage("fish", field.name)}
                        fileList={
                          fishImages[field.name]?.url
                            ? [
                                {
                                  uid: "-1",
                                  name: "Fish Image",
                                  status: "done",
                                  url: fishImages[field.name].url,
                                  thumbUrl: fishImages[field.name].url,
                                },
                              ]
                            : []
                        }
                        style={{ borderRadius: "6px" }}
                      >
                        {!fishImages[field.name]?.url && (
                          <div
                            style={{
                              padding: "16px",
                              border: "1px dashed #d9d9d9",
                              borderRadius: "6px",
                              cursor: "pointer",
                              transition: "all 0.3s",
                              "&:hover": {
                                borderColor: "#e25822",
                              },
                            }}
                          >
                            <PlusOutlined style={{ color: "#e25822" }} />
                            <div style={{ marginTop: 8, color: "#666" }}>
                              Upload Fish Image
                            </div>
                          </div>
                        )}
                      </Upload>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      label={
                        <span style={{ fontWeight: 500 }}>License Image</span>
                      }
                      rules={[
                        { required: true, message: "Please upload license" },
                      ]}
                    >
                      <Upload
                        {...getLicenseImageProps(field.name)}
                        onRemove={() =>
                          handleRemoveImage("license", field.name)
                        }
                        fileList={
                          licenseImages[field.name]?.url
                            ? [
                                {
                                  uid: "-1",
                                  name: "License Image",
                                  status: "done",
                                  url: licenseImages[field.name].url,
                                  thumbUrl: licenseImages[field.name].url,
                                },
                              ]
                            : []
                        }
                        style={{ borderRadius: "6px" }}
                      >
                        {!licenseImages[field.name]?.url && (
                          <div
                            style={{
                              padding: "16px",
                              border: "1px dashed #d9d9d9",
                              borderRadius: "6px",
                              cursor: "pointer",
                              transition: "all 0.3s",
                              "&:hover": {
                                borderColor: "#e25822",
                              },
                            }}
                          >
                            <PlusOutlined style={{ color: "#e25822" }} />
                            <div style={{ marginTop: 8, color: "#666" }}>
                              Upload License Image
                            </div>
                          </div>
                        )}
                      </Upload>
                    </FormItem>
                  </Col>
                </Row>
                <Form.Item
                  name={[field.name, "note"]}
                  label={<span style={{ fontWeight: 500 }}>Note</span>}
                >
                  <TextArea
                    rows={2}
                    style={{ borderRadius: "6px" }}
                    placeholder="Enter notes about this fish..."
                  />
                </Form.Item>
              </Card>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                style={{
                  height: "45px",
                  borderColor: "#e25822",
                  color: "#e25822",
                  borderRadius: "6px",
                  marginBottom: "24px",
                  "&:hover": {
                    color: "#fff",
                    backgroundColor: "#e25822",
                  },
                }}
              >
                Add Fish
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Card
        style={{
          marginTop: 24,
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={4} style={{ color: "#e25822", marginBottom: 24 }}>
          Order Summary
        </Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card size="small" style={{ borderRadius: "6px" }}>
              <Statistic
                title={<span style={{ color: "#666" }}>Total Weight</span>}
                value={totalWeight}
                precision={2}
                suffix="kg"
                valueStyle={{ color: "#000" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ borderRadius: "6px" }}>
              <Statistic
                title={<span style={{ color: "#666" }}>Total Fish</span>}
                value={fishCount}
                suffix="fish"
                valueStyle={{ color: "#000" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ borderRadius: "6px" }}>
              <Statistic
                title={<span style={{ color: "#666" }}>Total Price</span>}
                value={totalPrice}
                formatter={value => formatCurrency(value)}
                valueStyle={{ color: "#000" }}
              />
            </Card>
          </Col>
        </Row>

        <Title level={5} style={{ margin: "24px 0 16px", color: "#000" }}>
          Box Requirements
        </Title>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card size="small" style={{ borderRadius: "6px" }}>
              <Statistic
                title={<span style={{ color: "#666" }}>Small Boxes</span>}
                value={boxCounts.small}
                valueStyle={{ color: "#000" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ borderRadius: "6px" }}>
              <Statistic
                title={<span style={{ color: "#666" }}>Medium Boxes</span>}
                value={boxCounts.medium}
                valueStyle={{ color: "#000" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ borderRadius: "6px" }}>
              <Statistic
                title={<span style={{ color: "#666" }}>Large Boxes</span>}
                value={boxCounts.large}
                valueStyle={{ color: "#000" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ borderRadius: "6px" }}>
              <Statistic
                title={<span style={{ color: "#666" }}>Extra Large Boxes</span>}
                value={boxCounts.extraLarge}
                valueStyle={{ color: "#000" }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {previewImage && (
        <Image
          style={{ display: "none" }}
          preview={{
            visible: previewOpen,
            src: previewImage,
            onVisibleChange: (visible) => {
              setPreviewOpen(visible);
              if (!visible) {
                setPreviewImage("");
              }
            },
          }}
        />
      )}
    </Form>
  );
}

export default Fish;

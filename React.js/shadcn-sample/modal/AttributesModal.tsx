import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "antd";
import ENDPOINTS from "api/endpoints/Endpoints";
import useRequest, { HTTP_METHODS } from "api/hooks/useRequest";
import Button from "components/elements/Button";
import Input from "components/elements/Input";
import Select from "components/elements/Select";
import Toggle from "components/elements/Toggle";
import { BaseModal, MainContent, ModalList, ModalWidth } from "components/modal/BaseModal";
import { Flex } from "components/SharedStyles";
import Table from "components/table/Table";
import { IconWrapper } from "features/global-code/GlobalCode";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Colors from "styles/Colors";
import RequiredMessages from "utils/requiredMessages";

// Styled components
const ErrorMessage = styled.div`
  color: ${Colors.Red};
  position: absolute;
  bottom: -23px;
`;

const AddOption = styled(Flex)`
  .ant-form-item-label & {
    height: 0;
  }
  .anticon-plus {
    padding: 8px;
    background: #00588b;
    color: #fff;
    border-radius: 50%;
    font-size: 18px;
    margin-bottom: 2px;
  }
`;

const Options = styled.div`
  box-shadow: 0 0 10px #0000002a;
  width: max-content;
  padding: 6px 10px;
  font-size: 16px;
  height: max-content;
  font-weight: 900;
  position: relative;
  min-width: 55px;
  text-align: center;
  border-radius: 8px;

  .anticon-close {
    position: absolute;
    top: -7px;
    right: -9px;
    background: #00588b;
    color: #fff;
    font-size: 13px;
    padding: 3px;
    border-radius: 50%;
  }
`;

const AttributeModalFooter = styled(Flex)`
  padding: 10px 10px 20px;
  border-bottom: 1px solid ${Colors.Grey};
  width: 100%;
`;

// Main component
const AttributesModal = ({ data, type }: { data: any; type: string }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [refreshResponse, setRefreshResponse] = useState<boolean>(false);
  const [inputData, setInputData] = useState<{ value: string; error: boolean }>({
    value: "",
    error: false,
  });
  const [dataType, setDataType] = useState<{ id: string; value: string } | null>(null);
  const [attributeType, setAttributeType] = useState<{ id: string; value: string } | null>(null);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState<boolean>(false);
  const [enterText, setEnterText] = useState<string[]>([]);
  const [isRequired, setIsRequired] = useState<boolean>(true);

  // Requests
  const [getAttributesType, { response: attributesTypeList, loading: attributeTypesLoader }] = useRequest({
    path: ENDPOINTS.PARENT_GLOBAL_CODE,
    errorToast: true,
    method: HTTP_METHODS.GET,
  });

  const [getAllAttributes, { response: attributesList, loading: attributesLoader }] = useRequest({
    path: ENDPOINTS.ATTRIBUTE_MODALS,
    errorToast: true,
    method: HTTP_METHODS.GET,
  });

  const [getDataTypes, { response: dataTypeList, loading: dataTypeLoader }] = useRequest({
    path: ENDPOINTS.PARENT_GLOBAL_CODE,
    errorToast: true,
    method: HTTP_METHODS.GET,
  });

  const [createAttributes, { loading: createAttributesLoader }] = useRequest({
    successToast: true,
    path: ENDPOINTS.ATTRIBUTE_MODALS,
    errorToast: true,
    method: HTTP_METHODS.POST,
  });

  const [updateAttributes, { loading: updateAttributesLoader }] = useRequest({
    path: ENDPOINTS.ATTRIBUTE_MODALS,
    errorToast: true,
    method: HTTP_METHODS.PUT,
  });

  const [deleteAttributes, { loading: deleteLoader }] = useRequest({
    path: ENDPOINTS.ATTRIBUTE_MODALS,
    errorToast: true,
    successToast: true,
    method: HTTP_METHODS.DELETE,
  });

  // Handlers
  const handleDeleteAction = (record: any) => {
    setEditRecord(record);
    setOpenConfirmDeleteModal(true);
  };

  const handleAttributeTypeChange = (_: any, e: any) => {
    setAttributeType(e);
  };

  const handleDataTypeChange = (_: any, e: any) => {
    setDataType(e);
  };

  const handleRequiredStatusChange = (value: boolean) => {
    setIsRequired(value);
  };

  const addEnterText = () => {
    const text = inputData.value;
    if (text) {
      setEnterText(prev => [...prev, text]);
      setInputData({ value: "", error: false });
      form.setFieldsValue({ textType: "" });
    } else {
      setInputData(prev => ({ ...prev, error: true }));
    }
  };

  const deleteText = (id: number) => {
    setEnterText(prev => prev.filter((_, index) => index !== id));
  };

  const deleteRecords = () => {
    const params = {
      attributeModule: type,
      attributeModuleId: data?._id,
    };
    deleteAttributes({
      params,
      id: editRecord?._id,
      onCompleted: () => {
        setRefreshResponse(true);
        setOpenConfirmDeleteModal(false);
      },
      onError: (error) => {
        console.error("Error deleting attribute:", error);
      },
    });
  };

  const handleToggleButton = (checked: boolean, record: any) => {
    const variables = {
      required: checked ? 1 : 0,
      attributeModule: type,
      attributeModuleId: data?._id,
    };
    updateAttributes({
      variables,
      id: record?._id,
      onCompleted: () => {
        form.resetFields();
        setRefreshResponse(true);
      },
      onError: (error) => {
        console.error("Error updating attribute:", error);
      },
    });
  };

  const handleActions = (record: any) => {
    setAttributeType({ value: record?.attributeTypeName, id: record?.attributeType });
    setDataType({ value: record?.dataTypeName, id: record?.dataType });
    form.setFieldsValue({
      attributeName: record?.attributeName,
      orderNo: record?.orderNo.toString(),
      attributeType: record?.attributeName,
      dataType: record?.dataTypeName,
    });
    setEnterText(record?.options);
    setIsRequired(record?.required);
    setEditRecord(record);
  };

  const onFinish = (values: any) => {
    const variables: any = {
      attributeName: values.attributeName,
      orderNo: Number(values.orderNo) || null,
      attributeType: attributeType?.id || "",
      dataType: dataType?.id || "",
      options: enterText,
      attributeModule: type,
      required: isRequired ? 1 : 0,
    };

    if (editRecord) {
      variables.attributeModuleId = data?._id;
      updateAttributes({
        variables,
        id: editRecord?._id,
        onCompleted: () => {
          setEditRecord(null);
          form.resetFields();
          setEnterText([]);
          setAttributeType(null);
          setDataType(null);
          setRefreshResponse(true);
        },
        onError: (error) => {
          console.error("Error updating attribute:", error);
        },
      });
    } else {
      createAttributes({
        id: data?._id,
        variables,
        onCompleted: () => {
          form.resetFields();
          setEditRecord(null);
          setAttributeType(null);
          setDataType(null);
          setEnterText([]);
          setRefreshResponse(true);
        },
        onError: (error) => {
          console.error("Error creating attribute:", error);
        },
      });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputData({
      value,
      error: !value,
    });
  };

  useEffect(() => {
    const params = {
      attributeModule: type,
    };
    getAllAttributes({
      params,
      id: data?._id,
      onCompleted: () => { },
      onError: (error) => {
        console.error("Error fetching attributes:", error);
      },
    });
    setRefreshResponse(false);
  }, [refreshResponse]);

  useEffect(() => {
    getAttributesType({
      id: "hECQsZbCq",
      onCompleted: () => { },
      onError: (error) => {
        console.error("Error fetching attribute types:", error);
      },
    });
    getDataTypes({
      id: "dovEydnKI",
      onCompleted: () => { },
      onError: (error) => {
        console.error("Error fetching data types:", error);
      },
    });
  }, []);

  const attributeOptions = attributesTypeList?.data?.map((item: any) => ({
    id: item._id,
    value: item.codeName,
  })) || [];
  attributeOptions.unshift({ label: "Please Select Attribute Type", value: "" });

  const dataTypeOptions = dataTypeList?.data?.map((item: any) => ({
    id: item._id,
    value: item.codeName,
  })) || [];
  dataTypeOptions.unshift({ label: "Please Select Data Type", value: "" });

  const columns = [
    {
      title: t("attributes"),
      dataIndex: "attributeName",
    },
    {
      title: t("attributeType"),
      dataIndex: "attributeTypeName",
    },
    {
      title: t("dataType"),
      dataIndex: "dataTypeName",
    },
    {
      title: t("required"),
      dataIndex: "required",
      render: (required: any, record: any) => (
        <Toggle
          checked={required}
          onChange={(value: boolean) => handleToggleButton(value, record)}
        />
      ),
    },
    {
      title: t("orderNo"),
      dataIndex: "orderNo",
    },
    {
      title: t("actions"),
      dataIndex: "action",
      render: (_: any, record: any) => (
        <IconWrapper>
          <EditOutlined onClick={() => handleActions(record)} title="Edit" />
          <DeleteOutlined onClick={() => handleDeleteAction(record)} title="Delete" />
        </IconWrapper>
      ),
    },
  ];

  return (
    <>
      <ModalWidth width="900px">
        <MainContent>
          <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Input
                  name="attributeName"
                  label={t("attributes") || "Attribute"}
                  requiredMessage={RequiredMessages.ATTRIBUTE}
                  required
                  placeholder={t("attributes") || "Attribute"}
                />
              </Col>
              <Col span={12}>
                <Input
                  name="orderNo"
                  type="number"
                  label={t("orderNo") || "Order No"}
                  placeholder={t("orderNo") || "Order No"}
                />
              </Col>
              <Col span={12}>
                <Select
                  name="attributeType"
                  value={attributeType?.value}
                  defaultValue=""
                  loading={attributeTypesLoader}
                  label={t("attributeType") || "Attribute Type"}
                  onChange={handleAttributeTypeChange}
                  options={attributeOptions}
                />
              </Col>
              <Col span={9}>
                <Select
                  name="dataType"
                  value={dataType?.value}
                  defaultValue=""
                  onChange={handleDataTypeChange}
                  label={t("dataType") || "Data Type"}
                  loading={dataTypeLoader}
                  options={dataTypeOptions}
                />
              </Col>
              <Col span={3}>
                <Form.Item
                  name="required"
                  label={t("required") || "Required"}
                  initialValue={data?.isChecked}
                >
                  <Toggle
                    onChange={handleRequiredStatusChange}
                    checked={isRequired}
                    style={{ paddingLeft: "10px" }}
                  />
                </Form.Item>
              </Col>
              {attributeType?.value ? (
                <>
                  <Col span={13}>
                    <AddOption Align="end" style={{ position: "relative" }}>
                      <Input placeholder="Enter Text" name="textType" onChange={handleTextChange} />
                      <PlusOutlined onClick={addEnterText} />
                      {inputData.error && (
                        <ErrorMessage>{RequiredMessages.ENTERTEXT}</ErrorMessage>
                      )}
                    </AddOption>
                  </Col>
                  <Col span={24}>
                    <Flex gap="20px">
                      {enterText.length
                        ? enterText.map((item: string, index: number) => (
                          <Options key={index}>
                            {item}
                            <CloseOutlined onClick={() => deleteText(index)} />
                          </Options>
                        ))
                        : ""}
                    </Flex>
                  </Col>
                </>
              ) : null}
              <Col span={24}>
                <Form.Item>
                  <AttributeModalFooter Justify="end" gap="10px">
                    <Button variant="default" text={t("clear")} type="reset" />
                    <Button
                      text={editRecord ? t("update") : t("submit")}
                      loading={createAttributesLoader}
                      type="submit"
                    />
                  </AttributeModalFooter>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Col span={24}>
            <Table
              dataSource={attributesList?.data?.attributes}
              columns={columns}
              loading={attributesLoader || updateAttributesLoader}
              showSorterTooltip={false}
            />
          </Col>
        </MainContent>
      </ModalWidth>
      <BaseModal
        title={t("delete")}
        open={openConfirmDeleteModal}
        setOpen={setOpenConfirmDeleteModal}
        modalType={ModalList.IsConfirm}
        loading={deleteLoader}
        onConfirm={deleteRecords}
      />
    </>
  );
};

export default AttributesModal;

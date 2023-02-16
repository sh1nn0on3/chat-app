import { Form, Input, Modal } from "antd";
import React, { useContext, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import { addDocument } from "../../firebase/services";

export default function AddRoomModal() {
  const {
    user: { uid },
  } = useContext(AuthContext);
  const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
  const [form] = Form.useForm();
  // console.log({isAddRoomVisible})
  const handleOk = () => {
    // console.log({formData : form.getFieldValue() })
    addDocument("rooms", { ...form.getFieldsValue(), members: [uid] });
    //
    form.resetFields();
    //
    setIsAddRoomVisible(false);
  };
  const handleCancel = () => {
    form.resetFields();

    //
    setIsAddRoomVisible(false);
  };
  return (
    <div>
      <Modal
        title="Tạo Phòng"
        open={isAddRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên phòng" name="name">
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea placeholder="Nhập mô tả" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

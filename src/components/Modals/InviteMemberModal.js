import { Avatar, Form, Modal, Select, Spin } from "antd";
import { debounce } from "lodash";
import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { db } from "../../firebase/config";

function DebounceSelect({
  fetchOptions,
  debounceTimeout = 400,
  curMembers,
  ...props
}) {
  // search : abcdad
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value, curMembers).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout, curMembers]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {
        // [{ label , value, photoURL }]
        options.map((opt) => (
          <Select.Option key={opt.value} value={opt.value} title={opt.label}>
            <Avatar size="small" src={opt ? opt.photoURL : ""}>
              {opt.photoURL ? "" : opt.displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
            {` ${opt.label}`}
          </Select.Option>
        ))
      }
    </Select>
  );
}

async function fetchUserList(search, curMembers) {
  return db
    .collection("users")
    .where("keywords", "array-contains", search)
    .orderBy("displayName")
    .limit(20)
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .map((doc) => ({
          label: doc.data().displayName,
          value: doc.data().uid,
          photoURL: doc.data().photoURL,
        }))
        .filter((opt) => !curMembers.includes(opt.value));
    });
}

export default function InviteMemberModal() {
  const {
    isInviteMemberVisible,
    setIsInviteMemberVisible,
    selectedRoomId,
    selectedRoom,
  } = useContext(AppContext);
  const [value, setValue] = useState([]);

  // const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
  const [form] = Form.useForm();
  // console.log({isInviteMemberVisible})
  const handleOk = () => {
    // reset form value
    form.resetFields();
    // form.focus()

    // update members in current room
    const roomRef = db.collection("rooms").doc(selectedRoomId);

    roomRef.update({
      members: [...selectedRoom.members, ...value.map((val) => val.value)],
    });
    //
    setIsInviteMemberVisible(false);
  };
  const handleCancel = () => {
    form.resetFields();

    //
    setIsInviteMemberVisible(false);
  };
  return (
    <div>
      <Modal
        title="Mời thêm thành viên"
        open={isInviteMemberVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <DebounceSelect
            mode="multiple"
            lable="Tên các thành viên"
            value={value}
            placeholder="Nhập tên các thành viên"
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            curMembers={selectedRoom ? selectedRoom.members : ""}
          />
        </Form>
      </Modal>
    </div>
  );
}

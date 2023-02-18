import { Avatar, Button, Form, Input, Tooltip } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import { addDocument } from "../../firebase/services";
import useFirbase from "../../hooks/useFirestore";
import Message from "./Message";

const WrapperStyled = styled.div`
  height: 100vh;
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);
  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &__title {
      margin: 0;
      font-weight: bold;
    }
    &__description {
      font-style: 12px;
    }
  }
`;

const ButtonStyled = styled.div`
  display: flex;
  align-items: center;
`;


const ContentStyled = styled.div`
  height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid(230, 230, 230);
  border-radius: 2px;
  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

export default function ChatWindow() {
  // const { rooms, selectedRoomId } = useContext(AppContext);
  const { selectedRoom, members, setIsInviteMemberVisible } =
    useContext(AppContext);

  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);

  const [inputvalue, setInputValue] = useState("");
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = () => {
    addDocument("messages", {
      text: inputvalue,
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName,
    });
    form.resetFields(["message"]);
  };
  // const selectedRoom = useMemo(
  //   () => rooms.find((room) => room.id === selectedRoomId),
  //   [rooms, selectedRoomId]
  // );
  // console.log(selectedRoom);
  const checkSelectedRoomid = selectedRoom ? selectedRoom.id : "";

  const condition = React.useMemo(
    () => ({
      fieldName: "roomId",
      operator: "==",
      compareValue: checkSelectedRoomid,
    }),
    [checkSelectedRoomid]
  );

  const messages = useFirbase("messages", condition);

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  return (
    <WrapperStyled>

      {/* Header  */}
      <HeaderStyled>
      {/* Bên trái phần InFo */}
        <div className="header__info">
          <p className="header__title">
            {selectedRoom ? selectedRoom.name : ""}
          </p>
          <span className="header__description">
            {selectedRoom ? selectedRoom.description : ""}
          </span>
        </div>
        {/* Bên phải mời và phần avt thêm */}
        <ButtonStyled>
          <Button type="text" onClick={() => setIsInviteMemberVisible(true)}>
            <i className="fa-solid fa-user-plus mr-2" />
            Mời
          </Button>
          <Avatar.Group size="small" maxCount={2}>
            {members.map((member) => (
              <Tooltip title={member.displayName} key={member.id}>
                <Avatar src={member.photoURL}>
                  {member.photoURL
                    ? ""
                    : member.displayName?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        </ButtonStyled>
      </HeaderStyled>

      {/* Phần Content */}
      <ContentStyled>
        
        {/* Phần hiển thị  */}
        <MessageListStyled ref={messageListRef}>
          {messages.map((mes) => {
            // console.log("🚀 ~ file: ChatWindow.js:162 ~ ChatWindow ~ mes", mes)
            return <Message
              	key={mes.id}
              	text={mes.text}
              	photoURL={mes.photoURL}
              	displayName={mes.displayName}
              	createAt={1234}
            	/>
          	})
          }
          {/* <Message
            text="test"
            displayName="Tung 25 tuoi"
            photoURL={null}
            createAt={123123141}
          />
          <Message
            text="test"
            displayName="Tung 25 tuoi"
            photoURL={null}
            createAt={123123141}
          />
          <Message
            text="test"
            displayName="Tung 25 tuoi"
            photoURL={null}
            createAt={123123141}
          /> */}
        </MessageListStyled>
        
        {/* Phần Form điền input */}
        <FormStyled form={form}>
          <Form.Item name="message">
            <Input
              ref={inputRef}
              onChange={handleInputChange}
              onPressEnter={handleOnSubmit}
              placeholder="Nhập tin nhắn ..."
              bordered={false}
              autoComplete="off"
              autoFocus
            />
          </Form.Item>
          <Button type="primary" onClick={handleOnSubmit}>
            Gửi
          </Button>
        </FormStyled>

      </ContentStyled>

    </WrapperStyled>
  );
}

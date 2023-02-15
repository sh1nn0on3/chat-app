import { Button, Collapse } from "antd";
import Link from "antd/es/typography/Link";
import React, { useContext, useMemo } from "react";
import styled from "styled-components";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import useFirbase from "../../hooks/useFirestore";

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }
    .ant-collapse-content-box {
      padding: 0 40px;
    }
    .add-room {
      color: white;
      padding: 0;
    }
  }
`;

const LinkStyled = styled(Link)`
  display: block;
  margin-bottom: 10px;
  color: white;
`;

export default function RoomList() {
  // const {
  //   user: { uid },
  // } = useContext(AuthContext);

  // const roomCondition = useMemo(() => {
  //   return {
  //     fieldName: "members",
  //     operator: "array-contains",
  //     compareValue: uid,
  //   };
  // }, [uid]);

  // const rooms = useFirbase("rooms", roomCondition);

  // console.log({ rooms });

  const { rooms, setIsAddRoomVisible, setSelectedRoomId } =
    useContext(AppContext);
  // console.log(rooms);
  // console.log({isAddRoomVisible})

  // console.log({rooms})

  return (
    <Collapse ghost defaultActiveKey={"1"}>
      <PanelStyled header="Danh sách các phòng" key="1">
        {rooms.map((room) => (
          <LinkStyled key={room.id} onClick={() => setSelectedRoomId(room.id)}>
            {room.name}
          </LinkStyled>
        ))}
        {/* <LinkStyled>Room 1</LinkStyled>
        <LinkStyled>Room 2</LinkStyled>
        <LinkStyled>Room 3</LinkStyled> */}
        <Button
          type="text"
          className="add-room"
          onClick={() => setIsAddRoomVisible(true)}
        >
          <i className="fa-regular fa-square-plus mr-3" />
          Thêm Phòng
        </Button>
      </PanelStyled>
    </Collapse>
  );
}

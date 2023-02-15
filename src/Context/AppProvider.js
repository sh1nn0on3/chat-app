import { Spin } from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import useFirbase from "../hooks/useFirestore";
import { AuthContext } from "./AuthProvider";

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  // console.log({isInviteMemberVisible})
  const {
    user: { uid },
  } = useContext(AuthContext);

  const roomCondition = useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: uid,
    };
  }, [uid]);
  // const selectedRoom = useMemo(
  //   () => rooms.find((room) => room.id === selectedRoomId),
  //   [rooms, selectedRoomId]
  // );

  const rooms = useFirbase("rooms", roomCondition);
  //   console.log({ rooms });

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId),
    [rooms, selectedRoomId]
  );
  // check
  const checkSelectedRoom = selectedRoom ? selectedRoom.members : "";
  // console.log(checkSelectedRoom)

  const usersCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: checkSelectedRoom,
    };
  }, [checkSelectedRoom]);

  const members = useFirbase("users", usersCondition);
  return (
    <div>
      <AppContext.Provider
        value={{
          members,
          rooms,
          selectedRoom,
          isAddRoomVisible,
          setIsAddRoomVisible,
          selectedRoomId,
          setSelectedRoomId,
          isInviteMemberVisible,
          setIsInviteMemberVisible,
        }}
      >
        {children}
      </AppContext.Provider>
    </div>
  );
}

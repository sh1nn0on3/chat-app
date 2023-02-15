import { Avatar, Button, Typography } from "antd";

import React, { useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../../Context/AuthProvider";
import { auth } from "../../firebase/config";

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(82, 38, 83);

  .username {
    color: white;
    margin-left: 5px;
  }

  .button {
    color: white;
  }
`;

export default function UserInfo() {
  const {
    user: { displayName, photoURL },
  } = useContext(AuthContext);

  // console.log({data})

  // useEffect(() => {
  //   db.collection("users").onSnapshot((snapshot) => {
  //     const data = snapshot.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }));
  //     console.log({ data, snapshot, docs: snapshot.docs });
  //   });
  // }, []);
  return (
    <WrapperStyled>
      <div>
        <Avatar src={photoURL}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className="username">{displayName} </Typography.Text>
      </div>
      {/* <Button>Đăng Xuất</Button> */}
      <Button onClick={() => auth.signOut()} className="button">
        Đăng Xuất
      </Button>
    </WrapperStyled>
  );
}

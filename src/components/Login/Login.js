import React from "react";
import { Row, Col, Button } from "antd";
import Title from "antd/es/typography/Title";
import { auth } from "../../firebase/config";
import firebase from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { addDocument, generateKeywords } from "../../firebase/services";

// liên kết firebase -> auth Fb
const fbProvider = new firebase.auth.FacebookAuthProvider();

export default function Login() {
  const handleFbLogin = async () => {
    // dữ liệu form vào data
    const { additionalUserInfo, user } = await auth.signInWithPopup(fbProvider);

    // db lấy từ FireStore
    // console.log({ db });

    // check isNewUser  ~~~ add form -> form
    // console.log({ additionalUserInfo });

    // data user
    // console.log({ user });

    // form data
    if (additionalUserInfo?.isNewUser) {
      addDocument("users", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        providerId: additionalUserInfo.providerId,
        keywords: generateKeywords(user.displayName),
      });

      // db.collection('users').add({
      //   displayName: user.displayName,
      //   email : user.email,
      //   photoURL: user.photoURL,
      //   uid : user.displayName,
      //   providerId : additionalUserInfo.providerId,
      // })
    }
    //  console.log({data})
    return true;
  };

  // Điều hướng về trang Login < Nếu chưa có tk đăng nhập >
  const navigate = useNavigate();
  auth.onAuthStateChanged((user) => {
    // console.log({ user });
    if (user) {
      navigate("/");
    }
  });

  return (
    <div>
      <Row className="flex justify-center">
        <Col span={8}>
          <Title className="flex justify-center">Fun Chat</Title>
          <Button className="w-full mb-5 ">Đăng Nhập Bằng Google</Button>
          <Button
            className="w-full flex justify-center "
            onClick={handleFbLogin}
          >
            Đăng Nhập Bằng Facebook
          </Button>
        </Col>
      </Row>
    </div>
  );
}

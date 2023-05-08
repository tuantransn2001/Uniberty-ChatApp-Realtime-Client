import React from "react";
import fetchAPI from "../../utils/fetch";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
const Login = ({}): JSX.Element => {
  const navigate = useNavigate();
  const [name, setName] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [_, setAccessTokenLocalStorage] = useLocalStorage("token", true);
  const [__, setCurrentUserIDLocalStorage] = useLocalStorage("id", "");

  const handleOnSubmit = async (): Promise<any> => {
    if (name && password) {
      const loginResult = await fetchAPI.post("login", { name, password });
      if (loginResult.status === 201) {
        setAccessTokenLocalStorage(loginResult.data.token);

        const currentUserID: string = loginResult.data.userInfo.id;

        setCurrentUserIDLocalStorage(currentUserID);
        // ? => Direct to Chat Screen
        navigate("/chat");
      }
    } else {
      console.error("Name | Password is require!");
    }
  };

  return (
    <>
      <input
        placeholder="Enter name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <br></br>
      <input
        placeholder="Enter password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <br></br>
      <button onClick={handleOnSubmit}>Login</button>
    </>
  );
};

export default Login;

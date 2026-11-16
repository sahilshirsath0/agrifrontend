import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const AuthContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const Input = styled.input`
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Authentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Now used in handleLogin

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    alert(`Logging in with:\nEmail: ${email}\nPassword: ${password}`);
  };
  const { t } = useTranslation();
  return (
    <AuthContainer>
      <h2>{t("login")}</h2>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleLogin}>{t("login")}</Button>
    </AuthContainer>
  );
};

export default Authentication;

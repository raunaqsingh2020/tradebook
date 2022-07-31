import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Row, Col, Container } from "react-bootstrap";
import {UserContext} from '../App'
import { useNavigate } from "react-router-dom";
import AboutTradebook from "./AboutTradebook";

import { addTrials, authAccount, getUser } from '../modules/api';

const StyledRegisterLink = styled(Link)`
  text-decoration: none;
  font-family: Poppins;
  font-weight: 600;
  font-size: 16px;
  color: #2400FF;
  position: relative;
  margin-left: 5px;
`;

const StyledResetLink = styled(Link)`
  text-decoration: none;
  display: flex;
  justify-content: center;
  font-family: Poppins;
  font-weight: 600;
  font-size: 16px;
  color: #2400FF;
`;

const InputField = styled.input`
  height: 50px;
  border-radius: 30px;
  border-color: #DEDEDE;
  border-style: solid;
  padding-left: 20px;
  font-family: Poppins;
  font-weight: 400;
`;

const StyledRow = styled(Row)`
  @media(max-width: 991px) {
    flex-direction: column-reverse;
  }
`;

const Error = styled.p`
  margin: 1rem 0 0 0;
  text-align: center;
  font-style: normal;
  font-size: 11px;
  font-family: Poppins;
  color: #FF0000;
  visibility: ${({ show = 'hidden' }) => show};
  @media(max-width: 768px) {
    font-size: 12px;
  }
`;

const Login = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [valid, setValid] = useState('hidden');
  const [error, setError] = useState('error');

  const { setAuthUsername, setUserId } = useContext(UserContext);

  async function handleLogin() {
    const res = await authAccount(username, password);
    console.log(res);
    if (res == null) {
      setValid('visible');
      setError('Unexpected error occurred.')
    } else if (res.status === "error") {
      setValid('visible');
      setError(res.message)
      if (res.message === "Incorrect email or password") {
        try {
          const userData = await getUser(username);
          if (userData.user.trials >= 5) {
            setValid('visible');
            setError('Too many incorrect password attempts, try again tomorrow.')
          }
          await addTrials(userData.user.id);
        } catch {
          console.log("error increasing attempts");
        }
      }
    } else {
      setValid('hidden');
      setAuthUsername(username);
      setUserId(res.data.user.id);
      localStorage.setItem("user-id", res.data.user.id);
      localStorage.setItem("username", username);
      navigate('/search', {});
    }
  }

  return (
    <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
      <StyledRow>
        <Col sm={12} md={12} lg={6}>
          <div style={{margin: '0', padding: '60px 30px 10px 30px'}}>
            <div style={{margin: '0 auto', width: 'fit-content'}}>
              <h1 style={{fontSize: '55px', fontFamily: 'Poppins', fontWeight: 700}}>Log in.</h1>
              <p style={{fontFamily: 'Poppins', fontWeight: 500}}>Don't have an account?
                <StyledRegisterLink to="/register">Register</StyledRegisterLink>
              </p>
              <p style={{'margin-top': '40px', fontFamily: 'Poppins'}}><b>Email</b></p>
              <InputField type="text" size="50" placeholder="joe@email.com" onChange={e => setUsername(e.target.value)}/>
              <p style={{'margin-top': '20px', fontFamily: 'Poppins'}}><b>Password</b></p>
              <InputField type="password" size="50" placeholder="Enter your password" onChange={e => setPassword(e.target.value)}/>
              <br/>
              <div style={{marginTop: '0 auto', width: '100%', display: 'flex', justifyContent: 'center'}}>
                <button type="submit" id="login_button" onClick={() => handleLogin()}>Log in</button>
              </div>
              <Error show={valid}>{error}</Error>
              <br/>
              <StyledResetLink to="/reset-password">Forgot password?</StyledResetLink>
            </div>
          </div>
        </Col>
        <Col sm={12} md={12} lg={6} style={{ background: 'linear-gradient(141.22deg, #2400FF 5.53%, #3000BA 81.5%)' }}>
          <div style={{width: '100%', height: '100%', margin: 0 }}>
            <AboutTradebook/>
          </div>
        </Col>
      </StyledRow>
    </Container>
  );
}

export default Login;

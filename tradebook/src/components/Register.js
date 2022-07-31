import React, { useState, useContext } from "react";
import { Link, NavigationType } from "react-router-dom";
import styled from "styled-components";
import { Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AboutTradebook from "./AboutTradebook";
import { UserContext } from "../App";

import { registerAccount } from '../modules/api';

const StyledRegisterLink = styled(Link)`
  text-decoration: none;
  font-family: Poppins;
  font-weight: 600;
  font-size: 16px;
  color: #2400FF;
  position: relative;
  margin-left: 5px;
`;

const InputField = styled.input`
  height: 40px;
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

const Register = () => {

  const navigate = useNavigate();

  const { setAuthUsername, setUserId } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [valid, setValid] = useState('hidden');
  const [error, setError] = useState('error');

  const passRegex = /^[a-z0-9]+$/i;
  const emailRegex = /\S+@\S+\.\S+/;

  async function handleRegister() {
    if (!passRegex.exec(password) || password.length < 8) {
      setError('Please enter an alphanumeric password with 8+ characters.')
      setValid('visible');
    } else if (!emailRegex.exec(username)) {
      setError('Please enter a valid email address.')
      setValid('visible');
    } else {
      const res = await registerAccount(username, password, question, answer);
      if (res == null) {
        setValid('visible');
        setError('Unexpected error occurred.')
      } else if (res.status === "error") {
        setValid('visible');
        setError(res.message)
      } else {
        setValid('hidden');
        setAuthUsername(username)
        setUserId(res.data.newUser.id);
        localStorage.setItem("user-id", res.data.newUser.id);
        localStorage.setItem("username", username);
        navigate('/search', {});
      }
    }
  }

  return (
    <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
      <StyledRow>
        <Col sm={12} md={12} lg={6}>
          <div style={{margin: '0', padding: '15px 30px 10px 30px', background: 'white'}}>
            <div style={{margin: '0 auto', width: 'fit-content'}}>
              <h1 style={{fontSize: '45px', fontFamily: 'Poppins', fontWeight: 700}}>Get started.</h1>
              <p style={{fontFamily: 'Poppins', fontWeight: 500}}>Already have an account?
                <StyledRegisterLink to="/">Log in</StyledRegisterLink>
              </p>
              <p style={{'margin-top': '25px', fontFamily: 'Poppins', marginBottom: 5}}><b>Email</b></p>
              <InputField type="text" size="50" placeholder="joe@email.com" value={username} onChange={e => setUsername(e.target.value)}/>
              <p style={{'margin-top': '15px', fontFamily: 'Poppins', marginBottom: 5}}><b>Password</b></p>
              <InputField type="password" size="50" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)}/>
              <p style={{marginTop: '8px', textAlign: 'center', fontFamily: 'Poppins', fontWeight: 400, color: '#676767', fontSize: '13px'}}>
                {'Use 8 or more letters & numbers'}
              </p>
              <p style={{'margin-top': '15px', fontFamily: 'Poppins', marginBottom: 5}}><b>Security Question</b></p>
              <InputField type="text" size="50" placeholder="E.g. What was your first pet's name?" value={question} onChange={e => setQuestion(e.target.value)}/>
              <p style={{'margin-top': '15px', fontFamily: 'Poppins', marginBottom: 5}}><b>Your Answer</b></p>
              <InputField type="text" size="50" placeholder="Make sure to remember this!" value={answer} onChange={e => setAnswer(e.target.value)}/>
              <div style={{marginTop: '0 auto', width: '100%', display: 'flex', justifyContent: 'center'}}>
                <button type="submit" id="login_button" onClick={() => handleRegister()}>Register</button>
              </div>
              <Error show={valid}>{error}</Error>
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

export default Register;

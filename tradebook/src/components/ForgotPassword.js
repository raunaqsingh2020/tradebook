import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Row, Col, Container } from "react-bootstrap";
import AboutTradebook from "./AboutTradebook";
import { getUser, updatePassword, verifySecurityQuestion } from "../modules/api";

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

const VerifyDiv = styled.div`
  margin: 0;
  padding: 0;
  visibility: ${({ show = 'hidden' }) => show};
`;

const Result = styled.p`
  margin: 0.5rem 0 0 0;
  text-align: center;
  font-style: normal;
  font-size: 12px;
  font-family: Poppins;
  font-weight: bold;
  visibility: ${({ show = 'hidden' }) => show};
  @media(max-width: 768px) {
    font-size: 12px;
  }
`;

const ForgotPassword = () => {

  const [username, setUsername] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPassword, setPassword] = useState('');

  const [valid, setValid] = useState('hidden');
  const [userFound, setUserFound] = useState('hidden');
  const [showResult, setShowResult] = useState('hidden');
  const [result, setResult] = useState('');
  const [userId, setUserId] = useState('');

  const passRegex = /^[a-z0-9]+$/i;

  async function checkUser() {
    setQuestion('');
    const res = await getUser(username);
    setShowResult('hidden');
    if (res == null) {
      setValid('hidden');
      setUserFound('hidden');
      console.log("Unexpected error.");
    } else if (res.status === "error") {
      setValid('hidden');
      setUserFound('visible');
    } else {
      setQuestion(res.user.securityQuestion);
      setUserId(res.user.id);
      setValid('visible');
      setUserFound('hidden');
    }
  }

  async function handleResetPassword() {
    const res = await verifySecurityQuestion(userId, answer);
    if (res == null || res.status === "error") {
      setResult('Unexpected error occurred.')
      setShowResult('visible');
    } else if (!res.data) {
      setResult('Incorrect security question answer.')
      setShowResult('visible');
    } else if (!passRegex.exec(newPassword) || newPassword.length < 8) {
      setResult('Please enter an alphanumeric password with 8+ characters.')
      setShowResult('visible');
    } else {
      const passRes = await updatePassword(answer, userId, newPassword);
      if (passRes == null || passRes.status !== "success") {
        setResult('Unexpected error occurred.')
      } else {
        setResult('Successfully reset password!');
      }
      setShowResult('visible');
    }
  }

  return (
    <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
      <StyledRow>
        <Col sm={12} md={12} lg={6}>
          <div style={{margin: '0', padding: '20px 30px 10px 30px', background: 'white'}}>
            <div style={{margin: '0 auto', width: 'fit-content'}}>
              <h1 style={{fontSize: '40px', fontFamily: 'Poppins', fontWeight: 700}}>Forgot your password?</h1>
              <p style={{fontFamily: 'Poppins', fontWeight: 500}}>Remembered?
                <StyledRegisterLink to="/">Log in</StyledRegisterLink>
              </p>
              <p style={{'margin-top': '30px', fontFamily: 'Poppins', marginBottom: 5}}><b>Email</b></p>
              <InputField type="text" size="50" placeholder="joe@email.com" value={username} onChange={e => setUsername(e.target.value)}/>
              <div style={{marginTop: '0 auto', width: '100%', display: 'flex', justifyContent: 'center'}}>
                <button style={{marginTop: 20}} type="submit" id="login_button" onClick={() => checkUser()}>Go</button>
              </div>
              <Result show={userFound}>No accounts with that email address found.</Result>
              <VerifyDiv show={valid}>
                <p style={{'margin-top': '10px', fontFamily: 'Poppins', marginBottom: 5}}><b>Security Question: {question}</b></p>
                <InputField type="text" size="50" placeholder="Enter your answer here" value={answer} onChange={e => setAnswer(e.target.value)}/>
                <p style={{'margin-top': '20px', fontFamily: 'Poppins', marginBottom: 5}}><b>New Password</b></p>
                <InputField type="text" size="50" placeholder="Enter your new password" value={newPassword} onChange={e => setPassword(e.target.value)}/>
                <br/>
                <div style={{marginTop: '0 auto', width: '100%', display: 'flex', justifyContent: 'center'}}>
                  <button style={{marginTop: 20}} type="submit" id="login_button" onClick={() => handleResetPassword()}>Reset Password</button>
                </div>
                <Result show={showResult}>{result}</Result>
              </VerifyDiv>
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

export default ForgotPassword;

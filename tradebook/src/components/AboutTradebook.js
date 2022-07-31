import React from "react";
import styled from "styled-components";

import logo from "../assets/logo.png";

const Wrapper = styled.div`
  margin: 0;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(141.22deg, #2400FF 5.53%, #3000BA 81.5%);
  padding: 70px 40px 70px 40px;
`;

const Logo = styled.img`
  width: min(40%, 300px);
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
`

const Header = styled.h1`
  color: #FFF;
  font-size: 60px;
  font-family: Poppins;
  font-weight: 700;
  white-space: break-spaces;
  text-align: center;
  padding: 0 10px 0 10px;
  overflow: hidden;
  margin-top: 6rem;
`

const Subhead = styled.h1`
  color: #FFF;
  font-size: min(4vw, 25px);
  font-family: Poppins;
  font-weight: 500;
  text-align: center;
  padding: 0 25px 0 25px;
  margin-top: 6rem;
`

const AboutTradebook = () => {
  return (
    <Wrapper>
        <div style={{margin: '0 auto', width: 'fit-content'}}>
            <Logo src={logo}/>
            <Header>{'Textbooks\nare\n$$$'}</Header>
            <Subhead>Connect with students that have the textbooks you need!</Subhead>
        </div>
    </Wrapper>
  );
}

export default AboutTradebook;

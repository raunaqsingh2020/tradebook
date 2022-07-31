import React, {createContext, useState} from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './assets/App.css';
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Register from "./components/Register";
import Profile from "./components/Profile";
//import Navbar from "./components/Navbar";
import Search from "./components/Search";
import Messages from "./components/Messages";
import Chat from "./components/Chat";
import TextbookDetails from "./components/TextbookDetails";
import "setimmediate";

export const UserContext = createContext({
  username: "not-authenticated",
  setAuthUsername: (username) => {},
  userId: "no-userid",
  setUserId: (userId) => {}
});

function App() {

  const [username, setAuthUsername] = useState("not-authenticated");
  const [userId, setUserId] = useState("no-userid");

  return (
    <>
      <Helmet>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="tradebook" />
        <title>tradebook</title>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
        />

        <meta
          property="og:title"
          content="tradebook: ..."
        />
        <meta
          property="og:image"
          content="..."
        />
        <meta property="og:description" content="desc..."/>
        <meta property="og:type" content="page" />
        <meta
          property="og:url"
          content="https://..."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="..."
        />
        <meta
          name="twitter:image"
          content="..."
        />
        <meta name="twitter:description" content="..."/>
        <meta
          name="twitter:url"
          content="..."
        />

        <script
          src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
          integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
          integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
          integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
          crossOrigin="anonymous"
        ></script>
      </Helmet>
      <UserContext.Provider value={{ username, setAuthUsername, userId, setUserId }}>
        <Router>
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/reset-password" element={<ForgotPassword/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/search" element={<Search/>} />
            <Route path="/messages" element={<Messages/>} />
            <Route path="/chat" element={<Chat/>} />
            <Route path="/TextbookDetails" element={<TextbookDetails/>} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
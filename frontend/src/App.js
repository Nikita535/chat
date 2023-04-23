import Header from './Components/Header/header';
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import { useContext, useEffect} from 'react';
import {Context} from './index';
import { check } from './http/userApi';
import { observer } from 'mobx-react-lite';
import React from 'react';
import {ChatRoom} from "./Components/ChatRoom";
import Profile from "./Components/Profile";
import Admin from "./Components/Admin/Admin";


const App = observer((props) => {
  const {user}= useContext(Context);

  useEffect(() => {
    check().then(data => {
      user.setUser(data.data)
      user.setIsAuth(true)
      console.log(data)
    })
  }, [])



  return (
      <BrowserRouter>
        <div>
          <Header/>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            {user.isAuth &&
              <Route path="/chat" element={<ChatRoom/>}/>
            }
            {user.isAuth &&
                <Route path="/profile" element={<Profile/>}/>
            }
            {user.isAuth && user.isAdmin &&
                <Route path="/admin" element={<Admin/>}/>
            }
          </Routes>
        </div>
      </BrowserRouter>
  );
})

export default App;
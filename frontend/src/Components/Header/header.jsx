import React from "react";
import { NavLink } from "react-router-dom";
import { Context } from "../..";
import { useContext } from "react";
import {observer} from "mobx-react-lite";
import jwt_decode from 'jwt-decode';


const Header = observer((props) =>{
    const {user} = useContext(Context);


    const logOut = () =>{
        user.setUser({});
        user.setIsAuth(false);
        console.log(jwt_decode(localStorage.getItem('token')))
        localStorage.removeItem('token');
    }

    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">Курсовая работа</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        {user.isAuth &&
                            <li class="nav-item active">
                                <NavLink className='nav-link' to="/chat" >Чат</NavLink>
                            </li>
                        }
                        {user.isAuth &&
                            <li class="nav-item active">
                                <NavLink className='nav-link' to="/profile">Личный кабинет</NavLink>
                            </li>
                        }
                        {!user.isAuth &&
                            <li class="nav-item">
                                <NavLink className='nav-link' to="/login">Авторизация</NavLink>
                            </li>
                        }
                        {user.isAdmin && user.isAuth &&
                            <li class="nav-item">
                                <NavLink className='nav-link' to="/admin">Администратор</NavLink>
                            </li>
                        }
                        {user.isAuth &&
                            <li class="nav-item">
                                <NavLink className='nav-link' onClick={()=>logOut()} to="/">{`Выйти: ${JSON.parse(JSON.stringify(user.user)).username}`}</NavLink>
                            </li>
                        }
                    </ul>
                </div>
            </nav>
        </div>
    );
})

export default Header;
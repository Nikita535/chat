import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState ,useContext} from "react";
import {login} from '../../http/userApi'
import {observer} from "mobx-react-lite";
import { Context } from "../..";

const Login = observer(() =>{
    const [name,setName] = useState();
    const [password,setPassword]=useState();
    const [email,setEmail]=useState();
    const {user} = useContext(Context);
    const [loginError, setLoginError] = useState('');
    let navigate = useNavigate();

    const signUp = async()=>{
        let data;
        try {
            data = await login(email,name,password,navigate);
            user.setUser(data);
            user.setIsAuth(true);
            console.log(JSON.parse(JSON.stringify(user.user)))
            navigate('/');
        } catch (error) {
            console.log(error.response.data)
            setLoginError("Такого пользователя не существует!")
            navigate('/login');
        }
    }
    return (
        <section class="vh-100">
            <div class="container py-5 h-100">
                <div class="row d-flex align-items-center justify-content-center h-100">
                    <div class="col-md-8 col-lg-7 col-xl-6">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                             class="img-fluid" alt="Phone image"></img>
                    </div>
                    <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                        <form>
                            <div class="form-outline mb-4">
                                {
                                    loginError ? <span style={{ color: 'red', fontSize: '12px'}}>{loginError}</span> : ''
                                }
                                <input type="name" onChange={e =>setName(e.target.value)} id="form1Example13" class="form-control form-control-lg" />
                                <label class="form-label" for="form1Example13">Имя</label>
                            </div>

                            <div className="form-outline mb-4">
                                <input type="email" onChange={e => setEmail(e.target.value)} id="form1Example13"
                                       className="form-control form-control-lg"/>
                                <label className="form-label" htmlFor="form1Example13">Почта</label>
                            </div>

                            <div class="form-outline mb-4">
                                <input type="password" onChange={e =>setPassword(e.target.value)} id="form1Example23" class="form-control form-control-lg" />
                                <label class="form-label" for="form1Example23">Пароль</label>
                            </div>
                            <NavLink to="/register">Регистрация</NavLink>
                            <br></br>
                            <NavLink to="/login" onClick={signUp} class="btn btn-primary btn-lg">Логин</NavLink>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
})

export default Login;
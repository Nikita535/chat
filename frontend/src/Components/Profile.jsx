import React, { useEffect, useState } from 'react'
import {useContext} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {editProfile} from "../http/userApi";

const Profile = observer(()=>{
    const {user} = useContext(Context);
    const [name,setName] = useState( JSON.parse(JSON.stringify(user.user)).username);
    const [password,setPassword]=useState();
    const [email,setEmail]=useState( JSON.parse(JSON.stringify(user.user)).email);
    const [avatar, setAvatar] = useState();

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [userExistError, setUserExistError] = useState('');


    const saveChanges =async ()=>{
        let formData = new FormData();
        if (avatar){
            formData.append('file',avatar);
        }
        let user1 = {
            username:name,
            email:email,
            password:password
        }
        formData.append('user', JSON.stringify(user1))
        await editProfile(formData).then(response => {
            if (!response.ok) {
                response.json().then(
                    err => {
                        console.log(err)
                        err.forEach(fieldError => {
                            console.log(fieldError.defaultMessage)
                            switch (fieldError.field) {
                                case 'username': {
                                    setNameError(fieldError.defaultMessage);
                                    break;
                                }
                                case 'email': {
                                    setEmailError(fieldError.defaultMessage);
                                    break;
                                }
                                case 'password': {
                                    setPasswordError(fieldError.defaultMessage);
                                    break;
                                }
                            }
                        })
                    }
                )
            } else {
                response.json().then(async (data) => {
                        console.log(data)
                        user.setUser(data);
                        user.setIsAuth(true);
                        localStorage.setItem('token',data.jwt);
                })

            }

        })
    }

    return (
        <div class="container rounded bg-white mt-5 mb-5">
            <div class="row">
                <div class="col-md-3 border-right">
                    <div class="d-flex flex-column align-items-center text-center p-3 py-5"><img class="rounded-circle mt-5" width="150px" src={user.avatarPicture}></img>
                        <div className="pt-3 col-10">
                            <input className="form-control"
                                   type="file"
                                   name="formFile1"
                                   id="formFile1"
                                   accept="image/*"
                                   multiple
                                   onChange={e => setAvatar(e.target.files[0])}/>
                        </div>
                        <span class="font-weight-bold">{ JSON.parse(JSON.stringify(user.user)).username}</span>
                        <span class="text-black-50">{ JSON.parse(JSON.stringify(user.user)).email}</span><span> </span></div>
                </div>
                <div class="col-md-5 border-right">
                    <div class="p-3 py-5">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4 class="text-right">Настройка профиля</h4>
                        </div>

                        <div class="row mt-2">
                            {
                                userExistError ? <span style={{ color: 'red', fontSize: '12px'}}>{userExistError}</span> : ''
                            }
                            {
                                nameError ? <span style={{ color: 'red', fontSize: '12px'}}>{nameError}</span> : ''
                            }
                            <div class="col-md-6"><label class="labels">Имя</label><input onChange={e =>setName(e.target.value)} type="text" class="form-control" placeholder="Имя" value={name ||  JSON.parse(JSON.stringify(user.user)).username}></input></div>
                            {
                                emailError ? <span style={{ color: 'red', fontSize: '12px'}}>{emailError}</span> : ''
                            }
                            <div class="col-md-6"><label class="labels">Почта</label><input onChange={e =>setEmail(e.target.value)} type="email" class="form-control" value={email ||  JSON.parse(JSON.stringify(user.user)).email} placeholder="Почта"></input></div>
                        </div>
                        <div class="row mt-3">
                            {
                                passwordError ? <span style={{ color: 'red', fontSize: '12px'}}>{passwordError}</span> : ''
                            }
                            <div class="col-md-12"><label class="labels">Пароль</label><input type="password" onChange={e =>setPassword(e.target.value)} class="form-control" placeholder="Пароль" value={password}></input></div>
                        <div class="mt-5 text-center"><button class="btn btn-primary profile-button" onClick={saveChanges} type="button">Сохранить изменения</button></div>
                    </div>
                </div>
            </div>
         </div>
        </div>
    );
});

export default Profile;
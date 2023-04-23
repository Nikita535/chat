import { $authHost,$host } from ".";
import axios from "axios";
import jwt_decode from 'jwt-decode';

const login =async (email,username,password) =>{
    const {data} = await $host.post('api/auth/login',{email,username,password})
    localStorage.setItem('token',data.jwt)
    return data;
}

const registration = async (email,username, password) => {
    return await $host.post('api/auth/register', {
        username,
        password,
        email
    })
};

const getToken=()=>{
    return localStorage.getItem('token');
}

const check = async () =>{
    return axios({
        method:'GET',
        url:`http://localhost:8080/api/auth/userinfo`,
        headers:{
            'Authorization':'Bearer '+getToken()
        }
    })
}

const editProfile = async (formData) =>{
    return fetch("http://localhost:8080/api/user/edit", {
        method: "POST",
        body: formData,
        headers:{'Authorization': 'Bearer ' + getToken()}
    })
}

const getAvatar = async (url) => {
    return axios({
        method: 'GET',
        url: url,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}
const allUsers = async (page) => {
    return axios({
        params:{
            pageNumber: page
        },
        method: 'GET',
        url: `http://localhost:8080/api/admin/users`,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

const deleteUser = async (id) => {
    return axios({
        params:{
            id:id
        },
        method: 'DELETE',
        url: `http://localhost:8080/api/admin/delete/`,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

const getPublicMessages = async () =>{
    return axios({
        method: 'GET',
        url: `http://localhost:8080/api/chat/messages/public/`,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

const getPrivateMessages = async () =>{
    return axios({
        method: 'GET',
        url: `http://localhost:8080/api/chat/messages/private/`,
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    })
}

export {
    login,
    registration,
    check,
    getToken,
    editProfile,
    getAvatar,
    allUsers,
    deleteUser,
    getPublicMessages,
    getPrivateMessages
}
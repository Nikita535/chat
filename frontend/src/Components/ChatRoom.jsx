import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import {useContext} from "react";
import {Context} from "../index";
import ReactLoading from "react-loading"
import {allUsers, getPrivateMessages, getPublicMessages} from "../http/userApi";
let globalPublicChats=[];
let members=[]

var stompClient =null;
const ChatRoom = () => {
    const [loading, setLoading] = useState(true);
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab,setTab] =useState("CHATROOM");
    const {user} = useContext(Context);

    const [userData, setUserData] = useState({
        username: JSON.parse(JSON.stringify(user.user.username)),
        receivername: '',
        connected: false,
        message: ''
    });


    useEffect(() => {
        allUsers().then((data)=>{
            members=[...data.data]
            console.log(members)
        }).finally(() => setLoading(false))

        getPublicMessages().then((data) => {
            globalPublicChats = data.data
            setPublicChats([...globalPublicChats])
        })

        getPrivateMessages().then((data) =>{
            console.log(data.data)
        })
        connect();
    }, [])

     const connect =()=>{

        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({},function (){
            setTimeout(onConnected,100)
        }, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{
        var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        console.log(payloadData)
        switch(payloadData.status){
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)){
                    privateChats.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats(globalPublicChats.concat(publicChats));
                break;
        }
    }

    const onPrivateMessage = (payload)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);

    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }
    const sendValue=()=>{
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                receiverName:tab,
                message: userData.message,
                status:"MESSAGE"
            };

            if(userData.username !== tab){
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    if (loading) {
        return (<div className={"d-flex min-vh-100 align-items-center justify-content-center"}><ReactLoading
            className={"col-md-8 mx-auto h-100"} type={"spinningBubbles"} color={"skyblue"} height={'20vh'}
            width={'20vh'}></ReactLoading></div>)
    } else {
    return (
        <div className="container">
            {userData.connected &&
                <div className="chat-box">
                    <div className="member-list">
                        <ul>
                            <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab==="CHATROOM" && "active"}`}>Общая комната</li>
                            {[...privateChats.keys()].map((name,index)=>(
                                <div>
                                    <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>
                                        <img style={{ height: 40 , width:40, marginRight:'10px',borderRadius:20}} src={'http://localhost:8080/api/media/' +members.find(user=>user.username===name).avatar.id}></img>
                                        {name}
                                    </li>
                                </div>
                            ))}
                        </ul>
                    </div>
                    {tab==="CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages prokrutka">
                            {publicChats.map((chat,index)=>(
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username &&
                                        <div className="avatar">
                                            <img style={{ height: 40 , width:40, marginRight:'10px',borderRadius:20}} src={'http://localhost:8080/api/media/' +members.find(user=>user.username===chat.senderName).avatar.id}></img>
                                            {chat.senderName}
                                        </div>
                                    }
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">
                                        {chat.senderName}
                                        <img style={{ height: 40 , width:40, marginLeft:'10px',borderRadius:20}} src={'http://localhost:8080/api/media/' +members.find(user=>user.username===chat.senderName).avatar.id}></img>
                                    </div>
                                    }
                                </li>
                            ))}
                        </ul>

                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                            <button type="button" className="send-button" onClick={sendValue}>send</button>
                        </div>
                    </div>}
                    {tab!=="CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages prokrutka">
                            {[...privateChats.get(tab)].map((chat,index)=>(
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {
                                        chat.senderName !== userData.username &&
                                        <div className="avatar">
                                            <img style={{ height: 40 , width:40, marginRight:'10px',borderRadius:20}} src={'http://localhost:8080/api/media/' +members.find(user=>user.username===chat.senderName).avatar.id}></img>
                                            {chat.senderName}
                                        </div>
                                    }
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username &&
                                        <div className="avatar self">
                                            {chat.senderName}
                                            <img style={{ height: 40 , width:40, marginLeft:'10px',borderRadius:20}} src={'http://localhost:8080/api/media/' +members.find(user=>user.username===chat.senderName).avatar.id}></img>
                                        </div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                            <button type="button" className="send-button" onClick={sendPrivateValue}>send</button>
                        </div>
                    </div>}
                </div>
            }
        </div>
    )
}}

export {ChatRoom}

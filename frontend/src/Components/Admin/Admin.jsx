import React from "react";
import {useState, useEffect, useContext} from "react";
import {allUsers, deleteUser, login} from '../../http/userApi'
import {observer} from "mobx-react-lite";
let page = 0;
const Admin = observer(() => {


    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);

    const removeUser = async (event, id) => {
        const table = event.target.parentNode.parentNode.parentNode
        const tr = event.target.parentNode.parentNode
        await deleteUser(id).then(() => table.removeChild(tr))
    }

    const nextPage =async ()=>{
        page+=1
        allUsers(page).then(data => {
            console.log(data)
            setUsers(data.data)
        }).finally(() => setLoading(false))
        console.log(page)
    }

    const previousPage =async ()=>{
        page=page-1
        if(page<0){
            page=0
        }
        allUsers(page).then(data => {
            console.log(data)
            setUsers(data.data)
        }).finally(() => setLoading(false))
        console.log(page)
    }

    useEffect(() => {
        allUsers(page).then(data => {
            console.log(data)
            setUsers(data.data)
        }).finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (<div>Загрузка</div>)
    } else {
        return (
            <div className="container">
                <table className="table table-responsive" id="myTable">
                    <tr>
                        <th>Фото</th>
                        <th>Имя</th>
                        <th>Почта</th>
                        <th>Активность</th>
                        <th>Роль</th>
                    </tr>
                    {users.map(user => {
                        return (
                            <tr>
                                <td>
                                    {user.avatar ?
                                    <img style={{ height: 100 , width:80}} src={'http://localhost:8080/api/media/' + user.avatar.id}></img>
                                    :
                                    <img
                                        style={{ height: 100 , width:80}} src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh-Eyhw75b-TG4elFWMKn9AofNoQQMgkIwiw&usqp=CAU'}></img>
                                    }
                                </td>
                                <td>{user.email}</td>
                                <td>{user.active ? 'Активен' : 'Не активен'}</td>
                                {user.authorities.includes('ROLE_ADMIN') &&
                                    <td>Админ</td>}
                                {!user.authorities.includes('ROLE_ADMIN') &&
                                    <td>Пользователь</td>}
                                {!user.authorities.includes('ROLE_ADMIN') &&
                                    <td><span className="btn btn-danger"
                                          onClick={(event) => removeUser(event, user.id)}>Удалить аккаунт</span>
                                </td>}
                            </tr>)
                    })}
                </table>
                <div className="tab-pane"  style={{ textAlign:"center"}} id="tab2">
                    <a className="btn btn-primary btnNext"  style={{ marginRight:15}} onClick={previousPage}>Назад</a>
                    <a className="btn btn-primary btnPrevious" onClick={nextPage}>Вперёд</a>
                </div>
            </div>
        );
    }
})

export default Admin;
import {makeAutoObservable} from 'mobx';
export default class UserStore {
    constructor(){
        this._isAuth = false;
        this._user={};
        makeAutoObservable(this);
    }


    setIsAuth(bool){
        this._isAuth=bool;
    }

    setUser(user){
        this._user=user;
    }


    get isAuth(){
        return this._isAuth;
    }

    get user(){
        return this._user;
    }

    get isAdmin() {
        if (this.isAuth) {
            return this._user.authorities.includes('ROLE_ADMIN')
        } else return false
    }

    get avatarPicture() {
        if (this._user.avatar) {
            return "http://localhost:8080/api/media/" + this._user.avatar.id
        } else {
            return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh-Eyhw75b-TG4elFWMKn9AofNoQQMgkIwiw&usqp=CAU"
        }
    }
}
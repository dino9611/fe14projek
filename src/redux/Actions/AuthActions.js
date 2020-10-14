import Axios from 'axios'
import { API_URL,API_URLbe } from '../../helpers/idrformat'
import {ADDCART} from './../Type'
export const LoginFunc=(user,cart)=>{
    return{
        type:'LOGIN',
        payload:user,
        cart:cart
    }
}

export const Clearfunc=()=>{
    return{
        type:'CLEAR'
    }
}

export const LogOutfunc=()=>{
    return{
        type:'LOGOUT'
    }
}
export const AddcartAction=(cart)=>{
    return{
        type:ADDCART,
        cart:cart
    }
}


export const LoginThunk=(username,password)=>{
    return (dispatch)=>{
        dispatch({type:'LOADING'})
        Axios.post(`${API_URLbe}/auth/login`,{
            username:username,
            password:password
        })
        .then((res)=>{
            localStorage.setItem('id',res.data.datauser.id)
            dispatch({type:'LOGIN',payload:res.data.datauser,cart:res.data.cart})//backend
        }).catch((err)=>{
            dispatch({type:'Error',payload:err.response.data.message})
        })
        // Axios.get(`${API_URL}/users`,{
        //     params:{
        //         username:username,
        //         password:password
        //     }
        // }).then((res)=>{
        //     if(res.data.length){
        //         Axios.get(`${API_URL}/carts`,{
        //             params:{
        //                 userId:res.data[0].id,
        //                 _expand:'product'
        //             }
        //         }).then((res1)=>{
        //             localStorage.setItem('id',res.data[0].id)
        //             dispatch({type:'LOGIN',payload:res.data[0],cart:res1.data})//json
        //             dispatch({type:'LOGIN',payload:res.data.datauser,cart:res.data.cart})//backend
        //         }).catch((err)=>{
        //             dispatch({type:'Error',payload:'servernya error bro'})
        //         })
        //     }else{
        //         dispatch({type:'Error',payload:'kayaknya nb dari redux'})
        //     }
        // }).catch((err)=>{
        //     dispatch({type:'Error',payload:'servernya error bro'})
        // })
    }
}

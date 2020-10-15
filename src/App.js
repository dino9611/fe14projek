import React, { useEffect,useState } from 'react';
import Home from './pages/home/home'
import './App.css';
import {Loading} from './components'
import ManageAdmin from './pages/admin/admin'
import ListProd from './pages/Listprod'
import NotFound from './pages/notfound'
import {Switch,Route} from 'react-router-dom'
import Login from './pages/Login/Login'
import {connect} from 'react-redux'
import {LoginFunc} from './redux/Actions'
import {API_URLbe} from './helpers/idrformat'
import Axios from 'axios'
import Cart from './pages/cart'
import DetailProd from './pages/detailprod'
import Register from './pages/register'
import {toast} from 'react-toastify'
import AdminPay from './pages/adminpayment'
import History from './pages/history'
import 'react-toastify/dist/ReactToastify.css' 
// umum : register
// user : history,
// admin :confirm admin,
toast.configure()
function App(props) {

  const [loading,setloading]=useState(true)

  useEffect( ()=>{
    var id=localStorage.getItem('id')
    if(id){ 
      Axios.get(`${API_URLbe}/auth/keeplogin/${id}`)
      .then((res)=>{
        props.LoginFunc(res.data.datauser,res.data.cart)
      }).catch((err)=>{
        console.log(err.response.data.message)
      }).finally(()=>{
        setloading(false)
      })
      //ini jason server
      // Axios.get(`${API_URL}/users/${id}`)
      // .then((res)=>{
      //   Axios.get(`${API_URL}/carts`,{
      //     params:{
      //         userId:res.data.id,
      //         _expand:'product'
      //     }
      //   }).then((res1)=>{
      //       props.LoginFunc(res.data,res1.data)
      //       // setloading(false)
      //   }).catch((err)=>{
      //       console.log(err)
      //       // setloading(false)
      //   })
      //   .finally(()=>{
      //     setloading(false)
      //   })
      // }).catch((err)=>{
      //   console.log(err)
      // }).
    }else{
      setloading(false)
    }
  },[props])
  if(loading){
    return(
      <Loading/>
    )
  }

  const renderProtectedroutesadmin=()=>{
    if(props.role==='admin'){
      return(
        <>
          <Route exact path='/manageAdmin' component={ManageAdmin}/>
        </>
      )
    }
  }

  return (
    <div >
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/products' component={ListProd}/>
        <Route path='/products/:id' component={DetailProd}/>
        <Route exact path='/cart' component={Cart}/>
        <Route exact path='/register' component={Register}/>
        <Route exact path='/adminPay' component={AdminPay}/>
        <Route exact path='/history' component={History}/>
        {renderProtectedroutesadmin()}
        <Route path='*' component={NotFound} />
      </Switch>
    </div>
  );
}
const MapstatetoProps=({Auth})=>{
  return{
    // ...Auth,
    username:Auth.username,
    isLogin:Auth.isLogin,
    role:Auth.role
    // username:Auth.username
    // username:'dino',
    // sd
  }
}
export default connect(MapstatetoProps,{LoginFunc}) (App);

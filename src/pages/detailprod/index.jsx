import React, { Component, createRef } from 'react';
import Header from '../../components/Header'
import { Breadcrumb, BreadcrumbItem,Modal,ModalBody,ModalFooter} from 'reactstrap';
import {Link,Redirect} from 'react-router-dom'
import Axios from 'axios'
import ButtonUi from './../../components/button'
import { API_URL,dateformat,API_URLbe } from '../../helpers/idrformat';
import {connect} from 'react-redux'
import {AddcartAction} from './../../redux/Actions'
import {toast} from 'react-toastify'
import SliderSlick from './../../components/Slider'

class DetailProd extends Component {
    state = {
        loading:true,
        products:{},
        qty:createRef(),
        isOpen:false,
        kelogin:false,
        photo:[]
    }

    componentDidMount(){
        Axios.get(`${API_URLbe}/product/getproduct/${this.props.match.params.id}`)
        .then((res)=>{
            console.log(res.data)
            this.setState({products:res.data.dataprod,loading:false,photo:res.data.datafoto})
        }).catch((err)=>{
            console.log(err)
        })
    }

    onAddToCart=()=>{
        if(this.props.role==='admin'){
            alert('jangan beli bro inget admin')
        }else if(!this.props.verified){
            alert('harus verified dulu')
        }else if(this.props.role==='user'){
            if(this.state.qty.current.value){
                Axios.post(`${API_URLbe}/trans/Addtocart`,{
                    userid:this.props.id,
                    productid:this.state.products.id,
                    qty:this.state.qty.current.value
                },{
                    headers:{
                        'Authorization':`Bearer ${this.props.token}`
                    },
                }).then((res)=>{
                    this.props.AddcartAction(res.data)
                    alert('berhasil masuk cart')
                }).catch((err)=>{
                    console.log(err)
                    alert(err)
                })
                // console.log(this.state.products.id)
                // Axios.get(`${API_URL}/carts`,{
                //     params:{
                //         userId:this.props.id,
                //         productId:this.state.products.id
                //     }
                // }).then((res)=>{
                //     if(res.data.length){
                //         console.log(res.data)
                //         Axios.patch(`${API_URL}/carts/${res.data[0].id}`,{
                //             qty:parseInt(this.state.qty.current.value) + parseInt(res.data[0].qty)
                //         }).then(()=>{
                //             Axios.get(`${API_URL}/carts`,{
                //                 params:{
                //                     userId:this.props.id,
                //                     _expand:'product'
                //                 }
                //             }).then((res1)=>{
                //                 this.props.AddcartAction(res1.data)
                //                 alert('berhasil masuk cart')
                //             }).catch((err)=>{
                //                 console.log(err)
                //             })
                //         }).catch((err)=>{
                //             console.log(err)
                //         })
                //     }else{
                //         Axios.post(`${API_URL}/carts`,{
                //             userId:this.props.id,
                //             productId:this.state.products.id,
                //             qty: parseInt(this.state.qty.current.value)
                //         }).then(()=>{
                //             Axios.get(`${API_URL}/carts`,{
                //                 params:{
                //                     userId:this.props.id,
                //                     _expand:'product'
                //                 }
                //             }).then((res)=>{
                //                 this.props.AddcartAction(res.data)
                //                 alert('berhasil masuk cart')
                //             }).catch((err)=>{
                //                 console.log(err)
                //             })
                //         })

                //     }
                // }).catch((err)=>{
                //     console.log(err)
                // })
            }else{
                toast('salah broo harusnya qty disii', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }else{
            this.setState({isOpen:true})
        }
    }
    
    renderfoto=()=>{
        return this.state.photo.map((val,index)=>{
            return(
                <div style={{height:'200px'}} key={index}>
                    <img src={API_URLbe+val.gambar} style={{objectFit:'cover',objectPosition:'bottom'}}  height='200' width='100%' alt={"foo"}/>
                </div>
            )
        })
    }

    onRedirecttoLogin=()=>{
        this.setState({isOpen:false,kelogin:true})
    }
    render() {
        const {products,isOpen}=this.state
        if(this.state.loading){
            return(
                <div>Loadingg....</div>
            )
        }
        if(this.state.kelogin){
            return <Redirect to='/login'/>
        } 
        return (
            <div>
                <Modal isOpen={isOpen} toggle={()=>this.setState({isOpen:false})}>
                    <ModalBody>
                        login dulu bro baru bisa beli cuy
                    </ModalBody>
                    <ModalFooter>
                        <ButtonUi onClick={this.onRedirecttoLogin}>
                            Ok
                        </ButtonUi>
                    </ModalFooter>
                </Modal>
                <Header/>
                <div className='martgintop'>
                    <Breadcrumb className='tranparant m-0 px-2 '>
                        <BreadcrumbItem ><Link className='link-class' to="/">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem ><Link className='link-class' to="/products">Products</Link></BreadcrumbItem>
                        <BreadcrumbItem active >{this.state.products.namaproduct}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="pt-3 px-4">
                        <div style={{width:'100%',height:400,}}>
                            <img src={API_URLbe+products.banner} style={{objectFit:'cover',objectPosition:'bottom'}} height='100%' width='100%' alt={"foo"}/>
                        </div>
                        <div className='pt-3' style={{paddingRight:300,paddingLeft:300}}>
                            <SliderSlick>
                                {this.renderfoto()}
                            </SliderSlick>
                        </div>
                        <h5 className='mt-2'>Tanggal mulai :{dateformat(products.tanggalmulai)}</h5>
                        <h5 className='mt-2'>Tanggal berakhir :{dateformat(products.tanggalberakhir)}</h5>
                        <h2 className='mt-2'>
                            {products.namaproduct}
                        </h2>
                        <label>jumlah tiket</label><br/>
                        <input type="number" className={'form-control'} placeholder='qty' style={{width:200}} ref={this.state.qty}/>
                        <ButtonUi className='mt-2' onClick={this.onAddToCart}>
                            Add to cart
                        </ButtonUi>
                        <div className=' mt-3 mb-5'>
                            {products.deskripsi}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
const MapstatetoProps=({Auth})=>{
    return {
        ...Auth
    }
}
export default connect(MapstatetoProps,{AddcartAction}) (DetailProd);
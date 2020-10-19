import React, { Component, createRef } from 'react';
import Header from '../../components/Header'
import {connect} from 'react-redux'
import Axios from 'axios'
import { API_URL,API_URLbe, priceFormatter,credit } from '../../helpers/idrformat';
import Notfound from './../notfound'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import ButtonUi from './../../components/button'
import {Modal,ModalHeader,ModalBody,ModalFooter,CustomInput} from 'reactstrap'
import {AddcartAction} from './../../redux/Actions'

class Cart extends Component {
    state = {
        cart:[],
        isOpen:false,
        pilihan:0,
        bukti:createRef(),
        cc:createRef(),
        idtrans:0,
        buktitrans:null,

    }
    componentDidMount(){
        // Axios.get(`${API_URL}/carts?userId=${this.props.id}&_expand=product`)
        console.log(this.props.id)
        Axios.get(`${API_URLbe}/trans/getcart`,{
            params:{
                userid:this.props.id,
            }
        })
        .then((res)=>{
            console.log(res.data)
            this.setState({cart:res.data,idtrans:res.data[0].idtrans})
        }).catch((err)=>{
            console.log(err)
        })
    }

    oninputfilechange=(e)=>{
        if(e.target.files[0]){
            this.setState({buktitrans:e.target.files[0]})
        }else{
            // console.log('hapus')
            this.setState({buktitrans:null})
        }
      }

    renderTotalHarga=()=>{
        var total=this.state.cart.reduce((total,num)=>{
            return total+(num.harga*num.qty)
        },0)
        return total
    }

    renderCart=()=>{
        return this.state.cart.map((val,index)=>{
            return(
                <TableRow key={index}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{val.namaproduct}</TableCell>
                    <TableCell>
                        <div style={{maxWidth:'200px'}}>
                            <img width='100%' height='100%' src={API_URLbe+val.banner} alt={val.namaproduct}/>
                        </div>
                    </TableCell>
                    <TableCell>{val.qty}</TableCell>
                    <TableCell>{priceFormatter(val.harga)}</TableCell>
                    <TableCell>{priceFormatter(val.harga*val.qty)}</TableCell>
                </TableRow>
            )
        })
    }

    // transaction itu ada id,status,userId,tanggalpembayaran,metode,buktipembayaran,
    // transactionDetails id,transactionId,productId,price,qty
    onBayarClick=()=>{
        const {pilihan} =this.state
        if(pilihan==='1'){
            this.onbayarpakebukti()
        }else if(pilihan==='2'){
            if(credit(parseInt(this.state.cc.current.value))){
                // alert('cc bener')
                this.onbayarpakeCC()
            }else{
                alert('bukan cc')
            }
        }else{
            alert('pilih dulu tipe pembayarannya bro')
        }
    }
    onbayarpakeCC=()=>{
        Axios.post(`${API_URLbe}/trans/bayarcc`,{
            idtrans:this.state.idtrans,
            nomercc:this.state.cc.current.value
        }).then((res)=>{
            if(res.data === 'berhasil'){
                this.props.AddcartAction([])
                this.setState({cart:[],isOpen:false})
            }
        }).catch(err=>{
            console.log(err)
        })
        // Axios.post(`${API_URL}/transactions`,{
        //     status:'Completed',
        //     userId:this.props.id,
        //     tanggalPembayaran:new Date().getTime(),
        //     metode:'cc',
        //     buktipembayaran:this.state.cc.current.value
        // }).then((res)=>{
        //     var arr=[]
        //     this.state.cart.forEach((val)=>{
        //         arr.push(Axios.post(`${API_URL}/transactionsdetails`,{
        //             transactionId:res.data.id,
        //             productId:val.productId,
        //             price: parseInt(val.product.harga),
        //             qty:val.qty
        //         }))
        //     })
        //     Axios.all(arr).then((res1)=>{
        //         var deletearr=[]
        //         this.state.cart.forEach((val)=>{
        //             deletearr.push(Axios.delete(`${API_URL}/carts/${val.id}`))
        //         })
        //         Axios.all(deletearr)
        //         .then(()=>{
        //             Axios.get(`${API_URL}/carts`,{
        //                 params:{
        //                     userId:this.props.id,
        //                     _expand:'product'
        //                 }
        //             })
        //             .then((res3)=>{
        //                 console.log(res3.data)
        //                 this.props.AddcartAction([])
        //                 this.setState({cart:res3.data,isOpen:false})
        //             }).catch((err)=>{
        //                 console.log(err)
        //             })
        //         }).catch((Err)=>{
        //             console.log(Err)
        //         })
        //     }).catch((err)=>{
        //         console.log(err)
        //     })
        // }).catch((err)=>{

        // })
    }
    onbayarpakebukti=()=>{
        Axios.post(`${API_URL}/transactions`,{
            status:'WaitingAdmin',
            userId:this.props.id,
            tanggalPembayaran:new Date().getTime(),
            metode:'upload',
            buktipembayaran:this.state.bukti.current.value
        }).then((res)=>{
            var arr=[]
            this.state.cart.forEach((val)=>{
                arr.push(Axios.post(`${API_URL}/transactionsdetails`,{
                    transactionId:res.data.id,
                    productId:val.productId,
                    price: parseInt(val.product.harga),
                    qty:val.qty
                }))
            })
            Axios.all(arr).then((res1)=>{
                var deletearr=[]
                this.state.cart.forEach((val)=>{
                    deletearr.push(Axios.delete(`${API_URL}/carts/${val.id}`))
                })
                Axios.all(deletearr)
                .then(()=>{
                    Axios.get(`${API_URL}/carts`,{
                        params:{
                            userId:this.props.id,
                            _expand:'product'
                        }
                    })
                    .then((res3)=>{
                        console.log(res3.data)
                        this.props.AddcartAction([])
                        this.setState({cart:res3.data,isOpen:false})
                    }).catch((err)=>{
                        console.log(err)
                    })
                }).catch((Err)=>{
                    console.log(Err)
                })
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{

        })
    }
    onCheckOutClick=()=>{
        this.setState({isOpen:true})
        // Axios.post(`${API_URL}/transactions`,{
        //     status:'WaitingPayment',
        //     checkoutDate:new Date().getTime(),
        //     userId:this.props.id,
        //     tanggalPembayaran:''
        // }).then((res)=>{
        //     var arr=[]
        //     this.state.cart.forEach((val)=>{
        //         arr.push(Axios.post(`${API_URL}/transactionsdetails`,{
        //             transactionId:res.data.id,
        //             productId:val.productId,
        //             price: parseInt(val.product.harga),
        //             qty:val.qty
        //         }))
        //     })
        //     Axios.all(arr).then((res1)=>{
        //         var deletearr=[]
        //         this.state.cart.forEach((val)=>{
        //             deletearr.push(Axios.delete(`${API_URL}/carts/${val.id}`))
        //         })
        //         Axios.all(deletearr)
        //         .then(()=>{
        //             Axios.get(`${API_URL}/carts`,{
        //                 params:{
        //                     userId:this.props.id,
        //                     _expand:'product'
        //                 }
        //             })
        //             .then((res3)=>{
        //                 console.log(res3.data)
        //                 this.setState({cart:res3.data})
        //             }).catch((err)=>{
        //                 console.log(err)
        //             })
        //         }).catch((Err)=>{
        //             console.log(Err)
        //         })
        //     }).catch((err)=>{
        //         console.log(err)
        //     })
        // }).catch((err)=>{

        // })
    }

    render() {
        if(this.props.role==='user') {
            return (
                <div>
                    <Modal style={{marginTop:80}} isOpen={this.state.isOpen} toggle={()=>this.setState({isOpen:false})}>
                        <ModalHeader toggle={()=>this.setState({isOpen:false})}>Pembayaran</ModalHeader>
                        <ModalBody>
                            <select onChange={(e)=>this.setState({pilihan:e.target.value})} className='form-control' defaultValue={0} >
                                <option value="0" hidden>Select payment</option>
                                <option value="1">input bukti transfer</option>
                                <option value="2">Credit card</option>
                            </select>
                            {
                                this.state.pilihan==2?
                                <input className='form-control' ref={this.state.cc} placeholder='masukkan cc'/>
                                :
                                this.state.pilihan==1?
                                <CustomInput className='form-control' onChange={this.oninputfilechange} type='file'   label={this.state.buktitrans?this.state.buktitrans.name:'Select bukti'}/>
                                :
                                null
                            }
                            <div>
                              Total Harga  {priceFormatter(this.renderTotalHarga())}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonUi onClick={this.onBayarClick}>
                                Bayar
                            </ButtonUi>
                        </ModalFooter>
                    </Modal>
                    <Header/>
                    <div className=' pt-3 martgintop' style={{paddingLeft:'10%',paddingRight:'10%'}}>
                        <Paper >
                            <TableContainer >
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell style={{width:'200px'}}>Nama Trip</TableCell>
                                            <TableCell style={{width:'200px'}}>Gambar</TableCell>
                                            <TableCell>Jumlah</TableCell>
                                            <TableCell>Harga</TableCell>
                                            <TableCell>subtotal Harga</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.renderCart()}
                                    </TableBody>
                                    <TableFooter>
                                        <TableCell colSpan={4}></TableCell>
                                        <TableCell style={{fontWeight:'700',color:'black',fontSize:20}}>Subtotal Harga</TableCell>
                                        <TableCell style={{color:'black',fontSize:20}}>{priceFormatter(this.renderTotalHarga())}</TableCell>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                            <ButtonUi onClick={this.onCheckOutClick}  className='my-3' >
                                CheckOut
                            </ButtonUi>
                        </Paper>
                    </div>
                </div>
            );
        }else{
            return(
                <Notfound/>
            )
        }
    }
}
const MapstatetoProps=({Auth})=>{
    return {
        ...Auth
    }
}
export default connect(MapstatetoProps,{AddcartAction})(Cart);
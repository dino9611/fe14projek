import React, { Component } from 'react';
import Header from '../../components/Header'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Axios from 'axios'
import {ButtonUi} from './../../components'
import { API_URL,priceFormatter,API_URLbe } from '../../helpers/idrformat';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
class AdminPayment extends Component {
    state = {
        confirm:[]
    }
    componentDidMount(){
        Axios.get(`${API_URLbe}/trans/getwaitingApprove`)
        .then((res)=>{
            this.setState({confirm:res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }
    renderTotal=(transactionsdetails=[])=>{
        return transactionsdetails.reduce((val,number)=>{
            return val + (number.price*number.qty)
        },0)
    }
    onAcceptClick=(id)=>{
        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'yes ,Accept'
          }).then((result) => {
            if (result.isConfirmed) {
                Axios.patch(`${API_URL}/transactions/${id}`,{
                    status:'Completed'
                }).then(()=>{
                    Axios.get(`${API_URL}/transactions`,{
                        params:{
                            status: "WaitingAdmin",
                            _embed:'transactionsdetails'
                        }
                    }).then((res)=>{
                        MySwal.fire(
                            'Accepted',
                            'Payment Accepted',
                            'success'
                        )
                        this.setState({confirm:res.data})
                    }).catch((err)=>{
                        console.log(err)
                    })

                }).catch((err)=>{
                    console.log(err)
                })
            }
          })
    }
    renderTable=()=>{
        return this.state.confirm.map((val,index)=>{
            return(
            <TableRow key={val.id}>
                <TableCell>{index+1}</TableCell>
                <TableCell>
                  <div style={{maxWidth:'200px'}}>
                    <img width='100%' height='100%' src={val.buktipembayaran} alt={val.id}/>
                  </div>
                </TableCell>
                <TableCell>{priceFormatter(this.renderTotal(val.transactionsdetails))}</TableCell>
                <TableCell>
                    <ButtonUi onClick={()=>this.onAcceptClick(val.id)}>
                        Accept
                    </ButtonUi>
                </TableCell>
            </TableRow>
            )
        })
    }

    render() { 
        return (
            <div>
                <Header/>
                <div className='martgintop'>
                    {/* <h1>payment</h1> */}
                    <div className='d-flex justify-content-center pt-3'>
                        <Paper style={{width:'50%'}}>
                            <TableContainer >
                                <Table  stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{width:50}}>No.</TableCell>
                                        {/* <TableCell>Nama Trip</TableCell> */}
                                        <TableCell style={{width:'200px'}}>Gambar</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.renderTable()}
                                </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                    </div>
                </div>
                
            </div>
          );
    }
}
 
export default AdminPayment;
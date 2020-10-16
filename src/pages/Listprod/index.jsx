import React, { Component } from 'react';
import Header from '../../components/Header'
import './listprod.css'
import { Breadcrumb, BreadcrumbItem, Card, CardImg} from 'reactstrap';
import Axios from 'axios'
import {Link} from 'react-router-dom'
import { API_URL,priceFormatter,API_URLbe } from '../../helpers/idrformat';
import {ButtonUi} from './../../components'


class ListProd extends Component {
    state = {
        Products:[]
    }

    componentDidMount(){
        Axios.get(`${API_URLbe}/product/getproduct`
        // ,{
        //     params:{
        //         tanggalmulai_gte:new Date().getTime()
        //     }
        // }
        )
        .then((res)=>{
            // var filter=res.data.filter((val)=>val.tanggalmulai>=new Date().getTime())
            this.setState({Products:res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }
    onProductInputChange= (e)=>{
        Axios.get(`${API_URL}/products`
        ,{
            params:{
                tanggalmulai_gte:new Date().getTime(),
                namatrip_like:e.target.value
            }
        }
        ).then((res)=>{
            // console.log(e.target.value)
            // var filter=res.data.filter((val)=>val.tanggalmulai>=new Date().getTime()&&val.namatrip.includes(e.target.value)) 
            this.setState({Products:res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }
    renderCard=()=>{
        return this.state.Products.map((val)=>{
            return(
                <div key={val.id} className="col-md-3 px-2 py-2">
                    <Link to={'/products/'+val.id}>
                        <Card className='kartu card-rounded'>
                            <CardImg top width="100%" className='card-rounded' height={200} src={API_URLbe
                                 +val.banner} alt="Card image cap" />
                            <div class="overlay card-rounded">
                                <div class="text">
                                    <div>
                                        {val.namaproduct}
                                    </div>
                                    <div>
                                        {priceFormatter(val.harga)}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            )
        })
    }
    render() { 
        return (
            <div>
                <Header/>
                <div className='pt-3 px-4 martgintop'>
                    <Breadcrumb className='tranparant m-0 px-2'>
                        <BreadcrumbItem ><Link className='link-class' to="/">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Products</BreadcrumbItem>
                    </Breadcrumb>
                    <div style={{width:'30%'}}>
                        <div style={{display:'flex'}}>
                            <input type="text" onChange={this.onProductInputChange} className='form-control mr-2' placeholder='nama product' />
                            <ButtonUi>Filter</ButtonUi>
                        </div>
                    </div>
                    <div className="row p-0 m-0">
                        {this.renderCard()}
                    </div>
                </div>
            </div>
         );
    }
}
 
export default ListProd;
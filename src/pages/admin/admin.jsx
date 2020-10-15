import React, {useState,useRef, useEffect} from 'react';
import Header from '../../components/Header'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {MdDeleteForever} from 'react-icons/md'
import {BiEdit,BiPlusCircle} from 'react-icons/bi'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {priceFormatter, API_URL,API_URLbe} from '../../helpers/idrformat'
import ButtonUi from './../../components/button'
import axios from 'axios'
import {connect} from 'react-redux'
// import from 'react-router-dom'
import Notfound from './../notfound'
const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

 function StickyHeadTable(props) {
  const classes = useStyles();
  const [modal, setModal] = useState(false);
  const [modaledit, setModaledit] = useState(false);
  const [modalfoto,setmodalfoto]=useState(false)
  const [fotos,setfotos]=useState([null])
  const [banner,setbanner]=useState(null)

  const [addform,setaddform]=useState({
    namaTrip:useRef(),
    tanggalmulai:useRef(),
    tanggalberakhir:useRef(),
    harga:'',
    descripsi:useRef(),
    capacity:useRef()
  })
  const [editform,seteditform]=useState({
    namaTrip:useRef(),
    gambar:useRef(),
    tanggalmulai:useRef(),
    tanggalberakhir:useRef(),
    harga:'',
    descripsi:useRef()
  })
  const [indexedit,setindexedit]=useState(0)
  const [product,setProduct]=useState([])


  useEffect(()=>{
    console.log('masuk')
    const fetch=()=>{
      axios.get(`${API_URLbe}/product/getproduct`)
      .then((res)=>{
        console.log(res.data)
        setProduct(res.data)
        seteditform({...editform,harga:res.data[0].harga})
      }).catch((err)=>{
        console.log(err)
      })
    }
    fetch()
  },[])

  const oninputfilechange=(e)=>{
    console.log(e.target.files)
    if(e.target.files[0]){
        console.log(e.target.files[0])
        setbanner(e.target.files[0])
    }else{
        console.log('hapus')
        setbanner(null)
    }
  }
  const oninputfilefotochange=(e,index)=>{
    console.log(e.target.files)
    if(e.target.files[0]){
        console.log(e.target.files[0])
        fotos[index]=e.target.files[0]
        setfotos(fotos)
    }else{
        console.log('hapus')
      
    }
  }

  const onhargachange=(e)=>{
    if(e.target.value===''){
      setaddform({...addform,harga:0})
    }
    if(Number(e.target.value)){
        if(addform.harga===0){
            setaddform({...addform,harga:e.target.value[1]})
        }else{
            setaddform({...addform,harga:e.target.value})    
        }
    }
  }
  const onhargachangeedit=(e)=>{
    console.log(e.target.value)
    if(e.target.value===''){
      seteditform({...editform,harga:0})
    }
    if(Number(e.target.value)){
        if(editform.harga===0){
          seteditform({...editform,harga:e.target.value[1]})
        }else{
          seteditform({...editform,harga:e.target.value})    
        }
    }
  }

  const dateformat=(n)=>{
    var today = new Date(n);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;
    return today
  }
  const dateeditformat=(n)=>{
    var today = new Date(n);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
  }

  const readMore=(kata='')=>{
    const hitungkata=kata.split(' ').filter((val)=>val!=='').length
    if(hitungkata>10){
      var kataarray=kata.split(' ').map((val,index)=>index<11?val:'').filter((val)=>val!=='')
      var katafinale=kataarray.join(' ')
      return (
        <>
        {katafinale}
        <span style={{color:'red'}}>Read more ..</span>
        </>
      )
    }
    return kata

  }

  const OnAdddataClick=()=>{
    var formData=new FormData()
    var options={
        headers:{
          'Content-type':'multipart/form-data',
        }
    }
    var namatrip = addform.namaTrip.current.value
    var tanggalmulai=addform.tanggalmulai.current.value
    var tanggalberakhir=addform.tanggalberakhir.current.value
    var harga=addform.harga
    var deskripsi=addform.descripsi.current.value
    var capacity=addform.capacity.current.value
    var data={
      namaproduct:namatrip,
      capacity:capacity,
      tanggalmulai:new Date(tanggalmulai).getTime(),
      tanggalberakhir:new Date(tanggalberakhir).getTime(),
      harga,
      deskripsi
    }

    formData.append('image',banner)
    formData.append('data',JSON.stringify(data))

    if(data.tanggalmulai>data.tanggalberakhir || data.tanggalmulai<new Date().getTime()){
      console.log('data tidak boleh masuk')
    }else{
      axios.post(`${API_URLbe}/product/Addproduct`,formData,options)
      .then((res)=>{
        console.log(res.data)
        alert('berhasil')
      }).catch((err)=>{
        console.log(err)
      })
   
    }
  }

  // useEffect(()=>{
  //   if(product.length){
  //     seteditform({...editform,harga:product[indexedit].harga})
  //   }
  // },[indexedit])

  const Oneditclick= (index)=>{
    setindexedit(index)
    seteditform({...editform,harga:product[index].harga})
    setModaledit(true)
    // setTimeout(() => {
    // }, 1000);
  }

  const onSaveeditClick =(id)=>{
    // var namatrip = editform.namaTrip.current.value
    // var gambar = editform.gambar.current.value
    // var tanggalmulai=editform.tanggalmulai.current.value
    // var tanggalberakhir=editform.tanggalberakhir.current.value
    // var harga=editform.harga
    // var deskripsi=editform.descripsi.current.value
    // var obj={
    //   namatrip,
    //   gambar,
    //   tanggalmulai:new Date(tanggalmulai).getTime(),
    //   tanggalberakhir:new Date(tanggalberakhir).getTime(),
    //   harga,
    //   deskripsi
    // }
  
    // axios.put(`${API_URL}/products/${id}`,obj)
    // .then(()=>{
    //   axios.get(`${API_URL}/products`)
    //     .then((res)=>{
    //       setProduct(res.data)
    //       seteditform({...editform,harga:''})
    //       setModaledit(false)
    //     }).catch((err)=>{
    //       console.log(err)
    //     })
    // })
  }
  
  const renderTable=()=>{
    return product.map((val,index)=>{
      return(
        <TableRow key={val.id}>
            <TableCell>{index+1}</TableCell>
            <TableCell>{val.namaproduct}</TableCell>
            <TableCell>
              <div style={{maxWidth:'200px'}}>
                <img width='100%' height='100%' src={API_URLbe+val.banner} alt={val.namaproduct}/>
              </div>
            </TableCell>
            <TableCell>{dateformat(val.tanggalmulai)}</TableCell>
            <TableCell>{dateformat(val.tanggalberakhir)}</TableCell>
            <TableCell>{priceFormatter(val.harga)}</TableCell>
            <TableCell>{val.capacity}</TableCell>
            <TableCell>{readMore(val.deskripsi)}</TableCell>
            <TableCell>
              <span style={{fontSize:30}} className='text-danger mr-3'><MdDeleteForever/></span>
              <span style={{fontSize:30}}  className='text-primary ml-3'><BiEdit/></span>  
              <span style={{fontSize:30}} onClick={togglefoto}  className='text-primary ml-3'><BiPlusCircle/></span>  
            </TableCell>
        </TableRow>
      )
    })
  }

  const toggle = () => {
    setModal(!modal)
    setbanner(null)
  }
  const togglefoto = () => {
    setmodalfoto(!modalfoto)
    // setbanner(null)
  }
    
  const toggleedit = () => setModaledit(!modaledit);

  const tambahfoto=()=>{
    // let arr=fotos
    // arr.push(null)
    // console.log(arr.length)
    setfotos([...fotos,null])
  }
  console.log(fotos)
    return (
        <>
          <Modal style={{marginTop:80}} isOpen={modal} toggle={toggle} >
              <ModalHeader toggle={toggle}>Add data</ModalHeader>
              <ModalBody>
                 <input type='text' ref={addform.namaTrip} placeholder='Masukkan Nama' className='form-control mb-2'/>
                 <input type="file" className='form-control' onChange={oninputfilechange} />
                 {
                   banner?
                   <div className='my-2'>
                     <img src={URL.createObjectURL(banner)} height='200'
                     widht='200' alt="foto"/>

                   </div>
                   :
                   null
                 }
                 <label className='ml-1'>
                   Tanggal mulai
                 </label>
                 <input type='date' ref={addform.tanggalmulai} placeholder='Masukkan tanggal' className='form-control mb-2'/>
                 <label className='ml-1'>
                   Tanggal berakhir
                 </label>
                 <input type='date' ref={addform.tanggalberakhir} placeholder='tanggal berakhir' className='form-control mb-2'/>
                 <input type='number' ref={addform.capacity} placeholder='capacity' className='form-control mb-2'/>
                 <input type='text' onChange={onhargachange} placeholder='Rp....' value={addform.harga} className='form-control mb-2'/>
                 <textarea className='form-control mb-2' ref={addform.descripsi} placeholder='deskripsi' cols="30" rows="7"></textarea>
              </ModalBody>
              <ModalFooter>
                  <Button color="primary" onClick={OnAdddataClick}>Add data</Button>
                  <Button color="secondary" onClick={toggle}>Cancel</Button>
              </ModalFooter>
          </Modal>
          {
            product.length?
              <Modal isOpen={modaledit} toggle={toggleedit} >
                  <ModalHeader toggle={toggleedit}>edit data {product.length?product[indexedit].namatrip:''}</ModalHeader>
                  <ModalBody>
                     <input type='text' defaultValue={product[indexedit].namatrip} ref={editform.namaTrip} placeholder='Masukkan Nama' className='form-control mb-2'/>
                     <input type='text' defaultValue={product[indexedit].gambar} ref={editform.gambar} placeholder='Masukkan Gambar' className='form-control mb-2'/>
                     <label className='ml-1'>
                       Tanggal mulai
                     </label>
                     <input type='date' defaultValue={dateeditformat(product[indexedit].tanggalmulai)}  ref={editform.tanggalmulai} placeholder='Masukkan tanggal' className='form-control mb-2'/>
                     <label className='ml-1'>
                       Tanggal berakhir
                     </label>
                     <input type='date' defaultValue={dateeditformat(product[indexedit].tanggalberakhir)} ref={editform.tanggalberakhir} placeholder='tanggal berakhir' className='form-control mb-2'/>
                     <input type='text' onChange={onhargachangeedit} value={editform.harga}  placeholder='Rp....'  className='form-control mb-2'/>
                     <textarea className='form-control mb-2' defaultValue={product[indexedit].deskripsi} ref={editform.descripsi} placeholder='deskripsi' cols="30" rows="7"></textarea>
                  </ModalBody>
                  <ModalFooter>
                      <Button color="primary" onClick={()=>onSaveeditClick(product[indexedit].id)}>save</Button>
                      <Button color="secondary" onClick={toggleedit}>Cancel</Button>
                  </ModalFooter>
              </Modal>
            :
            null
          }
          <Modal style={{marginTop:80}} isOpen={modalfoto} toggle={togglefoto} >
              <ModalHeader toggle={togglefoto}>Add Foto</ModalHeader>
              <ModalBody>
                  {
                    fotos.map((val,index)=>{
                      return(
                        <input type="file" onChange={(e)=>oninputfilefotochange(e,index)}  className='form-control' />
                       
                      )
                    })
                  }
                  <BiPlusCircle onClick={tambahfoto} />
              </ModalBody>
              <ModalFooter>
                  <Button color="primary" onClick={OnAdddataClick}>Add data</Button>
                  <Button color="secondary" onClick={toggle}>Cancel</Button>
              </ModalFooter>
          </Modal>
          <Header/>
          <div className='px-5 martgintop'>
              <ButtonUi onClick={toggle} className='my-3' >
                  Add Data
              </ButtonUi>
              <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                          <TableCell>No.</TableCell>
                          <TableCell>Nama Trip</TableCell>
                          <TableCell style={{width:'200px'}}>Gambar</TableCell>
                          <TableCell>Tanggal mulai</TableCell>
                          <TableCell>Tanggal berakhir</TableCell>
                          <TableCell>Harga</TableCell>
                          <TableCell>Capacity</TableCell>
                          <TableCell style={{width:'300px'}}>Description</TableCell>
                          <TableCell >action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderTable()}
                    </TableBody>
                    </Table>
                </TableContainer>
              </Paper>
          </div>
        </>
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
export default connect(MapstatetoProps) (StickyHeadTable);
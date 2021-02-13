import {Component} from 'react'
import { Link } from 'react-router-dom'

import {MDBIcon} from 'mdbreact'



export default class Cadastros extends Component {

    render () {

      return (        
        <div className="d-flex justify-content-around" style = {{paddingTop: "10em", height: "80%", width: "80%"}}>

                <div className="p-2 col-example text-left">
                    <div>
                        <Link to = "/cadastros/equipamento">
                            <MDBIcon icon="hammer" size= "10x" />
                        </Link> 
                    </div>                    
                    <label >Cadastro de Equipamento</label>
                </div>

                <div className="p-2 col-example text-left">
                    <div>
                        <Link to = "/cadastros/fornecedor">
                            <MDBIcon icon="dolly" size= "10x" />
                        </Link> 
                    </div>                    
                    <label htmlFor="icoTanque">Cadastro de Fornecedor</label>
                </div>

                <div className="p-2 col-example text-left">
                    <div>
                        <Link to = "/cadastros/usuario" >
                        <MDBIcon icon="user-plus" size= "10x" />
                        </Link> 
                    </div>                     
                    <label htmlFor="icoTanque">Cadastro de Usuário</label>
                </div>


        </div>


      )
    }
  }
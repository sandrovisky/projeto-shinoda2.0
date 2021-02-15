import {Component} from 'react'
import { Link } from 'react-router-dom'

import { MDBIcon, MDBRow, MDBCol, MDBContainer } from 'mdbreact'



export default class Cadastros extends Component {

    render () {

      return (        
        <div className="d-flex justify-content-around" style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 3em 0 3em", textAlign: 'center'}}>
            
        <MDBContainer>
        <h1>Cadastros</h1>
        <MDBRow>

            <MDBCol style = {{textAlignLast: "center"}}>
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
            </MDBCol>

            <MDBCol style = {{textAlignLast: "center"}}>
                <div className="p-2 col-example text-left">
                    <div>
                        <Link to = "/cadastros/usuario" >
                            <MDBIcon icon="user-plus" size= "10x" />
                        </Link> 
                    </div>                     
                    <label htmlFor="icoTanque">Cadastro de Usuário</label>
                </div>

                <div className="p-2 col-example text-left">
                    <div>
                        <Link to = "/cadastros/produto">
                            <MDBIcon icon="plus-circle" size= "10x" />
                        </Link> 
                    </div>                    
                    <label >Cadastro de Produto</label>
                </div>
            </MDBCol>

        </MDBRow>
        </MDBContainer>           

        </div>


      )
    }
  }
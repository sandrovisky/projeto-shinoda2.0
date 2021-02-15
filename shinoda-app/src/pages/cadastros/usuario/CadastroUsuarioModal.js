import {Component} from 'react'
import axios from 'axios'

import { MDBInput, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBIcon } from "mdbreact";



export default class Modal extends Component {

    constructor(){
        super()
        this.state = {
            usuario: '',
            senha: '',
            senha2: '',
            modal: false
        }
    }
    
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };
    
    handleChangeSenha = (e) => {
        this.setState({senha: e.target.value});
    }

    handleChangeSenha2 = (e) => {
        this.setState({senha2: e.target.value});
    }

    handleChangeUsuario = (e) => {
        this.setState({usuario: e.target.value});
    }
 
    cadastrar = async () => {
        let aviso = 'Favor verificar os campos:'
        let obj = Object.entries(this.state)
        console.log(obj)
        for(let i = 0; i < 4;i++){
            for(let k = 0; k < 2; k++){
                if(obj[i][k] === ''){
                    aviso += '\n' + obj[i][0]
                }
            }
        }
        if (aviso !== 'Favor verificar os campos:'){
            alert(aviso)
        } else if (this.state.senha !== this.state.senha2){
            alert("As senhas não coincidem")
        }else {
            await axios.post('http://localhost:3333/users', {
                usuario: this.state.usuario,
                senha: this.state.senha
                })
            window.location.reload();
        }
    }

    render () {
        
      return (
        <div  >
            
            <div >                

                <MDBBtn onClick={this.toggle} className="mx-auto">
                    Cadastrar Usuario
                </MDBBtn>
                <MDBModal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    size="md"
                    cascading
                >
                    <MDBModalHeader
                        toggle={this.toggle}
                        titleClass="d-inline title"
                        className="text-center black darken-3 white-text"
                    >
                        
                        <>   Cadastro de Usuario</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <MDBInput label="Usuario" onChange = {this.handleChangeUsuario} />
                        <MDBInput type = "password" label="Senha"  onChange = {this.handleChangeSenha} />
                        <MDBInput type = "password" label="Confirme a senha" onChange = {this.handleChangeSenha2}  />
                        <div className="text-center mt-1-half">
                            <MDBBtn
                                color="info"
                                className="mb-2"
                                onClick={this.cadastrar}
                            >
                                Cadastrar
                            <MDBIcon icon="plus" className="ml-1" />
                            </MDBBtn>
                        </div>
          </MDBModalBody>
        </MDBModal>

            </div>
            

            

        </div>
      )
    }
  }
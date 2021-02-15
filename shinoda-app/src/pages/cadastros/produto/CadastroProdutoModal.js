import {Component} from 'react'
import axios from 'axios'

import { MDBInput, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBIcon } from "mdbreact";



export default class Modal extends Component {

    constructor(){
        super()
        this.state = {
            nome: '',
            codigo: '',
            medida: '',
            modal: false
        }
    }
    
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };
    
    handleChangeNome = (e) => {
        this.setState({nome: e.target.value});
    }

    handleChangeCodigo = (e) => {
        this.setState({codigo: e.target.value});
    }

    handleChangeMedida = (e) => {
        this.setState({medida: e.target.value});
    }
 
    cadastrar = () => {
        let aviso = 'Favor verificar os campos:'
        let obj = Object.entries(this.state)
        console.log(obj)
        for(let i = 0; i < 3;i++){
            for(let k = 0; k < 2; k++){
                if(obj[i][k] === ''){
                    aviso += '\n' + obj[i][0]
                }
            }
        }
        if (aviso !== 'Favor verificar os campos:'){
            alert(aviso)
        } else {
            axios.post('http://localhost:3333/products', {
                codigo: this.state.codigo,
                nome: this.state.nome,
                medida: this.state.medida
                })
            window.location.reload();
        }
    }

    render () {
        
      return (
        <div  >
            
            <div >                

                <MDBBtn onClick={this.toggle} className="mx-auto">
                    Cadastrar Produto
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
                        
                        <>   Cadastro de Produto</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <MDBInput label="Codigo"  onChange = {this.handleChangeCodigo} />
                        <MDBInput label="Nome" onChange = {this.handleChangeNome}  />
                        <MDBInput label="Medida"  onChange = {this.handleChangeMedida} />
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
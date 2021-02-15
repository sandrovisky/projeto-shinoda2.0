import {Component} from 'react'
import axios from 'axios'

import { MDBInput, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBIcon } from "mdbreact";



export default class Modal extends Component {

    constructor(){
        super()
        this.state = {
            tipo: '',
            tag: '',
            nome: '',
            capacidade: ''
        }
    }
    
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };
    
    handleChangeTipo = (e) => {
        this.setState({tipo: e.target.value});
    }

    handleChangeTag = (e) => {
        this.setState({tag: e.target.value});
    }

    handleChangeNome = (e) => {
        this.setState({nome: e.target.value});
    }

    handleChangeCapacidade = (e) => {
        this.setState({capacidade: e.target.value});
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
        } else {
            await axios.post('http://localhost:3333/users', {
                tipo: this.state.tipo,
                tag: this.state.tag,
                nome: this.state.nome,
                capacidade: this.state.capacidade
                })
            window.location.reload();
        }
    }

    render () {
        
      return (
        <div  >
            
            <div >                

                <MDBBtn onClick={this.toggle} className="mx-auto">
                    Cadastrar Equipamento
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
                        <MDBInput label="Tipo" onChange = {this.handleChangeTipo} />
                        <MDBInput label="Tag"  onChange = {this.handleChangeTag} />
                        <MDBInput label="Nome" onChange = {this.handleChangeNome}  />
                        <MDBInput label="Capacidade" onChange = {this.handleChangeCapacidade}  />
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
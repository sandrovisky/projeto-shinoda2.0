import React, { Component } from 'react'
import { Redirect, Switch, BrowserRouter as Router } from 'react-router-dom'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBTable, MDBTableHead, MDBTableBody, MDBIcon } from "mdbreact";

import api from '../../services/api'

export default class NovaProducao extends Component{ 

    state = {
        formActivePanel1: 1,
        formActivePanel1Changed: false,
        idProducao: parseInt(this.props.match.params.idProducao),
        redirecionar: false
    }

    swapFormActive = (a) => (param) => (e) => {
        this.setState({
            ['formActivePanel' + a]: param,
            ['formActivePanel' + a + 'Changed']: true
        });
        this.setState({click: this.state.click+1})
    }
    
    handleNextPrevClick = (a) => (param) => (e) => {
        
        if (this.state.idProducao === 0){
            alert("Primeiro Adicione um Palete")
        } else {
            this.setState({                
                ['formActivePanel' + a]: param,
                ['formActivePanel' + a + 'Changed']: true
            }); 
        }
    }

    calculateAutofocus = (a) => {
        if (this.state['formActivePanel' + a + 'Changed']) {
            return true
        }
    }

    onSubmitAdicionarPalete = async (event) => {
        event.preventDefault()

        //criar registro na tabela producao, caso nao exista
        if ( !this.state.idProducao ) {
            api.post(`/producoes`, {
                codigo: this.state.codigo,
                createdBy: parseInt(localStorage.getItem('idUsuario')) 
            })
            .then(async res => {
                api.post('/producao-itens', { //cria registro na tabela producao-itens
                    idProducao: res.data.id,
                    codigo: this.state.codigo,
                    createdBy: parseInt(localStorage.getItem('idUsuario')) 
                })
                .then(async resProdItens => {
                    console.log(resProdItens)
                })
                .catch(async errProdItens => {
                    alert(errProdItens.response.data.err)
                })
                window.open(`/producao/novo/${res.data.id}`, '_self')  //abre a pagina passando a ID da producao criada              
            })
            .catch(async error => {
                alert(error.response.data.err)
            })
        } else {
            api.post('/producao-itens', { // se ja houver uma producao criada, ele cria registro na tabela producao-itens
                idProducao: this.state.idProducao,
                codigo: this.state.codigo,
                createdBy: parseInt(localStorage.getItem('idUsuario')) 
            })
            .then(async resProdItens => {
                this.setState({codigo: ""})
                this.gerarTabelaProducaoItens()
            })
            .catch(async errProdItens => {
                alert(errProdItens.response.data.err)
                console.log(errProdItens.response)
            })
        }
        
    }

    onSubmitAdicionarEquipamento = async (event) => {
        event.preventDefault()
        
        api.post(`/producao-equipamentos`, {
            idProducao: this.state.idProducao,
            idEquipamento: this.state.equipamento,                
            createdBy: parseInt(localStorage.getItem('idUsuario'))             
        })
        .then(async response => {
            this.gerarTabelaProducaoEquipamentos()
        })
        .catch(async error => {
            alert(error.response.data.err)
        })
    }
    
    onHandleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    //delete registro na tabela producao-itens
    deletarProdItem = async ( id ) => {
        api.delete('/producao-itens', {
            data: {
                id
            }
        })
        .then(async () => {
            this.gerarTabelaProducaoItens()
        })
    }

    deletarProdEquipamento = async ( id ) => {
        api.delete('/producao-equipamentos', {
            data: {
                id
            }
        })
        .then(async () => {
            this.gerarTabelaProducaoEquipamentos()
        })
    }

    gerarTabelaProducaoItens = async () => {
        const response =  await api.get(`/producao-itens/producao/${this.state.idProducao}`);
    
        //manipulando os dados que preencherão o tabledata
        let tableData = []
        
        if (response !== null){
            response.data.map(dados => tableData.push(
                <tr key = {dados.id}>
                    <td>{dados.moveitensvolume.id}</td>
                    <td>{dados.moveitensvolume.lote.lote}</td>
                    <td>{dados.moveitensvolume.quantidadeTotal}</td>
                    <td style = {{textAlign: "right"}}>
                        <MDBBtn size="sm" color = "danger" onClick={() => this.deletarProdItem(dados.id)}  >
                            <MDBIcon icon="times" size = "" />
                        </MDBBtn>
                    </td>
                </tr>
            ))                
            this.setState({tabela: tableData})
        }      
    }

    gerarTabelaProducaoEquipamentos = async () => {
        const response =  await api.get(`/producao-equipamentos/producao/${this.state.idProducao}`);
    
        //manipulando os dados que preencherão o tabledata
        let tableData = []
        
        if (response !== null){
            response.data.map(dados => tableData.push(
                <tr key = {dados.id}>
                    <td>{dados.equipamento.id}</td>
                    <td>{dados.equipamento.nome}</td>
                    <td style = {{textAlign: "right"}}>
                        <MDBBtn size="sm" color = "danger" onClick={() => this.deletarProdEquipamento(dados.id)}  >
                            <MDBIcon icon="times" size = "" />
                        </MDBBtn>
                    </td>
                </tr>
            ))                
            this.setState({tabelaEquipamento: tableData})
        }      
    }

    finalizar = async () => {
        if ( !this.state.tabelaEquipamento.length) {
            alert("Nenhum equipamento selecionado")
        } else if ( !this.state.tabela.length){
            alert("Nenhum palete selecionado")
        } else {
            api.put('/producoes', {
                id: this.state.idProducao,
                updatedBy: parseInt(localStorage.getItem('idUsuario')),
                status: "2"
            })
            if ( window.confirm("Tem certeza que quer finalizar essa produção?") ) {
                this.setState({ redirecionar: true })
            }            
        }
    }

    async componentDidMount() {
        api.get(`/producoes/${this.state.idProducao}`)
        .then( async (response) => {
            if ( response.data ) {
                this.setState({
                    dataCriacao: response.data.createdAt,
                    status: response.data.status === "1" ? "Em Digitação" : response.data.status === "2" ? "Em Produção" : "Finalizado"
                })
                if ( response.data.status !== "1" ) {
                    this.setState({redirecionar: true})
                }
            } else if ( this.state.idProducao !== 0 ) {
                this.setState({redirecionar: true})
            }           
        })

        let options = [<option key = {0} value = ""></option>]

        api.get(`/equipment`)
        .then(async response => {
            response.data.map(dados => options.push(
                <option key = {dados.id} value = {dados.id}>{dados.nome}</option>
            ))
            this.setState({options: options})
        })
        this.gerarTabelaProducaoEquipamentos()
        this.gerarTabelaProducaoItens()
    }

    render(){
        if (this.state.redirecionar) {
            return <Redirect push to = '/producao' />
        }
        return (
            <div style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}>
                <MDBContainer >
                <h2 className="text-center font-weight-bold pt-4 pb-2"><strong>Produção</strong></h2>
                <MDBRow>
                    {/* 
                        Paletes
                    */}
                    {this.state.formActivePanel1 === 1 &&
                    (<MDBCol md="12">
                    <h3 className="text-center font-weight-bold pt-4 pb-2 mb-2">Etapa 1 - Leitura de Paletes</h3>
                        
                        <form onSubmit = {this.onSubmitAdicionarPalete}>
                            <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", }}>
                                
                                <MDBRow>
                                    <MDBCol >   
                                        <label><strong>ID Produção:</strong>{" "+this.state.idProducao}</label>                                    
                                    </MDBCol>

                                    <MDBCol >   
                                        <label><strong>Data de Inicio:</strong>{" "+this.state.dataCriacao}</label>                                    
                                    </MDBCol>
                                </MDBRow>

                                <MDBRow>
                                    <MDBCol >   
                                        <label><strong>Status:</strong>{" "+this.state.status}</label>                                    
                                    </MDBCol>
                                </MDBRow>
                            
                                <MDBRow className="justify-content-center">
                                    <MDBCol size = "6" >   
                                        <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} required label="Ler Codigo do Palete" value = {this.state.codigo} name = "codigo" onChange = {this.onHandleChange}/>
                                    </MDBCol>
                                </MDBRow>
                                
                                <MDBRow>
                                    <MDBCol>
                                        <MDBBtn type = "submit" color="primary" size="sm" rounded style = {{width: "100%", margin: "1em 0 0 0"}}  >Adicionar</MDBBtn>
                                    </MDBCol>
                                </MDBRow>
                                
                            </MDBContainer>
                        </form>

                        <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}>
                            
                            <div className = "border p-4 mb-1 mt-1 overflow-auto" style = {{ borderRadius: "10px", border: "2px solid", borderColor: "black", maxHeight: "500px" }}>
                                <MDBTable>
                                    <MDBTableHead>
                                        <tr>
                                            <th>ID Palete</th>
                                            <th>Lote</th>
                                            <th>Peso</th>
                                            <th></th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {this.state.tabela}
                                    </MDBTableBody>
                                </MDBTable>
                            </div>

                        </MDBContainer>
                        
                        <MDBBtn color="danger" rounded className="float-left" onClick = {() => window.history.back()}>cancelar</MDBBtn>
                        <MDBBtn color="mdb-color" rounded className="float-right" onClick={this.handleNextPrevClick(1)(2)} >next</MDBBtn>
                    </MDBCol>)}

                    {/* 
                        Equipamentos
                    */} 
                    {this.state.formActivePanel1 === 2 &&
                    (<MDBCol md="12">
                        <h3 className="text-center font-weight-bold pt-4 pb-2 mb-2">Etapa 2 - Equipamentos do Processo</h3>
                        <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", }}>
                                    
                            <MDBRow>
                                <MDBCol >   
                                    <label><strong>ID Produção:</strong> {" "+this.state.idProducao}</label>                                    
                                </MDBCol>

                                <MDBCol >   
                                    <label><strong>Data de Inicio:</strong> {" "+this.state.dataCriacao}</label>                                    
                                </MDBCol>
                            </MDBRow>

                            <MDBRow>
                                <MDBCol >   
                                    <label><strong>Status:</strong> {" "+this.state.status}</label>                                    
                                </MDBCol>
                            </MDBRow>
                            
                            <form onSubmit = {this.onSubmitAdicionarEquipamento} >
                                <MDBRow className="justify-content-center text-center">
                                    <MDBCol size = "6" >   
                                        <label className="mt-1" htmlFor="equipamento"><strong>Selecione o Equipamento</strong></label>
                                        <select name="equipamento" required onChange = {this.onHandleChange} style = {{width: "100%"}} value = {this.state.equipamento} className="browser-default custom-select" id = "equipamento">
                                            {this.state.options}
                                        </select>
                                    </MDBCol>
                                </MDBRow>
                                
                                <MDBRow>
                                    <MDBCol>
                                        <MDBBtn type = "submit" color="primary" size="sm" rounded style = {{width: "100%", margin: "1em 0 0 0"}}  >Adicionar</MDBBtn>
                                    </MDBCol>
                                </MDBRow>
                            </form>                            
                        </MDBContainer>

                        <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}>
                            
                            <div className = "border p-4 mb-1 mt-1 overflow-auto" style = {{ borderRadius: "10px", border: "2px solid", borderColor: "black", maxHeight: "500px" }}>                        
                                <MDBTable>

                                    <MDBTableHead>
                                        <tr>
                                            <th>ID Equipamento</th>
                                            <th>Nome</th>
                                            <th></th>
                                        </tr>
                                    </MDBTableHead>

                                    <MDBTableBody>
                                            {this.state.tabelaEquipamento}
                                    </MDBTableBody>
                                </MDBTable>
                            </div>
                        </MDBContainer>
                        <MDBBtn color="mdb-color" rounded className="float-left" onClick={this.handleNextPrevClick(1)(1)}>previous</MDBBtn>
                        <MDBBtn color="success" rounded className="float-right" onClick = {this.finalizar} >Finalizar</MDBBtn>
                    </MDBCol>)}
                </MDBRow>
                
            </MDBContainer>
            </div>   
        );

    }  
}
import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";

import api from '../../services/api'

export default class DatatablePage extends Component{ 

    state = {
        formActivePanel1: 1,
        formActivePanel1Changed: false,
        idProducao: parseInt(this.props.match.params.idProducao)
    }

    swapFormActive = (a) => (param) => (e) => {
        this.setState({
            ['formActivePanel' + a]: param,
            ['formActivePanel' + a + 'Changed']: true
        });
        this.setState({click: this.state.click+1})
    }
    
    handleNextPrevClick = (a) => (param) => (e) => {
        this.setState({                
            ['formActivePanel' + a]: param,
            ['formActivePanel' + a + 'Changed']: true
        }); 
        this.setState({click: this.state.click+1})
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
                    console.log(errProdItens.response.data.err)
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
                this.gerarTabelaProducaoItens()
                console.log(resProdItens)
            })
            .catch(async errProdItens => {
                alert(errProdItens.response.data.err)
                console.log(errProdItens.response.data.err)
            })
        }
        
    }
    
    onHandleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    gerarTabelaProducaoItens = async () => {
        const response =  await api.get(`/producao-itens/producao/${this.state.idProducao}`);
    
        //manipulando os dados que preencherão o tabledata
        let tableData = []
        
        if (response !== null){
            response.data.map(dados => tableData.push(
                <tr key = {dados.id}>
                    <td>{dados.id}</td>
                    <td>{dados.moveitensvolume.lote.lote}</td>
                    <td>{dados.moveitensvolume.quantidadeTotal}</td>
                    <td style = {{textAlign: "right"}}>
                        <MDBBtn size="sm" color = "danger" onClick={() => this.deletarProduto(dados.id)} >
                        </MDBBtn>
                    </td>
                </tr>
            ))                
            this.setState({tabela: tableData})
        }      
    }

    async componentDidMount() {
        this.gerarTabelaProducaoItens()
    }

    render(){
        
        return (
            <div style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}>
                <MDBContainer >
                <h3 className="text-center font-weight-bold pt-4 pb-5 mb-2"><strong>Produção</strong></h3>
                <MDBRow>
                
                {/* 
                    Entrada Inicio
                */}
                {this.state.formActivePanel1 === 1 &&
                (<MDBCol md="12">
                    <h6 className="font-weight-bold pl-0 my-4">
                        
                    </h6>
                    <form onSubmit = {this.onSubmitAdicionarPalete}>
                        <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black" }}>
                            
                            <MDBRow>
                                <MDBCol >   
                                    <label><strong>ID Produção:</strong>{this.state.idProducao}</label>                                    
                                </MDBCol>

                                <MDBCol >   
                                    <label><strong>Data de Inicio:</strong></label>                                    
                                </MDBCol>
                            </MDBRow>

                            <MDBRow>
                                <MDBCol >   
                                    <label><strong>Status:</strong></label>                                    
                                </MDBCol>
                            </MDBRow>

                            <MDBRow>
                                <MDBCol >   
                                    <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} required label="Let Codigo do Palete" value = {this.state.codigo} name = "codigo" onChange = {this.onHandleChange} className="mt-4"   />
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
                        
                        <div className = "border p-4 mb-4 mt-4 overflow-auto" style = {{ height: "500px", borderRadius: "10px", border: "2px solid", borderColor: "black" }}>
                            <MDBTable>
                                <MDBTableHead>
                                    <tr>
                                        <th>ID Palete</th>
                                        <th>produto</th>
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
                    Entrada Lotes
                */} 
                {this.state.formActivePanel1 === 2 &&
                (<MDBCol md="12">
                <h3 className="text-center font-weight-bold pt-4 pb-5 mb-2">Entrada - Lotes</h3>
                <h6 className="font-weight-bold pl-0 my-4">
                    <strong>ID: {this.state.idMove}</strong>
                </h6>
                <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black" }}>
                    <form onSubmit = {this.onSubmitCadastraMoveItensVolume}>
                        <MDBRow>
                            <MDBCol>
                                <MDBInput onFocus = {(e) => e.target.autocomplete = "off"}  id="laudo" value = {this.state.laudo} name = "laudo" label="Laudo" onChange = {this.onHandleChange} className="mt-4" autoFocus={this.calculateAutofocus(1)}  />                        
                            </MDBCol>

                            <MDBCol>
                                
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>

                                <MDBCol>
                                    <MDBInput required onFocus = {(e) => e.target.autocomplete = "off"} name = "quantidadePaletes" value = {this.state.quantidadePaletes} min = "1" max = "50" type = "number" label="Nº de Paletes" onChange = {this.onHandleChange} className="mt-4"    />
                                    
                                </MDBCol>

                                <MDBCol>
                                    <MDBInput required onFocus = {(e) => e.target.autocomplete = "off"} onChange = {this.onHandleChange} value = {this.state.quantidadeTotal} name = "quantidadeTotal" type = "number" label="Quantidade do Produto" className="mt-4"  />

                                </MDBCol>
                        </MDBRow>          

                        <MDBRow >

                            <MDBCol>
                                    <MDBInput required onFocus = {(e) => e.target.autocomplete = "off"} onChange = {this.onHandleChange} value = {this.state.lote} name = "lote" label="Lote do fornecedor" className="mt-4"  />

                            </MDBCol>
                            <MDBCol style = {{marginTop: "1.5em"}} >
                                
                            </MDBCol >

                        </MDBRow>   

                        <MDBRow>
                            <MDBCol>
                                <MDBBtn type = "submit" color="primary" size="sm" rounded style = {{width: "100%", margin: "1em 0 0 0"}}  >Adicionar</MDBBtn>
                            </MDBCol>
                        </MDBRow>
                    </form>      
                    
                </MDBContainer>

                <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}>
                    
                    <MDBTable>
                        <MDBTableHead>
                            <tr>
                                <th>Paletes</th>
                                <th>Produto</th>
                                <th>Validade</th>
                                <th>lote</th>
                                <th>Quantidade Total </th>
                                <th> </th>
                            </tr>
                        </MDBTableHead>

                        <MDBTableBody>
                                {this.state.tabelaMoveItensVolume}
                        </MDBTableBody>
                    </MDBTable>

                </MDBContainer>

                <MDBBtn color="mdb-color" rounded className="float-left" onClick={this.handleNextPrevClick(1)(1)}>previous</MDBBtn>
                <MDBBtn color="mdb-color" rounded className="float-right" onClick={this.handleNextPrevClick(1)(3)}>next</MDBBtn>
            </MDBCol>)}
                
                {/* 
                    FIM
                */}
                {this.state.formActivePanel1 === 3 &&
                (<MDBCol md="12">
                    <h3 className="text-center font-weight-bold pt-4 pb-5 mb-2">Entrada - Volumes</h3>
                    <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}> 
                        
                        <MDBRow>

                            <MDBCol md = "6">
                                <h5>
                                    <strong>id:</strong> {this.state.idMove}
                                </h5>

                            </MDBCol>

                            <MDBCol md = "6">
                                <h5 className = "float right">
                                    <strong>Data de Entrada:</strong>  {this.state.dataEntrada}
                                </h5>

                            </MDBCol>   
                        </MDBRow>
                        
                        <MDBRow>

                            <MDBCol>
                                <h5>
                                    <strong>Fornecedor:</strong> {this.state.fornecedorNome}
                                </h5>

                            </MDBCol>                          
                        </MDBRow>                   

                        <MDBRow>

                            <MDBCol md = "6">
                                <h5>
                                    <strong>NF:</strong> {this.state.nf}
                                </h5>

                            </MDBCol>

                            <MDBCol md = "6">
                                <h5 className = "float right">
                                    <strong>Status:</strong> Emitido
                                </h5>

                            </MDBCol>   
                        </MDBRow>                
                    </MDBContainer>

                    <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}> 
                        
                        <MDBTable>
                            
                            <MDBTableHead>
                                <tr>                                
                                    <th>Produto</th>
                                    <th>Validade</th>
                                    <th>Paletes</th>
                                    <th>Total</th>
                                </tr>
                            </MDBTableHead>

                            <MDBTableBody>
                                {this.state.tabelaFim}
                            </MDBTableBody>
                        </MDBTable>
                        
                    </MDBContainer>
                    <MDBBtn color="mdb-color" rounded className="float-left" onClick={this.handleNextPrevClick(1)(2)}>previous</MDBBtn>
                    <MDBBtn color="success" rounded className="float-right" onClick = {this.imprimir}>Imprimir</MDBBtn>
                </MDBCol>)}
                </MDBRow>
                
            </MDBContainer>
            </div>   
        );

    }  
}
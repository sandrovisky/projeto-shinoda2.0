import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBIcon, MDBBtn, MDBInput, MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import axios from 'axios'

import SelectSupplier from './component/SupplierSelect'
import SelectProduct from './component/ProductSelect'
import TableDataMoveItens from './component/TableDataMoveItens'
import TableDataMoveItensVolume from './component/TableDataMoveItensVolume'
import SelectItensVolumes from './component/SelectItensVolumes'

var dataAtual = new Date();
var dia = dataAtual.getDate();
var mes = (dataAtual.getMonth() + 1);
var ano = dataAtual.getFullYear();

if (mes < 10) {
    mes = "0" + mes
}
var dataHoje = `${ano}-${mes}-${dia}`

class NovaEntrada extends React.Component {

    state = {
    formActivePanel1: 1,
    formActivePanel1Changed: false,
    idSupplier: 0,
    idProduct: 0,
    idMove: 0,
    tableDataMoveItens: [],
    click: 0,
    delete: 0
    }

    cadastrarItem = async () => {
        if (this.state.idMove){
            await axios.post('http://localhost:3333/move-itens', {
                idMove: this.state.idMove,
                idProduct: this.state.idProduct,
                createdBy: 1,
                updatedBy: 1
            })
            this.setState({click: this.state.click+1})
            
        }else{

            //funcao q cria registro na tabela MOVE
            const result = await axios.post('http://localhost:3333/moves', {
                nf: this.state.nf,
                pedido: this.state.pedido,
                status: 2,
                createdBy: 1,
                updatedBy: 1,
                idSupplier: this.state.idSupplier
            })
            .then(async function (response) {
                return (response)         
            })
            .catch(function (error) {
                alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
            })
            if (result.data.id !== null){
                this.setState({idMove: result.data.id})
            }        

            //adicionar produto a tabela move-itens
            await axios.post('http://localhost:3333/move-itens', {
                idMove: this.state.idMove,
                idProduct: this.state.idProduct,
                createdBy: 1,
                updatedBy: 1
            })
            this.setState({click: this.state.click+1})
            
        }
    }

    cadastrarItemVolume = async () => {
        
            this.setState({click: this.state.click+1})
            
        
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

    handleSubmission = () => {
    alert('Form submitted!');
    }

    calculateAutofocus = (a) => {
    if (this.state['formActivePanel' + a + 'Changed']) {
        return true
    }
    }

    getIdSupplier = (childData) => {
        this.setState({idSupplier: childData})
    }

    getIdProduct = (childData) => {
        this.setState({idProduct: childData})
    }

    getIdProductVolume = (childData) => {
        this.setState({idProductVolume: childData})
    }

    getDelete = (childData) => {
        this.setState({delete: childData})
    }

    onHandleChangeNF = (e) => {
        this.setState({ nf: e.target.value })
    }

    onHandleChangeNPedido = (e) => {
        this.setState({ pedido: e.target.value })
    }

    onHandleChangeNLote = (e) => {
        this.setState({ nLote: e.target.value })
    }

    onHandleChangeDataValidade = (e) => {
        this.setState({ dataValidade: e.target.value })
    }

    async componentDidUpdate(prevState){
        if(this.state.idMove !== prevState.idMove){
            return true
        }
    }

    render() {
    return (
        <div style = {{padding: "0em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}>
    {}
            <MDBContainer >
                <h3 className="text-center font-weight-bold pt-4 pb-5 mb-2"><strong>Formulario de nova entrada</strong></h3>
                {this.state.idMove}
                {this.state.nf}
                {this.state.pedido}
                <MDBRow>
                
                {/* 
                    Entrada Inicio
                */}
                {this.state.formActivePanel1 === 1 &&
                (<MDBCol md="12">
                    <h3 className="text-center font-weight-bold pt-4 pb-5 mb-2">Entrada</h3>
                    <h6 className="font-weight-bold pl-0 my-4">
                        <strong>ID: {this.state.delete}</strong>
                    </h6>
                    <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black" }}>
                        <SelectSupplier getIdSupplier = {this.getIdSupplier} />
                        
                        <MDBRow>
                            <MDBCol>
                                <MDBInput label="Nº da NF" value = {this.state.nf} onChange = {this.onHandleChangeNF} className="mt-4" autoFocus={this.calculateAutofocus(1)}  />
                                
                            </MDBCol>

                            <MDBCol>
                                <MDBInput label="Nº do Pedido"  onChange = {this.onHandleChangeNPedido} className="mt-4" />
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>
                            
                            {/* Select dos produtos */}
                            <MDBCol md="12" >
                                <SelectProduct  getIdProduct = {this.getIdProduct} idSupplier = {this.state.idSupplier} />
                            </MDBCol >
                        </MDBRow> 

                        <MDBRow>
                            <MDBCol>
                                <MDBBtn color="primary" size="sm" rounded style = {{width: "100%", margin: "1em 0 0 0"}} onClick = {this.cadastrarItem} >Adicionar</MDBBtn>
                            </MDBCol>
                        </MDBRow>
                        
                        
                    </MDBContainer>
                    <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}>



                        <TableDataMoveItens click = {this.state.click} delete = {this.state.delete} idMove = {this.state.idMove} getDelete = {this.getDelete} />



                    </MDBContainer>
                    <MDBBtn color="danger" rounded className="float-left" onClick = {() => window.history.back()}>cancelar</MDBBtn>
                    <MDBBtn color="mdb-color" rounded className="float-right" onClick={this.handleNextPrevClick(1)(2)}>next</MDBBtn>
                </MDBCol>)}

                {/* 
                    Entrada Lotes
                */} 
                {this.state.formActivePanel1 === 2 &&
                (<MDBCol md="12">
                <h3 className="text-center font-weight-bold pt-4 pb-5 mb-2">Entrada - Lotes</h3>
                <h6 className="font-weight-bold pl-0 my-4">
                    <strong>ID: 321312331-24124</strong>
                </h6>
                <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black" }}>
                    
                    <MDBRow>
                        <MDBCol>
                            <label htmlFor="lote">Nº do Lote</label>
                            <MDBInput id="lote" label="" className="mt-4" autoFocus={this.calculateAutofocus(1)}  />                        
                        </MDBCol>

                        <MDBCol>
                            <label htmlFor="date">Vencimento</label>
                            <MDBInput disablePast id= "date" type = "date" className="mt-4" min={dataHoje} />
                        </MDBCol>
                    </MDBRow>

                    <MDBRow>

                            <MDBCol>
                                <MDBInput max = "10" type = "number" label="Nº de Paletes" className="mt-4" autoFocus={this.calculateAutofocus(1)}  />
                                
                            </MDBCol>

                            <MDBCol>
                                <MDBInput type = "number" label="Quantidade do Produto" className="mt-4" />

                            </MDBCol>
                    </MDBRow>          

                    <MDBRow >

                        <MDBCol >
                            
                            <SelectItensVolumes idMove = {this.idMove} getIdProductVolume = {this.getIdProductVolume}/>
                            
                        </MDBCol >

                    </MDBRow>   

                    <MDBRow>

                        <MDBCol>
                            
                            <MDBBtn color="primary" size="sm" rounded style = {{width: "100%" }} onClick = {this.cadastrarItemVolume} >Adicionar</MDBBtn> 

                        </MDBCol>

                    </MDBRow>      
                    
                </MDBContainer>

                <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}>
                    
                    <TableDataMoveItensVolume click = {this.state.click} idMove = {this.state.idMove} getDelete = {this.getDelete}/>

                </MDBContainer>

                <MDBBtn color="mdb-color" rounded className="float-left" onClick={this.handleNextPrevClick(1)(1)}>previous</MDBBtn>
                <MDBBtn color="mdb-color" rounded className="float-right" onClick={this.handleNextPrevClick(1)(3)}>next</MDBBtn>
            </MDBCol>)}
                
                {/* 
                    Entrada Volumes
                */}
                {this.state.formActivePanel1 === 3 &&
                (<MDBCol md="12">
                    <h3 className="text-center font-weight-bold pt-4 pb-5 mb-2">Entrada - Volumes</h3>
                    <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}> 
                        
                        <MDBRow>

                            <MDBCol md = "6">
                                <h5>
                                    id:1111
                                </h5>

                            </MDBCol>

                            <MDBCol md = "6">
                                <h5 className = "float right">
                                    Data de Entrada: 11/11/1111
                                </h5>

                            </MDBCol>   
                        </MDBRow>
                        
                        <MDBRow>

                            <MDBCol>
                                <h5>
                                    Fornecedor: Lula
                                </h5>

                            </MDBCol>                          
                        </MDBRow>                   

                        <MDBRow>

                            <MDBCol md = "6">
                                <h5>
                                    NF:1111
                                </h5>

                            </MDBCol>

                            <MDBCol md = "6">
                                <h5 className = "float right">
                                    Status: Emitido
                                </h5>

                            </MDBCol>   
                        </MDBRow>                
                    </MDBContainer>

                    <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}> 
                    
                        <TableDataMoveItensVolume />
                        
                    </MDBContainer>
                    <MDBBtn color="mdb-color" rounded className="float-left" onClick={this.handleNextPrevClick(1)(2)}>previous</MDBBtn>
                    <MDBBtn color="success" rounded className="float-right" onClick={this.handleSubmission}>submit</MDBBtn>
                </MDBCol>)}
                </MDBRow>
                
            </MDBContainer>
        </div>
        
        );
    };
}

export default NovaEntrada;
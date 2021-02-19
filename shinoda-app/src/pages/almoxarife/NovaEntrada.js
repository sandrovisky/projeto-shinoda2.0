import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBIcon, MDBBtn, MDBInput, MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";

import SelectSupplier from './component/SupplierSelect'
import SelectProduct from './component/ProductSelect'

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
}

swapFormActive = (a) => (param) => (e) => {
  this.setState({
    ['formActivePanel' + a]: param,
    ['formActivePanel' + a + 'Changed']: true
  });
}

handleNextPrevClick = (a) => (param) => (e) => {
  this.setState({
    ['formActivePanel' + a]: param,
    ['formActivePanel' + a + 'Changed']: true
  });
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

onHandleChangeNF = (e) => {
    this.setState({ nf: e.target.value })
}

onHandleChangeNPedido = (e) => {
    this.setState({ nPedido: e.target.value })
}

onHandleChangeNLote = (e) => {
    this.setState({ nLote: e.target.value })
}

onHandleChangeDataValidade = (e) => {
    this.setState({ dataValidade: e.target.value })
}

render() {
  return (
      <div style = {{padding: "0em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}>
{}
        <MDBContainer >
            <h3 className="text-center font-weight-bold pt-4 pb-5 mb-2"><strong>Formulario de nova entrada</strong></h3>
            <MDBRow>
            
            {/* 
                Entrada Inicio
            */}
            {this.state.formActivePanel1 === 1 &&
            (<MDBCol md="12">
                <h3 className="text-center font-weight-bold pt-4 pb-5 mb-2">Entrada</h3>
                <h6 className="font-weight-bold pl-0 my-4">
                    <strong>ID: {this.state.idSupplier}</strong>
                </h6>
                <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black" }}>
                    <SelectSupplier getIdSupplier = {this.getIdSupplier} />
                    
                    <MDBRow>
                        <MDBCol>
                            <MDBInput label="Nº da NF" className="mt-4" autoFocus={this.calculateAutofocus(1)}  />
                            
                        </MDBCol>

                        <MDBCol>
                            <MDBInput label="Nº do Pedido" className="mt-4" />
                        </MDBCol>
                    </MDBRow>

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
                        
                        {/* Select dos produtos */}
                        <MDBCol md="12" >
                            <SelectProduct getIdProduct = {this.getIdProduct} idSupplier = {this.state.idSupplier} />
                        </MDBCol >
                    </MDBRow> 

                    <MDBRow>
                        <MDBCol>
                            <MDBBtn color="primary" size="sm" rounded style = {{width: "100%", margin: "1em 0 0 0"}} >Adicionar</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                    
                    
                </MDBContainer>
                <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}>
                    <MDBTable>
                        <MDBTableHead>
                            <tr>
                                <th>id</th>
                                <th>produto</th>
                                <th></th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            <tr>
                                <td>1</td>
                                <td>ovo branco</td>
                                <td><MDBBtn size="sm" color = "danger" >
                                        <MDBIcon icon="trash-alt" size = "1x" />
                                    </MDBBtn>
                                    </td>
                            </tr>

                            <tr>
                                <td>2</td>
                                <td>Açucar</td>
                                <td>
                                    <MDBBtn size="sm" color = "danger" >
                                        <MDBIcon icon="trash-alt" size = "1x" />
                                    </MDBBtn>
                                </td>
                            </tr>

                            <tr>
                                <td>3</td>
                                <td>Graxa em pó</td>
                                <td>
                                    <MDBBtn size="sm" color = "danger" >
                                        <MDBIcon icon="trash-alt" size = "1x" />
                                    </MDBBtn>
                                </td>
                            </tr>
                        </MDBTableBody>
                    </MDBTable>
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

                <MDBRow >
                    <MDBCol >
                        <select className="browser-default custom-select" >
                            <option>Escolha o Produto</option>
                            <option value="1">Exemplo 1</option>
                            <option value="2">Exemplo 2</option>
                            <option value="3">Exemplo 3</option>
                        </select>
                        
                    </MDBCol >
                </MDBRow>

                <MDBRow >

                    <MDBCol  >
                        <MDBBtn color="primary" size="sm" rounded style = {{width: "100%", margin: "1em 0 0 0"}} >Adicionar</MDBBtn>

                    </MDBCol>
                </MDBRow>         
                
            </MDBContainer>

            <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}>
                
                <MDBTable>
                    <MDBTableHead>
                        <tr>
                            <th>Produto</th>
                            <th>Lote</th>
                            <th>Validade</th>
                            <th></th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        <tr>
                            <td>ovo branco</td>
                            <td>lote 2</td>
                            <td>hoje</td>
                            <td><MDBBtn size="sm" color = "danger" >
                                    <MDBIcon icon="trash-alt" size = "1x" />
                                </MDBBtn>
                                </td>
                        </tr>

                        <tr>
                            <td>açucar</td>
                            <td>lote 2</td>
                            <td>ja venceu</td>
                            <td>
                                <MDBBtn size="sm" color = "danger" >
                                    <MDBIcon icon="trash-alt" size = "1x" />
                                </MDBBtn>
                            </td>
                        </tr>

                        <tr>
                            <td>Graza em pó</td>
                            <td>lote 2</td>
                            <td>infinito</td>
                            <td>
                                <MDBBtn size="sm" color = "danger" >
                                    <MDBIcon icon="trash-alt" size = "1x" />
                                </MDBBtn>
                            </td>
                        </tr>
                    </MDBTableBody>
                </MDBTable>
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
                <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black" }}>
                    
                    <MDBRow>
                        
                        <MDBCol md="12" >

                            <select className="browser-default custom-select" >
                                <option>Escolha o Produto - Lote</option>
                                <option value="1">Exemplo 1</option>
                                <option value="2">Exemplo 2</option>
                                <option value="3">Exemplo 3</option>

                            </select>
                        </MDBCol >
                    </MDBRow> 

                    <MDBRow>

                        <MDBCol>
                            <MDBInput max = "10" type = "number" label="Nº de Paletes" className="mt-4" autoFocus={this.calculateAutofocus(1)}  />
                            
                        </MDBCol>

                        <MDBCol>
                            <MDBInput type = "number" label="Quantidade do Produto" className="mt-4" />

                        </MDBCol>
                    </MDBRow>

                    <MDBRow>
                        <MDBBtn color="primary" size="sm" rounded style = {{width: "100%" }}  >Adicionar</MDBBtn> 

                    </MDBRow>              
                </MDBContainer>

                <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", marginTop: "0.5em" }}> 
                
                    <MDBTable>

                        <MDBTableHead>

                            <tr>
                                <th>ID</th>
                                <th>Produto</th>
                                <th>Quantidad</th>
                                <th>Lote</th>
                                <th></th>
                            </tr>
                        </MDBTableHead>

                        <MDBTableBody>

                            <tr>
                                <td>1</td>
                                <td>ovo branco</td>
                                <td>800</td>
                                <th>111111-01</th>
                                <td><MDBBtn size="sm" color = "danger" >
                                        <MDBIcon icon="trash-alt" size = "1x" />

                                    </MDBBtn>
                                </td>
                            </tr>

                            <tr>

                                <td>2</td>
                                <td>Açucar</td>
                                <td>10</td>
                                <th>111111-01</th>
                                <td>
                                    <MDBBtn size="sm" color = "danger" >
                                        <MDBIcon icon="trash-alt" size = "1x" />

                                    </MDBBtn>
                                </td>
                            </tr>

                            <tr>
                                <td>3</td>
                                <td>Graxa em pó</td>
                                <td>1</td>
                                <th>111111-01</th>
                                <td>
                                    <MDBBtn size="sm" color = "danger" >
                                        <MDBIcon icon="trash-alt" size = "1x" />
                                    </MDBBtn>
                                </td>
                            </tr>
                        </MDBTableBody>
                    </MDBTable>
                </MDBContainer>
                <MDBBtn color="mdb-color" rounded className="float-left" onClick={this.handleNextPrevClick(1)(2)}>previous</MDBBtn>
                <MDBBtn color="mdb-color" rounded className="float-right" onClick={this.handleNextPrevClick(1)(4)}>next</MDBBtn>
            </MDBCol>)}

            {/* 
                Entrada Fim
            */}
            {this.state.formActivePanel1 === 4 &&
            (<MDBCol md="12">
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
                
                    <MDBTable>

                        <MDBTableHead>

                            <tr>
                                <th>id</th>
                                <th>produto</th>
                                <th>
                                    <MDBBtn size="sm" color = "danger" >
                                        <MDBIcon icon="trash-alt" size = "1x" />

                                    </MDBBtn>
                                </th>
                            </tr>
                        </MDBTableHead>

                        <MDBTableBody>

                            <tr>
                                <td>1</td>
                                <td>ovo branco</td>
                                <td><MDBBtn size="sm" color = "danger" >
                                        <MDBIcon icon="trash-alt" size = "1x" />

                                    </MDBBtn>
                                </td>
                            </tr>

                            <tr>

                                <td>2</td>
                                <td>Açucar</td>
                                <td>
                                    <MDBBtn size="sm" color = "danger" >
                                        <MDBIcon icon="trash-alt" size = "1x" />

                                    </MDBBtn>
                                </td>
                            </tr>

                            <tr>
                                <td>3</td>
                                <td>Graxa em pó</td>
                                <td>
                                    <MDBBtn size="sm" color = "danger" >
                                        <MDBIcon icon="trash-alt" size = "1x" />
                                    </MDBBtn>
                                </td>
                            </tr>
                        </MDBTableBody>
                    </MDBTable>
                </MDBContainer>
                <MDBBtn color="mdb-color" rounded className="float-left" onClick={this.handleNextPrevClick(1)(3)}>previous</MDBBtn>
                <MDBBtn color="success" rounded className="float-right" onClick={this.handleSubmission}>submit</MDBBtn>
            </MDBCol>)}
            </MDBRow>
        </MDBContainer>
      </div>
    
    );
  };
}

export default NovaEntrada;
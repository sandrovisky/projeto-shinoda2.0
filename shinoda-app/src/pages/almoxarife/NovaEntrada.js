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
        delete: 0,
        selectProduct: []
    }

    deletarProduto = async (id) => {
        await axios.delete('http://localhost:3333/move-itens/:',{
            data : {id: id}
        })
        .then(async function () {
            console.log("ok")
        })
        .catch(function (error) {
            
            alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
            console.log(error.response);
        })
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/move-itens/'
        }); 

        const response =  await cadastros.get(`${this.state.idMove}`);
    
        //manipulando os dados que preencherão a tabela
        let tableData = []
        if (response !== null){
            response.data.map(dados => tableData.push(
                <tr key = {dados.id}>
                    <td>{dados.product.id}</td>
                    <td>{dados.product.nome}</td>
                    <td>
                        <MDBBtn size="sm" color = "danger" onClick={() => this.deletarProduto(dados.id)} >
                            <MDBIcon icon="trash-alt"  size = "1x" />
                        </MDBBtn>
                    </td>
                </tr>
            ))                
            this.setState({tabela: tableData})
        }
        
    }

    //Funcao q cadastra cada item adicionado ao movimento
    onSubmitCadastraMoveItens = async (e) => {
        e.preventDefault()

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
                nf: this.state.nf.toString(),
                pedido: this.state.pedido.toString(),
                status: 0,
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
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/move-itens/'
        }); 

        const response =  await cadastros.get(`${this.state.idMove}`);
    
        //manipulando os dados que preencherão a tabela
        let tableData = []
        if (response !== null){
            response.data.map(dados => tableData.push(
                <tr key = {dados.id}>
                    <td>{dados.product.id}</td>
                    <td>{dados.product.nome}</td>
                    <td>
                        <MDBBtn size="sm" color = "danger" onClick={() => this.deletarProduto(dados.id)} >
                            <MDBIcon icon="trash-alt"  size = "1x" />
                        </MDBBtn>
                    </td>
                </tr>
            ))                
            this.setState({tabela: tableData})
        }
    }

    deletarMoveItensVolume = async(idLoteitens, idMoveitensvolumes) => {

        await axios.delete('http://localhost:3333/move-itens-volumes/:',{
            data : {id: idMoveitensvolumes}
        })
        .then(() => {
            console.log("Lote excluido com sucesso")
        })
        .catch(function (error) {            
            alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
            console.log(error.response);
        })
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/lotes/moveitensvolume/'
        }); 

        
        await axios.delete('http://localhost:3333/lotes/:',{
            data : {id: idLoteitens}
        })
        .then(() => {
            console.log("Lote excluido com sucesso")
        })
        .catch(function (error) {            
            alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
            console.log(error.response);
        })

        const response1 =  await cadastros.get(`${this.state.idMove}`);
        console.log(response1.data)
         //manipulando os dados que preencherão a tabela
         let tableData = []
         if (response1 !== null){
             response1.data.map(dados => tableData.push(
                 <tr key = {dados.id}>
                     <td>{dados.moveitensvolume.quantidadePaletes}</td>
                     <td>{dados.moveitens.product.nome}</td>
                     <td>{dados.dataValidade}</td>
                     <td>{dados.codigo}</td>
                     <td>{dados.moveitensvolume.quantidadeTotal}</td>
                     <td>
                         <MDBBtn size="sm" color = "danger" onClick={() => this.deletarMoveItensVolume(dados.id, dados.moveitensvolume.id)} >
                             <MDBIcon icon="trash-alt"  size = "1x" />
                         </MDBBtn>
                     </td>
                 </tr>
            ))}           
            this.setState({tabelaMoveItensVolume: tableData})
    }

    onSubmitCadastraMoveItensVolume = async (e) => {
        e.preventDefault()

        await axios.post('http://localhost:3333/lotes', {
            numLaudo: this.state.numLaudo,
            dataValidade: this.state.dataValidade,
            idMoveitens: this.state.idMoveitens,
            quantidadeTotal: this.state.quantidadeProduto,
            createdBy: 1,
            updatedBy: 1
        })
        .then((response) => {
            this.setState({idLoteitens: response.data.id})
            console.log(response.data)
        })
        .catch((err) => console.log(err))
        
        await axios.post('http://localhost:3333/move-itens-volumes', {
            idMoveitens: this.state.idMoveitens,
            idLoteitens: this.state.idLoteitens,
            quantidadePaletes: this.state.quantidadePalete,
            quantidadeTotal: this.state.quantidadeProduto,
            createdBy: 1,
            updatedBy: 1
        })
        .then((response) => this.setState({idMoveitensvolumes: response.data.id}))
        .catch((err) => console.log(err))

        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/lotes/moveitensvolume/'
        }); 

        const response1 =  await cadastros.get(`${this.state.idMove}`);
        console.log(response1.data)
         //manipulando os dados que preencherão a tabela
         let tableData = []
         if (response1 !== null){
             response1.data.map(dados => tableData.push(
                 <tr key = {dados.id}>
                     <td>{dados.moveitensvolume.quantidadePaletes}</td>
                     <td>{dados.moveitens.product.nome}</td>
                     <td>{dados.dataValidade}</td>
                     <td>{dados.codigo}</td>
                     <td>{dados.moveitensvolume.quantidadeTotal}</td>
                     <td>
                         <MDBBtn size="sm" color = "danger" onClick={() => this.deletarMoveItensVolume(dados.id, dados.moveitensvolume.id)} >
                             <MDBIcon icon="trash-alt"  size = "1x" />
                         </MDBBtn>
                     </td>
                 </tr>
            ))}           
            this.setState({tabelaMoveItensVolume: tableData})                                
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

    getIdMoveitens = (childData) => {
        this.setState({idMoveitens: childData})
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

    onHandleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
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
                        <strong>ID:{this.state.idMove}</strong>
                    </h6>
                    <form onSubmit = {this.onSubmitCadastraMoveItens}>
                        <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black" }}>
                            <label for="selectSupplier">Selecione o fornecedor</label>
                            <SelectSupplier required id = "selectSupplier" idSupplier = {this.state.idSupplier} getIdSupplier = {this.getIdSupplier} autoFocus={this.calculateAutofocus(1)} />
                            
                            <MDBRow>
                                <MDBCol >
                                    <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} success="Yeah!" required label="Nº da NF" value = {this.state.nf} name = "nf" onChange = {this.onHandleChange} className="mt-4"   />
                                    
                                </MDBCol>

                                <MDBCol>
                                    <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} required label="Nº do Pedido" value = {this.state.pedido} name = "pedido" onChange = {this.onHandleChange} className="mt-4" />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow>
                                
                                {/* Select dos produtos */}
                                <MDBCol md="12" >
                                    <label for="selectProduct">Selecione o Produto</label>
                                    <SelectProduct required idProduct = {this.state.idProduct}  getIdProduct = {this.getIdProduct} idSupplier = {this.state.idSupplier} />
                                </MDBCol >
                            </MDBRow> 

                            <MDBRow>
                                <MDBCol>
                                    <MDBBtn type = "submit" color="primary" size="sm" rounded style = {{width: "100%", margin: "1em 0 0 0"}}  >Adicionar</MDBBtn>
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
                                    {this.state.tabela}
                                </MDBTableBody>
                            </MDBTable>

                        </MDBContainer>
                    </form>
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
                    <strong>ID: {this.state.idMove}</strong>
                </h6>
                <MDBContainer style = {{padding: "1em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black" }}>
                    <form onSubmit = {this.onSubmitCadastraMoveItensVolume}>
                        <MDBRow>
                            <MDBCol>
                                <MDBInput required onFocus = {(e) => e.target.autocomplete = "off"} autoComplete="new-password" id="laudo" value = {this.state.numLaudo} name = "numLaudo" label="Laudo" onChange = {this.onHandleChange} className="mt-4" autoFocus={this.calculateAutofocus(1)}  />                        
                            </MDBCol>

                            <MDBCol>
                                <MDBInput required onFocus = {(e) => e.target.autocomplete = "off"} autoComplete="off" name = "dataValidade" value = {this.state.dataValidade} type = "text" label = "Data de Validade" onChange = {this.onHandleChange} className="mt-4" min={dataHoje} onBlur= {(e) => {e.target.value !== "" ? e.target.type = "date" : e.target.type = "text" }} onFocus = {(e) => e.target.type = "date"} />
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>

                                <MDBCol>
                                    <MDBInput required onFocus = {(e) => e.target.autocomplete = "off"} name = "quantidadePalete" value = {this.state.quantidadePalete} type = "number" label="Nº de Paletes" onChange = {this.onHandleChange} className="mt-4"    />
                                    
                                </MDBCol>

                                <MDBCol>
                                    <MDBInput required onFocus = {(e) => e.target.autocomplete = "off"} onChange = {this.onHandleChange} value = {this.state.quantidadeProduto} name = "quantidadeProduto" type = "number" label="Quantidade do Produto" className="mt-4"  />

                                </MDBCol>
                        </MDBRow>          

                        <MDBRow >

                            <MDBCol >
                                <SelectItensVolumes click = {this.state.click} idMove = {this.state.idMove} getIdMoveitens = {this.getIdMoveitens}/>
                                
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
                                <th>Lote</th>
                                <th>Quantidade</th>
                                <th></th>
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
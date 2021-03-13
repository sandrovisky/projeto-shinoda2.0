import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBIcon, MDBBtn, MDBInput, MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";

import api from '../../services/api'

import SelectSupplier from './component/SupplierSelect'
import SelectProduct from './component/ProductSelect'
import SelectItensVolumes from './component/SelectItensVolumes'

var dataAtual = new Date();
var dia = dataAtual.getDate();
var mes = (dataAtual.getMonth() + 1);
var ano = dataAtual.getFullYear();

if (mes < 10) {
    mes = "0" + mes
}

if(dia < 10) {
    dia = "0"+dia
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
        status: 0,
        selectProduct: [],
        tabelaMoveItensVolume: []
    }

    //Deleta um produto no datatable de move, assim como os registros no banco
    deletarProduto = async (id) => {
        await api.delete('/move-itens/:',{
            data : {id: id}
        })
        .then(async function () {
        })
        .catch(function (error) {
            
            alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
            console.log(error.response);
        })

        const response =  await api.get(`/move-itens/${this.state.idMove}`);
    
        //manipulando os dados que preencherão o datatable
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
         
        this.gerarDadosMoveItens() 
        this.gerarDadosMoveVolumes() 
        this.gerarDadosFim()
    }

    gerarDadosMoveItens = async () => {
        const response =  await api.get(`/move-itens/${this.state.idMove}`);
    
        //manipulando os dados que preencherão o tabledata
        let tableData = []
        
        if (response !== null){
            response.data.map(dados => tableData.push(
                <tr key = {dados.id}>
                    <td>{dados.product.id}</td>
                    <td>{dados.product.nome}</td>
                    <td style = {{textAlign: "right"}}>
                        <MDBBtn size="sm" color = "danger" onClick={() => this.deletarProduto(dados.id)} >
                            <MDBIcon icon="trash-alt"  size = "1x" />
                        </MDBBtn>
                    </td>
                </tr>
            ))                
            this.setState({tabela: tableData})
        }      
    }

    gerarDadosMoveVolumes = async () => {
        
        await api.get(`/volume-itens-tables/moves/${this.state.idMove}`)
        .then(async responseTable => {
            let tableData = []
            if (responseTable.data) {
                responseTable.data.map((dados) => {       
                    tableData.push(
                        <tr key = {dados.id}>
                            <td>{dados.quantidadePaletes}</td>
                            <td>{dados.loteitens.moveitens.product.nome}</td>
                            <td>{dados.loteitens.dataValidade}</td>
                            <td>{dados.loteitens.lote}</td>
                            <td>{dados.quantidadeTotal * dados.quantidadePaletes}{" " + dados.loteitens.moveitens.product.medida}</td>
                            <td style = {{textAlign: "right"}}>
                                <MDBBtn size="sm" color = "danger" onClick={() => this.deletarVolume(dados.id, dados.idLoteitens)} >
                                    <MDBIcon icon="trash-alt"  size = "1x" />
                                </MDBBtn>
                            </td>
                        </tr>
                    ) 
                })   
            }
            this.setState({tabelaMoveItensVolume: tableData})
        })
    }

    gerarDadosFim = async () => {
        
        await api.get(`/lotes/move/${this.state.idMove}`)
        .then(async response => {
            console.log(response.data)
            let tableData = []
            await response.data.map(dados => {
                let peso = 0
                dados.moveitensvolume.map( volumes => {
                    peso += parseInt(volumes.quantidadeTotal)                
                })
                tableData.push(
                    <tr key = {dados.id}>
                        <td>{dados.moveitens.product.nome}</td>
                        <td>{dados.dataValidade}</td>
                        <td>{dados.moveitensvolume.length}</td>
                        <td>{peso}{" " + dados.moveitens.product.medida}</td>
                    </tr>
                )
                console.log(peso)
            })
            this.setState({ tabelaFim: tableData }) 
        })
    }

    //Funcao q cadastra cada item adicionado ao movimento
    onSubmitCadastraMoveItens = async (e) => {
        e.preventDefault()

        //cria um movimentação
        if (this.state.idMove !== 0){
            await api.get(`/moves/product/${this.state.idProduct}`)
            .then(async response => {
                if ( response.data ) {
                    alert("Item ja vinculado a essa movimentação")
                } else {
                    await api.post('/move-itens', {
                        idMove: this.state.idMove,
                        idProduct: this.state.idProduct,
                        createdBy: 1,
                        updatedBy: 1
                    })
                }
            })            
        }else{

            //funcao q cria registro na tabela MOVE
            await api.post('/moves', {
                nf: this.state.nf.toString(),
                pedido: this.state.pedido.toString(),
                status: 1,
                createdBy: 1,
                updatedBy: 1,
                idSupplier: this.state.idSupplier
            })
            .then(async (response) =>{
                this.setState({idMove: response.data.id})
                this.setState({dataEntrada: response.data.createdAt})
            })
            .catch(function (error) {
                alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
            })       

            //adicionar produto a tabela move-itens
            await api.post('/move-itens', {
                idMove: this.state.idMove,
                idProduct: this.state.idProduct,
                createdBy: 1,
            })
            
        }
         
        this.gerarDadosMoveItens() 
        this.gerarDadosMoveVolumes() 
        this.gerarDadosFim()
    }

    //função q deleta um item na datable de volumes, e tambem as IDs relacionadas a ela no banco de dados
    deletarVolume = async( id, idLoteitens ) => {

        await api.delete(`/volume-itens-tables/${id}`)
        .then(async response => {
            console.log(response)
        })
        .catch(async err => {
            console.log(err)
        })

        await api.get(`/lotes/${idLoteitens}`)
        .then(async response => {
            console.log(response.data.moveitensvolume.length)
            if ( response.data.moveitensvolume.length === 0 ){
                await api.delete(`/lotes/${idLoteitens}`)
            }
        }) 
        this.gerarDadosMoveItens() 
        this.gerarDadosMoveVolumes() 
        this.gerarDadosFim()
    }

    //cria registros no banco relacionadas a tela de move itens volumes
    onSubmitCadastraMoveItensVolume = async (e) => {
        e.preventDefault()
        
        await api.get(`/lotes/lote/${this.state.idMove}/${this.state.lote}/${this.state.idProduct}`)
        .then(async response => {
            if (response.data === null) {
                await api.post(`/lotes`, {
                    idMoveitens: this.state.idMoveitens,
                    lote: this.state.lote,
                    laudo: this.state.laudo,
                    dataValidade: this.state.dataValidade,
                    createdBy: 1
                })
                .then(async responseLote => {
                    this.setState({idLoteitens: responseLote.data.id})
                })
            } else {
                this.setState({idLoteitens: response.data.id})
            }
        })
        await api.post(`/move-itens-volumes`, {
            idMoveitens: this.state.idMoveitens,
            idLoteitens: this.state.idLoteitens,
            quantidadeTotal: this.state.quantidadeTotal,
            quantidadePaletes: this.state.quantidadePaletes,
            createdBy: 1
        })
        .then(async responseVolume => {
            this.setState({lastId: responseVolume.data[responseVolume.data.length - 1].id})
        })

        await api.post('volume-itens-tables', {
            idLoteitens: this.state.idLoteitens,
            idMove: this.state.idMove,
            lastId: this.state.lastId,
            quantidadeTotal: this.state.quantidadeTotal,
            quantidadePaletes: this.state.quantidadePaletes,
            createdBy: 1
        })
        .then(async response => {
        }) 
        this.gerarDadosMoveItens() 
        this.gerarDadosMoveVolumes() 
        this.gerarDadosFim()                         
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

    //função q é passada ao componente filho, q recebe a idSupplier
    getIdSupplier = async (childData) => {

        await api.get(`/move-itens/${this.state.idMove}`)  
        .then((response) => {
            if(response.data.length > 0){
                alert("Delete os produtos primeiro")
            } else {
                this.setState({idSupplier: childData})
            }
        })
        .catch((err)=>{})        
    }

    //função q é passada ao componente filho, q recebe a idMoveitens
    getIdMoveitens = (childData) => {
        this.setState({idMoveitens: childData})
    }

    //função q é passada ao componente filho, q recebe a idProduct
    getIdProduct = (childData) => {
        this.setState({idProduct: childData})
    }

    //função q é passada ao componente filho, q recebe a idProductVolumes
    getIdProductVolume = (childData) => {
        this.setState({idProductVolume: childData})
    }

    //função q abre uma nova guia passando a id que sera usada para gerar as impressões, verifica se há produtos cadastrados e atualiza o status da move no banco
    imprimir = async () => {     

        const response =  await api.get(`/move-itens-volumes/${this.state.idMove}`);

        //verifica se há produtos cadastrados naquela movimentação
        if(response.data.length !== 0){
            if (this.state.nf === '' || this.state.pedido === ""){
                alert("Verifique os campos da primeira tela")
            } else {
                await api.put('/moves',{ //rota da atualização
                    id: this.state.idMove,

                    status: 2,        
                })
                window.open(`/entrada/impressao/${this.state.idMove}`, '_blank')
                window.open(`/entrada`, '_self')
            }
        } else{
            alert("Nenhum produto cadastrado")
        }     
    }

    //função q recebe os valores inseridos nos inputs
    onHandleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })  
    }

    //verifica se o id do fornecedor mudou para renderizar o componente
    async componentDidUpdate (prevPros,prevState) {

        if(this.state.idSupplier !== prevState.idSupplier){
    
            await api.get(`/suppliers/${this.state.idSupplier}`)
            .then((response) => {                
                this.setState({ fornecedorNome: response.data.nomeFantasia })
            })

            return false
        }        
    }

    async componentDidMount () {        

        await api.get(`/moves/${this.props.match.params.idMove}`)
        .then((response) => {
            
            if(response.data[0]){
                this.setState({dataEntrada: response.data[0].createdAt}) 
                this.setState({idMove: response.data[0].id}) 
                this.setState({nf: response.data[0].nf})     
                this.setState({pedido: response.data[0].pedido})           
                this.setState({idSupplier: response.data[0].idSupplier})
                if(response.data[0].status !== "1"){
                    window.location.href = '/entrada';
                }
            }             
        }) 
        this.gerarDadosMoveItens() 
        this.gerarDadosMoveVolumes() 
        this.gerarDadosFim()      
    }

    render() {
    return (
        <div id = "divPrincipal" style = {{padding: "0em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}>
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
                            <label htmlFor ="selectSupplier">Selecione o fornecedor</label>
                            <SelectSupplier required id = "selectSupplier" idMove = {this.state.idMove} idSupplier = {this.state.idSupplier} getIdSupplier = {this.getIdSupplier} autoFocus={this.calculateAutofocus(1)} />
                            
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
                                    <label htmlFor="selectProduct">Selecione o Produto</label>
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
                                <MDBInput required autoComplete="off" name = "dataValidade" value = {this.state.dataValidade} type = "text" label = "Data de Validade" onChange = {this.onHandleChange} className="mt-4" min={dataHoje} onBlur= {(e) => {e.target.value !== "" ? e.target.type = "date" : e.target.type = "text" }} onFocus = {(e) => e.target.type = "date"} />
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
                            <MDBCol  className="" >
                                <label htmlFor="volumes">Selecione o Produto</label>
                                <SelectItensVolumes click = {this.state.click} idMove = {this.state.idMove} getIdProduct = {this.getIdProduct} getIdMoveitens = {this.getIdMoveitens} id = "volumes" />
                                
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
    };
}

export default NovaEntrada;
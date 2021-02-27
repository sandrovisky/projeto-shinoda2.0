import React from "react";
import { useHistory } from 'react-router-dom'
import { MDBContainer, MDBRow, MDBCol, MDBIcon, MDBBtn, MDBInput, MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import axios from 'axios'

import SelectSupplier from './component/SupplierSelect'
import SelectProduct from './component/ProductSelect'
import TableDataFim from './component/TableDataFim'
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
        selectProduct: [],
        tabelaMoveItensVolume: []
    }

    deletarProduto = async (id) => {
        console.log(id)
        await axios.delete('http://localhost:3333/move-itens/:',{
            data : {id: id}
        })
        .then(async function () {
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
                status: 1,
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
                this.setState({dataEntrada: result.data.createdAt})
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

    deletarMoveItensVolume = async(last, range, idLoteitens, idTable ) => {
        console.log(last)
        console.log(range)
        function frange(last, end){
            last-= end -1
            end = last+end
            console.log(last + "-" + end)
            let x = []
            for(last;last < end;last++){
                x.push(last)
            }
            return x
        }

        const deleteIds = frange( last, range )
        console.log("deletes ids vol")
        console.log(deleteIds)

        await axios.delete('http://localhost:3333/move-itens-volumes/:',{
            data: {
                id: deleteIds
            }
        })
        .then(() => {
            console.log("MoveItensVolume excluido com sucesso")
        })
        .catch(function (error) {            
            alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
            console.log(error.response);
        })

        await axios.delete('http://localhost:3333/move-itens-volumes-tables/:',{
           data: {
               id: idTable
           }
        })
        .then(() => {
            console.log("Item da tabela excluido com sucesso")
        })
        .catch(function (error) {            
            alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
            console.log(error.response);
        })         
        
        await axios.delete('http://localhost:3333/lotes/:',{
           data: {
               id: idLoteitens
           }
        })
        .then(() => {
            console.log("Lote excluido com sucesso")
        })
        .catch(function (error) {            
            alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
            console.log(error.response);
        })
        
        const cadastros1 = axios.create({
            baseURL: 'http://localhost:3333/move-itens-volumes-tables/'
        });

        const response1 =  await cadastros1.get(`${this.state.idMove}`);
        console.log(response1.data)
        
        //manipulando os dados que preencherão a tabela
        let tableData = []
        console.log([response1.data])
        response1.data.map(dados => tableData.push(
            <tr key = {dados.id}>
                <td>{dados.quantidadePaletes}</td>
                <td>{dados.produto}</td>
                <td>{dados.validade}</td>
                <td>{dados.codigoLote}</td>
                <td>{dados.quantidadeTotal}</td>
                <td>
                    <MDBBtn size="sm" color = "danger" onClick={() => this.deletarMoveItensVolume(parseInt(dados.lastId), parseInt(dados.quantidadePaletes), dados.idLoteitens, dados.id )} >
                        <MDBIcon icon="trash-alt"  size = "1x" />
                    </MDBBtn>
                </td>
            </tr>
        ))          
            this.setState({ tabelaMoveItensVolume: tableData }) 

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
            this.setState({codigo: response.data.codigo})
        })
        .catch((err) => console.log(err))
        
        for(let i = 0;i < parseInt(this.state.quantidadePalete); i++){
            await axios.post('http://localhost:3333/move-itens-volumes', {
            idMoveitens: this.state.idMoveitens,
            idLoteitens: this.state.idLoteitens,
            quantidadePaletes: this.state.quantidadePalete,
            quantidadeTotal: this.state.quantidadeProduto,
            createdBy: 1,
            updatedBy: 1
            })
            .then((response) => {
                this.setState({idMoveitensvolumesLast: response.data.id})
                console.log(response.data.id)
            })
            .catch((err) => console.log(err))
        }
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/products/'
        }); 

        const resProduct =  await cadastros.get(`${this.state.idProduct}`);
        
        await axios.post('http://localhost:3333/move-itens-volumes-tables', {
            quantidadePaletes: this.state.quantidadePalete,
            validade: this.state.dataValidade,
            idMove: this.state.idMove,
            quantidadeTotal: this.state.quantidadeProduto,
            produto: resProduct.data.codigo + " - " + resProduct.data.nome,
            codigoLote: this.state.codigo,
            idLoteitens: this.state.idLoteitens,
            lastId: this.state.idMoveitensvolumesLast,
            createdBy: 1,
            updatedBy: 1
        })
        .then((response) => {
            this.setState({ idTable: response.data.id })
            console.log(response)
        })
        .catch((err) => console.log(err))

        const cadastros1 = axios.create({
            baseURL: 'http://localhost:3333/move-itens-volumes-tables/'
        }); 

        const response1 =  await cadastros1.get(`${this.state.idMove}`);
        console.log(response1.data)
        
        //manipulando os dados que preencherão a tabela
        let tableData = []
        response1.data.map(dados => tableData.push(
            <tr key = {dados.id}>
                <td>{dados.quantidadePaletes}</td>
                <td>{dados.produto}</td>
                <td>{dados.validade}</td>
                <td>{dados.codigoLote}</td>
                <td>{dados.quantidadeTotal}</td>
                <td>
                    <MDBBtn size="sm" color = "danger" onClick={() => this.deletarMoveItensVolume(parseInt(dados.lastId), parseInt(dados.quantidadePaletes), dados.idLoteitens, dados.id )} >
                        <MDBIcon icon="trash-alt"  size = "1x" />
                    </MDBBtn>
                </td>
            </tr>
        ))          
            this.setState({ tabelaMoveItensVolume: tableData })                                
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

    handleSubmission = async () => {
        
        var printWindow = window.open("", "Print Window","height=30cm,width=30cm")
        printWindow.document.write("<div style = 'width: 15cm;height:10cm;border-style: solid; border-width: 1px;'>");
        printWindow.document.write("<MDBRow><MDBCol>blablabla</MDBCol></MDBRow>");
        printWindow.document.write("<MDBRow><MDBCol>lote</MDBCol><MDBCol>validade</MDBCol></MDBRow>");
        printWindow.document.write("<MDBRow><MDBCol>num palete</MDBCol><MDBCol>peso total</MDBCol></MDBRow>");
        printWindow.document.write("</div>");
        printWindow.document.close();
    }

    calculateAutofocus = (a) => {
    if (this.state['formActivePanel' + a + 'Changed']) {
        return true
    }
    }

    getIdSupplier = async (childData) => {

        const cadastros1 = axios.create({
            baseURL: 'http://localhost:3333/move-itens/'
        }); 

        await cadastros1.get(`${this.state.idMove}`)  
        .then((response) => {
            if(response.data.length > 0){
                alert("Delete os produtos primeiro")
            } else {
                this.setState({idSupplier: childData})
            }
        })
        .catch((err)=>{})

        
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

    imprimir = async () => {
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/move-itens-volumes/'
        });      

        const response =  await cadastros.get(`${this.state.idMove}`);

        if(response.data.length !== 0){
            if (this.state.nf === '' || this.state.pedido === ""){
                alert("Verifique os campos da primeira tela")
            } else {
                await axios.put('http://localhost:3333/moves/:',{ //rota da atualização
                    id: this.state.idMove,

                    status: 2,        
                })
                window.open(`/entrada/impressao/${this.state.idMove}`, '_blank')
            }
        } else{
            alert("Nenhum produto cadastrado")
        }     
    }

    onHandleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })  
    }

    async componentDidUpdate (prevPros,prevState) {

        if(this.state.idSupplier !== prevState.idSupplier){
            const cadastros = axios.create({
                baseURL: 'http://localhost:3333/suppliers/'
            }); 
    
            await cadastros.get(`${this.state.idSupplier}`)
            .then((response) => {                
                this.setState({fornecedorNome: response.data.nomeFantasia})
            })         

            return false
        }        
    }

    async componentDidMount () {
        
        
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/moves/'
        }); 

        await cadastros.get(`${this.props.match.params.idMove}`)
        .then((response) => {
            console.log(response.data)
            if(response.data[0].status !== "1"){
                window.location.href = '/entrada';
            }
            if(response.data[0]){
                console.log() 
                this.setState({idMove: response.data[0].id}) 
                this.setState({nf: response.data[0].nf})     
                this.setState({pedido: response.data[0].pedido})           
                this.setState({idSupplier: response.data[0].idSupplier})
            }             
        })
        const cadastros1 = axios.create({
            baseURL: 'http://localhost:3333/move-itens/'
        }); 

        const response =  await cadastros1.get(`${this.state.idMove}`);
    
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
        const cadastros2 = axios.create({
            baseURL: 'http://localhost:3333/move-itens-volumes-tables/'
        }); 

        const response1 =  await cadastros2.get(`${this.state.idMove}`);
        console.log(response1.data)
        
        //manipulando os dados que preencherão a tabela
        let tableData1 = []
        response1.data.map(dados => tableData1.push(
            <tr key = {dados.id}>
                <td>{dados.quantidadePaletes}</td>
                <td>{dados.produto}</td>
                <td>{dados.validade}</td>
                <td>{dados.codigoLote}</td>
                <td>{dados.quantidadeTotal}</td>
                <td>
                    <MDBBtn size="sm" color = "danger" onClick={() => this.deletarMoveItensVolume(parseInt(dados.lastId), parseInt(dados.quantidadePaletes), dados.idLoteitens, dados.id )} >
                        <MDBIcon icon="trash-alt"  size = "1x" />
                    </MDBBtn>
                </td>
            </tr>
        ))          
            this.setState({ tabelaMoveItensVolume: tableData1 })
                   
    }

    render() {
    return (
        <div id = "divPrincipal" style = {{padding: "0em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}>
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
                                <MDBInput required onFocus = {(e) => e.target.autocomplete = "off"} autoComplete="new-password" id="laudo" value = {this.state.numLaudo} name = "numLaudo" label="Laudo" onChange = {this.onHandleChange} className="mt-4" autoFocus={this.calculateAutofocus(1)}  />                        
                            </MDBCol>

                            <MDBCol>
                                <MDBInput required onFocus = {(e) => e.target.autocomplete = "off"} autoComplete="off" name = "dataValidade" value = {this.state.dataValidade} type = "text" label = "Data de Validade" onChange = {this.onHandleChange} className="mt-4" min={dataHoje} onBlur= {(e) => {e.target.value !== "" ? e.target.type = "date" : e.target.type = "text" }} onFocus = {(e) => e.target.type = "date"} />
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>

                                <MDBCol>
                                    <MDBInput required onFocus = {(e) => e.target.autocomplete = "off"} name = "quantidadePalete" value = {this.state.quantidadePalete} min = "1" max = "50" type = "number" label="Nº de Paletes" onChange = {this.onHandleChange} className="mt-4"    />
                                    
                                </MDBCol>

                                <MDBCol>
                                    <MDBInput required onFocus = {(e) => e.target.autocomplete = "off"} onChange = {this.onHandleChange} value = {this.state.quantidadeProduto} name = "quantidadeProduto" type = "number" label="Quantidade do Produto" className="mt-4"  />

                                </MDBCol>
                        </MDBRow>          

                        <MDBRow >

                            <MDBCol >
                                <SelectItensVolumes click = {this.state.click} idMove = {this.state.idMove} getIdProduct = {this.getIdProduct} getIdMoveitens = {this.getIdMoveitens}/>
                                
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
                    
                        <TableDataFim idMove = {this.state.idMove} />
                        
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
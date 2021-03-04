import React, { Component } from 'react'
import { MDBRow, MDBCol, MDBInput, MDBBtn, MDBIcon } from 'mdbreact'
import axios from 'axios'

class PrintThisComponent extends Component {

    state ={
        fornecedor: "",
            laudo: "",
            produto: "",
            codigo: "",
            dataEntrada: "",
            dataValidade: "",
    }

    geraTabelaItens = async () => {
        const cadastros2 = axios.create({
            baseURL: 'http://localhost:3333/move-itens-volumess/'
        });

        const response =  await cadastros2.get(`${this.state.lastId}/${this.state.quantidadePaletes}`)

        let tableData = []
        response.data.map(dados => tableData.push(
            <tr key = {dados.id}>                    
                <td>{dados.id}</td>
                <td>{dados.codigo}</td>
                <td>{dados.leitura === true ? 
                    <MDBBtn color = "success" >
                        <MDBIcon icon="check" size = "1x" /> Lida
                    </MDBBtn>
                    : 
                    <MDBBtn color = "danger" >
                        <MDBIcon icon="times" size = "1x" /> Não Lida
                    </MDBBtn>}
                    
                </td>
            </tr>
        ))
        this.setState({tabela: tableData})
    }

    async componentDidMount () {
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/move-itens-volumes-tables/table/'
        });      

        await cadastros.get(`${this.props.match.params.id}`)
        .then(async response1 => {
            if(response1.data.idAnalysis === null){
                alert("erro")
            } else {
                this.setState({
                    fornecedor: response1.data.move.supplier.nomeFantasia,
                    laudo: response1.data.loteitens.laudo,
                    produto: response1.data.produto ,
                    lote: response1.data.loteitens.lote,
                    dataEntrada: response1.data.move.createdAt,
                    dataValidade: response1.data.loteitens.dataValidade,
                    lastId: response1.data.lastId,
                    quantidadePaletes: response1.data.quantidadePaletes,
                    idAnalysis: response1.data.idAnalysis
                })
                const cadastros1 = axios.create({
                    baseURL: 'http://localhost:3333/analysis-data/'
                });      
                console.log(this.state.idAnalysis)
                await cadastros1.get(`${this.state.idAnalysis}`)
                .then((response) => {
                    console.log(response.data)
                    this.setState({
                    pesoIntegral: response.data.quantidadeIntegral,
                    pesoGema: response.data.quantidadeGema,
                    pesoClara: response.data.quantidadeClara,
                    pesoCasca: response.data.quantidadeCasca,
                    })
                })
            }           
        })
        this.geraTabelaItens()
    }

    render() {   
        return (
            <div style = {{padding: "0em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}>
                <MDBRow style = {{marginTop: "1em"}}>
                    <MDBCol>
                        <label><strong>Fornecedor:</strong> {this.state.fornecedor}</label>
                    </MDBCol>
                </MDBRow>
    
                <MDBRow>
                    <MDBCol>
                        <label><strong>Produto:</strong> {this.state.produto}</label>
                    </MDBCol>
                    <MDBCol>
                        <label><strong>Lote:</strong> {this.state.lote}</label>
                    </MDBCol>
                </MDBRow>
    
                <MDBRow>
                    <MDBCol>
                        <label><strong>Entrada:</strong> {this.state.dataEntrada}</label>
                    </MDBCol>
                    <MDBCol>
                        <label><strong>Validade:</strong> {this.state.dataValidade}</label>
                    </MDBCol>
                </MDBRow>
    
                <form onSubmit = {this.handleSubmit} >
                    <MDBRow>
    
                        <MDBCol>
                            <MDBInput disabled onFocus = {(e) => e.target.autocomplete = "off"} name = "pesoIntegral" value = {this.state.pesoIntegral} label="Peso Integral" required onChange = {this.handleChange} />
                        </MDBCol>
    
                        <MDBCol>
                            <MDBInput disabled onFocus = {(e) => e.target.autocomplete = "off"} name = "pesoGema" value = {this.state.pesoGema} label="Peso da Gema" required onChange = {this.handleChange} />
                        </MDBCol>
    
                    </MDBRow>
                    <MDBRow>
    
                        <MDBCol>
                            <MDBInput disabled onFocus = {(e) => e.target.autocomplete = "off"} name = "pesoClara" value = {this.state.pesoClara} label="Peso da Clara do ovo" required onChange = {this.handleChange} />
                        </MDBCol>
    
                        <MDBCol>
                            <MDBInput disabled onFocus = {(e) => e.target.autocomplete = "off"} name = "pesoCasca" value = {this.state.pesoCasca} label="Peso da Casca do ovo" required onChange = {this.handleChange} />
                        </MDBCol>
    
                    </MDBRow>                         
                </form>
                
                <div className = "border p-4 mb-4 mt-4 overflow-auto">
                    <table class="table responsive align-middle">
                        <thead>
                            <tr>
                            <th scope="col">#id</th>
                            <th scope="col">Codigo</th>
                            <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
    
                            {this.state.tabela}
    
                        </tbody>
                    </table>
                </div>
                
            </div>
        )
  }
}

export default PrintThisComponent
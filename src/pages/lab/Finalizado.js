import React, { Component } from 'react'
import { MDBRow, MDBCol, MDBInput, MDBBtn, MDBIcon } from 'mdbreact'

import api from '../../services/api'

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

        api.get(`/move-itens-volumes/loteitens/${this.props.match.params.id}`)
        .then(async response => {
            let tableData = []
            response.data.map(dados => tableData.push(
                <tr key = {dados.id}>                    
                    <td>{dados.id}</td>
                    <td>{dados.codigo}</td>
                    <td  style = {{textAlign: "right"}} >{dados.leitura === true ? 
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
        })    
    }

    async componentDidMount () {

        await api.get(`/lotes/${this.props.match.params.id}`)
        .then(async response => {
            this.setState({
                fornecedor: response.data.moveitens.move.supplier.nomeFantasia,
                laudo: response.data.laudo,
                produto: response.data.moveitens.product.nome,
                lote: response.data.lote,
                dataEntrada: response.data.createdAt,
                dataValidade: response.data.dataValidade,
                pesoIntegral: response.data.analysis.analysisdata.quantidadeIntegral,
                pesoGema: response.data.analysis.analysisdata.quantidadeGema,
                pesoClara: response.data.analysis.analysisdata.quantidadeClara,
                pesoCasca: response.data.analysis.analysisdata.quantidadeCasca
            })
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
                
                <div className = "border p-4 mb-4 mt-4 overflow-auto" style = {{ height: "500px", borderRadius: "10px", border: "2px solid", borderColor: "black" }}>
                    <table className="table responsive align-right">
                        <thead>
                            <tr>
                            <th scope="col">#id</th>
                            <th scope="col">Codigo</th>
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
import React, { Component } from 'react'
import { MDBRow, MDBCol, MDBPopover, MDBInput, MDBBtn, MDBPopoverHeader, MDBPopoverBody, MDBIcon, MDBContainer } from 'mdbreact'

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

    async componentDidMount () {
        await api.get(`/lotes/${this.props.match.params.id}`)
        .then(async response => {
            console.log(response.data)
            if ( response.data.analysis) {
                if ( response.data.analysis.status === "2" ) {
                    window.location.href = '/laboratorio'
                }
            }
            
            this.setState({
                fornecedor: response.data.moveitens.move.supplier.nomeFantasia,
                laudo: response.data.laudo,
                produto: response.data.moveitens.product.nome,
                lote: response.data.lote,
                dataEntrada: response.data.createdAt,
                dataValidade: response.data.dataValidade,
                quantidadePaletes: response.data.moveitensvolume.length,
                idLoteitens: response.data.id,
                idProduct: response.data.moveitens.idProduct,
                idAnalysis: response.data.analysis === null ? 0 : response.data.analysis.id,
                idMove: response.data.moveitens.idMove,
            })
        })
        this.geraTabelaItens()

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
        window.onload = function() {
            document.getElementById("leitura").focus();
        };
    }

    lerRegistro = async (event) => {

        event.preventDefault()  

        await api.get(`/move-itens-volumes/codigo/${this.state.leitura}`)
        .then(async response => {
            if(response.data){
                await api.put('/move-itens-volumes',{
                    leitura: true,       
                    id: response.data.id 
                })
                this.geraTabelaItens()
            } else {
                alert("Palete não cadastrado ou não pertence a esse lote")
            }
        })
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleSubmit = async (event) => {

        event.preventDefault()
        console.log(this.state.idAnalysis)
        console.log(this.state.idMove)

        if(this.state.idAnalysis === 0){
            await api.post('/analyses', {
            idProduct: this.state.idProduct,
            idLoteitens: this.state.idLoteitens,
            status: 2,
            createdBy: 1,
            })
            .then(async (response) => {
                this.setState({idAnalysis: response.data.id})

            })
            .catch((err) => console.log(err))
        } else {
            await api.put(`/analyses`,{
                id: this.state.idAnalysis,
                status: 2,
            })
            .then((response) => {
            })
        }        

        await api.post('/analysis-data', {
            idAnalysis: this.state.idAnalysis,
            quantidadeIntegral: this.state.pesoIntegral,
            quantidadeGema: this.state.pesoGema,
            quantidadeCasca: this.state.pesoCasca,
            quantidadeClara: this.state.pesoClara,
            createdBy: 1,
        })
        .then((response) => {
            console.log(response.data)
        })
        .catch((err) => console.log(err))

        await api.put('/moves',{
            status: 3,       
            id: this.state.idMove 
        })        
        window.open(`/laboratorio`, '_self')
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
                        <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} name = "pesoIntegral" label="Peso Integral" required onChange = {this.handleChange} />
                    </MDBCol>

                    <MDBCol>
                        <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} name = "pesoGema" label="Peso da Gema" required onChange = {this.handleChange} />
                    </MDBCol>

                </MDBRow>
                <MDBRow>

                    <MDBCol>
                        <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} name = "pesoClara" label="Peso da Clara do ovo" required onChange = {this.handleChange} />
                    </MDBCol>

                    <MDBCol>
                        <MDBInput onFocus = {(e) => e.target.autocomplete = "off"} name = "pesoCasca" label="Peso da Casca do ovo" required onChange = {this.handleChange} />
                    </MDBCol>

                </MDBRow>                         
                <div className="text-center mt-1-half"  >
                    <MDBPopover
                        placement="left"
                        popover
                        clickable 
                    >

                        {/* botao de salvamento com popover */}
                        <MDBBtn color = "primary" >
                            Finalizar Análise
                        </MDBBtn>
                        <div>
                            <MDBPopoverHeader><strong>Confirmar Lançamento</strong></MDBPopoverHeader>
                            <MDBPopoverBody>
                                Confirme os dados, eles não poderão ser alterados posteriormente

                                <div>
                                    {/* botao de confirmação de cadastro */}
                                    <MDBBtn color = "success" type = "submit">
                                        <MDBIcon icon="check" size = "1x" />
                                    </MDBBtn>

                                    {/* botao de cancelar cadastro */}
                                    <MDBBtn color = "danger" onClick={() => window.location.reload()} >
                                        <MDBIcon icon="times" size = "1x" />
                                    </MDBBtn>
                                </div>
                            </MDBPopoverBody>
                        </div>
                    </MDBPopover>
                </div> 
            </form>
            <form onSubmit = {this.lerRegistro} >
                <MDBContainer>
                    <MDBRow className = "mt-3">

                        <MDBCol  >
                            <MDBInput id = "leitura" onFocus = {(e) => e.target.autocomplete = "off"} required name = "leitura" label="Leitura" onChange = {this.handleChange} />
                        </MDBCol>

                    </MDBRow>

                    <MDBRow center >

                        <MDBCol size = "3" className = " mt-3 float-right">
                            <MDBBtn type = "submit" color = "primary" >Ler</MDBBtn>
                        </MDBCol>

                    </MDBRow> 

                </MDBContainer>
            </form>     
            
            <div className = "border p-4 mb-4 mt-4 overflow-auto" style = {{ height: "500px", borderRadius: "10px", border: "2px solid", borderColor: "black" }}>
                <table className="table responsive align-middle">
                    <thead>
                        <tr>
                        <th scope="col">#id</th>
                        <th scope="col">Codigo</th>
                        <th scope="col" style = {{textAlign: "right"}}>Status</th>
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
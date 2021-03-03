import React, { Component } from 'react'
import { MDBRow, MDBCol, MDBPopover, MDBInput, MDBBtn, MDBPopoverHeader, MDBPopoverBody, MDBIcon } from 'mdbreact'
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

    async componentDidMount () {
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/move-itens-volumes/volume/'
        });      

        const response1 =  await cadastros.get(`${this.props.match.params.id}`)
        this.setState({
            fornecedor: response1.data.moveitens.move.supplier.nomeFantasia,
            laudo: response1.data.lote.numLaudo,
            produto: response1.data.moveitens.product.nome,
            codigo: response1.data.codigo,
            dataEntrada: response1.data.moveitens.move.createdAt,
            dataValidade: response1.data.lote.dataValidade,
            idProduct: response1.data.moveitens.idProduct,
            idLoteitens: response1.data.idLoteitens,
            idMoveitens: response1.data.idMoveitens,
        })
        
        console.log(response1.data)
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        await axios.post('http://localhost:3333/analysis', {
                idProduct: this.state.idProduct,
                idLoteitens: this.state.idLoteitens,
                status: 2,
                createdBy: 1,
                updatedBy: 1
        })
        .then(async (response) => {
            this.setState({idAnalysis: response.data.id})
        })
        .catch(function (error) {
            if (error.response) {
                alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
                console.log(error.response);
            }
        })

        await axios.post('http://localhost:3333/analysis-data', { 
            quantidadeIntegral: this.state.pesoIntegral,
            quantidadeGema: this.state.pesoGema,
            quantidadeClara: this.state.pesoClara,
            quantidadeCasca: this.state.pesoCasca,
            createdBy: 1,
            updatedBy: 1,
            idAnalysis: this.state.idAnalysis,
            idMoveitensvolume: this.props.match.params.id,
            idProduct: this.state.idProduct
        })
        .then(async (res) => {
            alert('Cadastrado com sucesso');
        })
        .catch(function (error) {
            if (error.response) {
                alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
                console.log(error.response);
        }})
    }

    render() {   
    return (
        <div style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}>
            <MDBRow style = {{marginTop: "1em"}}>
                <MDBCol>
                    <label><strong>Fornecedor:</strong> {this.state.fornecedor}</label>
                </MDBCol>
                <MDBCol>
                    <label><strong>Laudo:</strong> {this.state.laudo}</label>
                </MDBCol>
            </MDBRow>

            <MDBRow>
                <MDBCol>
                    <label><strong>Produto:</strong> {this.state.produto}</label>
                </MDBCol>
                <MDBCol>
                    <label><strong>Codigo:</strong> {this.state.codigo}</label>
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

            <form action="" method="post" onSubmit = {this.handleSubmit} >
                <MDBRow>

                    <MDBCol>
                        <MDBInput disabled name = "pesoIntegral" label="Peso Integral" required onChange = {this.handleChange} />
                    </MDBCol>

                    <MDBCol>
                        <MDBInput disabled name = "pesoGema" label="Peso da Gema" required onChange = {this.handleChange} />
                    </MDBCol>

                </MDBRow>
                <MDBRow>

                    <MDBCol>
                        <MDBInput name = "pesoClara" label="Peso da Clara do ovo" required onChange = {this.handleChange} />
                    </MDBCol>

                    <MDBCol>
                        <MDBInput name = "pesoCasca" label="Peso da Casca do ovo" required onChange = {this.handleChange} />
                    </MDBCol>

                </MDBRow>                         
                <div className="text-center mt-1-half">
                    <MDBPopover
                        placement="left"
                        popover
                        clickable 
                    >

                        {/* botao de salvamento com popover */}
                        <MDBBtn color = "primary" >
                            Salvar
                        </MDBBtn>
                        <div>
                            <MDBPopoverHeader><strong>Confirmar Lançamento</strong></MDBPopoverHeader>
                            <MDBPopoverBody>
                                Confirme os dados, eles não poderão ser alterados posteriormente

                                <div>
                                    {/* botao de confirmação da exclusão */}
                                    <MDBBtn color = "success" type = "submit">
                                        <MDBIcon icon="check" size = "1x" />
                                    </MDBBtn>

                                    {/* botao de cancelar a exclusão */}
                                    <MDBBtn color = "danger" onClick={() => window.location.reload()} >
                                        <MDBIcon icon="times" size = "1x" />
                                    </MDBBtn>
                                </div>
                            </MDBPopoverBody>
                        </div>
                    </MDBPopover>
                </div> 
            </form>
        </div>
    )
  }
}

export default PrintThisComponent
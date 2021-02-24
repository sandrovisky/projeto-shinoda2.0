import React, { Component } from 'react';
import { MDBDataTable, MDBBtn, MDBIcon, MDBInput, MDBModal, MDBModalHeader, MDBModalBody, MDBRow, MDBCol, MDBPopoverHeader, MDBPopover, MDBPopoverBody } from 'mdbreact';

import axios from 'axios'

export default class TabelaEntrada extends Component{

    state = {
        data: {
            columns: [{
                label: 'Análise',
                field: 'id',
                sort: 'asc',
              },
              {
                label: 'Lote',
                field: 'lote',
                sort: 'asc',
              },
              {
                label: 'Produto',
                field: 'produto',
                sort: 'asc',
              },
              {
                label: 'Validade',
                field: 'validade',
                sort: 'asc',
              },
              {
                label: 'Ações',
                field: 'action',
                sort: 'asc',
              }
            ],
            data: []
        },
        dadosAnalise: {
            fornecedor: "fornecedor",       
            laudo: "laudo",
            produto: "produto",
            dataEntrada: "dataentrada",
            dataValidade:  "datavalidade",
            codigo: 'codigo'
        },
        codigoLote: ''
    }

    //função q cria analise com banco de dados
    SalvarAnalise = async () => {
        await axios.post('http://localhost:3333/analysis', {
            idProduct: this.state.dadosAnalise.idProduct,
            idLoteitens: this.state.dadosAnalise.idLoteitens,
            status: 1,
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
        window.location.reload()
    }    

    //busca dados inseridos no bando de dados nos states
    obtemDados = async () => {

        //obtendo os dados da rota
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/lotes/'
        }); 
        let x = this.state.codigoLote.toString()
        const response =  await cadastros.get(`${x}`);

        if (response.data === null ) {
            alert("Codigo do lote nao encontrado")
            return false
            
        } else {
            this.setState(prevState => {
                let dadosAnalise = Object.assign({}, prevState.dadosAnalise);  
                dadosAnalise.fornecedor = response.data.moveitens.move.supplier.nomeFantasia;       
                dadosAnalise.laudo = response.data.numLaudo;
                dadosAnalise.produto = response.data.moveitens.product.nome;
                dadosAnalise.dataEntrada = response.data.moveitens.move.createdAt;
                dadosAnalise.dataValidade =  response.data.dataValidade;
                dadosAnalise.codigo = response.data.codigo
                dadosAnalise.idProduct =  response.data.moveitens.idProduct
                dadosAnalise.idLoteitens = response.data.id
                dadosAnalise.idAnalysis = response.data.analysis === null ? 0 : response.data.analysis.id  
                dadosAnalise.idMoveitensvolume =  response.data.moveitensvolume.id
                return { dadosAnalise };                                 
            })
            return true
        }        
    }

    //Lança dos dados na análise
    LancarAnalise = async () => {

        await axios.post('http://localhost:3333/analysis', {
            idProduct: this.state.dadosAnalise.idProduct,
            idLoteitens: this.state.dadosAnalise.idLoteitens,
            status: 1,
            createdBy: 1,
            updatedBy: 1
        })
        .then(async function () {
            alert('Cadastrado com sucesso');
        })
        .catch(function (error) {
            if (error.response) {
                alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
                console.log(error.response);
            }
        })

        window.location.reload()
    }

    //Função responsavel por abertura e fechamento do modal de VerificaLote
    toggleVerificaLote = () => {
        this.setState({
            modalVerificaLote: !this.state.modalVerificaLote
        });
    };
    
    coleta = async (codigo) => {
        await this.setState({verificaCod: 0})
        await this.setState({codigoLote: codigo})
        this.obtemDados()
        this.toggleColeta2()
    }

    //Função responsavel por abertura e fechamento do modal de coleta
    toggleColeta2 = () => {
        if (this.state.modalColeta === true){
            this.setState({
                modalColeta: !this.state.modalColeta
            });
        };
        
        this.setState({
            modalColeta2: !this.state.modalColeta2
        })
    };

    //Função responsavel por abertura e fechamento do modal lançamento
    toggleLancamento = (codigo) => {
        this.toggleVerificaLote()
        this.setState({verificaCod: codigo})
    };

    //Função responsavel por abertura e fechamento do modal de finalizado
    toggleFinalizado = async ( codigo ) => {
        this.setState({
            modalFinalizado: !this.state.modalFinalizado
        });
    };

    //funcao q pega os dados para o modal de finalizado
    Finalizado = async (codigo) => {
        await this.setState({verificaCod: 0})
        await this.setState({codigoLote: codigo})
        this.obtemDados()
        this.toggleFinalizado()
    }

    //Função responsavel por abertura e fechamento do modal de coleta
    toggleNovaAnalise = () => {
        this.setState({
            modalNovaAnalise: !this.state.modalNovaAnalise
        });
    };

    //Função responsavel por abertura e fechamento do modal de coleta
    toggleNovaAnalise2 = async () => {
        if (this.state.modalNovaAnalise === true){
            this.setState({
                modalNovaAnalise: !this.state.modalNovaAnalise
            });    
        }
        this.setState({
            modalNovaAnalise2: !this.state.modalNovaAnalise2
        });       
    };

    handleChangeCodigoLote = (e) => {
        this.setState({codigoLote: e.target.value})
    }

    //função que pega o codigo inserido para criar os campos no modal de analise
    handleSubmit = async e => {
        e.preventDefault()
        this.setState({verificaCod: 0}) 
        const x = await this.obtemDados()
        if(x){
            this.toggleNovaAnalise2()
        }
    }

    // //
    // handleSubmitColeta = async e => {
    //     e.preventDefault()
    //     this.setState({verificaCod: 0}) 
    //     const x = await this.obtemDados()
    //     if(x){            
    //         this.toggleColeta2()
    //     }
        
    // }

    //função q compara o codigo inserido com o que pertence ao lote
    handleSubmitVerificaLote = async e => {
        e.preventDefault()

        if(this.state.verificaCod === this.state.codigoLote) {
            this.obtemDados()
            this.toggleVerificaLote()
            this.toggleColeta2()
        } else {
            alert("Codigo do lote diferente")
        }
        
    }

    //FUNÇÃO Q SALVA OS DADOS DIGITADOS NO FORMULARIO DE COLETA
    handleSubmitFormularioAnalise = async (e) => {

        e.preventDefault()     
        
        if (this.state.verificaCod !== 0){
            alert(this.state.idMoveitensvolume)
            await axios.put('http://localhost:3333/analysis/:', {
                id: this.state.dadosAnalise.idAnalysis,
                status: 0,
                createdBy: 1,
                updatedBy: 1
            })
            .then(async function () {
                alert('Cadastrado com sucesso');
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
                idAnalysis: this.state.dadosAnalise.idAnalysis,
                idMoveitensvolume: this.state.dadosAnalise.idMoveitensvolume,
                idProduct: this.state.dadosAnalise.idProduct
            })
            .then(async function () {
                alert('Cadastrado com sucesso');
            })
            .catch(function (error) {
                if (error.response) {
                    alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
                    console.log(error.response);
            }})

        } else {
            await axios.post('http://localhost:3333/analysis', {
                idProduct: this.state.dadosAnalise.idProduct,
                idLoteitens: this.state.dadosAnalise.idLoteitens,
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
                idMoveitensvolume: this.state.dadosAnalise.idMoveitensvolume,
                idProduct: this.state.dadosAnalise.idProduct
            })
            .then(async (res) => {
                console.log(res)
                alert('Cadastrado com sucesso');
            })
            .catch(function (error) {
                if (error.response) {
                    alert("ERRO: "+error.response.status+ "\n" +error.response.data.message);
                    console.log(error.response);
            }})          
        }      
        window.location.reload()
    }

    handleChangePesoIntegral = (e) => {
        this.setState({pesoIntegral: e.target.value})
    }

    handleChangePesoClara = (e) => {
        this.setState({pesoClara: e.target.value})
    }

    handleChangePesoGema = (e) => {
        this.setState({pesoGema: e.target.value})
    }

    handleChangePesoCasca = (e) => {
        this.setState({pesoCasca: e.target.value})
    }

    //fazendo uma requisição para API e manipulando os dados para serem preenchidos na tabela
    async componentDidMount() {

        //obtendo os dados da rota
        const cadastros = axios.create({
            baseURL: 'http://localhost:3333/lotes'
        }); 

        const response =  await cadastros.get('');
        let rows = []

        //manipulando os dados que preencherão a tabela
        response.data.map(dados => rows.push({
            id: dados.analysis === null ? "" : dados.analysis.id,       
            lote: dados.codigo,
            produto: dados.moveitens.product.nome,
            validade: dados.dataValidade,
            action:  (dados.analysis === null) ? (<MDBBtn onClick={() =>this.coleta(dados.codigo)} color="primary">Coletar</MDBBtn>) : 
                (parseInt(dados.analysis.status) === 1 ? <MDBBtn onClick={() =>this.toggleLancamento(dados.codigo)} color="warning">Lançar</MDBBtn> : <MDBBtn onClick={() => this.Finalizado(dados.codigo)} color="success">Finalizado</MDBBtn> )        
        }))

        this.setState(prevState => {
            let data = Object.assign({}, prevState.data); 
            data.rows = rows;                            
            return { data };                      
        })    
    }
    
    render(){
        
        return (
            <div style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 3em 0 3em"}}>

                <h1 style = {{textAlign: 'center'}} >Laboratório</h1><br/><br/>
                <MDBBtn onClick = {this.toggleNovaAnalise} color = "primary" >
                    
                    <><MDBIcon icon="plus" size = "1x" /> Nova Análise</> 
                </MDBBtn>
                <MDBDataTable responsive
                striped
                bordered
                data={this.state.data}
                style = {{fontSize: "20px", textAlign: "center"}}
                />
                
                {/* MODAL DE COLETA  */}
                <MDBModal
                    isOpen={this.state.modalColeta2}
                    toggle={this.toggleColeta2}
                    size="md"
                    cascading
                    width = "600px"
                >
                    <MDBModalHeader
                        toggle={this.toggleColeta2}
                        titleClass="d-inline title"
                        className="text-center black darken-3 white-text"
                    >
                        <>Dados da Análise</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <MDBRow>
                            <MDBCol>
                                <label>Fornecedor: {this.state.dadosAnalise.fornecedor}</label>
                            </MDBCol>
                            <MDBCol>
                                <label>Laudo: {this.state.dadosAnalise.laudo}</label>
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>
                            <MDBCol>
                                <label>Produto: {this.state.dadosAnalise.produto}</label>
                            </MDBCol>
                            <MDBCol>
                                <label>Codigo: {this.state.dadosAnalise.codigo}</label>
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>
                            <MDBCol>
                                <label>Entrada: {this.state.dadosAnalise.dataEntrada}</label>
                            </MDBCol>
                            <MDBCol>
                                <label>Validade: {this.state.dadosAnalise.dataValidade}</label>
                            </MDBCol>
                        </MDBRow>

                        <form action="" method="post" onSubmit = {this.handleSubmitFormularioAnalise} >
                            <MDBRow>

                                <MDBCol>
                                    {this.state.pesoIntegral}
                                    <MDBInput label="Peso Integral" required onChange = {this.handleChangePesoIntegral} />
                                </MDBCol>

                                <MDBCol>
                                    <MDBInput label="Peso da Gema" required onChange = {this.handleChangePesoGema} />
                                </MDBCol>

                            </MDBRow>
                            <MDBRow>

                                <MDBCol>
                                    <MDBInput label="Peso da Clara do ovo" required onChange = {this.handleChangePesoClara} />
                                </MDBCol>

                                <MDBCol>
                                    <MDBInput label="Peso da Casca do ovo" required onChange = {this.handleChangePesoCasca} />
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
                    </MDBModalBody>
                </MDBModal>
   
                {/* MODAL LANÇAR */}
                <MDBModal
                    isOpen={this.state.modalLancamento}
                    toggle={this.toggleLancamento}
                    size="md"
                    cascading
                >
                    <MDBModalHeader
                        toggle={this.toggleLancamento}
                        titleClass="d-inline title"
                        className="text-center black darken-3 white-text"
                    >
                        <MDBIcon icon="dolly" />
                        <>   modal lançamento</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <MDBInput label="Nome Fantasia" onChange = {this.handleChangeNomeFantasia} />
                        <MDBInput label="Razão Social"  onChange = {this.handleChangeRazaoSocial} />
                        <MDBInput label="Endereço" onChange = {this.handleChangeEndereco}  />
                        <MDBInput label="CNPJ"  onChange = {this.handleChangeCnpj} />
                        <div className="text-center mt-1-half">
                            <MDBBtn
                                color="info"
                                className="mb-2"
                                onClick={this.cadastrar}
                            >
                                Cadastrar
                            <MDBIcon icon="plus" className="ml-1" />
                            </MDBBtn>
                        </div>
                    </MDBModalBody>
                </MDBModal>

                {/* MODAL FINALIZADO */}
                <MDBModal
                    isOpen={this.state.modalFinalizado}
                    toggle={this.toggleFinalizado}
                    size="md"
                    cascading
                >
                    <MDBModalHeader
                        toggle={this.toggleFinalizado}
                        titleClass="d-inline title"
                        className="text-center black darken-3 white-text"
                    >
                        <MDBIcon icon="dolly" />
                        <>   modal finalizado</>
                    </MDBModalHeader>

                    <MDBModalBody>

                        <MDBRow>
                            <MDBCol>
                                <label>Fornecedor: {this.state.dadosAnalise.fornecedor}</label>
                            </MDBCol>
                            <MDBCol>
                                <label>Laudo: {this.state.dadosAnalise.laudo}</label>
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>
                            <MDBCol>
                                <label>Produto: {this.state.dadosAnalise.produto}</label>
                            </MDBCol>
                            <MDBCol>
                                <label>Codigo: {this.state.dadosAnalise.codigo}</label>
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>
                            <MDBCol>
                                <label>Entrada: {this.state.dadosAnalise.dataEntrada}</label>
                            </MDBCol>
                            <MDBCol>
                                <label>Validade: {this.state.dadosAnalise.dataValidade}</label>
                            </MDBCol>
                        </MDBRow>

                        <div className="text-center mt-1-half">
                            <MDBBtn
                                color="danger"
                                className="mb-2"
                                onClick={this.toggleFinalizado}
                            >
                                Sair
                            </MDBBtn>
                        </div>

                    </MDBModalBody>
                </MDBModal>

                {/* MODAL NOVA ANALISE 1/2 */}
                <MDBModal
                    isOpen={this.state.modalNovaAnalise}
                    toggle={this.toggleNovaAnalise}
                    size="md"
                    cascading
                >
                    <MDBModalHeader
                        toggle={this.toggleNovaAnalise}
                        titleClass="d-inline title"
                        className="text-center black darken-3 white-text"
                    >
                        <>   Nova Análise</>
                    </MDBModalHeader>

                    <MDBModalBody>
                        <form action="" method="post" onSubmit = {this.handleSubmit} >
                            <MDBInput label="INSIRA O CODIGO DO LOTE" required size = "lg" onChange = {this.handleChangeCodigoLote} />
                            <div className="text-center mt-1-half">
                                <MDBBtn
                                    type = "submit"
                                    color="info"
                                    className="mb-2"
                                >
                                    Avançar
                                <MDBIcon icon="plus" className="ml-1" />
                                </MDBBtn>
                            </div> 
                        </form>
                        
                    </MDBModalBody>
                </MDBModal>

                {/* MODAL NOVA ANALISE 2/2 */}
                <MDBModal
                    isOpen={this.state.modalNovaAnalise2}
                    toggle={this.toggleNovaAnalise2}
                    size="md"
                    cascading
                >
                    <MDBModalHeader
                        toggle={this.toggleNovaAnalise2}
                        titleClass="d-inline title"
                        className="text-center black darken-3 white-text"
                    >
                        
                        <>Dados da Análise</>
                    </MDBModalHeader>

                    <MDBModalBody>

                        <MDBRow>
                            <MDBCol>
                                <label>Fornecedor: {this.state.dadosAnalise.fornecedor}</label>
                            </MDBCol>
                            <MDBCol>
                                <label>Laudo: {this.state.dadosAnalise.laudo}</label>
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>
                            <MDBCol>
                                <label>Produto: {this.state.dadosAnalise.produto}</label>
                            </MDBCol>
                            <MDBCol>
                                <label>Codigo: {this.state.dadosAnalise.codigo}</label>
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>
                            <MDBCol>
                                <label>Entrada: {this.state.dadosAnalise.dataEntrada}</label>
                            </MDBCol>
                            <MDBCol>
                                <label>Validade: {this.state.dadosAnalise.dataValidade}</label>
                            </MDBCol>
                        </MDBRow>

                        <div className="text-center mt-1-half">
                            <MDBBtn
                                color="info"
                                className="mb-2"
                                onClick={this.SalvarAnalise}
                            >
                                Salvar
                            <MDBIcon icon="plus" className="ml-1" />
                            </MDBBtn>
                        </div>

                    </MDBModalBody>
                </MDBModal>

                {/* MODAL DE VERIFICAR LOTE */}
                <MDBModal
                    isOpen={this.state.modalVerificaLote}
                    toggle={this.toggleVerificaLote}
                    size="md"
                    cascading
                >
                    <MDBModalHeader
                        toggle={this.toggleVerificaLote}
                        titleClass="d-inline title"
                        className="text-center black darken-3 white-text"
                    >
                        <>Insira o codigo do lote</>
                    </MDBModalHeader>

                    <MDBModalBody>
                    <form action="" method="post" onSubmit = {this.handleSubmitVerificaLote} >
                        <MDBInput label="INSIRA O CODIGO DO LOTE" required size = "lg" onChange = {this.handleChangeCodigoLote} />
                        <div className="text-center mt-1-half">
                            <MDBBtn
                                type = "submit"
                                color="info"
                                className="mb-2"
                            >
                                Avançar
                            <MDBIcon icon="plus" className="ml-1" />
                            </MDBBtn>
                        </div> 
                    </form>
                    </MDBModalBody>
                </MDBModal>


            </div>                     
        )
    }
}




await api.post('/lotes', {
    laudo: this.state.laudo,
    dataValidade: this.state.dataValidade,
    idMoveitens: this.state.idMoveitens,
    quantidadeTotal: this.state.quantidadeProduto,
    lote: this.state.lote,
    createdBy: 1,
    updatedBy: 1
})
.then((response) => {
    this.setState({idLoteitens: response.data.id})
    this.setState({codigo: response.data.codigo})
})
.catch((err) => console.log(err))

for(let i = 0;i < parseInt(this.state.quantidadePalete); i++){
    await api.post('/move-itens-volumes', {
    idMoveitens: this.state.idMoveitens,
    idLoteitens: this.state.idLoteitens,
    quantidadePaletes: this.state.quantidadePalete,
    quantidadeTotal: this.state.quantidadeProduto,
    createdBy: 1,
    updatedBy: 1
    })
    .then((response) => {
        this.setState({idMoveitensvolumesLast: response.data.id})
    })
    .catch((err) => console.log(err))
}

const resProduct =  await api.get(`/products/${this.state.idProduct}`);

await api.post('/move-itens-volumes-tables', {
    quantidadePaletes: this.state.quantidadePalete,
    validade: this.state.dataValidade,
    idMove: this.state.idMove,
    lote: this.state.lote,
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
})
.catch((err) => console.log(err))

const response1 =  await api.get(`/move-itens-volumes-tables/${this.state.idMove}`);

//manipulando os dados que preencherão o datatable de volume itens
let tableData = []
if(response1.data !== null){
    response1.data.map(dados => tableData.push(
        <tr key = {dados.id}>
            <td>{dados.quantidadePaletes}</td>
            <td>{dados.produto}</td>
            <td>{dados.validade}</td>
            <td>{dados.loteitens.lote}</td>
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
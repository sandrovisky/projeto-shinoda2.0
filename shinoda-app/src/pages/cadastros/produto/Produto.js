import {Component} from 'react'
import Tabela from './TabelaProduto'
import Modal from './CadastroProdutoModal'

export default class Produto extends Component {

    render () {
        
        return (
            <div style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}> 

                <h1 style = {{textAlign: 'center'}} >Produtos</h1>

                <Tabela />

                <Modal />

            </div>
        )
    }
}
import {Component} from 'react'
import Tabela from './TabelaEquipamento'
import Modal from './CadastroEquipamentoModal'

export default class Equipamento extends Component {

    render () {
        
        return (
            <div style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em"}}> 

                <h1 style = {{textAlign: 'center'}} >Equipamentos</h1>

                <Tabela />

                <Modal />

            </div>
        )
    }
}
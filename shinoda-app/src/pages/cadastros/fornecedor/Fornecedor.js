import {Component} from 'react'
import Tabela from './Tabela'
import Modal from './CadastroModal'

export default class Fornecedor extends Component {

    render () {
        
        return (
            <div style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 3em 0 3em"}}> 

                <Tabela />

                <Modal />

            </div>
        )
    }
}
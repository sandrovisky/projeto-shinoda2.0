import {Component} from 'react'
import Tabela from './TabelaUsuario'
import Modal from './CadastroUsuarioModal'

export default class Usuario extends Component {

    render () {
        
        return (
            <div style = {{padding: "0em 2em 2em 2em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 3em 0 3em"}}> 

                <h1 style = {{textAlign: 'center'}} >Usuarios</h1>

                <Tabela />

                <Modal />

            </div>
        )
    }
}
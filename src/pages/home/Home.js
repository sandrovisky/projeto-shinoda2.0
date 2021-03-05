import {Component} from 'react'
import { MDBBtn } from 'mdbreact'

import logo from '../../assets/images/shinoda.jpg'

import Teste from './teste'

export default class Home extends Component {

    state = {
        texto: ''
    }

    onHandleChangetexto = (e) => {
        this.setState({texto: e.target.value})
    }
    
    render () {

        return (
            <div style = {{padding: "0em 1em 1em 1em", borderRadius: "10px", border: "2px solid", borderColor: "black", margin: "5em 1em 0 1em", textAlign: "center"}}>
                {logo}
             </div>
            
      )
    }
  }
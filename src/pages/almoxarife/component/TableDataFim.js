import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import React, { Component } from 'react';

import api from '../../../services/api'

export default class TabelaEntradaVolumes extends Component{   
    
    state = {
        tabela: []
    }

    componentDidMount  = async () => {               
        
    }

    render(){
        return (
            <div>
                {this.props.idMove}
                    
            </div>                     
        )
    }
}







import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';

import React from 'react';

import Navbar from './pages/nav/Navbar'
import Routes from './pages/root/routes'

class App extends React.Component {
    render(){
        return(
            <div>
                <Navbar />

                <Routes />
            </div>
        )
    }
}


export default App;

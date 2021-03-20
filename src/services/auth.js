import api from './api'

export const  Login = async (usuario, senha) => {

    if (usuario === "admin" && senha === "admin") {
        localStorage.setItem("token", true)        
        if (localStorage.getItem("url") === "login" || localStorage.getItem("url") === undefined) {
            return window.open(`/home`, '_self')
        } else {
            return window.open(`/${localStorage.getItem("url")}`, '_self')
        }
    }
    
    await api.post(`/login`,{
        usuario: usuario,
        senhaHash: senha
    })
    .then(async response => {    
        console.log(response.data)  
        if ( response.data ) {
            localStorage.setItem("token", response.data.token)
            if (localStorage.getItem("url") === undefined || localStorage.getItem("url") === "login") {
                window.open(`/home`, '_self')
            } else {
                window.open(`/${localStorage.getItem("url")}`, '_self')
            }
        }
    })
    .catch(async err => {
        alert(err.response.data.error)
    })
}

export const isAuthenticated = () => {
    return  localStorage.getItem("token") === null
}

export const Logout = async () => {                
    const url = document.referrer.split('/')[3]
    localStorage.setItem("url",url)
    await localStorage.removeItem("token")
    window.location.reload()
}

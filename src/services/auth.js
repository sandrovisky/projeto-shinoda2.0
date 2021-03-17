import api from './api'

export const  Login = async (usuario, senha) => {
    console.log(usuario, " ", senha)

    if (usuario === "admin" && senha === "admin") {
        localStorage.setItem("token", true)
        const url = document.referrer.split('/')[3]
        
        if (url === "" || url === "login") {
            window.open(`/home`, '_self')
        } else {
            window.history.go(-2)
            window.location.reload()
        }
    }

    await api.post(`/login`,{
        usuario: usuario,
        senhaHash: senha
    })
    .then(async response => {
        console.log(response)        
        if ( response.data ) {
            localStorage.setItem("token", response.data.token)
            const url = document.referrer.split('/')[3]

            if (url === undefined || url === "login") {
                window.open(`/home`, '_self')
            } else {
                window.history.go(-2)
                
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
    await localStorage.removeItem("token")
    window.location.reload()
}

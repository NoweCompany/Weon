export default {
    //urlApi: 'http://localhost:3300', //localhost
    urlApi: 'https://apiweon.nowecompany.com.br',
    urlWebsiteDefault: 'https://nowecompany.com.br/weon',
    urlWebsiteRelativa: () => {
        const urlWebsite = document.location.href
        let urlFormated = urlWebsite.split("/").splice(0, 5).join('/')

        if(urlFormated.charAt(urlFormated.length - 1) === '/'){
            urlFormated = urlFormated.slice(0, -1)
        } 

        return urlFormated
    }
}
export default class Presets {
    constructor(container, messaging, requests){
        this.messaging = messaging
        this.api = requests

        this.container = container
    }

    async preset() {
        this.messaging.cleanMsg()
        this.creteTablePresets()
    }

    maiorLength(data) {
        let maiorLength = 0

        for (const preset of data.response) {
            for (let i = 0; i < preset.fields.length; i++) {
                if (i > maiorLength) maiorLength = i
            }
        }

        return maiorLength
    }

    event() {
        document.addEventListener('click', (e) => {
            const el = e.target
            const id = el.getAttribute('id')
            if (id === 'createPreset') this.rederFormPreset()
            if (id === 'cancelPresetForm') this.preset()
        })  
    }

    async createPreset(e) {
        try {
            e.preventDefault()

            const namePreset = document.querySelector('#name').value

            if (!namePreset) {
                return this.messaging.msg('Campo vazio', false)

            }
            const response = await this.api.postApiPreset(namePreset)
            if (!response) return
            
            this.messaging.msg(response.success, true)
            return this.preset()
        } catch (error) {
            return this.messaging.msg(error.message, false)
        }   
    }

    rederFormPreset() {
        this.container.innerHTML = `
        <form id="formPreset">
            <h1> Criar Predefinição </h1>
            <div>
                <label for="name">Nome</label>
                <input type="text" id="name">
            </div>

            <div class="btn1">
            <input type="button"  id="cancelPresetForm" value=" x " />
            </div>
            <div class="btn2">
                <input type="submit"  id="createPresetForm" value=" Próximo" />
            </div> 
        </form>   
        `
        const formPreset = document.querySelector('#formPreset')
        formPreset.addEventListener('submit', e => this.createPreset(e))
    }

    rederTable() {
        this.container.innerHTML = `
        
        <h1 id="tituloPrincipal" class="display-6">Predefinições</h1>


        <div class="table-container">
        <table>
            <thead>
                <tr id="thead">
                    <th>Campos</th>
                </tr>
            </thead>
            <tbody id="tbody"></tbody>
        </table>
    </div>
    <button id="createPreset" class="criarnovatabela">Criar</button>
    
        `
    }

    async creteTablePresets() {
        try {
            
            const data = await this.api.getApiPresets()
            if(data.length <= 0) {
                this.messagin.msg('Não há nehuma tabela crida')
            }
            this.rederTable()
            this.event()

            const tbody = document.querySelector('#tbody')
            const thead = document.querySelector('#thead')

            //retorna a lengtn do maior array de 'fields'
            const maiorLength = this.maiorLength(data)

            //thead enumerado
            for (let i = 0; i <= maiorLength; i++) {
                const th = document.createElement('th')
                const thText = document.createTextNode(`${i + 1}`)

                th.appendChild(thText)
                thead.appendChild(th)
            }

            //tbody
            for (const preset of data.response) {
                const { collectionName, fields } = preset
                //collectionName
                const tr = document.createElement('tr')
                const thTable = document.createElement('td')
                const thTextTable = document.createTextNode(collectionName)

                thTable.appendChild(thTextTable)
                tr.appendChild(thTable)
                tbody.appendChild(tr)

                //fields
                for (let i = 0; i <= maiorLength; i++) {
                    const thfield = document.createElement('td')
                    const thTextfield = document.createTextNode(fields[i] ? fields[i].key : '')

                    thfield.appendChild(thTextfield)
                    tr.appendChild(thfield)
                }

                const tdEdit = document.createElement('td')
                tdEdit.setAttribute('id', collectionName + '_edit')
                tdEdit.addEventListener('click', e => this.editPreset(e))

                const tdDelet = document.createElement('td')
                tdDelet.setAttribute('id', collectionName + '_delete'),
                tdDelet.addEventListener('click', e => {
                    const popUpAlert = document.querySelector('.popupConfirmation')
                    if(popUpAlert) this.showPopUp(popUpAlert, e)
                })

                tdEdit.className = 'editPreset'
                tdDelet.className = 'deletPreset'

                const tdTextEdit = document.createTextNode('Editar')
                const tdTextDelet = document.createTextNode('Apagar')

                tdDelet.appendChild(tdTextDelet)
                tdEdit.appendChild(tdTextEdit)

                tr.appendChild(tdEdit)
                tr.appendChild(tdDelet)

            }
        } catch (error) {
            const msgError = error.message
            this.messaging.msg(msgError || 'Algo deu errado tente novamente mais tarde 😢', false)
        }
    }

    showPopUp(popUpAlert, e){
        popUpAlert.classList.add('show')

        const labelAlertConfirmation = document.querySelector('#labelAlertConfirmation')
        const inputAlertConfimation = document.querySelector('#inputAlertConfimation')
        const formAlertConfirmation = document.querySelector('#formAlertConfirmation')
        const btnClosePopUp = document.querySelector('#btnClosePopUp')

        const el = e.target
        const collectionName = el.id.split('_')[0]

        labelAlertConfirmation.innerText = `Digite o nome da predefinição há ser excluida ${collectionName}`
        
        btnClosePopUp.addEventListener('click', (e) => {
            popUpAlert.classList.remove("show")
        })

        formAlertConfirmation.addEventListener('submit', async (e) => {
            e.preventDefault()
            const valueInput = inputAlertConfimation.value
            try {
                if(valueInput === collectionName){
                    const data = await this.api.deletePreset(collectionName)
                    popUpAlert.classList.remove("show")
                    this.preset()
                    return this.messaging.msg(data.success, true)
                }else{
                    this.messaging.msg('Escreva o nome correto para excluir a predefinição!', false)
                }
            } catch (error) {
                this.messaging.msg(error.message || "Algo deu errado tente novamente mais tarde 😢", false)
            }
        })
    }

    editPreset(e) {
        console.log(e.target.id);
    }
}
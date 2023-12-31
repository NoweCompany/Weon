export default class User {
    constructor(container, messaging, requests) {
        this.messaging = messaging
        this.api = requests
        this.container = container

        this.valuesUsers = []
    }

    async user() {
        this.initializeTable()
    }

    async initializeTable(){
        const { table, thead, tbody, btnCreateUser } = this.rederTable()
        this.setEventOnbtnCreateUser(btnCreateUser)
        await this.setValueUsers()
        this.loadRegister(tbody)
    }

    setEventOnbtnCreateUser(btnCreateUser){
        btnCreateUser.addEventListener("click", () => {
            const {
            formUsers,
            emailInput,
            passwordInput,
            confirmPasswordUser,
            admCheckBox,
            insertCheckBox,
            editCheckBox,
            deleteCheckBox,
            btnCancelUserForm
            } = this.renderForm()
            
            btnCancelUserForm.addEventListener('click', () => {
                this.initializeTable()
            })
            formUsers.addEventListener('submit', async (e) => {
                e.preventDefault()
                
                const email           = (String(emailInput.value)).trim()
                const password        = (String(passwordInput.value)).trim()
                const confirmPassword = (String(confirmPasswordUser.value)).trim()
                const adm             = admCheckBox.checked
                const insert          = insertCheckBox.checked
                const edit            = editCheckBox.checked
                const delet           = deleteCheckBox.checked

                if(!email || !password || !confirmPassword){
                    this.messaging.msg('Preencha o formulário corretamente.')
                    return
                }else if(password.length < 6){
                    this.messaging.msg('A senha deve ter no minimo 6 caracteres!', false)
                    return
                }else if(password !== confirmPassword){
                    this.messaging.msg('Confirme sua senha novamente.', false)
                    return
                }

                try {
                    const permission = {adm, insert, edit, delet}
                    const response = await this.api.postApiUser(email, password, permission) 
                    this.messaging.msg('Usuário criado com sucesso!', true)
                    this.initializeTable()
                    return
                } catch (error) {
                    console.log(error);
                    this.messaging.msg(error.message, false)
                    return
                }
            })
        })
    }

    renderForm() {
        this.container.innerHTML = ` <div class="d-flex justify-content-center align-items-center mb-5">
            <div class="border border-horizontal p-5 d-flex justify-content-between align-items-center">
                <div class="ml-auto">
                    <h1 class="mb-0 display-6"> Criar usuário </h1>
                </div>
                <div>
                    <button id="btnCancelUserForm" class="btn btn-outline-danger btn-sm-4">Voltar</button>
                    <button id="createDashboardForm" form="formUsers"
                            class="btn btn-outline-primary sm-4 ms-2">Salvar</button>
                </div>
            </div>
        </div>

        <div class="container">
        
        <form id="formUsers" class="formcaduser mx-auto w-100">
        <h1>Acesso</h1>
    
        <div class="row mb-3">
            <div class="col-md-4 form-group">
                <label for="emailUser" class="form-label">Email</label>
                <input type="email" class="form-control" id="emailUser" placeholder="Email">
            </div>
    
            <div class="col-md-4 form-group">
                <label for="passwordUser" class="form-label">Senha</label>
                <input type="password" class="form-control" id="passwordUser" placeholder="Senha">
            </div>
    
            <div class="col-md-4 form-group">
                <label for="confirmPasswordUser" class="form-label">Confirmar</label>
                <input type="password" class="form-control" id="confirmPasswordUser" placeholder="Confirmar Senha">
            </div>
        </div>
    
        <hr class="mt-4">
    
        <h1>Permissões</h1>
    
        <div class="row mb-3">

            <div class="col-md-4 p-2 form-group">
                <input type="checkbox" class="form-check-input" id="admUserCheckBox">
                <label class="form-check-label mt-1" for="admUserCheckBox">Administração</label>
            </div>
    
            <div class="col-md-4 p-2 form-group">
                <input type="checkbox" class="form-check-input" id="insertUserCheckBox">
                <label class="form-check-label mt-1" for="insertUserCheckBox">Inserção</label>
            </div>
        </div>
    
        <div class="row mb-3">
            <div class="col-md-4 p-2 form-group">
                <input type="checkbox" class="form-check-input" id="EditUserCheckBox">
                <label class="form-check-label mt-1" for="EditUserCheckBox">Edição</label>
            </div>
    
            <div class="col-md-4 p-2 form-group">
                <input type="checkbox" class="form-check-input" id="DeletUserCheckBox">
                <label class="form-check-label mt-1" for="DeletUserCheckBox">Deleção</label>
            </div>
        </div>
    </form>
    `

        const formUsers = document.querySelector('#formUsers')
        const btnCancelUserForm = document.querySelector('#btnCancelUserForm')

        const emailInput = document.querySelector("#emailUser")
        const passwordInput = document.querySelector("#passwordUser")
        const confirmPasswordUser = document.querySelector("#confirmPasswordUser")

        const admCheckBox = document.querySelector("#admUserCheckBox")
        const insertCheckBox = document.querySelector("#insertUserCheckBox")
        const editCheckBox = document.querySelector("#EditUserCheckBox")
        const deleteCheckBox = document.querySelector("#DeletUserCheckBox")

        return {formUsers, emailInput, passwordInput, confirmPasswordUser, admCheckBox, insertCheckBox, editCheckBox, deleteCheckBox, btnCancelUserForm}
    }

    rederTable() {
        this.container.innerHTML = `
        <div class="d-flex justify-content-center align-items-center mb-5">
            <div class="border border-horizontal p-5 d-flex justify-content-between align-items-center">
                <div class="titulo">
                    <h1 id="tituloPrincipal" class="display-6">Usuários</h1>
                </div>
            <div>
            
            <div class="newfield me-3">
                <button id="createUser" class="btn btn-outline-primary">Criar usuário</button>
            </div> 
        
            </div>
            </div>
        </div>
        <div class="table-container">
            <table id="table-user">
            <thead id="thead-user">
                <th>E-mail usuário</th>
                <th>ADM</th>
                <th>Inserir</th>
                <th>Editar</th>
                <th>Deletar</th>
                <th>Data de criação</th>
                <th>Data de última modificação</th>
                <th></th>
            </thead>
            <tbody id="tbody-user"></tbody>
            </table>
        </div>

        <div class="pagination-container d-flex justify-content-center mt-4">
        <nav>
            <ul class="pagination">
            </ul>
        </nav>
    </div>
        `


        const table = document.querySelector('#table-user')
        const thead = document.querySelector('#thead-user')
        const tbody = document.querySelector('#tbody-user')
        const btnCreateUser = document.querySelector('#createUser')
        return { table, thead, tbody, btnCreateUser }
    }

    filterHistoric(emailFilter, methodFilter) {
        return this.valuesUsers.filter((user) => {
        const userEmail = user.userEmail.toLowerCase()
        const method = user.method.toLowerCase()
        return userEmail.includes(emailFilter.toLowerCase()) && method.includes(methodFilter.toLowerCase())
        })
    }

    loadRegister(tbody, data) {
        let users = data || this.valuesUsers;

        for (const user of users) {
            const tr = document.createElement('tr')

            function togglePermissionValue(value){
                return value 
                ? `<i class="fa-solid fa-circle-check" style="color: #0fff4b;"></i>` 
                : `<i class="fa-solid fa-circle-xmark" style="color: #ff0000;"></i>`
            }

            const tdEmailUser = document.createElement('td')
            tdEmailUser.innerText = user.email

            const tdAdmP = document.createElement('td')
            tdAdmP.innerHTML = togglePermissionValue(user.permission?.adm)

            const tdinsertP = document.createElement('td')
            tdinsertP.innerHTML = togglePermissionValue(user.permission?.insert)

            const tdeditP = document.createElement('td')
            tdeditP.innerHTML = togglePermissionValue(user.permission?.edit)

            const tddeletP = document.createElement('td')
            tddeletP.innerHTML = togglePermissionValue(user.permission?.delet)

            const tdCreatedAt = document.createElement('td')
            tdCreatedAt.innerText = new Date(user.createdAt).toLocaleString()

            const tdUpdatedAt = document.createElement('td')
            tdUpdatedAt.innerText = new Date(user.updatedAt).toLocaleString()

            const tdDeleteTr = document.createElement('td')
            tdDeleteTr.id = user.id
            tdDeleteTr.innerHTML = `<i id="${user.id}" class="fas fa-trash-alt"></i>`
            this.addEventOnBtnDelete(tr, tdDeleteTr, user.email)

            tr.appendChild(tdEmailUser)
            tr.appendChild(tdAdmP)
            tr.appendChild(tdinsertP)
            tr.appendChild(tdeditP)
            tr.appendChild(tddeletP)
            tr.appendChild(tdCreatedAt)
            tr.appendChild(tdUpdatedAt)
            tr.appendChild(tdDeleteTr)

            tbody.appendChild(tr)
        }
    }

    async setValueUsers() {
        try {
            const user = await this.api.getIndexUser()
            this.valuesUsers = user
        } catch (error) {
            this.messaging.msg('Erro ao obter os registros do histórico, tente novamente mais tarde.')
        }
    }

    addEventOnBtnDelete(row, button, email) {
        button.addEventListener('click', async (e) => {
        const confirmation = confirm(`Deseja mesmo excluir esse registro?`)
        if (confirmation) {
            try{
                const id = e.target.id
                console.log(id);
                const response = await this.api.deleteApiUser(id)
                row.remove()
                alert(`Usuário com o email ${email} foi removido com sucesso!`)
            }catch(error){
                console.error(error);
                this.messaging.msg(error, false)
            }
        }
        })
    }

    sortByDateDescending(users) {
        return users.sort((a, b) => {
        const dateA = new Date(a.currentDate);
        const dateB = new Date(b.currentDate);
        return dateB - dateA;
        });
    }
}

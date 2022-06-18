let currentUser = {}
let userList = []

async function getUser(url) {
    try {
        let res = await fetch(url)
        return res.json()
    } catch (err) {
        console.log(err)
    }
}

async function renderUser(url, list) {
    userList = url === '' ? list : await getUser(url)
    let html = ""
    userList.forEach((user, index) => {
        html += `
        <tr>
            <td>${index + 1}</td>
            <td>${user.userName}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber}</td>
            <td>
                <span data-user=${user.id} class="btn_delete">Delete</span>
                <span data-user=${user.id} class="btn_edit">Edit</span>
            </td>
        </tr>
        `

    })

    let Tbody = document.getElementById("Table_body")
    Tbody.innerHTML = html

    let btnDeletes = document.querySelectorAll(".btn_delete")
    let btnEdit = document.querySelectorAll(".btn_edit")

    btnDeletes.forEach(item => item.addEventListener("click", handleDelete))
    btnEdit.forEach(item => item.addEventListener("click", showModal))
}

renderUser('https://62adc8f4b735b6d16a39c794.mockapi.io/users', [])


const generateUserId = (list) => {
    let userIdList = list.map(user => +user.id)
    let newId
    do{
        newId = Math.floor(Math.random() * 100) + 1
    }while(userIdList.includes(newId, 0))
    return newId
}

const handleChange = (e) => {
    const { name, value } = e.target
    currentUser[name] = value
}

const handleSubmit = (e) => {
    e.preventDefault()
    userList.push({ ...currentUser, id: generateUserId(userList).toString() })
    window.scrollTo({
        top: 1000,
        behavior: "smooth"
    })
    renderUser("", userList)
}

const handleResetForm = () => {
    for (let i = 0; i < 4; i++) {
        myForm[i].value = ''
    }
}

const handleDelete = (e) => {
    userList = userList.filter(user => user.id !== e.target.attributes[0].value)
    renderUser('', userList)
}

const handleEdit = (e) => {
    e.preventDefault()
    let newList = userList.map(user => user.id === currentUser.id ? currentUser : user)
    renderUser('', newList)
    myModal.style.display = "none"
}

const showModal = (e) => {
    let userEdit = userList.find(user => user.id === e.target.attributes[0].value)
    myModal.style.display = "block"
    currentUser = { ...userEdit }
    modalContent.innerHTML = `
            <form>
                <h2 class='heading'>Chỉnh sửa người dùng ${userEdit.fullName}</h2>
                <div class="form_item">
                    <input type="input" class="modal__field" name="userName" value=${userEdit.userName} required />
                    <label class="form__label">User Name</label>
                </div>
                <div class="form_item">
                    <input type="input" class="modal__field" name="fullName"  value=${userEdit.fullName} required />
                    <label class="form__label">Full Name</label>
                </div>
                <div class="form_item">
                    <input type="input" class="modal__field" name="email"  value=${userEdit.email} required />
                    <label class="form__label">Email</label>
                </div>
                <div class="form_item">
                    <input type="input" class="modal__field" name="phoneNumber"  value=${userEdit.phoneNumber} required />
                    <label class="form__label">Phone number</label>
                </div>
                <div class="row modalBtn">
                    <button data-user=${userEdit.id} type="submit" class="modal_save btn">Save Changes</button>
                </div>
            </form>
    `
    const modalFields = document.querySelectorAll(".modal__field")
    modalFields.forEach(item => item.addEventListener("blur", handleChange))

    const modalSaveBtn = document.querySelector(".modal_save")
    modalSaveBtn.addEventListener("click", handleEdit)
}

const btnReset = document.querySelector(".btn_reset")
const modalContent = document.querySelector(".modal-content")
const myForm = document.getElementById('myform')
const valueInputList = document.querySelectorAll(".form__field")
const myModal = document.getElementById("myModal")
const closeBtn = document.querySelector(".close")

btnReset.addEventListener("click", () => { handleResetForm() })
myForm.addEventListener("submit", handleSubmit)
valueInputList.forEach(item => item.addEventListener("blur", handleChange))

closeBtn.onclick = function () {
    myModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == myModal) {
        myModal.style.display = "none";
    }
}
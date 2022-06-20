let currentUser = {}
let userList = []
const successColor = '#0ba360'
const failColor = '#dc3545'
const btnReset = document.querySelector(".btn_reset")
const myForm = document.getElementById('myform')
const valueInputList = document.querySelectorAll(".form__field")

const notiContainer = document.querySelector('.noti')
const notiProgress = document.querySelector('.noti-progress')
const notiText = document.querySelector('.noti-text')
const notiCheck = document.querySelector('.noti-check')

const modalContent = document.querySelector(".modal-content")
const myModal = document.getElementById("myModal")
const closeBtn = document.querySelector(".close")
const URL_API = 'https://62adc8f4b735b6d16a39c794.mockapi.io/users'

btnReset.addEventListener("click", () => {
    for (let i = 0; i < 4; i++) {
        myForm[i].value = ''
    }
})

async function getUser(url) {
    try {
        let res = await fetch(url)
        return res.json()
    } catch (err) {
        createNotification('Oppsy!? Something went wrong!', false)
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
    let btnEdits = document.querySelectorAll(".btn_edit")

    btnDeletes.forEach(item => item.addEventListener("click", handleDelete))
    btnEdits.forEach(item => item.addEventListener("click", showModal))
}
renderUser(URL_API, [])


const generateUserId = (list) => {
    let userIdList = list.map(user => +user.id)
    let newId
    do {
        newId = Math.floor(Math.random() * list.length + 1) + 1
    } while (userIdList.includes(newId, 0))
    return newId
}

const handleChange = (e) => {
    const { name, value } = e.target
    currentUser[name] = value
}
valueInputList.forEach(item => item.addEventListener("blur", handleChange))


const handleSubmit = async (e) => {
    e.preventDefault()
    let newUser = { ...currentUser, id: generateUserId(userList).toString() }
    try {
        let res = await fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(newUser),
        })
        if (res.status === 201) {
            userList.push(newUser)
            window.scrollTo({
                top: 1000,
                behavior: "smooth"
            })
            createNotification("Submit successfully!", true)
            renderUser(URL_API, [])
        }
    } catch (err) {
        createNotification('Oppsy!? Something went wrong!', false)
        console.log(err)
    }

}
myForm.addEventListener("submit", handleSubmit)


const handleDelete = async (e) => {
    let userDeleteID = e.target.attributes[0].value
    try {
        let res = await fetch(URL_API + `/${userDeleteID}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
        })
        if (res.status === 200) {
            userList = userList.filter(user => user.id !== userDeleteID)
            createNotification("User deleted!", true)
            renderUser('', userList)
        }
    } catch (err) {
        createNotification('Oppsy!? Something went wrong!', false)
        console.log(err)
    }
}


const handleEdit = async (e) => {
    e.preventDefault()
    try {
        let res = await fetch(URL_API + `/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(currentUser)
        })
        if (res.status === 200) {
            let newList = userList.map(user => user.id === currentUser.id ? currentUser : user)
            createNotification("Changes have been saved!", true)
            renderUser('', newList)
        }
    } catch (err) {
        createNotification('Oppsy!? Something went wrong!', false)
        console.log(err)
    }
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

const createNotification = (mess, check) => {
    notiText.innerHTML = mess
    notiContainer.classList.add('active')
    notiProgress.classList.add('active')

    console.log(notiContainer)

    if (!check) {
        notiCheck.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>'
        notiContainer.style.borderLeftColor = failColor
        notiCheck.style.backgroundColor = failColor
    } else {
        notiCheck.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>'
        notiContainer.style.borderLeftColor = successColor
        notiCheck.style.backgroundColor = successColor
    }

    setTimeout(() => {
        notiProgress.classList.remove('active')
        notiContainer.classList.remove('active')
    }, 2000)

}

closeBtn.onclick = function () {
    myModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == myModal) {
        myModal.style.display = "none";
    }
}

let currentUser = {}
let userList = []
const successColor = '#0ba360'
const failColor = '#dc3545'
const URL_API = 'https://62adc8f4b735b6d16a39c794.mockapi.io/users'

const Tbody = document.getElementById("Table_body")

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

const myNofity = document.getElementById('myNofity')

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
        createNotification('Oppsie!? Something went wrong!', false)
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
            <td style="position: relative;">
                <div class="pop_confirm" data-user=${user.id} >
                    <div id="pop_confirm_text"></div>
                        <div class="row">
                            <button class="cornfirm_btn">Yes!</button>
                            <button class="cornfirm_btn">Cancel</button>
                        </div>
                    </div>
                <span data-user=${user.id} class="btn_delete">Delete</span>
                <span data-user=${user.id} class="btn_edit">Edit</span>
            </td>
        </tr>
        `
    })
    Tbody.innerHTML = html

    let btnDeletes = document.querySelectorAll(".btn_delete")
    let btnEdits = document.querySelectorAll(".btn_edit")

    btnDeletes.forEach(item => item.addEventListener("click", handleDelete))
    btnEdits.forEach(item => item.addEventListener("click", showModal))
}
renderUser(URL_API, [])


const handleChange = (e) => {
    const { name, value } = e.target
    currentUser[name] = value
}
valueInputList.forEach(item => item.addEventListener("blur", handleChange))


const handleSubmit = async (e) => {
    e.preventDefault()
    let newUser = { ...currentUser }
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
        createNotification('Oppsie!? Something went wrong!', false)
        console.log(err)
    }

}
myForm.addEventListener("submit", handleSubmit)


const handleDelete = (e) => {
    let userDeleteID = e.target.attributes[0].value
    let userDelete = userList.find(user => user.id === userDeleteID)

    let popConfirm = document.querySelector(`[data-user="${userDeleteID}"]`)
    let popConfirmText = popConfirm.querySelector('#pop_confirm_text')
    let btnList = popConfirm.querySelectorAll(".cornfirm_btn")

    popConfirmText.innerHTML = `Xác nhận xóa ${userDelete.fullName}`
    popConfirm.style.transform = 'scale(1)'

    btnList[0].addEventListener('click', async () => {
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
            createNotification('Oppsie!? Something went wrong!', false)
            console.log(err)
        }
    })

    btnList[1].addEventListener('click', () => {
        popConfirm.style.transform = 'scale(0)'
    })

    // window.onclick = function (e) {
    //     if (e.target == popConfirm) {
    //         popConfirm.style.display = "none";
    //     }
    // }
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
        createNotification('Oppsie!? Something went wrong!', false)
        console.log(err)
    }
    myModal.style.transform = "scale(0)"
}

const showModal = (e) => {
    currentUser = userList.find(user => user.id === e.target.attributes[0].value)

    myModal.style.transform = "scale(1)"
    modalContent.innerHTML = `
            <form>
                <h2 class='heading'>Chỉnh sửa người dùng ${currentUser.fullName}</h2>
                <div class="form_item">
                    <input type="input" class="modal__field" name="userName" value=${currentUser.userName} required />
                    <label class="form__label">User Name</label>
                </div>
                <div class="form_item">
                    <input type="input" class="modal__field" name="fullName"  value=${currentUser.fullName} required />
                    <label class="form__label">Full Name</label>
                </div>
                <div class="form_item">
                    <input type="input" class="modal__field" name="email"  value=${currentUser.email} required />
                    <label class="form__label">Email</label>
                </div>
                <div class="form_item">
                    <input type="input" class="modal__field" name="phoneNumber"  value=${currentUser.phoneNumber} required />
                    <label class="form__label">Phone number</label>
                </div>
                <div class="row modalBtn">
                    <button type="submit" class="modal_save btn">Save Changes</button>
                </div>
            </form>
    `
    const modalFields = document.querySelectorAll(".modal__field")
    modalFields.forEach(item => item.addEventListener("blur", handleChange))

    const modalSaveBtn = document.querySelector(".modal_save")
    modalSaveBtn.addEventListener("click", handleEdit)
}

closeBtn.onclick = function () {
    myModal.style.transform = "scale(0)"

}

window.onclick = function (event) {
    if (event.target == myModal) {
        myModal.style.transform = "scale(0)"
    }
}


const createNotification = (mess, check) => {

    let iEle = check ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>'
    let notiContainer = document.createElement("div")
    let notiProgress = document.createElement("div")

    notiProgress.classList.add("noti-progress")
    notiContainer.classList.add('noti')
    notiContainer.style.borderLeftColor = check ? successColor : failColor

    notiContainer.innerHTML = `
        <div class="noti-content">
            <div class="noti-check" style="background-color: ${check ? successColor : failColor};">
           ${iEle}
            </div>
        <div class="noti-text">${mess}</div>
        </div>
    `
    notiContainer.append(notiProgress)
    myNofity.append(notiContainer)

    setTimeout(() => {
        notiProgress.classList.add('active')
        notiContainer.classList.add('active')
    })

    setTimeout(() => {
        notiProgress.remove()
        notiContainer.classList.remove('active')
    }, 3000)

    setTimeout(()=> {
        notiContainer.remove()
    }, 4000)
}

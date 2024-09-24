// Düzenleme modu değişkenler

let editMode = false; // Düzenleme modunu belirleyecek değişken
let editItem;        //Düzenleme elemanını belirliyecek değiken
let editIdemId;       // Düzenlem elemanının id




// Html elemanları çagırma 

const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearButton = document.querySelector(".clear-btn");

// !!!!  Fonksiyonlar
const addItem = (e) => {
    // sayfanın yenilenmesini iptal ettik
    e.preventDefault();
    const value = input.value;
    if (value !== "" && !editMode) {
        // Silme işlemi için benzersiz deger için id oluşturdum
        const id = new Date().getTime().toString();
        createElement(id, value);
        setoDefault();
        showAlert("Eleman Eklendi", "success");
        addToLocalStorage(id, value);
    }
    else if (value !== "" && editMode) {
        editItem.innerHTML = value;
        updateLocalStorage(editIdemId, value);
        showAlert("Eleman Güncellendi", "success");
        setoDefault();
    }
};
// Uyarı veren fonksiyon

const showAlert = (text, action) => {
    // Alert kısmını içerigini belirleme
    alert.textContent = ` ${text}`;
    // Alert kısmına class ekleme
    alert.classList.add(`alert-${action}`);
    // Alert kısmının içerigini güncelle eklenen class kaldırma
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 2000);
};
// Elemanları silen fonksiyon

const deleteItem = (e) => {
    // silmek istenen elemana yetiş
    const element = e.target.parentElement.parentElement.parentElement;
    const id = element.dataset.id;
    // Bu elemanı kaldır
    itemList.removeChild(element);
    removeFromLocalStorage(id);
    showAlert("Eleman Silindi", "danger");
    if (!itemList.children.length) {
        clearButton.style.display = "none";
    }

};

// Elemanı düzenleyici fonksiyon

const editItems = (e) => {
    const element = e.target.parentElement.parentElement.parentElement;
    editItem = e.target.parentElement.parentElement.previousElementSibling;
    input.value = editItem.innerText;
    editMode = true;
    editIdemId = element.dataset.id;
    addButton.textContent = "Düzenle";

};

//  Varsayılan degerlere döndüren değerler

const setoDefault = () => {
    input.value = "";
    editMode = false;
    editItem = "";
    addButton.textContent = "Ekle";
};

// Sayfa yüklendiginde elemanları render edecek fonksiyon
const renderItems = () => {
    let items = getFromLocalStorage();
    console.log(items);
    if (items.length > 0) {
        items.forEach((item) => createElement(item.id, item.value));
    }
};



// Eleman oluşturan fonksiyon

const createElement = (id, value) => {
    // Yeni bir oluşturduk
    const newDiv = document.createElement("div");
    // bu dive attribution ekleme
    newDiv.setAttribute("data-id", id);

    // Bu dive class ekleme
    newDiv.classList.add("items-list-item");
    // Bu divin HTML içerigini belirleme
    newDiv.innerHTML = ` <p class="item-name">${value}</p>
                    <div class="btn-container">
                        <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                    </div>`;

    // Delete nutonuna eriş

    const deleteBtn = newDiv.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    // Edit butonuna eriş
    const editBtn = newDiv.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItems);

    itemList.appendChild(newDiv);
    showAlert("Eleman Eklendi", "success");
};

// Sıfırlama yapan fonksiyon
const clearItems = () => {
    const items = document.querySelectorAll(".items-list-item");
    if (items.length > 0) {
        items.forEach((item) => {
            itemList.removeChild(item);
        });
        clearButton.style.display = "none"
        showAlert("Liste Boş", "danger");
        localStorage.removeItem("items");
    }

};


// Localstorage a kayıt yapan fonksiyon

const addToLocalStorage = (id, value) => {
    const item = { id, value };
    let items = getFromLocalStorage();
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
};

// Localstoragedan  verileri alan fonksiyon
const getFromLocalStorage = () => {
    return localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];

};
// Localstrage verileri kaldıran fonksiyon
const removeFromLocalStorage = (id) => {
    let items = getFromLocalStorage();
    items = items.filter((item) => item.id !== id);
    localStorage.setItem("items", JSON.stringify(items));
};

// localstorage güncelleyen fonksiyon
const updateLocalStorage = (id, newValue) => {
    let items = getFromLocalStorage();
    items = items.map((item) => {
        if (item.id === id) {
            return { ...item, value: newValue };
        }
        return item;
    });
    localStorage.setItem("items", JSON.stringify(items));
};



// ! Olay izleyicileri
// form gönderildiginde anı yakala

form.addEventListener("submit", addItem);
// sayfanın yüklendigi anı yakal

window.addEventListener("DOMContentLoaded", renderItems);
//  clear button tıklandıgında sıfırlama
clearButton.addEventListener("click", clearItems);

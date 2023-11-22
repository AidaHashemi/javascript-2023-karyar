"use strict";
// select DOM elements
const doListSection = document.getElementById("do-list");
const btnOrange = document.getElementById("btn-orange");
const addForm = document.getElementById("add-form");
const editForm = document.getElementById("edit-form");
const editCardModal = document.getElementById("modal-edit-card");
const editTaskInput = document.getElementById("edit-task-input");
const addTaskInput = document.getElementById("add-task-input");
const addCardModal = document.getElementById("modal-add-card");
const closeWindow = document.querySelector(".close-window");
const allDoItems = document.getElementById("all-do-items");
const allDoneItems = document.getElementById("all-done-items");
// url
const url = "http://localhost:3004";
//event listeners
btnOrange.addEventListener("click", function () {
  cssStyles.addModal();
});

closeWindow.addEventListener("click", function () {
  cssStyles.closeModal();
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (addTaskInput.value.trim()) {
    const data = {
      title: addTaskInput.value,
    };
    creatItem(data);
  } else {
    alert("you should write something to add...");
  }
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (editTaskInput.value.trim()) {
    const data = {
      title: editTaskInput.value,
    };
    editItem(data);
  } else {
    alert("you should write something to edit...");
  }
});

allDoItems.addEventListener("click", (e) => {
  if (e.target.classList.contains("item-bar")) {
    const showIcons = e.target.parentElement.querySelector(".show-icons");
    showIcons.style.visibility = "visible";
    e.target.style.visibility = "hidden";
    console.log(showIcons);
  }
  if (e.target.classList.contains("delete-icon")) {
    const id = e.target.parentElement.id;
    const confirmResponse = confirm("Do you want to delete this item?!");
    if (confirmResponse) {
      deleteDoItem(id);
    }
  }
  if (e.target.classList.contains("edit-icon")) {
    const id = e.target.parentElement.id;
    editForm.id = id;
    cssStyles.editDoItem();
    getEditItem(id);
    editTaskInput.focus();
  }

  if (e.target.classList.contains("check-icon")) {
    const id = e.target.parentElement.id;
    alert("checked");
  }
});

// declaring object variable
const cssStyles = {
  addModal: function () {
    addCardModal.style.display = "flex";
    btnOrange.style.display = "none";
    addTaskInput.focus();
  },
  closeModal: function () {
    editCardModal.style.display = "none";
    addCardModal.style.display = "none";
    btnOrange.style.display = "flex";
  },
  editDoItem: function () {
    editCardModal.style.display = "flex";
    addCardModal.style.display = "none";
    btnOrange.style.display = "none";
  },
};
//functions
const creatItem = async function (data) {
  const respone = await fetch(url + "/doItems", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const deleteDoItem = async function (id) {
  const respone = await fetch(url + `/doItems/${id}`, {
    method: "DELETE",
  });
};

//  edit item to-do
const getEditItem = async function (id) {
  const response = await fetch(url + `/doItems/${id}`);
  const item = await response.json();
  editTaskInput.value = item.title;
};
const editItem = async function (data) {
  const respone = await fetch(url + `/doItems/${editForm.id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getDoItems = async function () {
  const respone = await fetch(url + "/doItems");
  const items = await respone.json();
  for (const item of items) {
    allDoItems.innerHTML += `<li class="item" data-id="${item.id}">
    <span class="item-title">${item.title}</span>
    <i class="fas fa-bars item-bar"></i>
    <span class="show-icons" id="${item.id}">
      <i class="far fa-minus-square delete-icon"></i>
      <i class="far fa-edit edit-icon"></i>
      <i class="far fa-check-square check-icon"></i>
    </span>
  </li>`;
  }
};

// ________________________________
btnOrange.focus();
getDoItems();

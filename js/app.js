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
const closeEditWindow = document.querySelector(".close-edit-window");
const closeAddWindow = document.querySelector(".close-add-window");
const allDoItems = document.getElementById("all-do-items");
const allDoneItems = document.getElementById("all-done-items");
// url
const url = "http://localhost:3004";
//event listeners
btnOrange.addEventListener("click", function () {
  cssStyles.addModal();
});

closeEditWindow.addEventListener("click", function () {
  cssStyles.closeModal();
});
closeAddWindow.addEventListener("click", function () {
  cssStyles.closeModal();
});

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (addTaskInput.value.trim()) {
    const data = {
      title: addTaskInput.value,
    };
    await creatItem(data);
    cssStyles.closeModal();
    btnOrange.focus();
    await getDoItems();
    await getDoneItems();
  } else {
    alert("you should write something to add...");
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (editTaskInput.value.trim()) {
    const data = {
      title: editTaskInput.value,
    };
    await editItem(data);
    cssStyles.closeModal();
    btnOrange.focus();
    await getDoItems();
    await getDoneItems();
  } else {
    alert("you should write something to edit...");
  }
});

allDoItems.addEventListener("click", async (e) => {
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
      await deleteDoItem(id);
      await getDoItems();
      await getDoneItems();
    }
  }
  if (e.target.classList.contains("edit-icon")) {
    const id = e.target.parentElement.id;
    editForm.id = id;
    cssStyles.editDoItem();
    await getEditItem(id);
    editTaskInput.focus();
    await getDoItems();
    await getDoneItems();
  }

  if (e.target.classList.contains("check-icon")) {
    const id = e.target.parentElement.id;
    await getCheckedItem(id);
    await deleteDoItem(id);
    await getDoItems();
    await getDoneItems();
  }
});

allDoneItems.addEventListener("click", async (e) => {
  if (e.target.classList.contains("item-bar")) {
    const showIcons = e.target.parentElement.querySelector(".show-icons");
    showIcons.style.visibility = "visible";
    e.target.style.visibility = "hidden";
  }
  if (e.target.classList.contains("delete-icon")) {
    const id = e.target.parentElement.id;
    const confirmResponse = confirm("Do you want to delete this item?!");
    if (confirmResponse) {
      await deleteDoneItem(id);
      await getDoItems();
      await getDoneItems();
    }
  }
  if (e.target.classList.contains("undo-icon")) {
    const id = e.target.parentElement.id;
    await getUndoItem(id);
    await deleteDoneItem(id);
    await getDoItems();
    await getDoneItems();
  }
});

///// create do and done items
const creatItem = async function (data) {
  const respone = await fetch(url + "/doItems", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const createDoneItem = async function (data) {
  const respone = await fetch(url + `/doneItems`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
///// delete do and done items
const deleteDoItem = async function (id) {
  const respone = await fetch(url + `/doItems/${id}`, {
    method: "DELETE",
  });
};
const deleteDoneItem = async function (id) {
  const respone = await fetch(url + `/doneItems/${id}`, {
    method: "DELETE",
  });
};

/////edit do item
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
///// done item (to-do section)
const getCheckedItem = async function (id) {
  const respone = await fetch(url + `/doItems/${id}`);
  const checkedItem = await respone.json();
  const data = {
    title: checkedItem.title,
  };
  await createDoneItem(data);
};
/////undo items (done section)
const getUndoItem = async function (id) {
  const respone = await fetch(url + `/doneItems/${id}`);
  const undoItem = await respone.json();
  const data = {
    title: undoItem.title,
  };
  await creatItem(data);
};
///// get all items
const getDoItems = async function () {
  allDoItems.innerHTML = "";
  const respone = await fetch(url + "/doItems");
  const doItems = await respone.json();
  for (const item of doItems) {
    allDoItems.innerHTML += `<li class="item" data-id="${item.id}">
    <span class="item-title">${item.title}</span>
    <i class="fas fa-bars item-bar"></i>
    <span class="show-icons" id="${item.id}">
      <i class="far fa-minus-square delete-icon" title="DELETE"></i>
      <i class="far fa-edit edit-icon" title="EDIT"></i>
      <i class="far fa-check-square check-icon" title="DONE"></i>
    </span>
  </li>`;
  }
};

const getDoneItems = async function () {
  allDoneItems.innerHTML = "";
  const respone = await fetch(url + "/doneItems");
  const doneItems = await respone.json();
  for (const item of doneItems) {
    allDoneItems.innerHTML += `<li class="item" data-id="${item.id}">
    <span class="item-title">${item.title}</span>
    <i class="fas fa-bars item-bar"></i>
    <span class="show-icons" id="${item.id}">
      <i class="far fa-minus-square delete-icon" title="DELETE"></i>
      <i class="fas fa-undo undo-icon" title="UNDO"></i>
    </span>
  </li>`;
  }
};

// cssStyles
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
//////
btnOrange.focus();
getDoItems();
getDoneItems();

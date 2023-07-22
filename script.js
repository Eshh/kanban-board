const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnload = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currenColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((each, i) => {
    localStorage.setItem(`${each}Items`, JSON.stringify(listArrays[i]));
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.ondragstart = (e) => drag(e);
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  columnEl.append(listEl);
}

function updateItem(i, c) {
  const selectedArray = listArrays[c];
  const selectedColumnEL = listColumns[c].children;
  if (!selectedColumnEL[i].textContent) {
    delete selectedArray[i];
  } else {
    selectedArray[i] = selectedColumnEL[i].textContent;
  }
  updateDOM();
}

function filterArrays(arr) {
  return arr.filter((e) => e);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnload) {
    getSavedColumns();
    updatedOnload = true;
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray = filterArrays(backlogListArray);
  backlogListArray.forEach((each, i) => createItemEl(backlogList, 0, each, i));
  // Progress Column
  progressList.textContent = "";
  progressListArray = filterArrays(progressListArray);
  progressListArray.forEach((each, i) =>
    createItemEl(progressList, 1, each, i)
  );
  // Complete Column
  completeList.textContent = "";
  completeListArray = filterArrays(completeListArray);
  completeListArray.forEach((each, i) =>
    createItemEl(completeList, 2, each, i)
  );
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray = filterArrays(onHoldListArray);
  onHoldListArray.forEach((each, i) => createItemEl(onHoldList, 3, each, i));
  // Run getSavedColumns only once, Update Local Storage
  updateSavedColumns();
}

function addToColumn(c) {
  const itemText = addItems[c].textContent;
  listArrays[c].push(itemText);
  updateDOM();
  addItems[c].textContent = "";
}

function showInputBox(c) {
  addBtns[c].style.display = "hidden";
  saveItemBtns[c].style.display = "flex";
  addItemContainers[c].style.display = "flex";
}
function hideInputBox(c) {
  addBtns[c].style.visibility = "visible";
  saveItemBtns[c].style.display = "none";
  addItemContainers[c].style.display = "none";
  addToColumn(c);
}

function rebuildArrays() {
  backlogListArray = [];
  progressListArray = [];
  completeListArray = [];
  onHoldListArray = [];
  for (child of backlogList.children) {
    backlogListArray.push(child.textContent);
  }
  for (child of progressList.children) {
    progressListArray.push(child.textContent);
  }
  for (child of completeList.children) {
    completeListArray.push(child.textContent);
  }
  for (child of onHoldList.children) {
    onHoldListArray.push(child.textContent);
  }
  updateDOM();
}

// Drag and drop methods
function drag(e) {
  draggedItem = e.target;
}
function allowDrop(e) {
  e.preventDefault();
}
function drop(e) {
  e.preventDefault();
  listColumns[currenColumn].classList.remove("over");
  const parentEl = listColumns[currenColumn];
  parentEl.append(draggedItem);
  rebuildArrays();
}
function dragEnter(column) {
  listColumns[column].classList.add("over");
  currenColumn = column;
  listColumns.forEach((each, i) => {
    if (column == i) {
      each.classList.add("over");
    } else {
      each.classList.remove("over");
    }
  });
}

updateDOM();

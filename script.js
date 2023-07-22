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
  columnEl.append(listEl);
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
  backlogListArray.forEach((each, i) => createItemEl(backlogList, 0, each, i));
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((each, i) =>
    createItemEl(progressList, 0, each, i)
  );
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((each, i) =>
    createItemEl(completeList, 0, each, i)
  );
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((each, i) => createItemEl(onHoldList, 0, each, i));
  // Run getSavedColumns only once, Update Local Storage
  updateSavedColumns();
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

// Check if there are items in local storage, if not, initialize an empty array
const itemsArray = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];

console.log(itemsArray);

// Add a click event listener to the "Enter" button
document.querySelector("#enter").addEventListener("click", () => {
    const item = document.querySelector("#item");
    createItem(item);
});

// Display the items in the to-do list
function displayItems(filteredItems = itemsArray) {
    let items = "";
    for (let i = 0; i < filteredItems.length; i++) {
        // create HTML elements for each item in the list
        items += `<div class="item">
            <div class="input-controller">
                <textarea disabled>${filteredItems[i].task}</textarea>
                <div class="edit-controller">
                    <div class="form-check form-switch">
                        <label class="switch">
                            <input type="checkbox" ${filteredItems[i].completed ? 'checked' : ''}>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <i class="fa-solid fa-trash deleteBtn" style="color: #f5f5f5;"></i>
                    <i class="fa-regular fa-pen-to-square editBtn"></i>  
                </div>
            </div>
            <div class="update-controller">
                <button class="saveBtn">Save</button>
                <button class="cancelBtn">Cancel</button>
            </div>
        </div>`;
    }
    // Insert the generated HTML into the "To-do-list" element
    document.querySelector(".to-do-list").innerHTML = items;
    // Add event listeners for various actions
    activateDeleteListeners();
    activateEditListeners();
    activateSaveListeners();
    activateCancelListeners();
    activateCompleteListeners();
}

// Function to activate delete item listeners
function activateDeleteListeners() {
    // Select all delete buttons and attach click event listeners
    let deleteBtn = document.querySelectorAll(".deleteBtn");
    deleteBtn.forEach((db, i) => {
        db.addEventListener("click", () => {
            deleteItem(i);
        });
    });
}

// Function to activate edit item listeners
function activateEditListeners() {
    const editBtn = document.querySelectorAll(".editBtn");
    const updatecontroller = document.querySelectorAll(".update-controller");
    const inputs = document.querySelectorAll(".input-controller textarea");

    editBtn.forEach((eb, i) => {
        eb.addEventListener("click", () => {
            updatecontroller[i].style.display = "block";
            inputs[i].disabled = false;

            const checkBtn = updatecontroller[i].querySelector(".fa-check");
            checkBtn.addEventListener("click", () => {
                completeTask(i);
                inputs[i].style.display = "none"; // Hide the textarea after completing
            });
        });
    });
}

/* Function to complete a task */
function completeTask(index) {
    const task = itemsArray[index];
    task.completed = !task.completed;
    itemsArray[index] = task;

    localStorage.setItem("items", JSON.stringify(itemsArray));
    displayItems();
}

function activateSaveListeners() {
    const saveBtn = document.querySelectorAll(".saveBtn");
    const inputs = document.querySelectorAll(".input-controller textarea");
    saveBtn.forEach((sb, i) => {
        sb.addEventListener("click", () => {
            updateItem(inputs[i].value, i);
        });
    });
}

function activateCancelListeners() {
    const cancelBtn = document.querySelectorAll(".cancelBtn");
    const updatecontroller = document.querySelectorAll(".update-controller");
    const inputs = document.querySelectorAll(".input-controller textarea");
    cancelBtn.forEach((cb, i) => {
        cb.addEventListener("click", () => {
            updatecontroller[i].style.display = "none";
            inputs[i].disabled = true;
        });
    });
}

// Function to update an item
function updateItem(text, i) {
    itemsArray[i].task = text;
    localStorage.setItem("items", JSON.stringify(itemsArray));
    location.reload();
}

// Function to delete an item
function deleteItem(i) {
    itemsArray.splice(i, 1);
    localStorage.setItem("items", JSON.stringify(itemsArray));
    location.reload();
    updateTaskCount();
}

// Function to create a new item
function createItem(item) {
    itemsArray.push({ task: item.value, completed: false });
    localStorage.setItem("items", JSON.stringify(itemsArray));
    location.reload();
    updateTaskCount();
}

// Function to display the current date
function displayDate() {
    let date = new Date();
    date = date.toString().split(" ");
    document.querySelector("#date").innerHTML = date[2] + " " + date[1] + ", " + date[3];
}
// Run these functions when the window loads
window.onload = function () {
    displayDate();
    displayItems();
    updateTaskCount();
    /* */
    const headingSpans = document.querySelectorAll(".todo-list-heading span");
    headingSpans.forEach((span, index) => {
        span.style.setProperty('--index', index);
    });

    const animatedHeading = document.querySelector(".animated-heading");
    animatedHeading.classList.add("start-animation");

    // Remove the animation class after the animation is done
    animatedHeading.addEventListener("animationend", () => {
        animatedHeading.classList.remove("start-animation");
    });
    /* */
}

/* */
document.querySelector("#sortBtn").addEventListener("click", () => {
    sortItems();
});

function sortItems() {
    console.log("sortItems");
    itemsArray.sort((a, b) => a.task.localeCompare(b.task)); // Sort items alphabetically based on task
    displayItems();

    // Save the sorted array back to local storage
    localStorage.setItem("items", JSON.stringify(itemsArray));

    // Refresh the displayed items
}

// Filter Tasks:

document.querySelector("#filterBtn").addEventListener("click", () => {
    const filterOptions = document.querySelector("#filterOptions");
    filterOptions.style.display = filterOptions.style.display === "block" ? "none" : "block";
});

document.querySelector("#completedFilter").addEventListener("click", () => {
    filterTasks("completed");
});

document.querySelector("#uncompletedFilter").addEventListener("click", () => {
    filterTasks("uncompleted");
});

function filterTasks(status) {
    const filteredItems = itemsArray.filter(item => {
        return status === "completed" ? item.completed : !item.completed;
    });
    displayItems(filteredItems);
}

// Activate complete listeners

function activateCompleteListeners() {
    const checkboxes = document.querySelectorAll(".form-check input[type='checkbox']");
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                completeTask(index);
            }
        });
    });
}

function updateTaskCount() {
    const taskCount = document.getElementById("taskCount");
    taskCount.textContent = `Tasks added: ${itemsArray.length}`;
}

/* */
const searchInput = document.getElementById("searchInput");
const searchResultsList = document.querySelector(".search-results");

searchInput.addEventListener("input", () => {
    const searchQuery = searchInput.value.trim().toLowerCase();
    const matchingItems = itemsArray.filter(item => item.task.toLowerCase().includes(searchQuery));
    displayItems(matchingItems);
});

// ===== Top Input and Control Elements =====
const toDoName = document.getElementById("toDoListName");
const addItemButton = document.getElementById("addItem");
const deleteCompletedButton = document.getElementById("deleteCompleted");
const displayAllCards = document.getElementById("displayAllCards");

const lowPriorityButton = document.getElementById("lowPriorityFilter");
const mediumPriorityButton = document.getElementById("mediumPriorityFilter");
const highPriorityButton = document.getElementById("highPriorityFilter");

const toDoContainer = document.getElementById("addCardHere");
let selectedParentElement;

let cardNumber;
let localStorageLength = localStorage.length;

console.log("local storage length " + localStorageLength);

if (localStorageLength == 0) {
    cardNumber = 0;
} else if (localStorageLength > 0) {
    const keys = Object.keys(localStorage).map(Number).sort((a, b) => a - b);
    for (let key of keys) {
        const value = localStorage.getItem(key);
        const valSplit = value.split(",");
        addCard(valSplit[1], valSplit[0], valSplit[2], valSplit[3], true, key);
    }
    cardNumber = keys[keys.length - 1] + 1;
}

addItemButton.addEventListener("click", () => {
    if (toDoName.value != "") {
        console.log(toDoName.value);
        addCard(toDoName.value);
        toDoName.value = "";
    }
});

function addCard(cardName, cardPriority, checkBoxValue, datePicked, fromStorage = false, storedCardNumber = null) {
    const currentCardNumber = fromStorage ? storedCardNumber : cardNumber;
    let myCardPriority = cardPriority || undefined;
    let myCheckBoxValue = checkBoxValue || false;
    let myDatePicked = datePicked || undefined;

    let newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.setAttribute("id", currentCardNumber);
    if (myCardPriority && myCardPriority !== "select") {
        newCard.classList.add(myCardPriority);
    }

    let myCardNameDiv = document.createElement("div");
    myCardNameDiv.classList.add("cardNameDiv");

    let myCardNameValue = document.createElement("h2");
    myCardNameValue.classList.add("innerCardName");
    myCardNameValue.innerHTML = cardName;
    myCardNameDiv.appendChild(myCardNameValue);

    let selectionDiv = document.createElement("div");
    selectionDiv.classList.add("selectionContainer");

    let leftSideCardDiv = document.createElement("div");
    leftSideCardDiv.classList.add("leftSideCardDiv");
    leftSideCardDiv.appendChild(myCardNameDiv);

    let priorityMenuLabel = document.createElement("label");
    priorityMenuLabel.setAttribute("for", "priorityOptions");
    priorityMenuLabel.innerHTML = "Priority";
    selectionDiv.appendChild(priorityMenuLabel);

    let priorityMenuList = document.createElement("select");
    priorityMenuList.setAttribute("name", "priorityOptions");
    priorityMenuList.setAttribute("id", "priorityOptions");
    selectionDiv.appendChild(priorityMenuList);

    let selectPriority = document.createElement("option");
    selectPriority.setAttribute("value", "select");
    selectPriority.innerHTML = "Select";
    priorityMenuList.appendChild(selectPriority);

    let lowPriority = document.createElement("option");
    lowPriority.setAttribute("value", "low");
    lowPriority.innerHTML = "Low";
    priorityMenuList.appendChild(lowPriority);

    let mediumPriority = document.createElement("option");
    mediumPriority.setAttribute("value", "medium");
    mediumPriority.innerHTML = "Medium";
    priorityMenuList.appendChild(mediumPriority);

    let highPriority = document.createElement("option");
    highPriority.setAttribute("value", "high");
    highPriority.innerHTML = "High";
    priorityMenuList.appendChild(highPriority);

    let myDateDiv = document.createElement("div");
    myDateDiv.classList.add("dateDivContainer");

    let myDatePicker = document.createElement("input");
    myDatePicker.setAttribute("type", "date");
    myDatePicker.setAttribute("id", "myDateInput" + currentCardNumber);

    let myDatePickerLabel = document.createElement("label");
    myDatePickerLabel.setAttribute("for", "datePicker");
    myDatePicker.setAttribute("class", "datePicker");
    myDatePickerLabel.innerHTML = "Due:";

    myDateDiv.appendChild(myDatePickerLabel);
    myDateDiv.appendChild(myDatePicker);

    let detailsContainer = document.createElement("div");
    detailsContainer.classList.add("detailsContainer");
    detailsContainer.appendChild(selectionDiv);
    detailsContainer.appendChild(myDateDiv);
    leftSideCardDiv.appendChild(detailsContainer);

    newCard.appendChild(leftSideCardDiv);
    toDoContainer.appendChild(newCard);

    if (datePicked != undefined) {
        myDatePicker.value = datePicked;
    }

    let myButtonsContainer = document.createElement("div");
    myButtonsContainer.classList.add("actionButtons");

    let myEditButton = document.createElement("button");
    myEditButton.classList.add("edit");
    myEditButton.innerText = "✎";
    myEditButton.setAttribute("id", currentCardNumber);

    let myDeleteButton = document.createElement("button");
    myDeleteButton.classList.add("delete");
    myDeleteButton.innerText = "X";

    let completedButton = document.createElement("button");
    completedButton.classList.add("completedButton");
    completedButton.innerText = myCheckBoxValue === "true" || myCheckBoxValue === true ? "✔" : "⍻";

    myButtonsContainer.appendChild(completedButton);
    myButtonsContainer.appendChild(myEditButton);
    myButtonsContainer.appendChild(myDeleteButton);

    let rightSideCardDiv = document.createElement("div");
    rightSideCardDiv.classList.add("rightSideCardDiv");

    rightSideCardDiv.appendChild(myButtonsContainer);


    newCard.appendChild(rightSideCardDiv);

    priorityMenuList.addEventListener("change", (e) => {
        if (newCard.classList.contains("lowPriority")) {
            newCard.classList.remove("lowPriority");
        } else if (newCard.classList.contains("mediumPriority")) {
            newCard.classList.remove("mediumPriority");
        } else if (newCard.classList.contains("highPriority")) {
            newCard.classList.remove("highPriority");
        }

        if (e.target.value == "low") {
            newCard.classList.add("lowPriority");
        } else if (e.target.value == "medium") {
            newCard.classList.add("mediumPriority");
        } else if (e.target.value == "high") {
            newCard.classList.add("highPriority");
        }

        let myValue = localStorage.getItem(currentCardNumber);
        if (!myValue) return;
        let myValsSplit = myValue.split(",");
        myValsSplit[0] = newCard.classList.value.split(" ")[1];
        myValsSplit.toString();
        addCardToLocalStorage(currentCardNumber, myValsSplit);
        console.log(localStorage);
    });

    myDatePicker.addEventListener("change", () => {
        if (myDatePicker !== "") {
            let myValue = localStorage.getItem(currentCardNumber);
            if (!myValue) return;
            let valsSplit = myValue.split(",");
            valsSplit[3] = myDatePicker.value;
            valsSplit.toString();
            addCardToLocalStorage(currentCardNumber, valsSplit);
            console.log(localStorage);
        }
    });

    myEditButton.addEventListener("click", (e) => {
        let newValue = prompt("What do you want to change the card name to?");
        if (newValue != "") {
            myCardNameValue.innerHTML = newValue;
            let myValue = localStorage.getItem(currentCardNumber);
            if (!myValue) return;
            let myValsSplit = myValue.split(",");
            myValsSplit[1] = newValue;
            myValsSplit.toString();
            addCardToLocalStorage(currentCardNumber, myValsSplit);
        }
    });

    myDeleteButton.addEventListener("click", (e) => {
        let selectedDeleteButton = e.target;
        let parentDiv = selectedDeleteButton.parentNode.parentNode;
        parentDiv.remove();
        localStorage.removeItem(currentCardNumber);
        console.log("card number when deleting: " + currentCardNumber);
        console.log(localStorage);
    });

    completedButton.addEventListener("click", () => {
        myCheckBoxValue = !(myCheckBoxValue === "true" || myCheckBoxValue === true);
        completedButton.innerText = myCheckBoxValue ? "⍻" : "✔";
        let value = localStorage.getItem(currentCardNumber);
        if (!value) return;
        let valsSplit = value.split(",");
        valsSplit[2] = myCheckBoxValue;
        valsSplit.toString();
        addCardToLocalStorage(currentCardNumber, valsSplit);
        console.log(localStorage);
    });

    if (!fromStorage) {
        addCardToLocalStorage(currentCardNumber, [myCardPriority, cardName, myCheckBoxValue, myDatePicked]);
        cardNumber++;
    }

    if (myCheckBoxValue != undefined) {
        myCheckBoxValue = myCheckBoxValue === "true" || myCheckBoxValue === true;
        completedButton.innerText = myCheckBoxValue ? "✔" : "⍻";
    }

    console.log(localStorage);
    myEditButtons = document.getElementsByClassName("edit");
}

function addCardToLocalStorage(map, key) {
    localStorage.setItem(map, key);
}

deleteCompletedButton.addEventListener("click", deleteCompleted);

lowPriorityButton.addEventListener("click", () => {
    hideCards("mediumPriority");
    hideCards("highPriority");
    displayCards("lowPriority");
});

mediumPriorityButton.addEventListener("click", () => {
    hideCards("lowPriority");
    hideCards("highPriority");
    displayCards("mediumPriority");
});

highPriorityButton.addEventListener("click", () => {
    hideCards("lowPriority");
    hideCards("mediumPriority");
    displayCards("highPriority");
});

displayAllCards.addEventListener("click", () => {
    displayCards("lowPriority");
    displayCards("mediumPriority");
    displayCards("highPriority");
});

function hideCards(className) {
    const cards = document.getElementsByClassName(className);
    if (cards.length == 0) {
        return;
    } else {
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.display = "none";
        }
    }
}

function displayCards(className) {
    const cards = document.getElementsByClassName(className);
    if (cards.length == 0) {
        return;
    } else {
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.display = "flex";
        }
    }
}

function deleteCompleted() {
    const cardList = document.getElementsByClassName("card");

    for (let i = cardList.length - 1; i >= 0; i--) {
        const button = cardList[i].querySelector(".completedButton");
        const card = cardList[i];

        if (button && button.innerText === "✔") {
            card.remove();
            localStorage.removeItem(card.id);
        }
    }
}

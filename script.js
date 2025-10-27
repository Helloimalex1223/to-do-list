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


// ===== Local Storage Setup =====
let cardNumber;
let localStorageLength = localStorage.length;

console.log("local storage length " + localStorageLength);

if(localStorageLength == 0)
{
    cardNumber = 0;
}
else if(localStorageLength > 0) {
    const keys = Object.keys(localStorage).map(Number).sort((a,b)=>a-b);
    for (let key of keys) {
        const value = localStorage.getItem(key);
        const valSplit = value.split(",");
        addCard(valSplit[1], valSplit[0], valSplit[2], valSplit[3], true);
    }
    cardNumber = keys[keys.length - 1] + 1;
}


// ===== Add Card Button Logic =====
addItemButton.addEventListener("click", () =>
{
    if(toDoName.value != "")
    {
        console.log(toDoName.value);
        addCard(toDoName.value);
        toDoName.value = "";
    }
});


// ===== Add Card Function =====
function addCard(cardName, cardPriority, checkBoxValue, datePicked, fromStorage = false)
{
    const currentCardNumber = cardNumber;
    let myCardPriority = cardPriority || undefined;
    let myCheckBoxValue = checkBoxValue || false;
    let myDatePicked = datePicked || undefined;

    let newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.setAttribute("id", cardNumber);
    if (myCardPriority && myCardPriority !== "select") {
        newCard.classList.add(myCardPriority);
    }

    // ===== Left Side of Card (Title + Priority + Due Date) =====
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
    leftSideCardDiv.appendChild(selectionDiv);

    newCard.appendChild(leftSideCardDiv);
    toDoContainer.appendChild(newCard);

    // ===== Priority Menu =====
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

    // ===== Due Date =====
    let myDateDiv = document.createElement("div");
    myDateDiv.classList.add("dateDivContainer");

    let myDatePicker = document.createElement("input");
    myDatePicker.setAttribute("type", "date");
    myDatePicker.setAttribute("id", "myDateInput" + cardNumber);

    let myDatePickerLabel = document.createElement("label");
    myDatePickerLabel.setAttribute("for", "datePicker");
    myDatePicker.setAttribute("class", "datePicker");
    myDatePickerLabel.innerHTML = "Due:";

    myDateDiv.appendChild(myDatePickerLabel);
    myDateDiv.appendChild(myDatePicker);
    leftSideCardDiv.appendChild(myDateDiv);

    if(datePicked != undefined)
    {
        myDatePicker.value = datePicked;
    }


    // ===== Button + Checkbox Section =====
    let myButtonsContainer = document.createElement("div");
    myButtonsContainer.classList.add("actionButtons");

    let myEditButton = document.createElement("button");
    myEditButton.classList.add("edit");
    myEditButton.innerText = "✎";
    myEditButton.setAttribute("id", cardNumber);

    let myDeleteButton = document.createElement("button");
    myDeleteButton.classList.add("delete");
    myDeleteButton.innerText = "X";

    let completedCheckBox = document.createElement("input");
    completedCheckBox.setAttribute("type", "checkbox");
    completedCheckBox.classList.add("completedCheckbox");

    let completedCheckBoxLabel = document.createElement("label");
    completedCheckBoxLabel.setAttribute("for", "completedCheckbox");
    completedCheckBoxLabel.innerHTML = "Completed";

    myButtonsContainer.appendChild(myEditButton);
    myButtonsContainer.appendChild(myDeleteButton);
    myButtonsContainer.appendChild(completedCheckBox);

    newCard.appendChild(myButtonsContainer);


    // ===== Event Listeners for Card Elements =====
    priorityMenuList.addEventListener("change", (e) =>
    {
        if(newCard.classList.contains("lowPriority"))
        {
            newCard.classList.remove("lowPriority");
        }
        else if(newCard.classList.contains("mediumPriority"))
        {
            newCard.classList.remove("mediumPriority");
        }
        else if(newCard.classList.contains("highPriority"))
        {
            newCard.classList.remove("highPriority");
        }

        if(e.target.value == "low")
        {
            newCard.classList.add("lowPriority");
        }
        else if(e.target.value == "medium")
        {
            newCard.classList.add("mediumPriority");
        }
        else if(e.target.value == "high")
        {
            newCard.classList.add("highPriority");
        }

        let isCheckboxChecked = false;
        const checkbox = newCard.querySelector(".completedCheckbox");
        if(checkbox.checked)
        {
            isCheckboxChecked = true;
        }

        let myValue = localStorage.getItem(currentCardNumber);
        let myValsSplit = myValue.split(",");
        myValsSplit[0] = newCard.classList.value.split(" ")[1];
        myValsSplit.toString();
        addCardToLocalStorage(currentCardNumber, myValsSplit);
        console.log(localStorage);
    });

    myDatePicker.addEventListener("change", () => 
    {
        if(myDatePicker !== "")
        {
            let value = localStorage.getItem(currentCardNumber);
            let valsSplit = value.split(",");
            valsSplit[3] = myDatePicker.value;
            valsSplit.toString();
            addCardToLocalStorage(currentCardNumber, valsSplit);
            console.log(localStorage);
        }
    });

    myEditButton.addEventListener("click", (e) =>
    {        
        let newValue = prompt("What do you want to change the card name to?");
        if(newValue != "")
        {
            myCardNameValue.innerHTML = newValue;
            let myValue = localStorage.getItem(currentCardNumber);
            let myValsSplit = myValue.split(",");
            myValsSplit[1] = newValue;
            myValsSplit.toString();
            addCardToLocalStorage(currentCardNumber, myValsSplit);
        }
    });

    myDeleteButton.addEventListener("click", (e) =>
    {
        let selectedDeleteButton = e.target;
        let parentDiv = selectedDeleteButton.parentNode.parentNode;
        parentDiv.remove();
        localStorage.removeItem(currentCardNumber);
        console.log("card number when deleting: " + currentCardNumber);
        console.log(localStorage);
    });

    completedCheckBox.addEventListener("click", () => {
        const checkbox = newCard.querySelector(".completedCheckbox");
        let value = localStorage.getItem(currentCardNumber);
        let valsSplit = value.split(",");
        valsSplit[2] = checkbox.checked;
        valsSplit.toString();
        addCardToLocalStorage(currentCardNumber, valsSplit);
        console.log(localStorage);
    });


    // ===== Local Storage Save =====
    if (!fromStorage) {
        addCardToLocalStorage(currentCardNumber, [myCardPriority, cardName, myCheckBoxValue, myDatePicked]);
        cardNumber++;
    }

    if(myCheckBoxValue != undefined)
    {
        myCheckBoxValue = (myCheckBoxValue === "true" || myCheckBoxValue === true);
        completedCheckBox.checked = myCheckBoxValue;
    }

    if (!fromStorage) {
        cardNumber++;
    }

    console.log(localStorage);
    myEditButtons = document.getElementsByClassName("edit");
}


// ===== Local Storage Helper =====
function addCardToLocalStorage(map, key)
{
    localStorage.setItem(map, key);
}


// ===== Filter Buttons =====
deleteCompletedButton.addEventListener("click", deleteCompleted);

lowPriorityButton.addEventListener("click", () =>
{
    hideCards("mediumPriority");
    hideCards("highPriority");
    displayCards("lowPriority");
});

mediumPriorityButton.addEventListener("click", () =>
{
    hideCards("lowPriority");
    hideCards("highPriority");
    displayCards("mediumPriority");
});

highPriorityButton.addEventListener("click", () =>
{
    hideCards("lowPriority");
    hideCards("mediumPriority");
    displayCards("highPriority");
});

displayAllCards.addEventListener("click", () =>
{
    displayCards("lowPriority");
    displayCards("mediumPriority");
    displayCards("highPriority");
});


// ===== Show/Hide Functions =====
function hideCards(className)
{
    const cards = document.getElementsByClassName(className);
    if(cards.length == 0)
    {
        return;
    }
    else
    {
        for(let i = 0; i < cards.length; i++)
        {
            cards[i].style.display = "none";
        }
    }
}

function displayCards(className)
{
    const cards = document.getElementsByClassName(className);
    if(cards.length == 0)
    {
        return;
    }
    else
    {
        for(let i = 0; i < cards.length; i++)
        {
            cards[i].style.display = "flex";
        }
    }
}


// ===== Delete Completed =====
function deleteCompleted() {
    const cardList = document.getElementsByClassName("card");

    for (let i = cardList.length - 1; i >= 0; i--) 
    {
        const checkbox = cardList[i].querySelector(".completedCheckbox");
        const card = cardList[i];
    
        if (checkbox && checkbox.checked) 
        {
            card.remove();
            localStorage.removeItem(card.id);
        }
    }
}

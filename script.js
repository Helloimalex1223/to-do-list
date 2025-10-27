const toDoName = document.getElementById("toDoListName");
const addItemButton = document.getElementById("addItem");
const toDoContainer = document.getElementById("addCardHere");
const lowPriorityButton = document.getElementById("lowPriorityFilter");
const mediumPriorityButton = document.getElementById("mediumPriorityFilter");
const highPriorityButton = document.getElementById("highPriorityFilter");
const deleteCompletedButton = document.getElementById("deleteCompleted");
const displayAllCards = document.getElementById("displayAllCards");
let selectedParentElement;

//defines the card number. The value starts from the last key in the localStorage. If there are no keys in the localStorage, start from 0.
//Set the id to the cardNumber variable. If the id already exists in the localStorage, increment the id
let cardNumber;
let localStorageLength = localStorage.length;

// localStorage.clear();

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


addItemButton.addEventListener("click", () =>
{
    if(toDoName.value != "")
    {
        console.log(toDoName.value);
        addCard(toDoName.value);
        toDoName.value = "";
    }
});

function addCard(cardName, cardPriority, checkBoxValue, datePicked, fromStorage = false)
{
    //create a constant of this card's particular card number. This is so when you go to retrieve a value in localStorage, you don't use the already incremented cardNumber value
    const currentCardNumber = cardNumber;


    //need to set the default values if the card information is not defined by the user (like in the case of the usre manually adding a card vs. reading from localStorage)
    let myCardPriority = cardPriority || undefined;
    let myCheckBoxValue = checkBoxValue || false;
    let myDatePicked = datePicked || undefined;

    let newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.setAttribute("id", cardNumber);

    //sets the card's priority (when read from localStorage)
    if (myCardPriority && myCardPriority !== "select") {
        newCard.classList.add(myCardPriority);
    }

    let myCardNameValue = document.createElement("h2");
    myCardNameValue.classList.add("innerCardName");
    myCardNameValue.innerHTML = cardName;

    newCard.appendChild(myCardNameValue);
    toDoContainer.appendChild(newCard);

    //add a selection menu div
    let selectionDiv = document.createElement("div");
    selectionDiv.classList.add("selectionContainer");

    //add the priority selection menu in the DOM
    let priorityMenuLabel = document.createElement("label");
    priorityMenuLabel.setAttribute("for", "priorityOptions");
    priorityMenuLabel.innerHTML = "Priority";
    selectionDiv.appendChild(priorityMenuLabel);
    
    
    let priorityMenuList = document.createElement("select");
    priorityMenuList.setAttribute("name", "priorityOptions");
    priorityMenuList.setAttribute("id", "priorityOptions");
    selectionDiv.appendChild(priorityMenuList);

    //menu options for the selection menu
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


    //checkbox div
    let checkboxDiv = document.createElement("div");
    checkboxDiv.classList.add("checkboxContainer");

    //adding the completed checkbox
    let completedCheckBox = document.createElement("input");
    completedCheckBox.setAttribute("type", "checkbox");
    completedCheckBox.classList.add("completedCheckbox");

    let completedCheckBoxLabel = document.createElement("label");
    completedCheckBoxLabel.setAttribute("for", "completedCheckbox");
    completedCheckBoxLabel.innerHTML = "Completed";

    priorityMenuList.addEventListener("change", (e) =>
    {
        //checks if the card already contains a class added by the select element. If so, remove it.
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

        //logic to determine the checkbox state before it's added to the localStorage
        let isCheckboxChecked = false;

        const checkbox = newCard.querySelector(".completedCheckbox");
        if(checkbox.checked)
        {
            isCheckboxChecked = true;
        }

        //update the card in localStorage when the card priority is changed, with the class name split on the priority class and the checkBox state
        let myValue = localStorage.getItem(currentCardNumber);
        let myValsSplit = myValue.split(",");
        myValsSplit[0] = newCard.classList.value.split(" ")[1];
        myValsSplit.toString();
        addCardToLocalStorage(currentCardNumber, myValsSplit);
        console.log(localStorage);

    });

    newCard.appendChild(selectionDiv);

    if (!fromStorage) {
        addCardToLocalStorage(currentCardNumber, [myCardPriority, cardName, myCheckBoxValue, myDatePicked]);
        cardNumber++;
    }

    let myButtonsContainer = document.createElement("div");
    myButtonsContainer.classList.add("actionButtons");

    let myEditButton = document.createElement("button");
    myEditButton.classList.add("edit");
    myEditButton.innerText = "Edit";
    myEditButton.setAttribute("id", cardNumber);

    //logic for editing a card's title
    myEditButton.addEventListener("click", (e) =>
    {        
        //prompts the user to edit the card
        let newValue = prompt("What do you want to change the card name to?");

        //changes the card's value to what the user entered.
        if(newValue != "")
        {
            myCardNameValue.innerHTML = newValue;
            //add the card to the localStorage with the updated value
            let myValue = localStorage.getItem(currentCardNumber);
            let myValsSplit = myValue.split(",");
            myValsSplit[1] = newValue;
            myValsSplit.toString();
            addCardToLocalStorage(currentCardNumber, myValsSplit);
        }

    });

    myButtonsContainer.appendChild(myEditButton);

    let myDeleteButton = document.createElement("button");
    myDeleteButton.classList.add("delete");
    myDeleteButton.innerText = "Delete";
    myButtonsContainer.appendChild(myDeleteButton);

    //logic for deleting a card
    myDeleteButton.addEventListener("click", (e) =>
        {
            //set the seleted delete button to the clicked button
            let selectedDeleteButton = e.target;
            let parentDiv = selectedDeleteButton.parentNode.parentNode;
            parentDiv.remove();
            localStorage.removeItem(currentCardNumber);
            console.log("card number when deleting: " + currentCardNumber);
            console.log(localStorage);
        });

    newCard.appendChild(myButtonsContainer);

    checkboxDiv.appendChild(completedCheckBoxLabel);
    checkboxDiv.appendChild(completedCheckBox);

    //add the date picker to the card
    let myDateDiv = document.createElement("div");
    myDateDiv.classList.add("dateDivContainer");

    let myDatePicker = document.createElement("input");
    myDatePicker.setAttribute("type", "date");
    myDatePicker.setAttribute("id", "myDateInput" + cardNumber);

    let myDatePickerLabel = document.createElement("label");
    myDatePickerLabel.setAttribute("for", "datePicker");
    myDatePicker.setAttribute("class", "datePicker");
    myDatePickerLabel.innerHTML = "Due Date";

    myDateDiv.appendChild(myDatePickerLabel);
    myDateDiv.appendChild(myDatePicker);

    if(datePicked != undefined)
    {
        myDatePicker.value = datePicked;
    }

    //when the date value is changed, output that to the console
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

    //if the checkBoxValue is set to true, check the checkbox
    if(myCheckBoxValue != undefined)
    {
        myCheckBoxValue = (myCheckBoxValue === "true" || myCheckBoxValue === true);
        completedCheckBox.checked = myCheckBoxValue;
    }

            
    //update the checkbox variable in the local storage when the checkbox is clicked
    completedCheckBox.addEventListener("click", () => {

        const checkbox = newCard.querySelector(".completedCheckbox");

            let value = localStorage.getItem(currentCardNumber);
            let valsSplit = value.split(",");
            valsSplit[2] = checkbox.checked;
            valsSplit.toString();
            addCardToLocalStorage(currentCardNumber, valsSplit);
            console.log(localStorage);
});


    newCard.appendChild(myDateDiv);

    newCard.appendChild(checkboxDiv);

    //increment the cardNumber variable if the card is not being rebuilt from storage
    if (!fromStorage) {
        cardNumber++;
    }
    console.log(localStorage);

    //update the myEditButtons nodeList after each new card is added
    myEditButtons = document.getElementsByClassName("edit");

    
}

function addCardToLocalStorage(map, key)
{
    localStorage.setItem(map, key);
}

deleteCompletedButton.addEventListener("click", deleteCompleted);



//hide all cards that are not a low priority
lowPriorityButton.addEventListener("click", () =>
{
    hideCards("mediumPriority");
    hideCards("highPriority");
    displayCards("lowPriority");
});

//hide all cards that are not a medium priority
mediumPriorityButton.addEventListener("click", () =>
{
    hideCards("lowPriority");
    hideCards("highPriority");
    displayCards("mediumPriority");
});

//hide all cards that are not a high priority
highPriorityButton.addEventListener("click", () =>
{
    hideCards("lowPriority");
    hideCards("mediumPriority");
    displayCards("highPriority");
});

//hide all cards that are not a high priority
displayAllCards.addEventListener("click", () =>
{
    displayCards("lowPriority");
    displayCards("mediumPriority");
    displayCards("highPriority");
});

//functions to only display cards with a certain class name
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


function deleteCompleted() {
    const cardList = document.getElementsByClassName("card");

    for (let i = cardList.length - 1; i >= 0; i--) 
        {
        // find the checkbox inside the current card
            const checkbox = cardList[i].querySelector(".completedCheckbox");
            const card = cardList[i];
        
            if (checkbox && checkbox.checked) 
            {
                card.remove();
                localStorage.removeItem(card.id);
            }
        }
}


//Storage controller

const StorageCtrl = (function(){

    //Public methods
    return {
        storeItem: function(item){
            let items; 
            //Check if any items in ls
            if(localStorage.getItem('items') === null){
                items = [];
                //Push new item
                items.push(item);
                //Set ls
                localStorage.setItem('items', JSON.stringify(items));

            }else {
                //Get stored items in ls
                items = JSON.parse(localStorage.getItem('items'));

                //Push the new item
                items.push(item);

                //Reset ls
                localStorage.setItem('items', JSON.stringify(items));


            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else {
                items = JSON.parse(localStorage.getItem('items'));
                // console.log(items);
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item,index){
                if(updatedItem.id === item.id){
                    items.splice(index,1,updatedItem);
                }
            });

            //Reset ls
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item,index){
                if(id === item.id){
                    items.splice(index,1);
                }
            });

            //Reset ls
            localStorage.setItem('items', JSON.stringify(items));
        },
        removeItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();
//Item Controller

const ItemCtrl = (function(){
  
    //Item Constructor
    const Item = function(id,name,calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / state
    const data = {
        // items : [
        //     // {id:0,name:'Steak Dinner',calories:1200},
        //     // {id:1,name:'Biscuit',calories:300},
        //     // {id:2,name:'Eggs ',calories:400}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem : null,
        totalCalories : 0  
    }

    //Public Methods
    return {
        getItems:function(){
            return data.items;
        },
        addItem: function(name,calories){
           let ID;
           //Create ID
           if(data.items.length > 0){
               ID = data.items[data.items.length -1].id + 1;
           }else {
               ID = 0;
           }

           //Calories to number
           calories = parseInt(calories);

           //Create new
           newItem = new Item(ID,name,calories);

           //Add to items array
           data.items.push(newItem);

           return newItem; 
        },
        getTotalCalories: function(){
            let total = 0;

            //Loop through items and add cals
            data.items.forEach(function(item){
                total += item.calories;
            });

            //Set total calories in data structure
            data.totalCalories = total;

            //Return total cal
            return data.totalCalories;
        },
        clearAllItems: function(){
            data.items = [];
        },
        getItemById: function(id){
            let found = null;
            //Loopthrough items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name,calories){
            //Calories to number
            calories = parseInt(calories);

            let found = null;
            
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            
            return found;
        },
        getcurrentItem: function(){
            return data.currentItem;
        },
        deteItem: function(id){
            //Get ids
            const ids = data.items.map(function(item){
                return item.id;
            });

            //Get index
            const index = ids.indexOf(id);

            //Remove item
            data.items.splice(index,1);
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        logData: function() {
            return data;
        }
    }

})();

    



//UI Contriller
const UICtrl = (function(){

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        clearBtn: '.clear-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput:'#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories:'.total-calories'
    }

    //Public Methods
    return {
        populateItemList: function(items) {
            let html= '';
            
            items.forEach(function(item){
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="fa fa-pencil"></i>
                    </a>
                </li>
                `;
            });

            //Insert list Items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            //Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create Li eliment
            const li = document.createElement('li');
            //Add class
            li.className = 'collection-item';
            //Add ID
            li.id = `item-${item.id}`;
            //Add HTML
            li.innerHTML = `
                <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            //Inset item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getcurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value =ItemCtrl.getcurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(ListItem){
                const itemID = ListItem.getAttribute('id');

                // console.log(item.id);

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    `;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
  
})();


//App Controller
const App = (function(ItemCtrl,StorageCtrl,UICtrl){
  //Load EventListners
    const loadEventListners = function(){
        //Get UISelectors
        const UISelectors = UICtrl.getSelectors();

        //Addm item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });
        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

        //Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

        //Update delete event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

        //Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);

        //Clear all event
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);

    }

    //Add item submit
    const itemAddSubmit = function(e){

        //Get form input from a UI controller
        const input = UICtrl.getItemInput();

        //Check for name and calorie input
        if(input.name !== '' & input.calories !== ''){
            
            //Add item
            const newItem = ItemCtrl.addItem(input.name,input.calories);

            //Add item to the UI list
            UICtrl.addListItem(newItem);

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //ADD total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Store in local storage
            StorageCtrl.storeItem(newItem);

            //Clear fields
            UICtrl.clearInput();

        }

        e.preventDefault();
    }

    //Click edit item
    const itemEditClick = function(e){

        if(e.target.classList.contains('edit-item')){
           //Get the list item id
           const listId = e.target.parentNode.parentNode.id;
           //Break in to an array
           const listIdArr = listId.split('-');
           //Get the actual id
           const id = parseInt(listIdArr[1]);
           //Get item id
           const itemToEdit = ItemCtrl.getItemById(id);
           //Set current item
           ItemCtrl.setCurrentItem(itemToEdit);
           //Add item to form
           UICtrl.addItemToForm(itemToEdit);
           
        }
       

        e.preventDefault();
    }

    //Item update submit
    const itemUpdateSubmit = function(e){

        //Get item input
        const input = UICtrl.getItemInput();

        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name,input.calories);

        //Update UI
        UICtrl.updateListItem(updatedItem);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //ADD total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();


        e.preventDefault();
    }

    //Item delete button

    const itemDeleteSubmit = function(e){

        //Get corrent item
        const currentItem = ItemCtrl.getcurrentItem();

        //Delete from the data structure
        ItemCtrl.deteItem(currentItem.id);

        //Delete from UI 
        UICtrl.deleteListItem(currentItem.id);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //ADD total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();


        e.preventDefault();
    }

    //Clear all items event
    const clearAllItemsClick = function(e){
        //Delete all items from the data structure
        ItemCtrl.clearAllItems();

        const totalCalories = ItemCtrl.getTotalCalories();

        //ADD total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        //Remove from UI
        UICtrl.removeItems();

        //Clear from local storage
        StorageCtrl.removeItemsFromStorage();

       

        //Hide the list
        UICtrl.hideList();
    }

  //Public Methods  
  return {
      init: function(){

        //clear edit state/ set initial state
        UICtrl.clearEditState();

        console.log('Initializing App....');

        //Fetch items from data structure
        const items = ItemCtrl.getItems();

        // Check if any items
         if(items.length === 0){
            UICtrl.hideList();
         }else{
            //Populate lists
            UICtrl.populateItemList(items);
         }

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //ADD total calories to UI
        UICtrl.showTotalCalories();       

        //Load Event Listners
        loadEventListners();
      }
  }
})(ItemCtrl,StorageCtrl,UICtrl);

//Initialize App

App.init();


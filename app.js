//Storage Controller
  const StorageCtrl = (function(){


    return {
      storeItem: function (item) {
        let items
        if (localStorage.getItem('items') === null) {
          items = []
          items.push(item)
          localStorage.setItem('items', JSON.stringify(items))
        }else{
          items = JSON.parse(localStorage.getItem('items'))

          items.push(item)

          localStorage.setItem('items', JSON.stringify(items))
        }

      },

      getItemsFromStorage: function(){
        let items;
        if(localStorage.getItem('items')===null){
          items = []
        }else{
          items= JSON.parse(localStorage.getItem('items'))
        }

        return items
      },

      updateItemStorage: function(updatedItem){
        let items = JSON.parse(localStorage.getItem('items'))

        items.forEach(function(item, index){
          if(updatedItem.id === item.id){
            items.splice(index, 1, updatedItem)
          }
        })

        localStorage.setItem('items', JSON.stringify(items))

      },

      deleteItemFromStorage: function(id){
        let items = JSON.parse(localStorage.getItem('items'))

        items.forEach(function(item, index){
          if(id === item.id){
            items.splice(index, 1)
          }
        })

        localStorage.setItem('items', JSON.stringify(items))
      },

      clearItemsFromStorage: function(){
        localStorage.removeItem('items')
      }

    }

  })()



//Item Controller
  const ItemCtrl = (function(){
    //Item Constructor
    const Item = function(id, name, calories){
      this.id = id,
      this.name = name,
      this.calories = calories
    }

    //data
    const data = {

      items: StorageCtrl.getItemsFromStorage(),

      currentItem : null,
      totalCalories : 0
    }

    return{

      getItems: function(){
        return data.items
      },

      addItem: function(name, calories){
        let ID;
        // creating ID
         if(data.items.length > 0){
          ID = data.items[data.items.length - 1].id + 1
        }else {
          ID = 0
        }

        //calories to number
       calories = parseInt(calories)

        // new item
        newItem = new Item(ID, name, calories)

        //add to items array
        data.items.push(newItem)


        return newItem;
      },


      getItemById: function(id){
        let found = null
        //loop through items
        data.items.forEach(function(item){
          if(item.id === id)
          found = item
        })
        return found
      },

      setCurrentItem: function(item){
        data.currentItem = item
      },

      deleteItem: function(id){
        const  ids = data.items.map(function(item){
          return item.id
        })

        const index = ids.indexOf(id)

        data.items.splice(index,1)
      },

      clearAllItems: function(){
        data.items = []
      },

      updateItem: function(name, calories){

        calories = parseInt(calories)

        let found = null

        data.items.forEach(function(item){
          if(item.id === data.currentItem.id){
           item.name = name
           item.calories = calories
           found = item
          }
        })
        return found
      },

      getCurrentItem: function(){
        return data.currentItem
        },

      updateTotalCalorie: function(){
        let total = 0;

        data.items.forEach(function(item){
          total += item.calories
        })
        //set total calories
        data.totalCalories = total

        return data.totalCalories;

      },

      logData: function(){
        return data
      }
    }

  })()


// UI Controller
  const UICtrl = (function(){

    const UISelector ={
      itemList: '#item-list',
      listItems: '#item-list li',
      addBtn: '.add-btn',
      updateBtn: '.update-btn',
      deleteBtn: '.delete-btn',
      backBtn: '.back-btn',
      clearBtn: '.clear-btn',
      itemNameInput: '#item-name',
      itemCaloriesInput: '#item-calories',
      totalCalories: '.total-calories'
    }

    let html = ''
    return {
      populateItemsList: function(items){

        html = ''

        items.forEach(function(item){
          html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`
        })

        //insert into app item list
        document.querySelector(UISelector.itemList).innerHTML = html
      },

      getItemInput: function(){

        return {
          name: document.querySelector(UISelector.itemNameInput).value,
          calories: document.querySelector(UISelector.itemCaloriesInput).value
        }
      },

      updateUIList: function(item){

        // show the list
        document.querySelector(UISelector.itemList).style.display = 'block'


        const li = document.createElement('li')
        li.className = 'collection-item'
        li.id = `item-${item.id}`
        li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`
        document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li)


      },

      deleteListItem: function(id){
        const itemID = `#item-${id}`
        const item = document.querySelector(itemID)
        item.remove()
      },

      updateListItem: function(item){
        let listItems = document.querySelectorAll(UISelector.listItems)
        listItems = Array.from(listItems)

        listItems.forEach(function(listItem){

          const itemID = listItem.getAttribute('id')


          if (itemID === `item-${item.id}`) {
            document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`
          }

        })

      },

      clearInput: function(){
        document.querySelector(UISelector.itemNameInput).value = ''
        document.querySelector(UISelector.itemCaloriesInput).value = ''
      },

      addItemToForm: function(){
        document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name
        document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories
        UICtrl.showEditState()
      },
      showTotalCalories: function(totalCalories){
        document.querySelector(UISelector.totalCalories).textContent = totalCalories
      },

      removeItems: function(){
        let listItems = document.querySelectorAll(UISelector.listItems)
        listItems = Array.from(listItems)
        listItems.forEach(function(item){
          item.remove()
        })

      },

      clearEditState: function(){
        UICtrl.clearInput()
        document.querySelector(UISelector.updateBtn).style.display = 'none'
        document.querySelector(UISelector.deleteBtn).style.display = 'none'
        document.querySelector(UISelector.backBtn).style.display = 'none'
        document.querySelector(UISelector.addBtn).style.display = 'inline'
      },

      showEditState: function(){
        document.querySelector(UISelector.updateBtn).style.display = 'inline'
        document.querySelector(UISelector.deleteBtn).style.display = 'inline'
        document.querySelector(UISelector.backBtn).style.display = 'inline'
        document.querySelector(UISelector.addBtn).style.display = 'none'
      },

      hideList: function(){
        document.querySelector(UISelector.itemList).style.display = 'none'
      },

      getSelectors: function(){
        return UISelector
      }
    }
  })()



//App Controller
  const App = (function(ItemCtrl,StorageCtrl, UICtrl){

  // Event Listners
    const loadEventlistners = function(){
      // get UI Selectors
      const UISelector = UICtrl.getSelectors()

      // Add item event
      document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit)
      document.addEventListener('keypress', function(e){
        if(e.keyCode === 13 || e.which === 13 ){
          e.preventDefault()
          return false
        }
      })

      //edit icon click event
      document.querySelector(UISelector.itemList).addEventListener('click', itemEditClick)

      //update event listners
      document.querySelector(UISelector.updateBtn).addEventListener('click', itemUpdateMeal)

      //back button
      document.querySelector(UISelector.backBtn).addEventListener('click', UICtrl.clearEditState)

      //delete item event
      document.querySelector(UISelector.deleteBtn).addEventListener('click', itemDeleteSubmit)

      //clear all
      document.querySelector(UISelector.clearBtn).addEventListener('click', clearAllItemsCLick)

    }

      //Add items from ui to ds after submit
      const itemAddSubmit =(e)=>{

        const input = UICtrl.getItemInput()

        if (input.name !== '' && input.calories !== '') {
          const newItem = ItemCtrl.addItem(input.name, input.calories)

            //add item to ui
            UICtrl.updateUIList(newItem)

            const totalCalories = ItemCtrl.updateTotalCalorie()

            // add to ui
            UICtrl.showTotalCalories(totalCalories)

            //additng to ls
            StorageCtrl.storeItem(newItem)


            //clear input
            UICtrl.clearInput()
        }

        e.preventDefault()
      }

    // edit items in list
    const itemEditClick = function(e){
      if(e.target.classList.contains('edit-item')){
        //get list item id
        const listId = e.target.parentNode.parentNode.id

        //split into array
        const listIdArr = listId.split('-')

        const id = parseInt(listIdArr[1])
        //get item
        const itemToEdit = ItemCtrl.getItemById(id)

        ItemCtrl.setCurrentItem(itemToEdit)
        //add item to form
        UICtrl.addItemToForm()


      }

      e.preventDefault()
    }

    const itemDeleteSubmit = function(e){
      // get current item
      const currentItem = ItemCtrl.getCurrentItem()

      // delete from ds
      ItemCtrl.deleteItem(currentItem.id)

      UICtrl.deleteListItem(currentItem.id)

      const totalCalories = ItemCtrl.updateTotalCalorie()

      // add to ui
      UICtrl.showTotalCalories(totalCalories)

      //delete from ls
      StorageCtrl.deleteItemFromStorage(currentItem.id)

      UICtrl.clearEditState()

      e.preventDefault()
    }

    const clearAllItemsCLick = function(){

      ItemCtrl.clearAllItems()

      const totalCalories = ItemCtrl.updateTotalCalorie()

      // add to ui
      UICtrl.showTotalCalories(totalCalories)

      UICtrl.clearEditState()

      UICtrl.removeItems()

      //clear from ls
      StorageCtrl.clearItemsFromStorage()

      UICtrl.hideList()
    }
    //item update meal
    const itemUpdateMeal = function(e){
      //get Item Input
      const input = UICtrl.getItemInput()
      console.log(input);

      //update Item
      const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

      console.log(updatedItem);

      //update UI
      UICtrl.updateListItem(updatedItem)

      const totalCalories = ItemCtrl.updateTotalCalorie()

      // add to ui
      UICtrl.showTotalCalories(totalCalories)

      //update local storage
      StorageCtrl.updateItemStorage(updatedItem)

      UICtrl.clearEditState()

      e.preventDefault()
    }

    // Public Events

    return {
      init: function(){
        //set initial state
        UICtrl.clearEditState()

        //fetch items from data
        const items = ItemCtrl.getItems()

        if (items.length === 0) {
          UICtrl.hideList()
        }else{
        //add into/ populate list with items
          UICtrl.populateItemsList(items)
        }

        const totalCalories = ItemCtrl.updateTotalCalorie()

        // add to ui
        UICtrl.showTotalCalories(totalCalories)

        //load events listners
        loadEventlistners()
      }
    }

  })(ItemCtrl,StorageCtrl, UICtrl)



  App.init()

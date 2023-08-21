import { kebabCase, addPurchase } from "./utils";
import { addLoader, removeLoader } from "./components/loader.js";
import { deleteOrder } from "./components/deleteOrder";
import { patchOrder } from "./components/patchOrder";
import { findEvents } from "./components/findByLocationAndType";


const imageArray = [
  "https://playtech.ro/wp-content/uploads/2023/08/UNTOLD-Festival-2023-Ziua-1-3-au.jpg", //untold
  "https://www.stiridecluj.ro/files/images/193/fcca5539b5cccbd741128f6a79c7b12c.jpg", //electric
  "https://cdnuploads.aa.com.tr/uploads/Contents/2021/11/06/thumbs_b_c_c0f3083541183d22ac6e9ff1e20963bf.jpg?v=023244", //fotbal
  "https://radiofir.ro/wp-content/uploads/2023/06/Untitled-1_0.png.jpg", //neversea
  "https://cloudfront-us-east-2.images.arcpublishing.com/reuters/TBCVUQQXOFKRLLS24WKCPXU2GE.jpg" //basket

];

let index = 0;

//
// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `

   <div id="content" >
    <div class="homepage-img-container">
      <img class="homepage-image" src="https://images.wallpaperscraft.com/image/single/concert_crowd_people_134866_3840x2160.jpg">
      <div id="welcome">Discover new experiences</div>
    </div>
    <center> 
      <div>    
          <p style="margin-bottom:40px">What kind of event are you looking for?</p>
            <div class="search-container flex items-center space-x-2">
              <form>
                <input id="search-input" class="search-bar" type="text" placeholder="Search..">
              </form>
              <select style="height: 43px; border-radius:5px" id="search-field">
                <option value="event-name">Event Name</option>
                <option value="event-type">Event Type</option>
                <option value="location">Location</option>
              </select>
            </div>
          
            <p>Find events by multiple criterias: </p>
            <div class="filter-container">
            
              <p>Location:</p>
              <select id="location"></select>

              <p>Event Type</p>
              <select id="eventType"></select>

              <button id="filter-button">Search</button>
           
            </div>
            
      </center>   
      </div>     
      <div class="events flex items-center justify-center flex-wrap">
      </div>
  </div>
  `;
}

function getOrdersPageTemplate() {
  return `
  <div id="content" >
    <div class="containter">
    <div class="events flex items-center justify-center flex-wrap">
    <center><div class="loader"><img src="https://static.vecteezy.com/system/resources/previews/009/400/932/non_2x/kitty-cat-clipart-design-illustration-free-png.png"></div>
  </div>
  `;
}

let events = [];
/*FILTER EVENTS*/
async function liveSearch() {
  const eventsContainer = document.querySelector('.events');
  eventsContainer.innerHTML='';
  events = await fetchTicketEvents();

  const filterInput = document.querySelector('#search-input');
  const selectedField = document.querySelector('#search-field');

  if (filterInput) {
    const searchValue = filterInput.value;
    console.log(selectedField.value);

    if (searchValue !== undefined) {
      if(selectedField.value === "event-name") {
        const filteredEvents = events.filter((event) =>
        event.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        filteredEvents.forEach(event => {
          const eventCard = createEventCard(event);
          eventsContainer.appendChild(eventCard); });
        }
      
      else if(selectedField.value === "event-type") {
        const filteredEvents = events.filter((event) =>
        event.eventTypeID.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        filteredEvents.forEach(event => {
          const eventCard = createEventCard(event);
          eventsContainer.appendChild(eventCard); });
        }
      
      else {
        const filteredEvents = events.filter((event) =>
        event.locationID.location.toLowerCase().includes(searchValue.toLowerCase())
        );
        filteredEvents.forEach(event => {
          const eventCard = createEventCard(event);
          eventsContainer.appendChild(eventCard); });
        }
    }
            
  }
}

function setupFilterEvents() {
  const nameFilterInput = document.querySelector('#search-input');
  nameFilterInput.addEventListener('keyup', liveSearch);
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

async function fetchTicketEvents(){
  const response = await fetch('http://localhost:8080/event/getEvents');
  const data = await response.json();
  console.log(data);
  return data;
}

async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  const eventsContainer = document.querySelector('.events');
  setupFilterEvents();
  const filterInput = document.querySelector('#search-input');
  populateFilters();

  const search = document.querySelector('#filter-button');
  const event_type_search = document.querySelector('#eventType');
  const venue = document.querySelector('#location');
  
  search.addEventListener('click', function () {

    handleSearch(venue.value, event_type_search.value);
  });
  
  try {
    if (filterInput.value !== '') {
      liveSearch();
    }
    else {
      const eventData = await fetchTicketEvents();
      events = await fetchTicketEvents();
      eventData.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
    });
    }

  } catch (error) {
    console.error('Error fetching event data:', error);
  }
}

async function populateFilters() {
  const locationsDropdown = document.querySelector('#location');
  const eventTypeDropdown = document.querySelector('#eventType');
  try {
    const response1 = await fetch('http://localhost:8080/venue/venues');
    const data1 = await response1.json();
    console.log("response location", data1);
    locationsDropdown.innerHTML = '';

    data1.forEach(location => {
      const option = document.createElement('option');
      option.value = location.location; // You can set the value to a unique identifier
      option.textContent = location.location; // Display the location name
      locationsDropdown.appendChild(option);
    });

    const response2 = await fetch('http://localhost:8080/eventtype/eventtypes');
    const data2 = await response2.json();
    eventTypeDropdown.innerHTML = '';

    data2.forEach(eventType => {
      const option = document.createElement('option');
      option.value = eventType.name; // You can set the value to a unique identifier
      option.textContent = eventType.name; // Display the location name
      eventTypeDropdown.appendChild(option);
    });

  }catch (error) {
    console.log("Error:", error);
  }
}




function createEventCard(eventData) {
  
  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card');
  //const imgUrl = imageArray[index % imageArray.length];
  let id = eventData.eventID - 1;
  const imgUrl = imageArray[id];
  index++;

  console.log(eventData.ticketCategories);
  const contentMarkup = `
      <div class="product">
        <div class="product-header">
          <h2 class="product-name">${eventData.name}</h2>
        </div>

        <center>
        <div class="image-container">
          <div class="flip-box">
            <div class="flip-box-inner">
              <div class="flip-box-front">
                <img class="event-img" src="${imgUrl}">
              </div>
              <div class="flip-box-back">
                <h2 style="margin-top:40px">Location: ${eventData.locationID.location} </h2>
                <h2>Start Date: ${eventData.startDate} </h2>
                <h2>End Date: ${eventData.endDate} </h2>
                <h2>Ticket prices: ${eventData.ticketCategories.map(ticket => `<h3>${ticket.description} - ${ticket.price} </h3>`)} </h2>
              </div> 
            </div> 
        </div>
        
        </center>
        <center><p class="event-description">${eventData.description}</p></center>
      
        <div>
          <div style="margin-botttom:10px;">
            <label for="ticket-number" style="margin-left:20px;">Quantity:</label>
            <input class="ticket-number" type="number" value="0" min="0">
        
            <label for="ticket-dropdown" style="margin-left:20px;">Ticket Type:</label>
            <select class="ticket-dropdown">
              ${eventData.ticketCategories.map(ticket => `<option>${ticket.description}</option>`)}
            </select>
          </div>
        </div>
        
        <button class="add-to-cart-btn">Buy tickets</button>

      </div>    
  `;
  eventCard.innerHTML = contentMarkup;
  
  const addToCartButton = eventCard.querySelector('.add-to-cart-btn');
  const ticketNumber = eventCard.querySelector('.ticket-number');
  const ticketCategory = eventCard.querySelector('.ticket-dropdown');
  
  addToCartButton.addEventListener('click', function () {
        handleAddToCart(eventData, ticketCategory, ticketNumber, addToCartButton);
  });

  console.log(ticketNumber.value);
  ticketNumber.addEventListener('input', function () {
    if(parseInt(ticketNumber.value>0)) {
      handleAddToCart.removeAttribute("disabled");
    }
    else {
      handleAddToCart.setAttribute("disabled", "true");
    }
  });
    
  return eventCard;
}

const handleSearch = async (location, eventType) => {
  let data = [];
  data = await findEvents(location, eventType);
  if(data.length > 0) {
    displayToasterMessage("Events found");
  }
  else {
    displayToasterMessage("No events found");
  }
  const eventsContainer = document.querySelector('.events');
  eventsContainer.innerHTML='';
  data.forEach(event => {
    const eventCard = createEventCard(event);
    eventsContainer.appendChild(eventCard);
  });

}

const handleAddToCart = async (eventData, ticketCategory, ticketNumber, addToCartButton) => {
  const category = eventData.ticketCategories.find(category => category.description === ticketCategory.value);
  console.log(category);
  const selectedCategory = category.ticketCategoryID; // Get the selected ticket category from the dropdown
  const selectedEventID = eventData.eventID;
  const numberOfTickets = parseInt(ticketNumber.value);

  console.log(typeof selectedCategory);
  console.log(typeof selectedEventID);
  console.log(typeof numberOfTickets);

  ticketNumber.addEventListener('input', function () {
    if(parseInt(ticketNumber.value>0)) {
      handleAddToCart.removeAttribute("disabled");
    }
    else {
      handleAddToCart.setAttribute("disabled", "true");
    }
  });

  if (numberOfTickets > 0) {
    const requestBody = {
      eventID: selectedEventID,
      ticketCategoryID: selectedCategory,
      numberOfTickets: numberOfTickets,
    };

    try {
      const response = await fetch('http://localhost:8080/order/addOrderFromFE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        displayToasterMessage("Order created successfully");
        ticketNumber.value = 0;
        addToCartButton.disabled = true;
        // Handle success message or UI update
      } else {
        // Handle error case
        console.error('Error creating order:', response.statusText);
        displayToasterMessage("Error creating order");
      }
    } catch (error) {
      console.error('Error creating order:', error);
      displayToasterMessage("Error creating order");

    }
  } else {
    //addToCartButton.disabled = true;
    console.log('Number of tickets must be greater than 0.');
    displayToasterMessage("Number of tickets must be greater than 0");

  }
};

//--------------------------ORDERS------------------
async function fetchOrders(){
  const response = await fetch('http://localhost:8080/order/orders');
  const data = await response.json();
  console.log(data);
  return data;
}

export function displayToasterMessage(message) {
  const toaster = document.createElement("div");
  toaster.className = "toaster";
  toaster.textContent = message;

  document.body.appendChild(toaster);

  setTimeout(function() {
      toaster.remove();
  }, 3000); // Remove the toaster after 3 seconds
}

function createOrderCard(orderData) {
  const orderCard = document.createElement('div');
  orderCard.classList.add('order-card');
  
  //console.log(orderCard);
  const contentMarkup = `
    <div class="order-card-text">
      <h2><strong>Order ID: </strong>${orderData.orderID}</h2>
      <h2><strong>Ordered at: </strong> ${orderData.orderedAt}</h2>
      <h2><strong>Number of tickets:</strong> <span id="numberOfTickets">${orderData.numberOfTickets}</h2>
      <div id="ticketCategoryContainer">
        <h2><strong>Ticket category: </strong> <span id="ticketCategory">${orderData.ticketCategoryID.description} </h2>
      </div>
      <h2><strong>Total price: </strong> ${orderData.totalPrice}</h2>   
    </div>
    <center><div class="buttons-container">
      <button id="editButton">Edit</button>
      <button id="saveButton">Save</button>
      <button id="cancelButton">Cancel</button>
      <button id="deleteButton">Delete</button>
    </div>
  `;

  orderCard.innerHTML = contentMarkup;

  const deleteButton = orderCard.querySelector('#deleteButton');
  const editButton = orderCard.querySelector('#editButton');
  const cancelButton = orderCard.querySelector('#cancelButton');
  const saveButton = orderCard.querySelector('#saveButton');

  const orderIDElement = orderCard.querySelector('#numberOfTickets');
  const currentNumberOfTickets = orderIDElement.textContent;

  const TicketCategoryElement = orderCard.querySelector('#ticketCategory'); 
  const currentTicketCategory = TicketCategoryElement.textContent;


  //console.log("Button", editButton);
  let originalNoTickets = "";
  let originalTicketCategory = "";
 

  deleteButton.addEventListener('click', function () {
    if (confirm("Are you sure you want to delete this order?")) {
      handleDeleteOrder(orderData.orderID);
      orderCard.remove(); 
    }
  });

  let newTicketNumber;
  let newTicketCategory;
  const noTicketsInput = document.createElement("input");
  const categoryDropdown = document.createElement("select");

  editButton.addEventListener('click', async function () {
      
      categoryDropdown.style.borderRadius = "5px";
      const ticketCategoryContainer = document.getElementById("ticketCategoryContainer");
     
      categoryDropdown.id = "categoryDropdown";
      events = await fetchTicketEvents();
      const foundEvent = events.find(event => event.eventID === orderData.ticketCategoryID.eventID.eventID);
    
      for (const category of foundEvent.ticketCategories) {
        const option = document.createElement("option");
        option.value = category.description;
        option.textContent = category.description;
        categoryDropdown.appendChild(option);
      }

      originalTicketCategory = currentTicketCategory;
  
      noTicketsInput.value = currentNumberOfTickets;
      originalNoTickets = currentNumberOfTickets;
      
      noTicketsInput.style.borderRadius = "5px";

      orderIDElement.textContent = "";
      orderIDElement.appendChild(noTicketsInput);

      TicketCategoryElement.textContent = "";
      TicketCategoryElement.appendChild(categoryDropdown);

      
  });

  
  cancelButton.addEventListener('click', function () {
   
    orderIDElement.textContent = originalNoTickets;
    TicketCategoryElement.textContent = originalTicketCategory;
    const categoryDropdown = document.getElementById("categoryDropdown");
      if (categoryDropdown) {
        categoryDropdown.remove();
        
      }
  });

  saveButton.addEventListener('click', function () {
    newTicketNumber = noTicketsInput.value;
    console.log("newticketnumber", newTicketNumber);
    newTicketCategory = categoryDropdown.value;
    console.log("newticketcategory", newTicketCategory);

    if (newTicketNumber > 0 && newTicketNumber !== undefined) {
      handleEditOrder(orderData.orderID, newTicketNumber, newTicketCategory);
    }
    else {
      displayToasterMessage("Invalid input data");
    }
  });

  return orderCard;
}

const handleDeleteOrder = async (orderID) => {
  deleteOrder(orderID);
}

const handleEditOrder = async (orderID, newTicketNumber, newTicketCategory) => {
  patchOrder(orderID, newTicketNumber, newTicketCategory);
}

async function renderOrdersPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
  const ordersContainer = document.querySelector('.events');
  console.log(ordersContainer);
  
  const loader = document.querySelector(".loader");
  setTimeout(async () => {
    loader.style.display = "none";
    const orderData = await fetchOrders();

    orderData.forEach(order => {
      const orderCard = createOrderCard(order);
      ordersContainer.appendChild(orderCard); 
    }); 
  }, 1000);

  
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();

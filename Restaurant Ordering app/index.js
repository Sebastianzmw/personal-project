import { menuArray } from "./data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const modal = document.getElementById("modal");
const form = document.getElementById("form");

let orderList = [];
let userName = '';

document.addEventListener('click', function(event){
	handleClicks(event);
});

form.addEventListener('submit', function(e) {
	e.preventDefault();
	payOrder(e);
});

// Handle all click events
function handleClicks(event) {
	if (event.target.dataset.id && event.target.classList.contains("add-item-btn")){
		addOrderItem(event.target.dataset.id);
	} else if (event.target.dataset.uuid && event.target.classList.contains("remove-btn")) {
		removeOrderItem(event.target.dataset.uuid);
	} else if (event.target.id === "complete-order-btn") {
		showModal();
	}
}

// Generate HTML for menu items
function getItemHtml(){
	let	itemHtml = '';

	menuArray.forEach(item => {
		let ingredients = item.ingredients.join(', ');
		itemHtml += `
		<div class="item">
			<div class="item-info">
				<p class="item-emoji">${item.emoji}</p>
				<div class="item-description">
					<p class="item-name">${item.name}</p>
					<p class="item-ingredients">${ingredients}</p>
					<p class="item-price">RM ${item.price}</p>
				</div>
			</div>
			<button class="add-item-btn" data-id="${item.id}">+</button>
		</div>`;
	});
	return itemHtml;
}

// Add item to order
function addOrderItem(clickedId) {
	const menuItem = menuArray.find(item => item.id == clickedId);
	const uuid = uuidv4();
	orderList.push({...menuItem, uuid});
	render();
}

// Remove item from order
function removeOrderItem(clickedId) {
	const index = orderList.findIndex(order => order.uuid == clickedId);
	if (index >= 0) {
		orderList.splice(index, 1);
	}
	render();
}

// Generate HTML for order items
function getOrderListHtml() {
	let orderListHtml = '';

	orderList.forEach(item => {
		orderListHtml += `
		<div class="order-item">
			<div class="item-name-container">
				<p>${item.name}</p>
				<button class="remove-btn" data-uuid="${item.uuid}">remove</button>
			</div>
			<p>RM ${item.price}</p>
		</div>`;
	});
	return orderListHtml;
}

// Calculate total price
function getTotalOrderPrice() {
	return orderList.reduce((total, order) => total + order.price, 0);
}

// Generate HTML for order section
function getOrderHtml() {
	return `
	<p class="your-order">Your order</p>
	${getOrderListHtml()}
	<div class="total-price">
		<p>Total price</p>
		<p>RM ${getTotalOrderPrice()}</p>
	</div>
	<button id="complete-order-btn" class="complete-order-btn">Complete Order</button>`;
}

// Show payment modal
function showModal() {
	modal.style.display = "block";
}

// Process payment
function payOrder(event) {
	userName = event.target.name.value;
	resetModal();
	orderList = [];
	render();
	// Reset username after showing the thank you message
	setTimeout(() => {
		userName = '';
		render();
	}, 3000);
}

// Reset modal after payment
function resetModal() {
	form.reset();
	modal.style.display = "none";
}

// Render the app
function render() {
	document.getElementById('items').innerHTML = getItemHtml();

	const orderHtml = orderList.length > 0 ? getOrderHtml() : '';
	document.getElementById('order-lists').innerHTML = orderHtml;

	const orderCompleteHtml = userName ? 
		`<p class="order-complete">Thanks ${userName}! Your order is on its way!</p>` : '';
	document.getElementById('order-complete').innerHTML = orderCompleteHtml;
}

// Initialize the app
render();
async function renderCheckout() {
	let data = JSON.parse(localStorage.getItem('products'));
	let currUserId = sessionStorage.getItem('currUserId');
	let currentUserCartKey = 'cart_' + currUserId;
	// let cart = JSON.parse(localStorage.getItem(currentUserCartKey || "[]"));
	let cart = [];
        await fetch(`http://localhost:4000/api/getCart?user=${currUserId}`, {
            method: "GET",
          }).then((response) => response.json())
          .then((response) => {
            cart = response.items;
            console.log(cart);
        })
      .catch((error) => {
        console.log(error);
      });
      console.log(cart);
	if(cart.length > 0) {
		// let cartArr = cart.map(item => {
		// 	for(let i = 0; i < data.length; i++) {
		// 		if(data[i].id === item.id) {
		// 			return {...data[i], quantity:item.count}
		// 		}
		// 	}
		// });
		let rowContainer = document.getElementById('checkout-table-row');
		rowContainer.innerHTML = "";
		let total = 0;
		cart.forEach((item, index) => {
			total += (+item.quantity * +item.price);
			rowContainer.innerHTML += `
			<tr>
				<td class="t-row">${index + 1}</td>
				<td class="t-row">${item.name}</td>
				<td class="t-row">₹ ${item.price}</td>
				<td class="t-row">${item.quantity}</td>
				<td class="t-row">₹ ${+item.quantity * +item.price}</td>
			</tr>
			`;
		});
		document.getElementById('total').innerHTML = total;
	} else {
		document.getElementById('confirmPurchase').style.display = 'none';
	}



}
function confirmPurchase() {
	let currUserId = sessionStorage.getItem('currUserId');
	let currentUserCartKey = 'cart_' + currUserId;
	localStorage.setItem(currentUserCartKey, JSON.stringify([]));
	window.alert('Thank You for purchase.');
	window.location = '/index.html';
}

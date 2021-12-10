async function renderCart() {
    console.log("cart-called");
    let cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = "";
    let data = JSON.parse(localStorage.getItem('products'));
    if (sessionStorage.getItem('isAuthenticated')) {
        let currUserId = sessionStorage.getItem('currUserId');
        let currentUserCartKey = 'cart_' + currUserId;
        let cart = [];
        await fetch(`http://localhost:4000/api/getCart?user=${currUserId}`, {
            method: "GET",
          }).then(response => response.text())
          .then(response => {
            console.log(currUserId);
            let responseParsed = JSON.parse(response);
            cart = responseParsed.items;
            console.log(cart);
        })
      .catch((error) => {
        console.log(error);
      });
      console.log(cart);
        // console.log(cartArr);
        // // console.log(`Cart: ${cart}`);
        // // let cart = JSON.parse(localStorage.getItem(currentUserCartKey || "[]"));
        // let cartArr = cart.map(item => {
        //     if (data[i].id === item.productID) {
        //         return {...data[i], quantity: item.quantity}
        //     }
        // });
        // console.log(cartArr);
        cart.forEach((item, index) => {
            console.log(item);
            cartContainer.innerHTML += `
			<div class="cart-product-item">
			<div class="cart-prod-image">
				<img src="${item.imageURL}" alt="prod-image">
			</div>
			<div class="cart-prod-data" >
				<span id="cart-prod-title">${item.name}</span>
				<span id="cart-prod-price">₹ ${item.price}</span>
				<span class="edit-quant"><button class="edit-count-btn" onClick="removeByOne('${index}')"><i class="material-icons">remove</i></button><input type="text" name="quantity" id="quantity" class="quant-input" value="${item.quantity}" readonly><button class="edit-count-btn" onClick="addByOne('${index}')"><i class="material-icons">add</i></button></span>
			</div>
			<form action="javascript:removeFromCart('${index}')" class="remove-cart-btn">
							<button class="delete-btn" id="remove-from-cart" type="submit"><i class="material-icons">delete</i></button>
						</form>
		</div>
		<div class="vertical-space"></div>
			`;
        })
    } else {
        alert("You must login first!!");
        window.location = "./auth/login.html"
    }

}

function removeByOne(index) {
    let currUserId = sessionStorage.getItem('currUserId');
    let currentUserCartKey = 'cart_' + currUserId;
    let cart = JSON.parse(localStorage.getItem(currentUserCartKey || "[]"));
    console.log(cart[+index]);
    if (cart[+index].count === 1) {
        cart.splice(index, 1);
    } else {
        cart[+index].count--;
    }
    localStorage.setItem(currentUserCartKey, JSON.stringify(cart));
    window.location.reload();
}

function addByOne(index) {
    let currUserId = sessionStorage.getItem('currUserId');
    let currentUserCartKey = 'cart_' + currUserId;
    let cart = JSON.parse(localStorage.getItem(currentUserCartKey || "[]"));
    cart[+index].count++;
    localStorage.setItem(currentUserCartKey, JSON.stringify(cart));
    window.location.reload();
}

function removeFromCart(index) {
    console.log(index);
    console.log('removed from cart');
    let currUserId = sessionStorage.getItem('currUserId');
    let currentUserCartKey = 'cart_' + currUserId;
    let cart = JSON.parse(localStorage.getItem(currentUserCartKey || "[]"));
    cart.splice(index, 1);
    localStorage.setItem(currentUserCartKey, JSON.stringify(cart));
    window.location.reload();
}
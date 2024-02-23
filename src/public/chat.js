const socket = io();
const newMessage = () => {
  const msg = {
    user: document.getElementById("user").value,
    message: document.getElementById("message").value,
  };
  socket.emit("newMessage", msg);
  document.getElementById("message").value = "";
  return false;
};

socket.on("allMessages", (msgs) => {
  render(msgs);
});

const render = (data) => {
  const mychat = data
    .map((msg) => {
      return `
      <p>${msg.user}:${msg.message}</p>
      `;
    })
    .join(" ");
  document.getElementById("chat").innerHTML = mychat;
};

// Agregar el elemento al DOM
document.body.appendChild(messageInput);

// Agregar el event listener después de crear el elemento
messageInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    newMessage();
  }
});

const deleteMessage = (id) => {
  socket.emit("idDelete", id);
};
const newProduct = () => {
  const product = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    quantity: document.getElementById("quantity").value,
  };
  socket.emit("newProduct", product);
  document.getElementById("productForm").reset();
  return false;
};

socket.on("updateProducts", (products) => {
  renderProducts(products);
});
const renderProducts = (data) => {
  const productList = data
    .map((product) => {
      return `
      <div class="product">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <p>${product.quantity}<p>
      </div>
    `;
    })

    .join("");
  const productsDiv = document.getElementById("products");
  if (productsDiv) {
    productsDiv.innerHTML = productList;
  }
};

document.getElementById("productForm").addEventListener("submit", (event) => {
  event.preventDefault();
  newProduct();
});

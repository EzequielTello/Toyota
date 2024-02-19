document.addEventListener("DOMContentLoaded", function () {
  const socket = io();

  socket.on("message-all", (messages) => {
    renderMessages(messages);
  });
  socket.on("updateProducts", (products) => {
    renderProducts(products);
  });

  const renderMessages = (messages) => {
    const messagesList = messages
      .map((message) => {
        return `
          <div class="message">
              <div>
                  <strong>${message.user}</strong>
                  <p>${message.message}</p>
              </div>
              <div class="deleteContainer">
                  <button class="buttonDelete" onclick="deleteMessage('${message._id}')">x</button>
              </div>
          </div>
      `;
      })
      .join("");

    const chatDiv = document.getElementById("chatHandlebars");
    if (chatDiv) {
      chatDiv.innerHTML = messagesList;
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
    const userElement = document.getElementById("user");
    const messageElement = document.getElementById("message");
    if (userElement && messageElement) {
      userElement.value = "";
      messageElement.value = "";
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    // Crear el elemento 'message'
    const messageInput = document.createElement("input");
    messageInput.setAttribute("type", "text");
    messageInput.setAttribute("id", "message");
    messageInput.setAttribute("placeholder", "Type your message here...");

    // Agregar el elemento al DOM
    document.body.appendChild(messageInput);

    // Agregar el event listener después de crear el elemento
    messageInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        newMessage();
      }
    });
  });

  const newMessage = () => {
    const userElement = document.getElementById("user");
    const messageElement = document.getElementById("message");
    if (userElement && messageElement) {
      const message = {
        user: userElement.value,
        message: messageElement.value,
      };
      socket.emit("addMessage", message);
      return false;
    }
  };

  const deleteMessage = (id) => {
    socket.emit("idDelete", id);
  };

  const renderProducts = (products) => {
    const productList = products
      .map((product) => {
        return `
      <div class="product">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
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
    const formData = new FormData(event.target);
    const newProduct = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
    };
    socket.emit("newProduct", newProduct);
  });
});

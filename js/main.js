
function inicio(productosDeportivos) {
    let productosInicial = productosDeportivos
  
    let input = document.getElementById("buscar");
    input.addEventListener("input", () => filtrar(productosInicial, input));
  
    let boton = document.getElementById("boton");
    boton.addEventListener("click", () => filtrar(productosInicial, input));
  
    let filtrarPorCategoria = document.getElementsByClassName("botonParaFiltrar");
    for (const boton of filtrarPorCategoria) {
      boton.addEventListener("click", () => filtrar(productosInicial, boton));
    }
  
    let ocultarCarrito = document.getElementById("verCarrito");
    ocultarCarrito.addEventListener("click", verOcultar);
  
    let botonCompra = document.getElementById("botonParaComprar");
    botonCompra.addEventListener("click", () => finalizarCompra(productos));
  
    convertirCarrito();
    representarTarjetas(productosInicial);
  
  }
  //------------------------------------------------------------------//
  
  //Funcion para filtrar por categoria y por nombre
  function filtrar(productos, nodo, carrito, e) {
    let productosFiltrados = productos.filter(
      (producto) =>
        producto.nombre.includes(nodo.value.toLowerCase()) ||
        producto.categoria.includes(nodo.value.toLowerCase())
    );
    representarTarjetas(productosFiltrados, carrito);
  }
  
  //Funcion para cambiar nombre de boton y ocular carrito/productos
  function verOcultar(e) {
    e.target.innerText === "Ver carrito"
      ? (e.target.innerText = "Ver productos")
      : (e.target.innerText = "Ver carrito");
  
    document.getElementById("productos").classList.toggle("oculto");
    document.getElementById("carrito").classList.toggle("oculto");
  }
  
  //Funcion para representar las tarjetas de los productos
  function representarTarjetas(productos) {
    let card = document.getElementById("productos");
    card.innerHTML = "";
    productos.forEach(({ nombre, precio, imagen, stock, id }) => {
      let cardProducto = document.createElement("div");
      cardProducto.className = "cardProducto";
  
      cardProducto.innerHTML = `
      <div class=imagen style="background-image: url(./assets/${imagen})"></div>
        <h3>${nombre}</h3>
        <p>Precio $${precio}</p>
        <p>Quedan ${stock} unidades</p>
        <button id=${id}>Agregar al carrito</button>
      `;
      card.appendChild(cardProducto);
  
      let boton = document.getElementById(id);
      boton.addEventListener("click", (e) => agregarAlCarrito(productos, e));
    });
  }
  //Funcion para agregar al carrito los productos
  function agregarAlCarrito(productos, { target }) {
    let carrito = localStorage.getItem("carrito")
      ? JSON.parse(localStorage.getItem("carrito")): [];
  
    let productoInicial = productos.find(({ id }) => id === Number(target.id));
    let { id, nombre, precio } = productoInicial;
    console.log(carrito);
    let productoEnCarrito = carrito.find(({ id }) => id === productoInicial.id);
  
    if (productoEnCarrito) {
      productoEnCarrito.unidades++;
      productoEnCarrito.subtotal =
        productoEnCarrito.unidades * productoEnCarrito.precioUnitario;
    } else {
      carrito.push({
        id,
        nombre,
        precioUnitario: precio,
        unidades: 1,
        subtotal: precio,
      });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    convertirCarrito(carrito);
    alertaAgregarAlCarrito("Producto agregado al carrito")
  }
  //Funcion que muestra los productos en el carrito
  function convertirCarrito() {
    let productos = localStorage.getItem("carrito")
      ? JSON.parse(localStorage.getItem("carrito")): [];
    let card = document.getElementById("productosEnCarrito");
  
    card.innerHTML = "";
    productos.forEach(({ nombre, precioUnitario, unidades, subtotal, id }) => {
      let cardProducto = document.createElement("div");
      cardProducto.className = "cardCarrito";
      cardProducto.innerHTML = `
        <p>${nombre}</p>
        <p>$${precioUnitario}</p>
        <p>${unidades}</p>
        <p>$${subtotal}</p>
        <button id=${id}>X</button>
      `;
      card.appendChild(cardProducto);
  
    });
  }

  
  //Funcion que finaliza la compra del carrito
  function finalizarCompra() {
   let carrito =localStorage.getItem("carrito")
   ? JSON.parse(localStorage.getItem("carrito")): [];
    if(carrito.length > 0){
    localStorage.removeItem("carrito");
   convertirCarrito([]);
   alertaFinalizarCompra("success", "Muchas gracias por su compra", "green");
    }
    else{
      alertaFinalizarCompra("warning", "No hay productos en el carrito", "red");
    }
    
  }
  
  //Alerta cuando se agrega al carrito
  function alertaAgregarAlCarrito(text){
  Toastify({
    text,
    duration: 3000,
    close: true,
    gravity: "top", 
    position: "right",
    stopOnFocus: true, 
    style: {
      background: "linear-gradient(90deg, rgba(239,114,41,1) 50%, rgba(252,164,69,1) 100%)",
  
    },
    onClick: function(){} 
  }).showToast()
  }
  //Alerta cuando se finaliza la compra
  function alertaFinalizarCompra(icon, title, iconColor){
    Swal.fire({
      icon: icon,
      title: title, 
      background: "linear-gradient(90deg, rgba(234,133,9,0.7484243697478992) 50%, rgba(243,204,124,0.70640756302521) 100%)",
      confirmButtonText: false,
      timer: 3000,
      showConfirmButton: false,
      iconColor: iconColor,
      color: "black",
    
    })
  }
  
  async function infoPedida() {
    try {
      const resp = await fetch('./data.json')
      const productos = await resp.json()
      inicio(productos)
    } catch (error) {
      console.log(error)
    }
  }
  infoPedida()
  
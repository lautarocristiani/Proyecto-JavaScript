class Producto{
    constructor(nombre, precio, id){
        this.nombre = nombre;
        this.precio = precio;
        this.id = id;
    }
}

document.getElementById("botonAgregarProducto").addEventListener("click", agregar);
document.getElementById("botonLimpiarCarrito").addEventListener("click", limpiarCarrito);
document.getElementById("botonProductosPredeterminados").addEventListener("click", productosPredeterminados);

mostrar();
mostrarCarrito();

// FUNCIONES LISTA PRODUCTOS

function mostrar() {
    let listaProductos = JSON.parse(localStorage.getItem("listaProductos"));
    let limpiarLista = document.querySelectorAll(".itemLista");
    for (let i = 0; i < limpiarLista.length; i++) {
        limpiarLista[i].remove();
    }
    let listaMostrar = [];
    if (listaProductos == null || listaProductos.length == 0) {
        let contenedor = document.querySelector("#contenedor");
        let noProductos = document.createElement("h3");
        noProductos.className = "nolista";
        noProductos.innerHTML = "No hay productos en la lista!";
        contenedor.append(noProductos);
    } else {
        for (const p of listaProductos) {
            listaMostrar.push(new Producto(p.nombre, p.precio, p.id))
        }
        if (document.querySelector(".nolista")!=null) {
            document.querySelector(".nolista").remove();
        }
        let contenedor = document.querySelector("#contenedor");
        let i = 0;
        listaMostrar.forEach(producto => {
            i++;
            let p = document.createElement("li");
            p.className = "itemLista"
            p.innerHTML = 
            `<h3>ID: ${producto.id} --- Producto: ${producto.nombre} --- Precio: ${producto.precio}
            <button class="botonAgregar" id="botonAgregar${i}">Agregar</button>
            <button class="botonModificar" id="botonModificar${i}">Modificar</button>
            <button class="botonEliminar" id="botonEliminar${i}">Eliminar</button></h3>`;
            contenedor.append(p);
            let botonAgregar = document.getElementById(`botonAgregar${i}`);
            botonAgregar.addEventListener("click", function(){
                agregarCarrito(producto.id, producto.nombre, producto.precio)
            });
            let botonModificar = document.getElementById(`botonModificar${i}`);
            botonModificar.addEventListener("click", function(){
                modificar(producto.id)
            });
            let botonEliminar = document.getElementById(`botonEliminar${i}`);
            botonEliminar.addEventListener("click", function(){
                eliminar(producto.id)
            });
        })
    }
}

function productosPredeterminados() {
    let lista = [];
    fetch('productos.json')
        .then((r) => r.json())
        .then((data) => {
            data.forEach(p => {
                lista.push(new Producto(p.nombre, p.precio, p.id));
        });
        localStorage.setItem("listaProductos", JSON.stringify(lista));
        Swal.fire({
            icon: 'success',
            text: 'Productos predeterminados agregados con éxito!'
          }) 
        mostrar();
    })
}

function agregar() {
    let listaProductos = JSON.parse(localStorage.getItem("listaProductos"));
    let listaAgregar = [];
    for (const p of listaProductos) {
        listaAgregar.push(new Producto(p.nombre, p.precio, p.id))
    }
    (async () => {
        const { value: respuesta } = await Swal.fire({
            title: 'Agregar Producto',
            html:
            '<label>Ingrese el ID</label><br>' +
            '<input id="idAgregar" class="swal2-input"><br><br>' +
            '<label>Ingrese el Nombre</label>' +
            '<input id="nombreAgregar" class="swal2-input"><br><br>' +
            '<label>Ingrese el Precio</label>' +
            '<input id="precioAgregar" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    parseInt(document.getElementById('idAgregar').value),
                    document.getElementById('nombreAgregar').value,
                    parseInt(document.getElementById('precioAgregar').value)
                ]
            }
        })
        if (Number.isNaN(respuesta[0]) || listaAgregar.find((p) => p.id == respuesta[0]) || respuesta[1] == "" || listaAgregar.find((p) => p.nombre.toString().toUpperCase() === respuesta[1].toString().toUpperCase()) || Number.isNaN(respuesta[2])) {
            Swal.fire({
                icon: 'error',
                text: 'Ingrese correctamente los valores'
            })
        } else {
            listaAgregar.push(new Producto(respuesta[1], respuesta[2], respuesta[0]));
            localStorage.setItem("listaProductos", JSON.stringify(listaAgregar));
            Swal.fire({
                icon: 'success',
                text: 'Producto agregado con éxito!'
              }) 
            mostrar();
        }
    })()
}



function eliminar(id){
    let listaProductos = JSON.parse(localStorage.getItem("listaProductos"));
    let listaEliminar = [];
    for (const p of listaProductos) {
        listaEliminar.push(new Producto(p.nombre, p.precio, p.id))
    }
    for (i = 0; i < listaEliminar.length; i++) {
        if (listaEliminar[i].id==id) {
            listaEliminar.splice(i, 1);
            localStorage.setItem("listaProductos", JSON.stringify(listaEliminar))
            mostrar();
            Swal.fire({
                icon: 'success',
                text: 'Producto eliminado con éxito!'
              })   
        }
    }
}



function modificar(id) {
    let listaProductos = JSON.parse(localStorage.getItem("listaProductos"));
    let listaModificar = [];
    for (const p of listaProductos) {
        listaModificar.push(new Producto(p.nombre, p.precio, p.id))
    }
    let resultado = listaModificar.find((p) => p.id == id);
    if (resultado != null) {
        (async () => {

            const { value: respuesta } = await Swal.fire({
              title: 'Multiple inputs',
              html:
              '<label>Ingrese el nuevo ID</label>' +
              '<input id="idModificar2" class="swal2-input"><br><br>' +
              '<label>Ingrese el nuevo Nombre</label>' +
              '<input id="nombreModificar" class="swal2-input"><br><br>' +
              '<label>Ingrese el nuevo Precio</label>' +
              '<input id="precioModificar" class="swal2-input">',
              focusConfirm: false,
              preConfirm: () => {
                return [
                    parseInt(document.getElementById('idModificar2').value),
                    document.getElementById('nombreModificar').value,
                    parseInt(document.getElementById('precioModificar').value)
                ]
              }
            })
            if (Number.isNaN(respuesta[0]) || listaModificar.find((p) => p.id == respuesta[0]) || respuesta[1] == "" || listaModificar.find((p) => p.nombre.toString().toUpperCase() == respuesta[1].toString().toUpperCase()) || Number.isNaN(respuesta[2])) {
                Swal.fire({
                    icon: 'error',
                    text: 'Ingrese correctamente los valores'
                })
            } else {
                listaModificar.forEach(producto => {
                    if (producto.id == id) {
                        producto.id = respuesta[0];
                        producto.nombre = respuesta[1];
                        producto.precio = respuesta[2];
                    }});
                    localStorage.setItem("listaProductos", JSON.stringify(listaModificar));
                    Swal.fire({
                        icon: 'success',
                        text: 'Producto modificado con éxito!'
                    })
                    mostrar();
            }
            })()
        } else {
            Swal.fire({
                icon: 'error',
                text: 'El ID ingresado no se encuentra en la lista'
              }) 
              mostrar();
    }
}

function limpiarLista() {
    localStorage.clear();
    mostrar();
}

// FUNCIONES CARRITO

function agregarCarrito(id, nombre, precio) {
    let listaCarrito = JSON.parse(sessionStorage.getItem("listaCarrito"));
    let listaAgregar = [];
    if (listaCarrito == null) {
        listaAgregar.push(new Producto(nombre, precio, id))
            sessionStorage.setItem("listaCarrito", JSON.stringify(listaAgregar));
            mostrarCarrito();
    } else{
        for (const p of listaCarrito) {
            listaAgregar.push(new Producto(p.nombre, p.precio, p.id))
        }
        listaAgregar.push(new Producto(nombre, precio, id))
        sessionStorage.setItem("listaCarrito", JSON.stringify(listaAgregar));
        mostrarCarrito();
    }
}

function mostrarCarrito() {
    let listaProductos = JSON.parse(localStorage.getItem("listaProductos"));
    let listaCarrito = JSON.parse(sessionStorage.getItem("listaCarrito"));
    let limpiarLista = document.querySelectorAll(".itemCarrito");
    for (let i = 0; i < limpiarLista.length; i++) {
        limpiarLista[i].remove();
    }
    if (listaCarrito == null) {
        let contenedor = document.querySelector("#contenedorCarrito");
        if (contenedor.querySelector(".noCarrito")) {
            contenedor.querySelectorAll("h3").remove();
        } else {
            let noProductos = document.createElement("h3");
            noProductos.className = "noCarrito";
            noProductos.innerHTML = "No hay productos en el carrito!";
            if(document.querySelector(".total")){
                document.querySelector(".total").remove();
            }
            contenedor.append(noProductos);
        }
    } else {
        if (document.querySelector(".noCarrito")!=null) {
            document.querySelector(".noCarrito").remove();
        }
        if (document.querySelector(".total")!=null) {
            document.querySelector(".total").remove();
        }
        let contenedor = document.querySelector("#contenedorCarrito");
        let t = 0;
        let acumulador = 1;
        listaProductos.forEach(productoLista => {
            let cantidad = 0;
            listaCarrito.forEach(productoCarrito => {
                if (productoLista.id === productoCarrito.id) {
                    cantidad++;
                }
            });
            if (cantidad>0) {
                let producto = document.createElement("h3");
                producto.className = "itemCarrito";
                producto.innerText = `${acumulador}) ${productoLista.nombre} --- Cantidad: ${cantidad} --- Precio ${productoLista.precio*cantidad}`; 
                contenedor.append(producto);
                t += productoLista.precio*cantidad;
            }
            acumulador++;
        });
        let total = document.createElement("h3");
        total.className = "total";
        total.innerHTML = "El total es: " + t;
        contenedor.append(total);
    }
}

function limpiarCarrito() {
    sessionStorage.clear();
    mostrarCarrito();
}
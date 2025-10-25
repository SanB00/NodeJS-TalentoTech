import axios from "axios";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

const API_URL = "https://fakestoreapi.com/products";

async function obtenerProducto() {
  const response = await axios.get(API_URL);
  return response.data;
}

async function crearProducto(objProducto) {
  const response = await axios.post(API_URL, objProducto);
  console.log("Producto creado:", response.data);
}

async function obtenerProductoPorId(id) {
  const response = await axios.get(`${API_URL}/${id}`);
  console.log("Producto encontrado:\n", response.data);
}

async function borrarProducto(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  console.log(`Producto con id ${id} eliminado:`, response.data);
}

async function main() {
  while (true) {
    console.log("\n===  Menu principal ===");
    console.log("1. Ver todos los productos");
    console.log("2. Buscar producto por ID");
    console.log("3. Crear producto");
    console.log("4. Eliminar producto");
    console.log("5. Salir");

    const opcion = await ask("Seleccione una opción: ");

    return await derivarOpcionesMenu(opcion);
  }
}

async function derivarOpcionesMenu(opcion, objProducto = {}) {
  switch (opcion.trim()) {
    case ("1", 1):
      const productos = await obtenerProducto();
      console.log("=== Todos los productos ===");
      //console.log(productos.slice(0, 5)); // mostrar solo 5 productos
      console.log(productos);
      break;
    case ("2", 2):
      let idAEncontrar = 0;
      if (!objProducto) {
        idAEncontrar = await ask("Ingrese el ID del producto a buscar: ");
      } else {
        idAEncontrar = objProducto.id;
      }
      await obtenerProductoPorId(idAEncontrar.trim());
      break;
    case ("3", 3):
      let objProductoACrear = {};
      if (!objProducto) {
        console.log("=== Creando nuevo producto con datos por ingreso ===");
        const titulo = await ask("Ingrese el título del producto: ");
        const precio = await ask("Ingrese el precio del producto: ");
        const categoria = await ask("Ingrese la categoría del producto: ");
        objProductoACrear = {
          titulo: titulo.trim(),
          precio: parseFloat(precio.trim()),
          categoria: categoria.trim(),
        };
      } else {
        console.log(
          "=== Creando nuevo producto con parámetros del comando ==="
        );
        objProductoACrear = {
          titulo: objProducto.titulo.trim(),
          precio: parseFloat(objProducto.precio.trim()),
          categoria: objProducto.categoria.trim(),
        };
      }
      await crearProducto(objProductoACrear);
      break;
    case ("4", 4):
      let idABorrar = 0;
      if (!objProducto) {
        idABorrar = await ask("Ingrese el ID del producto a buscar: ");
      } else {
        idABorrar = objProducto.id;
      }
      await borrarProducto(idABorrar.trim());
      break;
    case ("5", 5):
      console.log("Saliendo del programa...");
      rl.close(); // cerrar readline
      return; // salir del bucle
    default:
      console.log("Opción inválida, intentar de nuevo");
      break;
  }
}

async function gestionarParametrosDelComando() {
  const args = process.argv.slice(2);
  if (args.length <= 0) {
    console.error(
      "Error: No se han proporcionado argumentos. Separar con espacios"
    );
    return;
  }

  const [method, endpointProducts, titulo, precio, categoria] = args;
  const validMethods = ["get", "post", "delete", "put"];

  if (!validMethods.includes(method.toLowerCase())) {
    console.error(
      `Error: Método HTTP no válido. Usar uno de los siguientes: ${validMethods.join(
        ", "
      )}`
    );
    return;
  }

    if (endpointProducts !== "products") {
      console.error(
        "Error: El endpoint proporcionado no es válido. Usar 'products'"
      );
      return;
    }

  if (method.toLowerCase() === "get") {
    if (endpointProducts.includes("/")) {
      const id = endpointProducts.split("/")[1];
      const objProducto = { id };
      opcion = 2;
      await derivarOpcionesMenu(opcion, objProducto);
    } else {
      opcion = 1;
      await derivarOpcionesMenu(opcion);
    }
  }

  if (method.toLowerCase() === "post") {
    opcion = 3;
    const objProducto = {
      titulo: titulo.trim(),
      precio: parseFloat(precio.trim()),
      categoria: categoria.trim(),
    };
    await derivarOpcionesMenu(opcion, objProducto);
  }
  if (method.toLowerCase() === "delete") {
    opcion = 4;
    if (endpointProducts.includes("/")) {
      const id = endpointProducts.split("/")[1];
      const objProducto = { id };
      await derivarOpcionesMenu(opcion, objProducto);
    }
  }


}
//console.log("Hola Mundo desde Node.js");
//main();
gestionarParametrosDelComando();

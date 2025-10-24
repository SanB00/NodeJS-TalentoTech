import axios from "axios";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
        resolve(answer);
        });
    });
}

const API_URL = "https://fakestoreapi.com/products";

console.log("Hola Mundo desde Node.js");
async function obtenerProducto() {
  const response = await axios.get(API_URL);
  return response.data;
}

async function crearProducto(newProduct) {
  const response = await axios.post(API_URL, newProduct);
  console.log("Producto creado:", response.data);
}

async function obtenerProductoPorId(id) {
  const response = await axios.get(`${API_URL}/${id}`);
  console.log("Producto encontrado:", response.data);
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

    switch (opcion.trim()) {
      case "1":
        const productos = await obtenerProducto();
        console.log("=== Todos los productos ===");
        console.log(productos.slice(0, 5)); // mostrar solo 5 productos
        break;
      case "2":
        const idAEncontrar = await ask("Ingrese el ID del producto a buscar: ");
        await obtenerProductoPorId(idAEncontrar.trim());
        break;
      case "3":
        const titulo = await ask("Ingrese el título del producto: ");
        const precio = await ask("Ingrese el precio del producto: ");
        const descripcion = await ask("Ingrese la descripción del producto: ");
        const categoria = await ask("Ingrese la categoría del producto: ");
        await crearProducto({
          titulo: titulo.trim(),
          precio: parseFloat(precio.trim()),
          descripcion: descripcion.trim(),
          categoria: categoria.trim(),
        });
        break;
      case "4":
        const idABorrar = await ask("Ingrese el ID del producto a eliminar: ");
        await borrarProducto(idABorrar.trim());
        break;
      case "5":
        console.log("Saliendo del programa...");
        rl.close(); // cerrar readline
        return; // salir del bucle
      default:
        console.log("Opción inválida, intentar de nuevo");
        break;
    }
  }
}

main();

 
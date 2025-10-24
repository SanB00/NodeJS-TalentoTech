import axios from "axios";


console.log("Hola Mundo desde Node.js");
const URL_PRODUCTS = "https://fakestoreapi.com/products";
const ID_PRODUCT = "https://fakestoreapi.com/products/{id}".replace("{id}", 1);


const response = await axios.get(URL_PRODUCTS);
console.log(response.data);
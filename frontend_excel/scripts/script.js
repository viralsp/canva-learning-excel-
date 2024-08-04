import {Main} from './main.js'

let maindiv = document.querySelector("#mainDiv")
console.log(maindiv);
let main = new Main(maindiv);
window.s = main;

// window.addEventListener("load",async (e)=>{
//     let data = await fetch("./tempData.json")
//     data = await data.json();
//     console.log(data);
// })
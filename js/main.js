import { draw } from "./draw.js";
let queren = document.querySelector(".queren");
if (queren ) {
    console.log("upload");
    queren.addEventListener("click", draw);
}
let chongsheng = document.querySelector(".chongsheng");
if (chongsheng) {
    chongsheng.addEventListener("click", draw);
}

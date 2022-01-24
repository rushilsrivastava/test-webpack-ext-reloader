console.info("Change anything here! It will hot reload automatically! :)");

import "./style.css";

const element = document.createElement("span");
element.innerText = "You clicked me!!!!! :)";

document
    .getElementById("button")
    .addEventListener("click", () => document.body.appendChild(element));

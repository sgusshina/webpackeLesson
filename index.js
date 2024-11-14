import Img from "./static/рубашка.png";
import {add} from "./js/add.js";
import "./css/style.css"
function component () {
    const element = document.createElement('div');

    element.classList.add ('lesson')
    const image = new Image ()
    image.src = Img

    element.appendChild(image)

    add()
    return element
    
}
document.body.appendChild(component())
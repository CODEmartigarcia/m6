let items = [];

//afegir 
function afegir() {
    let textimp = document.getElementById("text").value; //obtenir valor
    let caixa_input = document.getElementById("text");
    if (textimp !== "" && textimp.indexOf("<") === -1 && textimp.indexOf(">") === -1) {
        items.push(textimp); //
        document.getElementById("text").value = ''; // 
        crear_llista(); //
    } else {
        caixa_input.style.borderColor = "red";
        document.getElementById("text").value = '';
        return; // se pot pausar completament en un return
    }

    let comptar = document.getElementById("comptador");
    comptar.innerHTML = items.length; //actualitzem
}

// creem ul li
function crear_llista() {
    let uls = document.querySelector("ul");
    if (uls) {
        uls.remove(); //regenerar
    }

    //creem lo ul
    let ul = document.createElement("ul");

    // creem lo li
    for (let i = 0; i < items.length; i++) {
        let li = document.createElement("li");
        li.textContent = items[i]; // assignem

        // crear boto
        let boto = document.createElement("button");
        boto.innerHTML = "borrar";
        
        //eliminar array i tornar llista zero
        boto.onclick = function() {
            items.splice(i, 1); //elimino array 
            crear_llista(); // genero llista un altre cop
            let comptar = document.getElementById("comptador");
            comptar.innerHTML = items.length; //actualitzo comptador?
        };

        li.appendChild(boto); //boto a li
        ul.appendChild(li); //li a ul
    }

    document.body.appendChild(ul); //ul
}

//mostrar/ocultar
function amagar_llista() {
    let ul = document.querySelector("ul");
    if (ul) {
        if (ul.style.display !== "none") {
            ul.style.display = "none";
        } else {
            ul.style.display = "block";
        }
    }
}

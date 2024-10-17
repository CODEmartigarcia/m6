let usuaris = [{

}];

let nom_usuari = document.forms[0].elements[0]
let cognom_usuari = document.forms[0]["contrassenya"] // esta es l'altra forma

function afegirUsuari() {
    //podem intentar afegir un usuari si no es nul cap dels dos valors i crear un objecte dels dos valors a la vegada.
    if (nom_usuari.value != "" && cognom_usuari.value != "" ){ //la d'abans
    let usuari ={
        nom: nom_usuari.value,
        cognom: cognom_usuari.value
    }
    usuaris.push(usuari)
    console.log(usuaris)
    //regenerem camps
    nom_usuari.value = "";
    cognom_usuari.value = "";
    
    //si entra, borra si hi ha alguna p(la id informacio vaya), perque sino se van multiplicant!!
    let elements = document.getElementById("informacio");
    if (elements){
        elements.remove();
    }
    }
    //sols borra elements quan los inputs son corretes sino es queda allà.
    else {
    //crearem la p para avisar
    
        let p = document.createElement("p");
        p.id = "informacio";
        p.textContent = "Per afegir-ho, hauries de posar-hi ambdos valors.";
        document.body.appendChild(p);
    } 
   
    
    return;

}

// function peticio(event){
//     event.preventDefault();
   
// }



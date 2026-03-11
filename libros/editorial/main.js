//CARGAR EDITORIALES

async function cargarEditoriales() {

const res = await fetch(
"https://backend-biblioteca-two.vercel.app/editoriales"
);

const data = await res.json();

const contenedor =
document.getElementById("listaEditoriales");

contenedor.innerHTML = "";

data.forEach(editorial => {

contenedor.innerHTML += `

<div class="fila-item">

<span class="item-text">

${editorial.Nombre} (${editorial.Pais})

</span>

<div class="acciones">

<button
onclick="editarEditorial('${editorial.Id_editorial}','${editorial.Nombre}','${editorial.Pais}')"
class="icon-btn">

<i class="fa-solid fa-pen-to-square"></i>

</button>

<button
onclick="eliminarEditorial('${editorial.Id_editorial}')"
class="icon-btn">

<i class="fa-solid fa-trash-can"></i>

</button>

</div>

</div>

`;

});

}

cargarEditoriales();



// GUARDAR / EDITAR
document
.getElementById("formEditorial")
.addEventListener("submit", async function(e){

e.preventDefault();

const nombre =
document.getElementById("nombreEditorial")
.value.trim();

const pais =
document.getElementById("paisEditorial")
.value.trim();

const id =
document.getElementById("idEditorial").value;

if(nombre === "" || pais === ""){
alert("Escribe el nombre y país");
return;
}

let url =
"https://backend-biblioteca-two.vercel.app/editoriales/agregar";

if(id !== ""){
url =
"https://backend-biblioteca-two.vercel.app/editoriales/editar";
}

await fetch(url,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
Id_editorial:id,
Nombre:nombre,
Pais:pais
})
});

limpiarFormulario();
cargarEditoriales();

});



// EDITAR

function editarEditorial(id,nombre,pais){

document.getElementById("idEditorial").value = id;
document.getElementById("nombreEditorial").value = nombre;
document.getElementById("paisEditorial").value = pais;

}


// ELIMINAR

async function eliminarEditorial(id){

if(!confirm("¿Eliminar esta editorial?")) return;

await fetch(
"https://backend-biblioteca-two.vercel.app/editoriales/eliminar",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
Id_editorial:id
})
}
);

cargarEditoriales();

}


// LIMPIAR FORM

function limpiarFormulario(){

document.getElementById("idEditorial").value="";
document.getElementById("nombreEditorial").value="";
document.getElementById("paisEditorial").value="";

}


//CANCELAR

document
.getElementById("cancelarBtn")
.addEventListener("click", limpiarFormulario);
// Mostrar u ocultar secciones según la selección del tipo de señal
document.getElementById("tipoSeñal").addEventListener("change", function() {
    const tipoSeñal = this.value;

    if (tipoSeñal === "homologada") {
        document.getElementById("definitivas").style.display = "block";
        document.getElementById("economica").style.display = "none";
    } else if (tipoSeñal === "economica") {
        document.getElementById("definitivas").style.display = "none";
        document.getElementById("economica").style.display = "block";
    } else {
        document.getElementById("definitivas").style.display = "none";
        document.getElementById("economica").style.display = "none";
    }
});

let señales = [];
let personalizaciones = [];

// Función para añadir señal
document.getElementById("añadirSeñal").addEventListener("click", function() {
    const tipoSeñal = document.getElementById("tipoSeñal").value;
    const tipoObra = document.getElementById("tipoDefinitiva") ? document.getElementById("tipoDefinitiva").value : "";
    const referenciaSeñal = document.getElementById("referenciaSeñal").value;
    const cantidad = document.getElementById("cantidad").value;
    const medidas = document.getElementById("medidas").value;
    const reflectancia = document.getElementById("reflectancia").value;

    // Capturar los comentarios del cliente para señalización económica
    const comentariosEconomica = document.getElementById("comentariosEconomica") ? document.getElementById("comentariosEconomica").value : "";

    let señal = {
        tipoSeñal,
        tipoObra,
        referenciaSeñal,
        cantidad,
        medidas,
        reflectancia,
        comentariosEconomica,  // Añadimos los comentarios del cliente
        imagen: null // Aquí se añadirá la imagen si se selecciona una
    };

    señales.push(señal);
    actualizarListaSeñales();
});

// Función para añadir imagen a la señal
document.getElementById("añadirImagenSeñal").addEventListener("click", function() {
    const archivoImagen = document.getElementById("imagen").files[0];

    if (archivoImagen) {
        const lector = new FileReader();
        lector.onload = function(e) {
            // Añadir la imagen al último elemento de señales
            if (señales.length > 0) {
                señales[señales.length - 1].imagen = e.target.result;
                actualizarListaSeñales();
            }
        };
        lector.readAsDataURL(archivoImagen);
    }
});

// Función para añadir personalización
document.getElementById("añadirPersonalizacion").addEventListener("click", function() {
    const material = document.querySelector('select[name="material"]').value;
    const medidasPersonalizacion = document.querySelector('input[name="medidasPersonalizacion"]').value;
    const descripcionSeñalPersonalizada = document.getElementById("descripcionSeñalPersonalizada").value;
    const cantidadPersonalizacion = document.getElementById("cantidadPersonalizacion").value;

    let personalizacion = {
        material,
        medidasPersonalizacion,
        descripcionSeñalPersonalizada,
        cantidadPersonalizacion,
        imagen: null // Aquí se añadirá la imagen si se selecciona una
    };

    personalizaciones.push(personalizacion);
    actualizarListaPersonalizaciones();
});

// Función para añadir imagen a la personalización
document.getElementById("añadirImagenPersonalizacion").addEventListener("click", function() {
    const archivoImagenPersonalizacion = document.getElementById("imagenPersonalizacion").files[0];

    if (archivoImagenPersonalizacion) {
        const lector = new FileReader();
        lector.onload = function(e) {
            // Añadir la imagen al último elemento de personalizaciones
            if (personalizaciones.length > 0) {
                personalizaciones[personalizaciones.length - 1].imagen = e.target.result;
                actualizarListaPersonalizaciones();
            }
        };
        lector.readAsDataURL(archivoImagenPersonalizacion);
    }
});

// Actualizar lista de señales añadidas
function actualizarListaSeñales() {
    const listaSeñales = document.getElementById("señalesAñadidas");
    listaSeñales.innerHTML = ""; // Limpiar la lista

    señales.forEach((señal, index) => {
        let item = document.createElement("li");
        item.textContent = `Señal ${index + 1}: ${señal.tipoSeñal} - ${señal.tipoObra} - ${señal.referenciaSeñal} - Medidas: ${señal.medidas} - Reflectancia: ${señal.reflectancia} - Cantidad: ${señal.cantidad}`;
        if (señal.comentariosEconomica) {
            item.textContent += ` - Comentarios: ${señal.comentariosEconomica}`;  // Mostrar los comentarios
        }
        if (señal.imagen) {
            let imagen = document.createElement("img");
            imagen.src = señal.imagen;
            imagen.width = 100; // Tamaño de la imagen
            item.appendChild(imagen);
        }
        listaSeñales.appendChild(item);
    });
}

// Actualizar lista de personalizaciones añadidas
function actualizarListaPersonalizaciones() {
    const listaPersonalizaciones = document.getElementById("personalizacionesAñadidas");
    listaPersonalizaciones.innerHTML = ""; // Limpiar la lista

    personalizaciones.forEach((personalizacion, index) => {
        let item = document.createElement("li");
        item.textContent = `Personalización ${index + 1}: ${personalizacion.material} - ${personalizacion.medidasPersonalizacion} - Descripción: ${personalizacion.descripcionSeñalPersonalizada} - Cantidad: ${personalizacion.cantidadPersonalizacion}`;
        if (personalizacion.imagen) {
            let imagen = document.createElement("img");
            imagen.src = personalizacion.imagen;
            imagen.width = 100; // Tamaño de la imagen
            item.appendChild(imagen);
        }
        listaPersonalizaciones.appendChild(item);
    });
}

// Función para generar PDF al finalizar el pedido
document.getElementById("finalizarPedido").addEventListener("click", function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nombreCliente = prompt("Por favor, introduce el nombre de la empresa: En caso de pedido enviar a pedidos@cvtools.es. Presupuesto enviar a comercial@cvtools.es");

    if (nombreCliente) {
        // Título del documento
        doc.setFontSize(16);
        doc.text("FORMULARIO PETICIÓN SEÑALIZACIÓN Y PERSONALIZACIONES", 10, 10);
    

        // Nombre del cliente
        doc.setFontSize(12);
        doc.text(`Nombre de la Empresa: ${nombreCliente}`, 10, 20);

        // Sección de Señalización Metálica
        doc.setFontSize(12);
        doc.text("SEÑAL METÁLICA", 10, 30);

        let offsetY = 40;

        señales.forEach((señal, index) => {
            doc.setFontSize(10);
            doc.text(`Señal ${index + 1}: ${señal.tipoSeñal} - ${señal.tipoObra || '-'} - ${señal.referenciaSeñal} - Medidas: ${señal.medidas || '-'} - Reflectancia: ${señal.reflectancia || '-'} - Cantidad: ${señal.cantidad}`, 10, offsetY);
            
            if (señal.comentariosEconomica) {
                doc.text(`Comentarios: ${señal.comentariosEconomica}`, 10, offsetY + 10);
                offsetY += 10;
            }

            if (señal.imagen) {
                doc.addImage(señal.imagen, 'JPEG', 10, offsetY + 5, 50, 50);
                offsetY += 60;
            } else {
                offsetY += 20;
            }
        });

        // Sección de Personalizaciones Fuera de Catálogo
        doc.setFontSize(12);
        doc.text("PERSONALIZACIONES FUERA DE CATÁLOGO", 10, offsetY);

        offsetY += 10;

        personalizaciones.forEach((personalizacion, index) => {
            doc.setFontSize(10);
            doc.text(`Personalización ${index + 1}: ${personalizacion.material} - Medidas: ${personalizacion.medidasPersonalizacion} - Descripción: ${personalizacion.descripcionSeñalPersonalizada} - Cantidad: ${personalizacion.cantidadPersonalizacion}`, 10, offsetY);

            if (personalizacion.imagen) {
                doc.addImage(personalizacion.imagen, 'JPEG', 10, offsetY + 5, 50, 50);
                offsetY += 60;
            } else {
                offsetY += 20;
            }
        });

        // Guardar PDF
        doc.save(`Pedido_${nombreCliente}.pdf`);
    } else {
        alert("El nombre de la empresa es obligatorio para generar el PDF.");
    }
});

// Limpiar formulario
document.getElementById("limpiarFormulario").addEventListener("click", function() {
    señales = [];
    personalizaciones = [];
    actualizarListaSeñales();
    actualizarListaPersonalizaciones();
    document.getElementById("formulario").reset();
});

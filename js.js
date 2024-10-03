// Mostrar u ocultar secciones según la selección del tipo de señal
document.getElementById("tipoSeñal").addEventListener("change", function() {
    const tipoSeñal = this.value;

    if (tipoSeñal === "homologada") {
        document.getElementById("definitivas").style.display = "block";
        document.getElementById("economica").style.display = "none";
    } else if (tipoSeñal === "economica") {
        document.getElementById("definitivas").style.display = "none";
        document.getElementById("economica").style.display = "block";
    }
});

// Función para abrir los PDFs
function verPDF(ruta) {
    window.open(ruta, '_blank');
}

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

// Función para generar PDF con los datos y las imágenes
document.getElementById("generarPDF").addEventListener("click", function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener el nombre del cliente
    const nombreCliente = prompt("Por favor, introduce el nombre de la empresa:");
    if (nombreCliente) {
        // Cambiar el título del documento
        doc.setFontSize(16);
        doc.setTextColor(0, 51, 102); // Azul oscuro para el título
        doc.text("FORMULARIO PETICIÓN SEÑALIZACIÓN Y PERSONALIZACIONES", 10, 10);

        // Añadir el nombre del cliente al PDF
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Negro para subtítulos
        doc.text(`Nombre de la Empresa: ${nombreCliente}`, 10, 20); // Mostrar el nombre de la empresa

        // Sección de "SEÑAL METÁLICA"
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Negro para subtítulos
        doc.text("SEÑAL METÁLICA", 10, 30);

        // Títulos de la tabla
        let offsetY = 40;
        doc.setFontSize(10);
        doc.setTextColor(105, 105, 105); // Gris para títulos de columnas
        doc.text("POSICIÓN", 10, offsetY);
        doc.text("TIPO DE SEÑAL", 30, offsetY);
        doc.text("TIPO", 70, offsetY);
        doc.text("MEDIDAS", 90, offsetY);
        doc.text("REFLECTANCIA", 110, offsetY);
        doc.text("REFERENCIA", 140, offsetY);
        doc.text("CANTIDAD", 170, offsetY);
        doc.text("IMAGEN", 190, offsetY);

        offsetY += 10;

        // Añadir datos de las señales
        señales.forEach((señal, index) => {
            doc.setTextColor(0, 0, 0); // Negro para contenido
            doc.text(`${index + 1}`, 10, offsetY);
            doc.text(señal.tipoSeñal, 30, offsetY);
            doc.text(señal.tipoObra || '-', 70, offsetY);
            doc.text(señal.medidas || '-', 90, offsetY);
            doc.text(señal.reflectancia || '-', 110, offsetY);
            doc.text(señal.referenciaSeñal, 140, offsetY);
            doc.text(señal.cantidad, 170, offsetY);

            if (señal.comentariosEconomica) {
                doc.text(`Comentarios: ${señal.comentariosEconomica}`, 30, offsetY + 10);  // Añadir los comentarios en el PDF
                offsetY += 5;
            }

            if (señal.imagen) {
                const img = new Image();
                img.src = señal.imagen;
                doc.addImage(img, 'JPEG', 190, offsetY - 5, 20, 20); // Añadir imagen de la señal
            }

            offsetY += 25; // Espacio entre filas
        });

        // Sección de "PERSONALIZACIONES FUERA DE CATÁLOGO"
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Negro para subtítulos
        doc.text("PERSONALIZACIONES FUERA DE CATÁLOGO", 10, offsetY + 10);

        offsetY += 20;

        // Títulos de la tabla de personalizaciones
        doc.setFontSize(10);
        doc.setTextColor(105, 105, 105); // Gris para títulos de columnas
        doc.text("POSICIÓN", 10, offsetY);
        doc.text("MEDIDAS", 30, offsetY);
        doc.text("DESCRIPCIÓN", 70, offsetY);
        doc.text("CANTIDAD", 140, offsetY);
        doc.text("IMAGEN", 170, offsetY);

        offsetY += 10;

        // Añadir datos de las personalizaciones
        personalizaciones.forEach((personalizacion, index) => {
            doc.setTextColor(0, 0, 0); // Negro para contenido
            doc.text(`${index + 1}`, 10, offsetY);
            doc.text(personalizacion.medidasPersonalizacion, 30, offsetY);
            doc.text(personalizacion.descripcionSeñalPersonalizada, 70, offsetY);
            doc.text(personalizacion.cantidadPersonalizacion, 140, offsetY);

            if (personalizacion.imagen) {
                const img = new Image();
                img.src = personalizacion.imagen;
                doc.addImage(img, 'JPEG', 170, offsetY - 5, 20, 20); // Añadir imagen de la personalización
            }

            offsetY += 25; // Espacio entre filas
        });

        // Guardar PDF
        doc.save("Formulario_Señalizacion_Personalizaciones.pdf");
    } else {
        alert("El nombre de la empresa es obligatorio para generar el PDF.");
    }
});

// Limpiar formulario
document.getElementById("limpiarFormulario").addEventListener("click", function() {
    document.getElementById("formSeñalizacion").reset();
    señales = [];
    personalizaciones = [];
    actualizarListaSeñales();
    actualizarListaPersonalizaciones();
});

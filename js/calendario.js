document.addEventListener('DOMContentLoaded', function() {
    //----Elementos del calendario----//
    const cuerpoCal = document.getElementById('cuerpoCalendario');
    const btnAgregar = document.getElementById('btnAgregar');
    const btnGuardar = document.getElementById('btnGuardar');
    const btnCargar = document.getElementById('btnCargar');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const modal = document.getElementById('ventanaModal');
    const btnCerrar = document.querySelector('.cerrar');
    
    //----Configurar la hora de inicio----//

    const horaInicio = 8;
    const horaFin = 20;
    
    //----Crear el calendario----//

    function crearCalendario() {
        cuerpoCal.innerHTML = '';
        
        for (let h = horaInicio; h <= horaFin; h++) {

            //----Columnas por horas----//

            const horaCelda = document.createElement('div');
            horaCelda.className = 'hora';
            horaCelda.textContent = h + ':00';
            cuerpoCal.appendChild(horaCelda);
            
            //----Celdas por dias----//

            for (let d = 1; d <= 5; d++) {
                const diaCelda = document.createElement('div');
                diaCelda.className = 'dia-celda';
                diaCelda.dataset.dia = d;
                diaCelda.dataset.hora = h;
                cuerpoCal.appendChild(diaCelda);
            }
        }
    }
    
    //----LLenar horas en la ventana----//

    function llenarHoras() {
        const selectHora = document.getElementById('horaEvento');
        selectHora.innerHTML = '';
        
        for (let h = horaInicio; h <= horaFin; h++) {
            const opcion = document.createElement('option');
            opcion.value = h;
            opcion.textContent = h + ':00';
            selectHora.appendChild(opcion);
        }
    }
    
    //----Agregar el Evento----//

    btnAgregar.addEventListener('click', () => modal.style.display = 'block');
    
    //----Cerrar ventana----//

    btnCerrar.addEventListener('click', () => modal.style.display = 'none');
    
    //----Guardr evento----//

    document.getElementById('btnGuardarEvento').addEventListener('click', function() {
        const dia = document.getElementById('diaEvento').value;
        const hora = document.getElementById('horaEvento').value;
        const texto = document.getElementById('textoEvento').value.trim();
        const color = document.getElementById('colorEvento').value;
        
        if (!texto) {
            alert('Escribe una descripcion');
            return;
        }
        
        const celda = document.querySelector(`.dia-celda[data-dia="${dia}"][data-hora="${hora}"]`);
        const evento = document.createElement('div');
        
        evento.className = 'evento';
        evento.textContent = texto;
        evento.style.backgroundColor = color;
        
        evento.addEventListener('click', () => {
            const nuevoTexto = prompt('Editar evento:', texto);
            if (nuevoTexto !== null) evento.textContent = nuevoTexto;
        });
        
        celda.appendChild(evento);
        modal.style.display = 'none';
        document.getElementById('textoEvento').value = '';
    });
    
    //----Guardar el LocalStorage----//

    btnGuardar.addEventListener('click', function() {
        const eventos = [];
        
        document.querySelectorAll('.dia-celda').forEach(celda => {
            const dia = celda.dataset.dia;
            const hora = celda.dataset.hora;
            
            celda.querySelectorAll('.evento').forEach(evento => {
                eventos.push({
                    dia: dia,
                    hora: hora,
                    texto: evento.textContent,
                    color: evento.style.backgroundColor
                });
            });
        });
        
        localStorage.setItem('calendarioGuardado', JSON.stringify(eventos));
        alert('Calendario guardado');
    });
    
    //----Cargar el LocalStorage----//

    btnCargar.addEventListener('click', function() {
        const datos = localStorage.getItem('calendarioGuardado');
        if (!datos) {
            alert('No hay datos guardados');
            return;
        }
        
        document.querySelectorAll('.evento').forEach(e => e.remove());
        
        JSON.parse(datos).forEach(evento => {
            const celda = document.querySelector(`.dia-celda[data-dia="${evento.dia}"][data-hora="${evento.hora}"]`);
            
            if (celda) {
                const nuevoEvento = document.createElement('div');
                nuevoEvento.className = 'evento';
                nuevoEvento.textContent = evento.texto;
                nuevoEvento.style.backgroundColor = evento.color;
                
                nuevoEvento.addEventListener('click', () => {
                    const editado = prompt('Editar evento:', evento.texto);
                    if (editado !== null) nuevoEvento.textContent = editado;
                });
                
                celda.appendChild(nuevoEvento);
            }
        });
        
        alert('Calendario cargado');
    });
    
    //----limpiar calendario----//

    btnLimpiar.addEventListener('click', function() {
        if (confirm('Borrar todos los eventos?')) {
            document.querySelectorAll('.evento').forEach(e => e.remove());
            localStorage.removeItem('calendarioGuardado');
            alert('Calendario limpiado');
        }
    });
    
    //----Iniciar----//
    
    crearCalendario();
    llenarHoras();
});
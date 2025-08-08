const API_URL = 'http://localhost:3000/proveedor';

const proveedoresTable = document.getElementById('proveedoresTable');
const proveedoresBody = document.getElementById('proveedoresBody');
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
const modal = document.getElementById('proveedorModal');
const modalForm = document.getElementById('proveedorForm');
const modalTitle = document.getElementById('modalTitle');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');

let modoEdicion = false;
let proveedorActualId = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarProveedores();
});



async function cargarProveedores() {
    try {
        const response = await fetch(`${API_URL}/listarTodos`);
        const data = await response.json();
        
        if (data.estado === 'ok') {
            mostrarProveedores(data.data);
        } else {
            mostrarError('Error al cargar los proveedores');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión con el servidor');
    }
}

function mostrarProveedores(proveedores) {
    if (!proveedores || proveedores.length === 0) {
        noResults.style.display = 'block';
        proveedoresTable.style.display = 'none';
        return;
    }

    noResults.style.display = 'none';
    proveedoresTable.style.display = 'table';
    
    proveedoresBody.innerHTML = proveedores.map(proveedor => `
        <tr>
            <td>${proveedor.id || ''}</td>
            <td>${proveedor.nombres || ''}</td>
            <td>${proveedor.apellidos || ''}</td>
            <td>${proveedor.direccion || ''}</td>
            <td>${proveedor.email || ''}</td>
            <td>${proveedor.telefono || ''}</td>
            <td>${proveedor.ciudad || ''}</td>
            <td>${proveedor.estado || ''}</td>
            <td class="actions">
                <button class="btn btn-edit" onclick="editarProveedor(${proveedor.id})">✏️</button>
                <button class="btn btn-delete" onclick="eliminarProveedor(${proveedor.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

async function filtrarProveedores() {
    const apellido = searchInput.value.trim();
    
    if (!apellido) {
        cargarProveedores();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/buscarporapellido/${encodeURIComponent(apellido)}`);
        const data = await response.json();
        
        if (data.estado === 'ok') {
            mostrarProveedores(data.data);
        } else {
            mostrarError(data.mensaje || 'Error al buscar proveedores');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión con el servidor');
    }
}





async function eliminarProveedor(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
        try {
            const response = await fetch(`${API_URL}/eliminar/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('Proveedor eliminado exitosamente');
                cargarProveedores();
            } else {
                mostrarError(data.mensaje || 'Error al eliminar el proveedor');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarError('Error de conexión con el servidor');
        }
    }
}

// Función para mostrar un mensaje de error
function mostrarError(mensaje) {
    // Usar un toast o alerta más amigable
    alert(`Error: ${mensaje}`);
}

// Función para mostrar un mensaje
function mostrarMensaje(mensaje) {
    // Usar un toast o alerta más amigable
    alert(mensaje);
}

// Función para editar un proveedor
async function editarProveedor(id) {
    try {
        // Obtener los datos actuales del proveedor
        const response = await fetch(`${API_URL}/buscarporid/${id}`);
        const data = await response.json();
        
        if (data.estado === 'ok' && data.data.length > 0) {
            abrirModal(data.data[0]);
        } else {
            mostrarError('No se encontró el proveedor');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar los datos del proveedor');
    }
}

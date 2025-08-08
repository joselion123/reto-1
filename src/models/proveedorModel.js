import dbConexion from '../config/conexion.js';

class Proveedor {
  static async buscartodos() {
    const query = "SELECT * FROM proveedor ORDER BY apellidos DESC";
    const [result] = await dbConexion.query(query);
    return result;
  }

  static async crear(proveedorData) {
    const query = "INSERT INTO proveedor SET ?";
    const [result] = await dbConexion.query(query, [proveedorData]);
    return result;
  }

  static async encontrarporapellido(apellido) {
    const query = "SELECT * FROM proveedor WHERE apellidos LIKE ?";
    const [result] = await dbConexion.query(query, [apellido + '%']);
    return result;
}
  static async eliminar(id) {
    const query = "DELETE FROM proveedor WHERE id = ?";
    const [result] = await dbConexion.query(query, [id]);
    return result;
  }
}

export default Proveedor;

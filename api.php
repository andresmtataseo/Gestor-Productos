<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gestor_productos";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $sql = "SELECT * FROM productos WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id);
        } else {
            $sql = "SELECT * FROM productos";
            $stmt = $conn->prepare($sql);
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $products = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $products[] = $row;
            }
        }
        echo json_encode($products);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode(["error" => "Datos JSON inválidos"]);
            exit;
        }

        if (!isset($data['nombre']) || !isset($data['descripcion']) || !isset($data['precio']) || !isset($data['stock'])) {
            echo json_encode(["error" => "Faltan campos requeridos"]);
            exit;
        }

        $nombre = $data['nombre'];
        $descripcion = $data['descripcion'];
        $precio = floatval($data['precio']);
        $stock = intval($data['stock']);

        $sql = "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssdi", $nombre, $descripcion, $precio, $stock);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Producto creado exitosamente"]);
        } else {
            echo json_encode(["error" => "Error al crear el producto: " . $stmt->error]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode(["error" => "Datos JSON inválidos"]);
            exit;
        }

        if (!isset($data['id']) || !isset($data['nombre']) || !isset($data['descripcion']) || !isset($data['precio']) || !isset($data['stock'])) {
            echo json_encode(["error" => "Faltan campos requeridos"]);
            exit;
        }

        $id = intval($data['id']);
        $nombre = $data['nombre'];
        $descripcion = $data['descripcion'];
        $precio = floatval($data['precio']);
        $stock = intval($data['stock']);

        $sql = "UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssdii", $nombre, $descripcion, $precio, $stock, $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Producto actualizado exitosamente"]);
        } else {
            echo json_encode(["error" => "Error al actualizar el producto: " . $stmt->error]);
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            echo json_encode(["error" => "Falta el ID del producto"]);
            exit;
        }

        $id = intval($_GET['id']); // Convertir a entero
        $sql = "DELETE FROM productos WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Producto eliminado exitosamente"]);
        } else {
            echo json_encode(["error" => "Error al eliminar el producto: " . $stmt->error]);
        }
        break;

    default:
        echo json_encode(["error" => "Método no soportado"]);
        break;
}

$conn->close();
?>
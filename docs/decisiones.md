# Decisiones del proyecto

## Historias de usuario

### Visitante
1. Como visitante, quiero registrarme con nombre, email único y contraseña, para obtener una cuenta con rol USUARIO asignado por el servidor (respuesta 201 sin `passwordHash`; si el email ya existe, 409).
2. Como visitante, quiero iniciar sesión con mis credenciales, para obtener un `access_token` JWT firmado que me permita autenticar mis peticiones (si las credenciales son inválidas, 401 con mensaje genérico).

### USUARIO (participante)
3. Como usuario autenticado, quiero crear un hábito con nombre, descripción, frecuencia y estado, para que se guarde en PostgreSQL asociado automáticamente a mi identidad del token (201; el `usuarioId` nunca viene del body).
4. Como usuario autenticado, quiero listar mis hábitos, para ver únicamente los míos sin que se mezclen con los de otras personas (200).
5. Como usuario autenticado, quiero consultar un hábito mío por su id, para ver sus campos completos (200 si es mío; 404 si el id no existe).
6. Como usuario autenticado, quiero actualizar parcialmente un hábito mío, para cambiar solo los campos enviados sin alterar los demás (200 con los campos no enviados intactos).
7. Como usuario autenticado, quiero eliminar un hábito mío por su id, para quitarlo del sistema (éxito al borrar y 404 en la consulta posterior).

### Privacidad y permisos
8. Como usuario autenticado, quiero que otra persona no pueda ver, editar ni eliminar mis hábitos, para proteger mi privacidad (un intento de otro usuario recibe 403 en cada operación).
9. Como persona sin sesión, no puedo acceder a las rutas de hábitos, para que solo identidades válidas usen el sistema (401 sin token o con token alterado o vencido).

### ADMIN (soporte)
10. Como ADMIN, quiero administrar mis propios hábitos igual que un usuario, para tener el mismo flujo de trabajo sobre mi información (CRUD propio, 200/201).
11. Como ADMIN, quiero consultar un listado global de hábitos, para atender casos de soporte sin ver datos sensibles de las cuentas (200 sin `passwordHash`).
12. Como USUARIO normal, no puedo llamar al listado global de administración, para que esa información quede reservada al soporte (403).
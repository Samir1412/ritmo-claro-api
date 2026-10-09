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


## Matriz de permisos

| Endpoint | Actor autorizado | Resultado esperado | Si falla |
|---|---|---|---|
| POST /auth/register | Visitante | 201, cuenta creada con rol USUARIO, sin passwordHash | 400 datos inválidos, 409 email repetido |
| POST /auth/login | Visitante | 200 con access_token | 400 datos inválidos, 401 credenciales inválidas (mensaje genérico) |
| POST /habitos | Usuario autenticado | 201, hábito asociado al usuario del token | 400 datos inválidos, 401 sin token válido |
| GET /habitos | Usuario autenticado | 200, solo los hábitos propios | 401 sin token válido |
| GET /habitos/:id | Dueño del hábito | 200 con el hábito | 401 sin token, 403 hábito ajeno, 404 no existe |
| PATCH /habitos/:id | Dueño del hábito | 200, solo cambian los campos enviados | 400 datos inválidos, 401 sin token, 403 hábito ajeno, 404 no existe |
| DELETE /habitos/:id | Dueño del hábito | Éxito al borrar; la consulta posterior da 404 | 401 sin token, 403 hábito ajeno, 404 no existe |
| GET /habitos/admin/todos | ADMIN | 200, todos los hábitos sin datos sensibles | 401 sin token, 403 si el rol es USUARIO |

## Criterios de aceptación

| Área | Caso positivo | Caso negativo |
|---|---|---|
| Registro | Datos correctos dan 201 y la respuesta no incluye passwordHash | Email repetido da 409; nombre corto o email inválido da 400 |
| Login | Credenciales correctas devuelven un token con expiración | Contraseña o email incorrectos dan 401 con mensaje genérico |
| CRUD | Crear y luego listar muestra el hábito propio (201 y 200) | Consultar un id que no existe da 404 |
| Actualización parcial | Cambiar un solo campo conserva los demás | Un enum inexistente da 400 |
| Propiedad | El dueño consulta, edita y borra su hábito | Usuario B recibe 403 al ver, editar o borrar el hábito de A |
| Rol | ADMIN llama a /habitos/admin/todos y recibe 200 | USUARIO recibe 403; sin token recibe 401 |


## Decisiones técnicas

### 1. Acceso a un hábito ajeno: 403
Si el token es válido pero el hábito pertenece a otra persona, la API responde 403 Forbidden: la identidad existe y el recurso existe, pero no hay permiso. Un 404 ocultaría que el id existe, pero el contrato del taller pide 403 para fallos de propiedad. El service busca primero el hábito (404 si no existe) y luego compara el dueño con el usuario del token (403 si no coincide).

### 2. Eliminación: borrado físico
DELETE elimina el registro de PostgreSQL y una consulta posterior devuelve 404, como exige el contrato. No se usa borrado lógico porque el modelo ya tiene el estado ARCHIVADO, que el usuario cambia con PATCH y es un concepto distinto de eliminar.

### 3. Campos adicionales: se ignoran
El ValidationPipe global usa `whitelist: true` y `transform: true`. Los campos que no están declarados en el DTO se descartan sin error, por lo que enviar `rol` o `usuarioId` en el body no tiene efecto. No se usa `forbidNonWhitelisted` para no devolver 400 por datos sobrantes que ya son inofensivos.

## Decisiones del modelo de datos

1. **Id con `autoincrement()` frente a `uuid()`**: Elegí ids enteros autoincrementales porque el MVP es deliberadamente pequeño y de baja escala. Las consultas indexadas en PostgreSQL son más eficientes, las pruebas manuales en Postman son más simples con números legibles (1, 2, 3...) y evito el almacenamiento extra de un UUID de 36 caracteres. Como los ids enteros son fáciles de adivinar, la privacidad no depende de que el id sea difícil de adivinar: la propiedad del hábito se valida siempre en el service comparando el dueño con la identidad del JWT.
2. **`onDelete: Cascade`**: Si se borra un usuario, sus hábitos se eliminan automáticamente en la base de datos. Lo decidí así para garantizar la integridad referencial y evitar registros huérfanos. El MVP no tiene endpoint para borrar usuarios, por lo que el `Cascade` es una protección de integridad y no una función visible de la API.
3. **`nombre` de Usuario sin límite en la base**: Dejé el campo como `String` simple (`text` en PostgreSQL) porque el modelo mínimo del taller no impone una longitud máxima para este atributo. Limitarlo sin un requisito claro podría truncar nombres compuestos legítimos. La longitud mínima de 2 caracteres se valida en el DTO de registro.
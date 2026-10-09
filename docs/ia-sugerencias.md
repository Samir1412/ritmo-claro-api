# Registro de sugerencias de IA corregidas o rechazadas

Uso de IA limitado a comprensión, revisión y diagnóstico. Aquí documento las sugerencias que no funcionaron tal cual y cómo las verifiqué y corregí.

## Caso 1: instalar @nestjs/swagger sin versión

- **Fecha:** 2026-10-09
- **Sugerencia de la IA:** `npm install ... @nestjs/swagger ...` sin fijar versión.
- **Qué pasó:** `ERESOLVE`. La última versión de `@nestjs/swagger` (12) exige `@nestjs/common` 12, y el proyecto usa NestJS 11. No se instaló ninguna dependencia.
- **Cómo lo verifiqué:** leí el error de npm (peer dependency) y comprobé las versiones con `npm ls --depth=0`.
- **Corrección:** instalé `@nestjs/swagger@11`, compatible con Nest 11. No usé `--force` ni `--legacy-peer-deps` porque dejan un árbol de dependencias inconsistente.
- **Resultado:** instalación sin errores y `npm run build` pasa.

## Caso 2: instalar prisma sin versión

- **Fecha:** 2026-10-09
- **Sugerencia de la IA:** `npm install -D prisma ...` sin fijar versión.
- **Qué pasó:** npm instaló `prisma@8.0.0-rc.22` (release candidate), distinta de `@prisma/client@7.10.0`. El taller usa Prisma 7 y la CLI y el cliente deben coincidir.
- **Cómo lo verifiqué:** `npm ls --depth=0` mostró las dos versiones distintas.
- **Corrección:** `npm install -D prisma@7.10.0`.
- **Resultado:** `npx prisma --version` muestra `prisma` y `@prisma/client` en 7.10.0.

## Aprendizaje

Fijar la versión mayor de los paquetes que dependen del framework (`@nestjs/*`, `prisma`) y verificar con `npm ls` antes de continuar.

### Caso 3: Configuración del schema de Prisma (Prisma 7)

* **Sugerencia recibida**: Usar `provider = "prisma-client-js"` en el generator y `url = env("DATABASE_URL")` dentro del datasource de `schema.prisma`.
* **Fuente**: Autocompletado predictivo de la IA de Cursor al abrir el archivo schema.prisma por primera vez.
* **Por qué era incorrecta**: En Prisma 7 el generator del taller es `"prisma-client"` (con `output` obligatorio) y la `url` de conexión ya no va en el `datasource` del schema: se configura en `prisma.config.ts`. Con las líneas sugeridas el cliente no quedaba como lo espera el proyecto y la configuración de conexión quedaba duplicada.
* **Cómo lo verifiqué**: Detecté la diferencia al revisar mi schema contra la guía del taller y contra el schema original generado por `prisma init`. Corregí ambos bloques y `npx prisma validate` pasó con la versión corregida.
* **Resultado**: Corregido antes de la primera migración (`20261009173551_modelo_inicial`).
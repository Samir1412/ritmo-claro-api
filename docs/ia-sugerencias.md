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
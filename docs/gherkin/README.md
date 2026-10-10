# Escenarios Gherkin — SportSpace

Pruebas de aceptación del MVP. Idioma: español (`# language: es`).

Fuente de verdad de negocio: [../requisitos.md](../requisitos.md). En fase 5 se automatizan; hasta entonces sirven como checklist de QA y de sustentación.

| Archivo | HU | Prioridad |
| --- | --- | --- |
| [autenticacion.feature](autenticacion.feature) | HU-01 a HU-04 | Must |
| [espacios.feature](espacios.feature) | HU-05 a HU-07, HU-08 | Must / Should (`@should` en HU-08) |
| [disponibilidad.feature](disponibilidad.feature) | HU-09, HU-10 | Must |
| [reservas.feature](reservas.feature) | HU-11 a HU-16 | Must |
| [administracion.feature](administracion.feature) | HU-19, HU-20 | Must |

HU-17 y HU-18 (Could) no tienen escenarios en PI1.

-----------------------------------

HU-01: Queda cubierta con el DTO de registro que valida estrictamente el dominio @udea.edu.co, el uso de contraseñas seguras y el cifrado con Argon2id en el servicio.

HU-02: Resuelta mediante el login seguro que emite un JWT de corta duración (15 min) y el Refresh Token almacenado en una cookie HttpOnly, Secure y SameSite=Strict.

HU-03: Gestionada mediante el endpoint de logout que limpia el estado de sesión y remueve la cookie de manera segura.

HU-04: Cubierta por la combinación del JwtAuthGuard y el RolesGuard, asegurando que los usuarios con rol STUDENT obtengan una respuesta 403 Forbidden al intentar realizar acciones administrativas o de staff.
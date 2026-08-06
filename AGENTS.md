# Banco-de-Anchoas

Frontend Vue 3 de Anchoita (Vite + TypeScript + Vuetify + Pinia + vue-router + axios + vue-i18n).

## Fuente funcional

Las especificaciones están disponibles mediante `@planning/specs` (repo `anchoita-project`).
El contrato de la API se consulta en `@backend` (OpenAPI / `docs/frontend-api-guide.md` del backend) y en `API_INTEGRATION.md` / `CURRENT_STATE.md` de este repo.

## Reglas

Antes de modificar código:

1. Leé el spec y la task (`@planning/specs`).
2. Identificá los criterios de aceptación (AC) referenciados.
3. Consultá el contrato real en OpenAPI o `@backend` antes de asumir tipos o códigos de error.
4. No escribas manualmente tipos generados a partir del contrato; verificá contra OpenAPI.
5. No amplíes el alcance.
6. Cubrí los estados: loading, vacío, error, permisos y conflicto.
7. Mantené la i18n (vue-i18n): textos en español e inglés según corresponda.
8. Usá `VITE_API_BASE_URL` desde el entorno (ver `.env.example`), nunca URLs hardcodeadas.

## Comandos

```bash
npm ci
npm run type-check
npm run test:unit
npm run build
```

> Nota: no hay script `lint` en package.json; si se necesita, usar `npx eslint .`
> (existe `eslint.config.js`).

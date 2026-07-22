// Tests de caracterización de las validaciones de categoriasService.
//
// Sin comment `// Derived from R*.*` a propósito: estos tests NO derivan de
// una spec. Cubren comportamiento que ya existía antes de adoptar AI-DLC, y
// backfillear una spec retroactiva para justificarlos es un anti-patrón
// explícito (stack/constraints.md § Anti-patrones del methodology).
//
// Los tests que sí nazcan de una spec llevan su `R*.*` y los cruza
// /spec-verify.

import { describe, expect, it } from "vitest";

import { crearCategoria, editarCategoria } from "./categoriasService";

// Ninguno de estos casos llega a la capa `data/`: las validaciones lanzan
// antes. Por eso son testeables sin base de datos ni mocks.
//
// ⚠️ Importar este módulo igual ABRE `finanzas.db` como efecto de import
// (categoriasService → categoriasRepository → database.ts, que crea la
// conexión y corre CREATE TABLE al importarse). No escribe nada, pero es
// exactamente el acoplamiento que documenta stack/testing.md § Aislamiento
// de la capa de datos. Mientras no se haga ese refactor, no se pueden
// testear ni el camino feliz ni el cálculo de sobrante.

describe("crearCategoria", () => {
  it("rechaza un nombre vacío", async () => {
    await expect(crearCategoria("", 1000, 0, 1000)).rejects.toThrow(
      "El nombre de la categoría no puede estar vacío",
    );
  });

  it("rechaza un nombre que es sólo espacios", async () => {
    await expect(crearCategoria("   ", 1000, 0, 1000)).rejects.toThrow(
      "El nombre de la categoría no puede estar vacío",
    );
  });

  it("rechaza un límite negativo", async () => {
    await expect(crearCategoria("Mercado", -1, 0, 0)).rejects.toThrow(
      "El límite no puede ser negativo",
    );
  });

  it("rechaza que el gastado supere al límite", async () => {
    await expect(crearCategoria("Mercado", 1000, 1500, 0)).rejects.toThrow(
      "El gastado no puede ser mayor a el límite",
    );
  });

  // FALTA: el caso borde `limite === gastado === 0` pasa las tres
  // validaciones y sigue hasta la capa `data/`, o sea que INSERTA una fila
  // en `finanzas.db`. No se puede testear sin el refactor de
  // stack/testing.md § Aislamiento de la capa de datos.
  //
  // Regla mientras tanto: en este archivo sólo van casos que terminan en
  // `throw`. Un test que llega a `data/` escribe en la base de verdad.
});

describe("editarCategoria", () => {
  it("rechaza un nombre vacío", async () => {
    await expect(editarCategoria(1, "", 1000, 1000)).rejects.toThrow(
      "El nombre de la categoría no puede estar vacío",
    );
  });

  it("rechaza un límite negativo", async () => {
    await expect(editarCategoria(1, "Mercado", -500, 0)).rejects.toThrow(
      "El límite no puede ser negativo",
    );
  });
});

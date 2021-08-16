import "../../src/setup";
import supertest from "supertest";
import app from "../../src/app";
import * as userFactory from "../factories/userFactory";
import * as pokemonFactory from "../factories/pokemonFactory";

import {
  startConnection,
  endConnection,
  clearDatabase,
} from "../utils/database";

beforeAll(startConnection);
beforeEach(clearDatabase);
afterAll(endConnection);

const test = supertest(app);

describe("GET /pokemons", () => {
  it("should answer with status 401 for unauthorized", async () => {
    const getPokemonsNoAuthorizationTry = await test.get("/pokemons");
    const getPokemonsNoTokenTry = await test
      .get("/pokemons")
      .set("Authorization", `Bearer `);
    const getPokemonsInvalidTokenTry = await test
      .get("/pokemons")
      .set("Authorization", `Bearer invalidToken`);
    expect(getPokemonsNoAuthorizationTry.status).toBe(401);
    expect(getPokemonsNoTokenTry.status).toBe(401);
    expect(getPokemonsInvalidTokenTry.status).toBe(401);
  });

  it("should answer with status 200 and pokemon array for a valid request", async () => {
    const user = await userFactory.registerUser();
    const session = await userFactory.createSession(1);
    const pokemon = await pokemonFactory.createPokemon();
    const result = await test
      .get("/pokemons")
      .set("Authorization", `Bearer ${session.token}`);
    expect(result.status).toBe(200);
    expect(result.body[0]).toStrictEqual({ ...pokemon, inMyPokemons: false });
  });
});

describe("POST /my-pokemons/:pokemonId/add", () => {
  it("should answer with status 401 for unauthorized", async () => {
    const pokemon = await pokemonFactory.createPokemon();
    const noAuthorizedAddPokemonTry = await test.post(
      `/my-pokemons/${pokemon.id}/add`
    );
    const noTokenAddPokemonTry = await test
      .post(`/my-pokemons/${pokemon.id}/add`)
      .set("Authorization", `Bearer`);
    const invalidTokenAddPokemonTry = await test
      .post(`/my-pokemons/${pokemon.id}/add`)
      .set("Authorization", `Bearer invalidToken`);
    expect(noAuthorizedAddPokemonTry.status).toBe(401);
    expect(noTokenAddPokemonTry.status).toBe(401);
    expect(invalidTokenAddPokemonTry.status).toBe(401);
  });
});

describe("POST /my-pokemons/:pokemonId/remove", () => {
  it("should answer with status 401 invalid authorization", async () => {
    const pokemon = await pokemonFactory.createPokemon();
    const noAuthorizedRemovePokemonTry = await test.post(
      `/my-pokemons/${pokemon.id}/remove`
    );
    const noTokenRemovePokemonTry = await test
      .post(`/my-pokemons/${pokemon.id}/remove`)
      .set("Authorization", `Bearer`);
    const invalidTokenRemovePokemonTry = await test
      .post(`/my-pokemons/${pokemon.id}/remove`)
      .set("Authorization", `Bearer invalidToken`);
    expect(noAuthorizedRemovePokemonTry.status).toBe(401);
    expect(noTokenRemovePokemonTry.status).toBe(401);
    expect(invalidTokenRemovePokemonTry.status).toBe(401);
  });
});

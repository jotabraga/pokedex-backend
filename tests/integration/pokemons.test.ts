import "../../src/setup";
import supertest from "supertest";
import app from "../../src/app";
import * as userFactory from "../factories/userFactory";
import * as pokemonFactory from "../factories/pokemonFactory";

import { startConnection, endConnection, clearDatabase } from "../utils/database";

beforeAll(startConnection);
beforeEach(clearDatabase);
afterAll(endConnection);

const test = supertest(app);

describe("GET /pokemons", () => {
    it("should answer with status 401 invalid authorization", async () => {
        const missingHeaderAuthorization = await test.get("/pokemons");
        const missingBearerToken = await test.get("/pokemons").set("Authorization", `Bearer `);
        const invalidToken = await test.get("/pokemons").set("Authorization", `Bearer invalidToken`);;
        expect(missingHeaderAuthorization.status).toBe(401);
        expect(missingBearerToken.status).toBe(401);
        expect(invalidToken.status).toBe(401);
    });

    it("should answer with status 200 and array of pokemons", async () => {
        const newUser = await userFactory.registerUser();
        const newSession = await userFactory.createSession(1);
        const newPokemon = await pokemonFactory.createPokemon();
        const result = await test.get("/pokemons").set("Authorization", `Bearer ${newSession.token}`);
        expect(result.status).toBe(200);
        expect(result.body[0]).toStrictEqual({ ...newPokemon, "inMyPokemons": false });
    });
});

describe("POST /my-pokemons/:pokemonId/add", () => {
    it("should answer with status 401 invalid authorization", async () => {
        const newPokemon = await pokemonFactory.createPokemon();
        const missingHeaderAuthorization = await test.post(`/my-pokemons/${newPokemon.id}/add`);
        const missingBearerToken = await test.post(`/my-pokemons/${newPokemon.id}/add`).set("Authorization", `Bearer`);
        const invalidToken = await test.post(`/my-pokemons/${newPokemon.id}/add`).set("Authorization", `Bearer invalidToken`);
        expect(missingHeaderAuthorization.status).toBe(401);
        expect(missingBearerToken.status).toBe(401);
        expect(invalidToken.status).toBe(401);
    });
});

describe("POST /my-pokemons/:pokemonId/remove", () => {
    it("should answer with status 401 invalid authorization", async () => {
        const newPokemon = await pokemonFactory.createPokemon();
        const missingHeaderAuthorization = await test.post(`/my-pokemons/${newPokemon.id}/remove`);
        const missingBearerToken = await test.post(`/my-pokemons/${newPokemon.id}/remove`).set("Authorization", `Bearer`);
        const invalidToken = await test.post(`/my-pokemons/${newPokemon.id}/remove`).set("Authorization", `Bearer invalidToken`);
        expect(missingHeaderAuthorization.status).toBe(401);
        expect(missingBearerToken.status).toBe(401);
        expect(invalidToken.status).toBe(401);
    });
});
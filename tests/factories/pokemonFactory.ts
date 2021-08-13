import { getRepository } from "typeorm";
import Pokemon from "../../src/entities/Pokemon";

export async function createPokemon(): Promise<Pokemon> {
    const pokemonRepository = getRepository(Pokemon);
    const pokemon = {
        id: 1,
        name: "pokemon",
        number: 1,
        image: "pokemonImage",
        weight: 2,
        height: 3,
        baseExp: 4,
        description: "description"
    }
    return await pokemonRepository.save(pokemon);
}
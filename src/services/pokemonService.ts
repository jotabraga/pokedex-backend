import { getManager, getRepository } from "typeorm";
import Pokemon from "../entities/Pokemon";
import CaughtPokemon from "../entities/CaughtPokemon";

export async function getPokemons() {
  const allPokemons = getRepository(Pokemon).find({order: {number: "ASC"}});  
  return allPokemons;
}

export async function addPokemonToMyPokedex(pokemonId: number, userId: number) {

  const entityManager = getManager();
  const pokemon = await entityManager.findOne(Pokemon, pokemonId);
  
  if(pokemon.inMyPokemons === false){
    await getRepository(CaughtPokemon).save({userId, pokemonId});
    pokemon.inMyPokemons = true;
    await entityManager.save(pokemon);    
    return true;
  }
  return 409;  
}

export async function removePokemonFromMyPokedex(pokemonId: number, userId: number) {

  const entityManager = getManager();
  const pokemon = await entityManager.findOne(Pokemon, pokemonId);

  if(pokemon.inMyPokemons === true){
    await getRepository(CaughtPokemon).delete( pokemonId );
    pokemon.inMyPokemons = false;
    await entityManager.save(pokemon);    
    return true;
  }
  return 409;    
}

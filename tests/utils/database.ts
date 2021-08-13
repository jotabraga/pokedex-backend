import { getConnection, getManager } from "typeorm";
import { init } from "../../src/app";

export async function startConnection(){
    await init();
}
export async function endConnection(){
    await getConnection().close();
}

export async function clearDatabase(){
    await getManager().query('TRUNCATE users RESTART IDENTITY CASCADE');
    await getManager().query('TRUNCATE pokemons RESTART IDENTITY CASCADE');
    await getManager().query('TRUNCATE "caughtPokemons" RESTART IDENTITY CASCADE');
}
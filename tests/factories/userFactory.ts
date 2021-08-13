import { getRepository } from "typeorm";
import bcrypt from "bcrypt";
import User from "../../src/entities/User";
import Session from "../../src/entities/Session";
import faker from "faker";
faker.locale = "pt_BR";

export async function createUser () {
  const password = faker.internet.password();
  const email = faker.internet.email();

  const user = {
    email,
    password,
    confirmPassword: password
  };
  return user;
}

export async function registerUser(){
  const password = faker.internet.password();
  const email = faker.internet.email();
  const repository = getRepository(User);
  await repository.save({
      email,
      password: bcrypt.hashSync(password,10)
  });
  return {email, password};
}

export async function createSession(userId: number) {
  const session = {
      userId,
      token: "pokemonpokemon"
  };

  return getRepository(Session).save(session);
}

export async function findByName(email:string){
  const user = await getRepository(User).findOne({where:{email}})
  return user;
}

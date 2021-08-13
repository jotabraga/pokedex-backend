import supertest from "supertest";
import * as userFactory from "../factories/userFactory";
import { clearDatabase, endConnection, startConnection } from "../utils/database";
import app from "../../src/app";

beforeAll(startConnection);
beforeEach(clearDatabase);
afterAll(endConnection);

describe("POST /sign-up", () => {

  it("should answer with status 201 for a valid input data", async () => {
    const user = await userFactory.createUser();
    const response = await supertest(app).post("/sign-up").send(user);
    expect(response.status).toBe(201);    
  });

  it("should answer with status 400 for password and confirm password divergence", async () => {
    const user = {email:"teste@teste.com",password:"rightOne",confirmPassword:"wrongOne"}
    const response = await supertest(app).post("/sign-up").send(user);
    expect(response.status).toBe(400);    
  });

  it("should answer with status 400 for a invalid input data", async () => {
    const user = {email:"12345",password:"rightOne",confirmPassword:"rightOne"}
    const response = await supertest(app).post("/sign-up").send(user);
    expect(response.status).toBe(400);    
  });

  it("should answer with status 409 if the user already exist", async () => {
    const registeredUser = await userFactory.registerUser();
    const response = await supertest(app).post("/sign-up").send({...registeredUser, confirmPassword: registeredUser.password});
    expect(response.status).toBe(409);    
  });
});

describe("POST /sign-in", () => {

  it("should answer with status 200 for a valid input data", async () => {
    const user = await userFactory.registerUser();
    const response = await supertest(app).post("/sign-in").send(user);
    expect(response.status).toBe(200);    
  });

  it("should answer with status 400 for a invalid input data", async () => {
    const user = {email:"12345",password:"rightOne",confirmPassword:"rightOne"}
    const response = await supertest(app).post("/sign-in").send(user);
    expect(response.status).toBe(400);    
  });

  it("should answer with status 401 for user not found", async () => {
    const user = {email:"notexistuser@gmail.com",password:"notexist"}
    const response = await supertest(app).post("/sign-in").send(user);
    expect(response.status).toBe(401);      
  });
});

import "./src/setup";

const {
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT,
  DB_DIALECT,
  DATABASE_URL,
} = process.env;

export = {
  type: DB_DIALECT,
  url:
    DATABASE_URL ||
    `${DB_DIALECT}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  migrationsTableName: "migrations",
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  cli: {
    migrationsDir: "src/migrations",
    entitiesDir: "src/entities/*.ts",
  },
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  migrationsTransactionMode: "each",
};

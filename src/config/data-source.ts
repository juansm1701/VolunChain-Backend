import "reflect-metadata";
import { DataSource } from "typeorm";
// Note: TypeORM entities are now managed through Prisma schema
// This file is kept for backward compatibility but not actively used

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "mydatabase",
  synchronize: false, // Disabled as we use Prisma
  logging: false,
  entities: [], // Empty as we use Prisma entities
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully ✅");
  })
  .catch((error) => console.error("Database connection failed ❌", error));

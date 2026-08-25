import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { migrate } from "drizzle-orm/mysql2/migrator";
import 'dotenv/config';

async function main() {
  console.log("Migration started...");
  const poolConnection = mysql.createPool(process.env.DATABASE_URL);
  const db = drizzle(poolConnection);

  try {
    // This will run migrations on the database, skipping the ones already applied
    await migrate(db, { migrationsFolder: "./src/database/migrations" });
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed!", error);
  } finally {
    await poolConnection.end();
  }
}

main();

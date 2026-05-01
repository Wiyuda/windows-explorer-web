import pg from "pg";
import "dotenv/config";

async function setup() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL not set");

  // Extract base connection (to 'postgres' db)
  const url = new URL(connectionString);
  const dbName = url.pathname.slice(1);
  url.pathname = "/postgres";

  const client = new pg.Client({
    connectionString: url.toString(),
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
    if (res.rowCount === 0) {
      console.log(`Creating database ${dbName}...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log("Database created.");
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    await client.end();
  }
}

setup();

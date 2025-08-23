import { neon } from "@neondatabase/serverless";
import { hash } from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);

const email = "admin@demo.it";
const password = "Admin123!";
const role = "owner";

const run = async () => {
  const password_hash = await hash(password, 10);
  await sql/*sql*/`
    INSERT INTO users (email, password_hash, role, name)
    VALUES (${email}, ${password_hash}, ${role}, 'Admin')
    ON CONFLICT (email) DO NOTHING
  `;
  console.log("Admin pronto:", email, "pwd:", password);
};
run().catch(e => { console.error(e); process.exit(1); });

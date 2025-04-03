import mysql from "mysql";

export const db = mysql.createConnection({
  host: process.env.HOST || "localhost",
  port: Number(process.env.PORT) || 3306,
  user: process.env.USER || "root",
  password: (process.env.PASSWORD as string) || "",
  database: (process.env.DATABASE_URL as string) || "sacofibank",
});

db.connect((err) => {
  if (err) {
    console.log("erreur" + err.stack);
  } else {
    console.log("connexion reussie");
  }
});

import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db";

const JWT_SECRET =
  (process.env.JWT_SECRET as string) || "3x@mpl3S3cr3tK3yecure&Random"; // Remplacez par une clé secrète sécurisée

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role, phone, titre } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    db.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Erreur lors de la vérification de l'utilisateur",
          });
        }
        if (results.length > 0) {
          return res.status(400).json({ message: "Utilisateur déjà existant" });
        }
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        // Créer un nouvel utilisateur
        db.query(
          "INSERT INTO user (name, email, password, role, phone, titre) VALUES (?, ?, ?, ?, ?, ?)",
          [name, email, hashedPassword, role, phone, titre],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                message: "Erreur lors de la création de l'utilisateur",
              });
            }
            res.status(201).json({
              message: "Utilisateur créé avec succès",
            });
          }
        );
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'utilisateur" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    db.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur lors de la recherche de l'utilisateur" });
        }
        const user = results[0];
        if (!user) {
          return res.status(400).json({ message: "Identifiants invalides" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Identifiants invalides" });
        }

        // Signer le token avec seulement l'ID et le rôle
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
          expiresIn: "24h",
        });

        // Renvoyer le token ET les informations utilisateur séparément
        res.status(200).json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            titre: user.titre,
            phone: user.phone,
          },
        });
      }
    );
  } catch (error) {
    console.log("Erreur lors de la recherche de l'utilisateur");
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

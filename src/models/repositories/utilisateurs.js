import { getDatabaseConnection } from "../dbContext.js";

/**
 * Get the user having a specific email from database
 * @param {string} email - The email of the user. 
 * @returns {Promise<{utilisateurId: number, nom: string, prenom: string, email: string, mot_de_passe: string} | undefined>} - The user having the email email, or `undefined` if the user does not exist.
 */
export async function getUtilisateurByEmail(email) {
    const connection = await getDatabaseConnection();
    const utilisateur = await connection.get('SELECT * FROM utilisateur WHERE email = ?', [email]);
    return utilisateur;
}

/**
 * Create a user in the database
 * @param {string} nom - The name of the user. 
 * @param {string} prenom - The first name of the user.
 * @param {string} email - The email of the user.
 * @param {string} mot_de_passe - The password of the user.
 * @returns {Promise<{utilisateurId: number, nom: string, prenom: string, email: string, mot_de_passe: string}>} - The ID of the created user.
 */
export async function createUtilisateur(nom, prenom, email, mot_de_passe) {
    const connection = await getDatabaseConnection();
    const response = await connection.run('INSERT INTO utilisateur(nom, prenom, email, mot_de_passe) VALUES(?, ?, ?, ?)', [nom, prenom, email, mot_de_passe]);
    return response.lastID;
}

import { COMMAND_STATE, mapCommande } from "../../utils.js";
import { getDatabaseConnection } from "../dbContext.js";


/**
 * Get all commandes from database
 * @returns {Promise<{commandeId: number, utilisateurId: number, date: number, etatCommandeId: number}[]>} - The list of commandes.
 */
export async function getCommandes() {
    const connection = await getDatabaseConnection();
    const commandes = await connection.all('SELECT * FROM commande WHERE id_etat_commande != ?', [1]);
    return commandes.map(commande => mapCommande(commande));
}

/**
 * Get all the commandes of a user from database
 * @param {number} commandeId - the ID of the command.
 * @returns {Promise<{commandeId: number, utilisateurId: number, date: number, etatCommandeId: number} | undefined>} - the commande having the ID commandeId, or `undefined` if the commande does not exist.
 */
export async function getCommandeById(commandeId) {
    const connection = await getDatabaseConnection();
    let commande = await connection.get('SELECT * FROM commande WHERE id_commande = ? and id_etat_commande != ?', [commandeId, COMMAND_STATE.PANIER]);
    if (commande != null) {
        commande = mapCommande(commande);
    }
    return commande;
}

/**
 * set the state of a commande
 * @param {number} commandeId - The ID of the command. 
 * @param {number} stateId - The ID of the new state. 
 * @returns {Promise<number>} - The number of updated rows.
 */
export async function setCommandeState(commandeId, stateId) {
    const connection = await getDatabaseConnection();
    // if stateId == PANIER, throw error
    if(stateId == COMMAND_STATE.PANIER){
        throw new Error('Cannot set commande state to panier');
    }
    const response = await connection.run('UPDATE commande SET id_etat_commande = ? WHERE id_commande = ? and id_etat_commande != ?',
    [stateId, commandeId, COMMAND_STATE.PANIER]);
    if (response.changes === 0) {
        throw new Error('Commande not found');
    }
    return response.lastID;
}


/**
 * Create a panier for a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<number>} - The ID of the created panier.
 */
export async function createPanier(userId) {
    const connection = await getDatabaseConnection();
    const response = await connection.run('INSERT INTO commande(id_utilisateur, id_etat_commande, date) VALUES(?, ?, ?)', [userId, COMMAND_STATE.PANIER, Date.now()]);
    if (response.changes === 0) {
        throw new Error('Panier not created');
    }
    return response.lastID;
}


/**
 * Get the panier of a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<{commandeId: number, utilisateurId: number, date: number, etatCommandeId: number} | undefined>} - The panier of the user, or `undefined` if the user has no panier.
 */
export async function getPanierByUserId(userId) {
    const connection = await getDatabaseConnection();
    let panier = await connection.get('SELECT * FROM commande WHERE id_utilisateur = ? and id_etat_commande = ?', [userId, COMMAND_STATE.PANIER]);
    if (panier != null) {
        panier = mapCommande(panier);
    }
    return panier;
}


/**
 * Set the state of a panier to CUISINE. (the panier becomes a commande)
 * @param {number} commandeId - The ID of the command. 
 * @returns {Promise<number>} - The number of updated rows.
 */
export async function setPanierStateToCuisine(commandeId) {
    const connection = await getDatabaseConnection();
    const response = await connection.run('UPDATE commande SET id_etat_commande = ?,  date = ? WHERE id_commande = ? and id_etat_commande = ?',
    [COMMAND_STATE.CUISINE, Date.now(), commandeId, COMMAND_STATE.PANIER]);
    if (response.changes === 0) {
        throw new Error('Panier not found');
    }
    return response.changes;
}


/**
 * Delete a panier
 * @param {number} commandeId - The ID of the command. 
 * @returns {Promise<number>} - The number of deleted rows.
 */
export async function deletePanier(commandeId) {
    const connection = await getDatabaseConnection();
    const response = await connection.run('DELETE FROM commande WHERE id_commande = ? and id_etat_commande = ?', [commandeId, COMMAND_STATE.PANIER]);
    if (response.changes === 0) {
        throw new Error('Panier not found');
    }
    return response.changes;
}
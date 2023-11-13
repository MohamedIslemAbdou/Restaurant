import { mapCommandeProduit } from "../../utils.js";
import { getDatabaseConnection } from "../dbContext.js";

/**
 * Get produits by commande id form database
 * @param {number} - The ID of the command.
 * @returns {Promise<{produit: { produitId: number,nom: string, cheminImage: string, prix: number },quantite: number}[]>} - The products of the command.
 */
export async function getProduitsByCommandeId(commandeId) {
    const connection = await getDatabaseConnection();
    const produits = await connection.all('SELECT p.id_produit, p.nom, p.chemin_image, p.prix, cp.quantite FROM commande_produit cp, produit p WHERE cp.id_commande = ? and cp.id_produit = p.id_produit',
    [commandeId]);
    return produits.map(produit => mapCommandeProduit(produit));
}



/**
 * Create a product in the user's shopping cart (panier).
 * @param {number} commandeId - The ID of the command.
 * @param {number} produitId - The ID of the product to add.
 * @param {number} quantity - The quantity of the product to add.
 * @returns {Promise<number>} - The ID of the created command_product.
 */
export async function createProduitInPanier(commandeId, produitId, quantity) {
    const connection = await getDatabaseConnection();
    const response = await connection.run('INSERT INTO commande_produit(id_commande, id_produit, quantite) VALUES(?, ?, ?)',
    [commandeId, produitId, quantity]);
    if (response.changes === 0) {
        throw new Error('Produit not created');
    }
    return response.lastID;
}

/**
 * Delete a product from the user's shopping cart (panier).
 * @param {number} commandeId - The ID of the command.
 * @param {number} produitId - The ID of the product to delete.
 * @returns {Promise<number>} - The number of deleted rows.
 */
export async function deleteProduitFromPanier(commandeId, produitId) {
    const connection = await getDatabaseConnection();
    const response = await connection.run('DELETE FROM commande_produit WHERE id_commande = ? and id_produit = ?',
    [commandeId, produitId]);
    if (response.changes === 0) {
        throw new Error('Produit not found');
    }
    return response.changes;
}

/**
 * Set the quantity of a product in the user's shopping cart (panier).
 * @param {number} commandeId - The ID of the command. 
 * @param {number} produitId - The ID of the product to update. 
 * @param {number} quantity - The new quantity of the product. 
 * @returns {Promise<number>} - The number of updated rows.
 */
export async function setProduitQuantityFromPanier(commandeId, produitId, quantity) {
    const connection = await getDatabaseConnection();
    const response = await connection.run('UPDATE commande_produit SET quantite = ? WHERE id_commande = ? and id_produit = ?',
    [quantity, commandeId, produitId]);
    if (response.changes === 0) {
        throw new Error('Produit not found');
    }
    return response.changes;
}
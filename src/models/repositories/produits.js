import { mapProduit } from "../../utils.js";
import { getDatabaseConnection } from "../dbContext.js";


/**
 * Get all produits from database
 * @returns {Promise<{produitId: number, nom: string, cheminImage: string, prix: number}[]>} - The list of produits.
 */
export async function getProduits() {
    const connection = await getDatabaseConnection();
    const produits = await connection.all('SELECT * FROM produit');
    return produits.map(produit => mapProduit(produit));
    
}


/**
 * Get the product having a specific ID from database
 * @param {number} produitId - the ID of the product. 
 * @returns {Promise<{produitId: number, nom: string, cheminImage: string, prix: number} | undefined>} - the product having the ID produitId, or `undefined` if the product does not exist.
 */
export async function getProduitById(produitId) {
    const connection = await getDatabaseConnection();
    let produit = await connection.get('SELECT * FROM produit WHERE id_produit = ?', [produitId]);

    if (produit != null) {
        produit = mapProduit(produit);
    }

    return produit;
}


/**
 * Create a product in database
 * @param {number} produitId - The ID of the product.
 * @param {string} nom - The new name of the product.
 * @param {string} chemin_image - The new image path of the product.
 * @param {number} prix - The new price of the product.
 * @returns {Promise<{produitId: number, nom: string, cheminImage: string, prix: number}>} - The created product.
 */
export async function createProduit(nom, chemin_image, prix) {
    const connection = await getDatabaseConnection();
    const response = await connection.run('INSERT INTO produit(nom, chemin_image, prix) VALUES(?, ?, ?)', [nom, chemin_image, prix]);
    const produit = await getProduitById(response.lastID);
    return produit;
}

/**
 * Delete a product from database
 * @param {number} produitId - The ID of the product.
 * @returns {Promise<number>} - The number of deleted rows.
 */
export async function deleteProduit(produitId) {
    const connection = await getDatabaseConnection();
    const response = await connection.run('DELETE FROM produit WHERE id_produit = ?', [produitId]);

    if (response.changes === 0) {
        throw new Error('Produit not found');
    }
    
    return response.changes;
}
import { getProduitsByCommandeId } from "../models/repositories/commande_produits.js";
import { getCommandeById } from "../models/repositories/commandes.js";
import { getProduitById } from "../models/repositories/produits.js";


/**
 * Check if a product with a specific ID exists in the user's shopping cart (panier).
 * @param {number} produitId - The ID of the product to check.
 * @param {number} panierId - The ID of the shopping cart to search in.
 * @returns {Promise<boolean>} - `true` if the product exists in the shopping cart, `false` otherwise.
 */
export const isProduitInPanier = async (produitId, panierId) => {
    const response = await getProduitsByCommandeId(panierId);
    const produit = response.find(p => p.produit.produitId == produitId);
    return produit !== undefined;
}


/**
 * Check if a product with a specific ID exists in the database.
 * @param {number} produitId - The ID of the product to check.
 * @returns {Promise<boolean>} - `true` if the product exists in the database, `false` otherwise.
 */
export const isProduitExist = async (produitId) => {
    const produit = await getProduitById(produitId);
    return produit !== undefined;
}


/**
 * Check if the user's shopping cart (panier) is empty.
 * @param {number} panierId - The ID of the shopping cart to check.
 * @returns {Promise<boolean>} - `true` if the shopping cart is empty, `false` otherwise.
 */
export const isPanierEmpty = async (panierId) => {
    const response = await getProduitsByCommandeId(panierId);
    return response.length === 0;
}


/**
 * Check if a command with a specific ID exists.
 * @param {number} commandeId - The ID of the command to check.
 * @returns {Promise<boolean>} - `true` if the command exists, `false` otherwise.
 */
export const isCommandeExist = async (commandeId) => {
    const commande = await getCommandeById(commandeId);
    return commande !== undefined;
}
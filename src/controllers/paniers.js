import express from 'express';
import { getProduitsByCommandeId, createProduitInPanier, setProduitQuantityFromPanier, deleteProduitFromPanier } from '../models/repositories/commande_produits.js';
import { createPanier, deletePanier, getPanierByUserId , setPanierStateToCuisine } from '../models/repositories/commandes.js';
import { getProduitById } from '../models/repositories/produits.js';
import { isPanierEmpty, isProduitExist, isProduitInPanier } from './util.js';



const panierRouter = express.Router();

/**
 * Retrieve the contents of the active user's shopping cart (panier).
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the products in the shopping cart or an empty array.
 * @returns {Promise<void>} - A promise for handling the asynchronous retrieval of shopping cart contents.
 */
export const getPanierController =  async (req, res) => {
    // get panier using commandes repository
    const userId = 1;
    let panier = await getPanierByUserId(userId);
    let panierProduits = [];

    // if panier not exist, create panier
    if (panier != null) {
        panierProduits = await getProduitsByCommandeId(panier.commandeId);
    }

    res.status(200).json(panierProduits);
};


/**
 * Delete the active user's shopping cart (panier) and its contents.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send a success message or an error message.
 * @returns {Promise<void>} - A promise for handling the asynchronous deletion of the shopping cart and its contents.
 */
export const deletePanierController = async (req, res) => {
    const userId = 1;
    let panier = await getPanierByUserId(userId);

    // if panier not exist, return 404
    if (panier == null) {
        res.status(404).json({ message: 'Panier Inexistant' });
        return;
    }
    try {
        // delete all produits from panier
        const produits_panier = await getProduitsByCommandeId(panier.commandeId);
        for (const produit_panier of produits_panier) {
            const deletedId = await deleteProduitFromPanier(panier.commandeId, produit_panier.produit.produitId);
        }

        // delete panier
        await deletePanier(panier.commandeId);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du panier' });
        return;
    }
    res.status(200).json({ message: 'Panier supprimé' });
};


/**
 * Submit the active user's shopping cart (panier) for processing.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send a success message or an error message.
 * @returns {Promise<void>} - A promise for handling the asynchronous submission of the shopping cart.
 */
export const soumettrePanierController = async (req, res) => {
    const userId = 1;
    let panier = await getPanierByUserId(userId);

    // if panier not exist, return 404
    if (panier === undefined) {
        res.status(404).json({ message: 'Panier Inexistant' });
        return;
    }
    
    // if panier is empty, return 404
    if (await isPanierEmpty(panier.commandeId)) {
        res.status(404).json({ message: 'Panier vide' });
        return;
    }

    try {
        await setPanierStateToCuisine(panier.commandeId);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la soumission du panier' });
        return;
    }
    res.status(200).json({ message: 'Panier soumis' });
};


/**
 * Add a product to the user's shopping cart (panier).
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send success or error messages.
 * @returns {void} - A response with appropriate status codes and messages.
 */
export const addProduitToPanierController = async (req, res) => {
    const { produitId, quantite } = req.body;

    // if quantite is negative or null, return Bad Request
    if (quantite <= 0) {
        res.status(409).json({ message: 'Quantité invalide' });
    }

    // add produit to panier using commandes repository
    const userId = 1;
    let panier = await getPanierByUserId(userId);
    let panierId =0;

    // if panier not exist, create panier
    // else get panier id
    if (panier === undefined) {
        panierId =await createPanier(userId);
    }else{
        panierId = panier.commandeId;
    }

    if (! await isProduitExist(produitId)) {
        res.status(404).json({ message: 'Produit Inexistant' });
        return;
    }

    // if produit already in panier, return 409 (Conflict)
    if (await isProduitInPanier(produitId, panierId)) {
        res.status(409).json({ message: 'Produit déjà dans le panier' });
        return;
    }

    // create produit to panier using commandes repository 
    try {
        await createProduitInPanier(panierId, produitId, quantite);

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du produit' });
        return;
    }

    res.status(201).json({ message: 'Produit ajouté au panier' });
};


/**
 * Set the quantity of a product in the user's shopping cart (panier).
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send success or error messages.
 * @returns {void} - A response with appropriate status codes and messages.
 */
export const setProduitQuantityInPanierController = async (req, res) => {
    const produitId = req.params.id;
    const { quantite } = req.body;

    // if quantite is negative or null, return Bad Request
    if (quantite <= 0) {
        res.status(409).json({ message: 'Quantité invalide' });
    }

    const userId = 1;
    let panier = await getPanierByUserId(userId);

    // if panier not exist, return 404
    if (panier == null) {
        res.status(404).json({ message: 'Panier Inexistant' });
        return;
    }

    // if produit not exist in panier, return 404
    if (! await isProduitInPanier(produitId, panier.commandeId)) {
        res.status(404).json({ message: 'Produit inexistant dans le panier' });
        return;
    }

    // set produit quantity in panier using commandes repository
    try {
        await setProduitQuantityFromPanier(panier.commandeId, produitId, quantite);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification de la quantité' });
        return;
    }

    res.status(200).json({ message: 'Quantité modifiée' });
};


/**
 * Delete a product from the user's shopping cart (panier).
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send success or error messages.
 * @returns {void} - A response with appropriate status codes and messages.
 */
export const deleteProduitFromPanierController = async (req, res) => {
    const {produitId} = req.body;
    const userId = 1;
    let panier = await getPanierByUserId(userId);

    // if produit not in panier, return 404
    if (panier == null) {
        res.status(404).json({ message: 'Panier Inexistant' });
        return;
    }

    if(! await isProduitExist(produitId)){
        res.status(404).json({ message: 'Produit Inexistant' });
        return;
    }

    if (! await isProduitInPanier(produitId, panier.commandeId)) {
        res.status(404).json({ message: 'Produit Inexistant dans le panier' });
        return;
    }

    // delete produit from panier using commandes repository
    try {
        await deleteProduitFromPanier(panier.commandeId, produitId);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
        return;
    }

    res.status(200).json({ message: 'Produit supprimé' });
};


export default panierRouter;
import express from "express";
import {
  getProduits,
  createProduit,
  deleteProduit,
  getProduitById,
} from "../models/repositories/produits.js";

const produitRouter = express.Router();
const haja = "test";
/**
 * Retrieve the list of all products.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise to handle asynchronous retrieval of products.
 */
export const getProduitsController = async (req, res) => {
  const produits = await getProduits();
  res.status(200).json(produits);
};

/**
 * Retrieve a product by its ID.
 * @param {Request} req - The request object containing the product ID as a parameter.
 * @param {Response} res - The response object to send the retrieved product or an error message.
 * @returns {Promise<void>} - A promise for handling asynchronous retrieval of the product.
 */
export const getProduitByIdController = async (req, res) => {
  const produitId = req.params.id;

  const produit = await getProduitById(produitId);
  if (produit == null) {
    res.status(404).json({ message: "Produit Inexistant" });
    return;
  }
  res.status(200).json(produit);
};

/**
 * Create a new product.
 * @param {Request} req - The request object containing the product data in the request body.
 * @param {Response} res - The response object to send the newly created product or an error message.
 * @returns {Promise<void>} - A promise for handling the asynchronous creation of the product.
 */
export const createProduitController = async (req, res) => {
  const { nom, cheminImage, prix } = req.body;
  // create produit using produits repository
  const produit = await createProduit(nom, cheminImage, prix);
  res.status(201).json(produit);
};

/**
 * Delete a product by its ID.
 * @param {Request} req - The request object containing the product ID as a parameter.
 * @param {Response} res - The response object to send a success message or an error message.
 * @returns {Promise<void>} - A promise for handling the asynchronous deletion of the product.
 */
export const deleteProduitController = async (req, res) => {
  const produitId = req.params.id;
  // delete produit using produits repository
  try {
    await deleteProduit(produitId);
  } catch (e) {
    res.status(404).json({ message: "Produit Inexistant" });
    return;
  }
  res.status(200).json({ message: "Produit supprimé" });
};

export default produitRouter;

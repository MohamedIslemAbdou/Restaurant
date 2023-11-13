import express from 'express';
import { getProduitsController, getProduitByIdController, createProduitController, deleteProduitController } from '../controllers/produits.js';


const produitRouter = express.Router();

// get produits
produitRouter.get('/', getProduitsController);

// get produit by id
produitRouter.get('/:id', getProduitByIdController);

// create produit
produitRouter.post('/', createProduitController);


// delete produit
produitRouter.delete('/:id', deleteProduitController);



export default produitRouter;
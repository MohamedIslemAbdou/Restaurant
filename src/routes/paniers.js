import express from 'express';
import { addProduitToPanierController, deletePanierController, deleteProduitFromPanierController, getPanierController, setProduitQuantityInPanierController, soumettrePanierController } from '../controllers/paniers.js';


const panierRouter = express.Router();

// get panier by user id
panierRouter.get('/', getPanierController);

// delete panier
panierRouter.delete('/', deletePanierController);

// soumettre panier
panierRouter.get('/soumettre', soumettrePanierController);

// add produit to panier
panierRouter.post('/produit', addProduitToPanierController);

// set produit quantity in panier
panierRouter.patch('/produit/:id', setProduitQuantityInPanierController);

// delete produit from panier
panierRouter.delete('/produit/', deleteProduitFromPanierController);

export default panierRouter;
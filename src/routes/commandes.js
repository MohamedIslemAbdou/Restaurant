import express from 'express';
import { getCommandeByIdController, getCommandesController, setCommandeStateController } from '../controllers/commandes.js';



const commandRouter = express.Router();

// get commandes
commandRouter.get('/', getCommandesController);

// get commande by id
commandRouter.get('/:id', getCommandeByIdController);

// set commande state
commandRouter.patch('/:id', setCommandeStateController);


export default commandRouter;
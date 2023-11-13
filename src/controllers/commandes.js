import express from 'express';
import { getCommandeById, getCommandes, setCommandeState } from '../models/repositories/commandes.js';
import { COMMAND_STATE } from '../utils.js';
import { isCommandeExist } from './util.js';



const commandRouter = express.Router();

/**
 * Get all submitted orders (commandes).
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the list of orders.
 * @returns {void} - A response with the list of submitted orders.
 */
export const getCommandesController = async (req, res) => {
    const commandes = await getCommandes();
    res.status(200).json(commandes);
};


/**
 * Get a specific order (commande) by its ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the order information or an error message.
 * @returns {void} - A response with the order information if found, or an error message if the order doesn't exist.
 */
export const getCommandeByIdController =  async (req, res) => {
    const commandeId = req.params.id;
    const commande = await getCommandeById(commandeId);

    // if commande does not exist, return 404 (Not Found)
    if (commande == null) {
        res.status(404).json({ message: 'Commande Inexistant' });
        return;
    }

    res.status(200).json(commande);
};


/**
 * Set the state of a specific order (commande) by its ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send a success message or an error message.
 * @returns {void} - A response indicating the status of the order state change.
 */
export const setCommandeStateController = async (req, res) => {
    const commandeId = req.params.id;
    const { stateId } = req.body;

    // if stateId is not a valide state of commandes, return 400 (Bad Request)
    if (!(Object.values(COMMAND_STATE).includes(stateId))) {
        res.status(400).json({ message: 'Etat de commande Invalide' });
        return;
    }
    // if the commande does not exist, return 404 (Not Found)
    if(!await isCommandeExist(commandeId)){
        res.status(404).json({ message: 'Commande Inexistante' });
        return;
    }

    // set commande state using commandes repository
    try {
        await setCommandeState(commandeId, stateId);

    } catch (e) {
        res.status(500).json({ message: 'Erreur interne au serveur' });
        return;
    }
    
    res.status(200).json({ message: 'Le status de la commande modifié' });
}


export default commandRouter;
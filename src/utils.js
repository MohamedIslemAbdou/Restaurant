/**
 * Map a state of a `Commande` object to its code
 */
export const COMMAND_STATE = {
    PANIER: 1,
    CUISINE: 2,
    LIVRAISON: 3,
    TERMINEE: 4
};


/**
 * Map a row from the database to a `Commande` object.
 * @param { {id_commande: number,id_utilisateur: number,date: number,id_etat_commande: number}} commande - The row from the database.
 * @returns { {commandeId: number,utilisateurId: number,date: number,etatCommandeId: number}} - The `Commande` object.
 */
export const mapCommande = (commande) => {
    return {
        commandeId: commande.id_commande,
        utilisateurId: commande.id_utilisateur,
        date: commande.date,
        etatCommandeId: commande.id_etat_commande
    };
}


/**
 * Map a row from the database to a `Produit` object.
 * @param { {id_produit: number,nom: string,chemin_image: string,prix: number}} produit - The row from the database.
 * @returns { {produitId: number,nom: string,cheminImage: string,prix: number}} - The `Produit` object.
 */
export const mapProduit = (produit) => {
    return {
        produitId: produit.id_produit,
        nom: produit.nom,
        cheminImage: produit.chemin_image,
        prix: produit.prix
    };
}


/**
 * Map a row from the database to a `CommandeProduit` object.
 * @param { {id_produit: number,nom: string,chemin_image: string,prix: number,quantite: number}} commandeProduit - The row from the database.
 * @returns { {produit: {produitId: number,nom: string,cheminImage: string,prix: number},quantite: number}} - The `CommandeProduit` object.
 */
export const mapCommandeProduit = (commandeProduit) => {
    return {
        produit:{
            ...mapProduit(commandeProduit)
        },
        quantite: commandeProduit.quantite
    };
}
import express from 'express';
import { getProduits } from '../models/repositories/produits.js';
import {getPanierByUserId} from '../models/repositories/commandes.js';
import {getProduitsByCommandeId} from '../models/repositories/commande_produits.js';
import {deleteProduitFromPanier} from"../models/repositories/commande_produits.js"
// import {setProduitQuantityFromPanier} from "../models/repositories/commande_produits.js"
// import {deleteProduitFromPanierController} from "../controllers/paniers.js"


const viewsRouter = express.Router();
let listPages = [
    {str:"Accueil",chemin:"/",active:false},
    {str:"Menu",chemin:"/menu",active:false},
    {str:"Commande",chemin:"/commande",active:false},
    {str:"About",chemin:"/about",active:false}
];

// let activerChemin = function (list,chemin){
// list.map(element => {
//     if(chemin == list.str){
//         this.active = true;
//     }else{
//         this.active = false;
//     }
// });
// return list;
// }

viewsRouter.get('/', async (req, res) => {
 
    res.render('home', {
        title: 'Page d\'accueil',
        img:"../../public/img/logo.png",
        heureOuverture:"DE 11 AM A 12 PM",  
        slogan: "NOUS LIVRONS<br>LE GOÛT DE<br>LA VIE",
        listPages,
        listStyles:["/public/css/style.css","/public/css/header.css","/public/css/footer.css","/public/css/accueil.css"],
        listScript:["/public/js/main.js","/public/js/header.js","/public/js/home.js"],
        AccueilActive:true
        // list: activerChemin(listPages,"Accueil")
    });
});

viewsRouter.get('/menu', async (req, res) => {
  

    res.render('menu', {
        listProduits: await getProduits(),
        listStyles:["/public/css/style.css","/public/css/header.css","/public/css/footer.css","/public/css/menu.css"],
        listScript:["/public/js/main.js","/public/js/header.js","/public/js/menu.js"],
        // list: activerChemin(listPages,"menu")
        menuActive: true
    });
});

viewsRouter.get('/panier', async (req, res) => {

    // recuperer le panier avec l utilisateur id
    const userId = 1;
    let panier = await getPanierByUserId(userId);
    let panierProduits = [];

    // si le panier n'existe pas on creer un nouveau
    if (panier != null) {
        panierProduits = await getProduitsByCommandeId(panier.commandeId);
    }
    const total = panierProduits.map(panierProduit  =>{
        panierProduit.prixTotal = panierProduit.produit.prix * panierProduit.quantite;
    });
    res.render('panier', {

        panierProduits,
        total, 
        listStyles:["/public/css/style.css","/public/css/header.css","/public/css/footer.css","/public/css/panier.css"],
        listScript:["/public/js/main.js","/public/js/header.js","/public/js/panier.js"]


    });

    // reception de la requette pour tout les bouton mise a jour
    // viewsRouter.patch('/api/panier/produit/:id_produit', async (req, res) => {
    //     const id_produit = parseInt(req.params.id_produit);
    //     console.log(id_produit);
    //     const quantite = req.body.quantite;
    //     setProduitQuantityFromPanier(1,id_produit,quantite);
    // });

    //supprimer un produit du panier 
    
    // viewsRouter.delete('/panier', async (req, res) => {
    //     deleteProduitFromPanierController(req,res)
    //     deleteProduitFromPanier(panier.commandeId, produitId);

    // });
});

export default viewsRouter;
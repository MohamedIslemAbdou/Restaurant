// Attendez que le DOM soit prêt
document.addEventListener('DOMContentLoaded', () => {

    //Supprimer un produit du panier
    const supprimerProduitPanier = document.querySelectorAll('.miseAjour');
    supprimerProduitPanier.forEach(bouton =>{
      bouton.addEventListener('click', async function(){
        const produitId = parseInt(bouton.id.replace('supProduit_',''));
        SupprimerProduit(produitId);
      })
    });
    
    // Mise a jour du panier 
    const miseAJourbtn = document.querySelectorAll('.miseAjour');
    miseAJourbtn.forEach(bouton =>{

      bouton.addEventListener('click', async function(){
        const produitId = parseInt(bouton.id.replace('miseAJour_', ''));
        const nouvelleQuantite = parseInt(document.getElementById('quantite_'+produitId).value);
        await miseAJourPanier(produitId,nouvelleQuantite);
      });

    });

    const miseAJourPanier = async (produitId,nouvelleQuantite) => {
      console.log(produitId);
      console.log(nouvelleQuantite);

      try {
          const url ="/api/panier/produit/"+produitId;
          const response = await fetch(url, {
          method: "PATCH",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'},
          body: JSON.stringify({
          quantite: nouvelleQuantite,
          }),
        });
        if (response.ok) {  
          console.log("La quantité est modifiée avec succès.");
        } else if(response.status == 404){
          console.log("L'élément ou le panier n'existe pas.");
        }else if (response.status == 400){
          console.log("Quantité invalide (<= 0).")
        }

      } catch (error) {
        console.error(`Erreur inattendue : ${error}`);
        return null;
      }
    };

    //l'effacement du panier
    // Récupérez le bouton Effacer le panier par son ID
    const effacerPanierBtn = document.getElementById('effacerPanierBtn');

    effacerPanierBtn.addEventListener('click', async function() {
      console.log("Bouton EFFACER PANIER cliqué");
      await SupprimerPanier();
      window.location.reload();
    });

    // Supprimer le Panier
    const SupprimerPanier = async (produitId) => {
      try {
          const response = await fetch("/api/panier/", {
          method: "DELETE",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'},
          body: JSON.stringify({
            produitId: produitId,
          }),
        });
        if (response.ok) {  
          console.log("L'élément est supprimé avec succès.");
        } else if(response.status == 404){
          console.log("L'élément ou le panier n'existe pas.");
        }

      } catch (error) {
        console.error(`Erreur inattendue : ${error}`);
        return null;
      }
    };
    // Supprimer le Panier
        const SupprimerProduit = async (produitId) => {
          try {
              const response = await fetch("/produit/", {
              method: "DELETE",
              headers: {"Content-Type":"application/json"},
            });
            if (response.ok) {  
              console.log("La requête réussit et le panier est supprimé.");
            } else if(response.status == 404){
              console.log("Le panier est vide ou n'existe pas.");
            }

          } catch (error) {
            console.error(`Erreur inattendue : ${error}`);
            return null;
          }
        };

      

    });

    // Gerer les boutons de plus et moins quantite
    const quantiteBtns = document.querySelectorAll('.quantite-btn');
    quantiteBtns.forEach(bouton => {
    bouton.addEventListener('click',function() {

      // Verifier que j'ai le id 
      console.log(bouton.id);
      // Optenir l'ID du produit à partir de l'ID du bouton
      if(bouton.id.includes("moinsBtn_")){

        const produitId = parseInt(bouton.id.replace('moinsBtn_', ''));
        decrementerQuantite(produitId);

      }
      else if(bouton.id.includes("plusBtn_")){

        const produitId = parseInt(bouton.id.replace('plusBtn_', ''));
        incrementerQuantite(produitId);
      }
    });
    

    // recuperer les input 
    const quantiteInputs = document.querySelectorAll('.quantite-input');

    quantiteInputs.forEach((input) => {
    input.addEventListener('input', (event) => {
      const produitId = parseInt(input.id.replace('quantite_', ''));
      inputQuantite(produitId);
      
      });
    });

    const decrementerQuantite = (produitId) => {
      const quantiteInput = document.getElementById(`quantite_${produitId}`);

      let quantiteActuelle = parseInt(quantiteInput.value);
      if (quantiteActuelle > 1) {
        quantiteActuelle--;
        quantiteInput.value = quantiteActuelle;
      }
    }

    const incrementerQuantite = (produitId) => {
      const quantiteInput = document.getElementById(`quantite_${produitId}`);

      let quantiteActuelle = parseInt(quantiteInput.value);
      quantiteActuelle++;
      quantiteInput.value = quantiteActuelle;
    }

    const inputQuantite = (produitId) => {
      const quantiteInput = document.getElementById(`quantite_${produitId}`);

      let quantiteActuelle = parseInt(quantiteInput.value);
      // si la quantite actuel
      if (isNaN(quantiteActuelle) || quantiteActuelle <= 0 ) {
        quantiteActuelle = null;
      }
      quantiteInput.value = quantiteActuelle;
    }
});


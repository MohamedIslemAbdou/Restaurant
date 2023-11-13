// Attendez que le DOM soit prêt
document.addEventListener('DOMContentLoaded', () => {

  // Sélectionnez tous les boutons d'achat
  const acheterBoutons = document.querySelectorAll('.acheterMenu');
  acheterBoutons.forEach(bouton => {
    // Verifier que j'ai le id 
    console.log(bouton.id);
  });

  // Gestionnaire d'événements à chaque bouton
  acheterBoutons.forEach(bouton => {
    bouton.addEventListener('click', async (event) => {
      event.preventDefault();

      // Optenir l'ID du produit à partir de l'ID du bouton
      const produitId = parseInt(bouton.id.replace('_btn', ''));
      // Ajouter le produit dans le panier
      try {
        const response = await fetch('/api/panier/produit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            produitId,
            quantite: 1,
          }),
        });
      
        if (response.status === 201) {
          console.log('Produit ajouté au panier avec succès.');
          // Vous pouvez également mettre à jour l'interface utilisateur ici.
        } else if (response.status === 409) {
          console.warn('Le produit est déjà dans le panier.');
        } else if (response.status === 404) {
          console.error('Le produit n\'existe pas.');
        } else if (response.status === 400) {
          console.error('Quantité invalide (<= 0).');
        } else {
          console.error('Erreur inattendue lors de l\'ajout du produit au panier.');
        }
      } catch (error) {
        console.error(`Erreur inattendue : ${error}`);
      }
    });
  });

 
});






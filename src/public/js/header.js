// Récupérer l'URL actuelle
let activeURL = window.location.pathname;

// initialiser les variables en fonction de l url
if(activeURL="#")
{let accueilActive = true}
else if(activeURL="/menu")
{let menuActive = true}
else if(activeURL="/panier")
{let panierActive = true}
else if(activeURL="/commande")
{let commandeActive = true}
else if(activeURL="/about")
{let aboutActive = true}
else{false}

document.querySelector('.burger_menu').addEventListener('click', function() {
  const nav = document.querySelector('.nav_header ul');
  nav.classList.toggle('show');
});
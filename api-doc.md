# Documentation de l'API du Restaurant

L'API du Restaurant permet de gérer le menu, les paniers et les commandes.

## Produits
### Récupérer Tous les Produits

**GET /api/produits/**

Cette requête permet de récupérer la liste de tous les produits.

**Réponses Possibles:**

- Code 200 : La requête réussit et renvoie une liste de produits:
```json
[
  {
    "produitId": 3,
    "nom": "sandwich poulet",
    "cheminImage": "/test",
    "prix": 5.99
  },
  {
    "produitId": 2,
    "nom": "sandwich omelette",
    "cheminImage": "/test2",
    "prix": 7.99
  }
]
```

### Récupérer un Produit par ID

**GET /api/produits/:produitId**

Cette requête permet de récupérer un produit en spécifiant son ID.

**Paramètres de chemin:**

- produitId : L'ID du produit à récupérer.

**Réponses Possibles:**

- Code 200 : La requête réussit et renvoie le produit demandé:
```json
  {
    "produitId": 2,
    "nom": "sandwich omelette",
    "cheminImage": "/test2",
    "prix": 7.99
  }
```
- Code 404 : Le produit n'existe pas.

### Créer un Nouveau Produit

**POST /api/produits/**

Cette requête permet de créer un nouveau produit.

**Corps de la Requête:**
```json
    {
      "nom": "string",
      "cheminImage": "string",
      "prix": number
    }
```

**Réponses Possibles:**

- Code 201 : Le produit est créé avec succès.
```json
    {
      "produitId": number,
      "nom": "string",
      "cheminImage": "string",
      "prix": number
    }
```
- Code 400 : La requête est incorrecte (paramètres manquants ou incorrects).

### Supprimer un Produit par ID

**DELETE /api/produits/:produitId**

Cette requête permet de supprimer un produit en spécifiant son ID.

**Paramètres:**

- produitId: L'ID du produit à supprimer.

**Réponses Possibles:**

- Code 200 : Le produit est supprimé avec succès.
- Code 404 : Le produit n'existe pas.


---

## Panier

### Récupérer les Éléments du Panier
**GET /api/panier/**

Cette requête permet de récupérer les éléments du panier actif.

**Réponses Possibles**:
- Code 200 : La requête réussit et renvoie une liste d'éléments avec leurs quantités:
```json
[
  {
    "quantite": number,
    "produit":     {
          "produitId": 3,
          "nom": "sandwich poulet",
          "cheminImage": "/test",
          "prix": 5.99
      }
  },
  {
    "quantite": number,
    "produit":     {
          "produitId": 2,
          "nom": "sandwich omelette",
          "cheminImage": "/test2",
          "prix": 7.99
      }
  }
]
```
- Code 200 (Panier Vide) : Si la commande de type panier n'existe pas, un panier vide est retourné.

### Supprimer le Panier
**DELETE /api/panier**

Cette requête permet de supprimer le panier actif.

**Réponses Possibles**:
- Code 200 : La requête réussit et le panier est supprimé.
- Code 404 : Le panier est vide ou n'existe pas.

### Ajouter un Élément au Panier
**POST /api/panier/produit**

Cette requête permet d'ajouter un élément au panier actif.

**Corps de la Requête**:
```json
{
  "produitId": "string",
  "quantite": number
}
```

**Réponses Possibles**:

- Code 201 : L'élément est ajouté avec succès.
- Code 409 : L'élément existe déjà dans le panier.
- Code 404 : L'élément n'existe pas.
- Code 400 : Quantité invalide (<= 0).
Si la commande de type panier n'existe pas, elle est créée automatiquement.

### Modifier la Quantité d'un Élément dans le Panier
**PUT /api/panier/produit/:produitId**

Cette requête permet de modifier la quantité d'un élément dans le panier actif.

**Corps de la Requête**:

```json
{
  "quantite": number
}
```
**Réponses Possibles**:

- Code 200 : La quantité est modifiée avec succès.
- Code 404 : L'élément ou le panier n'existe pas.
- Code 400 : Quantité invalide (<= 0).

### Supprimer un Élément du Panier
**DELETE /api/panier/produit**

Cette requête permet de supprimer un élément spécifique du panier actif.

**Corps de la Requête**:

```json
{
  "produitId": "string"
}
```
**Réponses Possibles**:

- Code 200 : L'élément est supprimé avec succès.
- Code 404 : L'élément ou le panier n'existe pas.

### Soumettre le Panier
**GET /api/panier/soumettre**

Cette requête permet de soumettre le panier actif.

**Réponses Possibles**:

- Code 200 : Le panier est soumis avec succès.
- Code 404 : Le panier est vide ou n'existe pas.

## Commandes

### Récupérer toutes les Commandes Soumises
**GET /api/commandes**

Cette requête permet de récupérer la liste de toutes les commandes soumises.

**Réponses Possibles**:

- Code 200 : Liste des commandes:
```json
[
    {
        "commandeId": 3,
        "utilisateurId": 1,
        "etatCommandeId": 3,
        "date": 1698035063186
    },
    {
        "commandeId": 4,
        "utilisateurId": 1,
        "etatCommandeId": 0,
        "date": 1698036078807
    }
]
```

### Récupérer une commandes Soumise par ID
**GET /api/commandes/:idcommande**

Cette requête permet de récupérer une commande soumise en spécifiant son ID.

**Réponses Possibles**:

- Code 200 : La requête réussit et renvoie la commande demandée:
```json
{
    "commandeId": 3,
    "utilisateurId": 1,
    "etatCommandeId": 3,
    "date": 1698035063186
}

```
- Code 404 : La commande n'existe pas.

### Modifier l'État d'une Commande
**PATCH /api/commandes/:idcommande**

Cette requête permet de modifier l'état d'une commande soumise.

**Corps de la Requête**:

```json
{
  "status": "string"
}
```
**Réponses Possibles**:

- Code 200 : L'état de la commande est modifié avec succès:
- Code 404 : La commande n'existe pas.
- Code 400 : L'état n'est pas valide.



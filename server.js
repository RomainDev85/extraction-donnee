const express = require('express')
const app = express()


const MaChaine = "8905;2021_2161;20210822;3.24;36*8905;Explor'Games - Le Silence de la Pieuvre - A part;65;ExplorGame;36;1@#8944;2021_2191;20210822;3.64;40*8944;Accrobranche - 2-5 ans;15;Accrobranche;22;2@8944;Balade à poney  - 2 à 13 ans (40 kg max);8;Balade Poney;9;1@8944;Balade à poney  - 2 à 13 ans (40 kg max);8;Balade Poney;9;1@#8947;2021_2192;20210822;12.12;125*8947;Accrobranche - 2-5 ans;15;Accrobranche;11;1@8947;Paire de gants - A partir de 6 ans - 4 tailles d;64;Accrobranche;2;1@8947;Accrobranche - 6-8 ans;9;Accrobranche;15;1@8947;Paire de gants - A partir de 6 ans - 4 tailles d;64;Accrobranche;2;1@8947;Accrobranche - 9-11 ans;24;Accrobranche;17;1@8947;Paire de gants - A partir de 6 ans - 4 tailles d;64;Accrobranche;2;1@8947;Accrobranche - 14 ans et +;7;Accrobranche;45;2@8947;Paire de gants - A partir de 6 ans - 4 tailles d;64;Accrobranche;4;2@8947;Balade à poney  - 2 à 13 ans (40 kg max);8;Balade Poney;9;1@8947;Balade à poney  - 2 à 13 ans (40 kg max);8;Balade Poney;9;1@8947;Balade à poney  - 2 à 13 ans (40 kg max);8;Balade Poney;9;1@#"

// Function utile lors de la mise en forme des données
    // Recrée l'objet
    const clone = (obj) => Object.assign({}, obj);

    // Renommer les proprietés d'un objet
    const renameKey = (object, key, newKey) => {
        const clonedObj = clone(object);     
        const targetKey = clonedObj[key];              
        delete clonedObj[key];  
        clonedObj[newKey] = targetKey;    
        return clonedObj;    
    };

    // Separe les commandes dans un array
    const commandes = MaChaine.split('#');
    commandes.pop();
    // console.log(commandes);

    
    // Separe numero de commande et les produits
    const commande = commandes.map(element => ( Object.assign(element.split('*'))))
    // console.log(commande);


    // Transforme le tableau contenant la commande et ses produits en objet
    const transformToObject = commande.map(element => Object.assign({}, element))
    const transformProprety = transformToObject.map(element => (element = renameKey(element, '0', 'commande'), element = renameKey(element, '1', 'product')))
    // console.log(transformProprety);

      
    // Separe les produits
    transformProprety.map(element => (element["products"] = element.product.split('@')))
    transformProprety.map(element => (element.products.pop()))
    transformProprety.map(element => ( delete element.product))
    // console.log(transformProprety);


    const data = transformProprety;

    
    // Separe les données de commande
    data.map(element => (element["transaction"] = element.commande.split(';')))
    data.map(element => delete element.commande)

    // Separe les données de chaque produit
    // console.log(data.length);   
    let n = 0;
    while (n < data.length) {
        n++;
        const nbr = n - 1;

        data[nbr].allProducts = [];
        data[nbr].products.map((element) => ( data[nbr].allProducts.push(element.split(";")) ))
        // data[nbr].products.map((element) => ( data[nbr].allProducts.push(Object.assign({}, element.split(";"))) ))
        // console.log(data[nbr].allProducts);
        delete data[nbr].products
    }
    
    //////// Google Analytics ////////

    // Transaction
    // IDCommande ; NumFacture ; DateCommande ; TotalTVA ; TotalTTC+*

    // Produit
    // IDCommande ; MonLibelleProduit ; IDProduit ; MonLibelleFamille ; TotalLigneTTC ;.Quantité+@+#
            
    data.map((element) => (
        ga('ecommerce:addTransaction', {
            'id': element.transaction[0], //IdCommande
            'affiliation': 'Grand défi Ecommerce',  
            'revenue': element.transaction[4], // TotalTTC
            'shipping': '5',
            'tax': element.transaction[3],   // TotalTVA 
            'currency': 'EUR'
        }),
        element.allProducts.map((element) => (
            ga('ecommerce:addItem', {
                'id': element[0], //IdCommande
                'name': element[1],    // MonLibelleProduit
                'sku': element[2], //ID Produit
                'category': element[3], // MonLibelleFamille 
                'price': element[4], // TotalLigneTTC
                'quantity': element[5], // Quantité
                'currency': 'EUR'
            })
        ))
    ))

    // test
    // data.map((element) => (
    //     console.log(element.transaction[0])
    //     ,
    //     element.allProducts.map((element) => (console.log(element)))
    // ))
        
        
app.get('/', function async (req, res) {
    res.json(data)
})
 
app.listen(5500)
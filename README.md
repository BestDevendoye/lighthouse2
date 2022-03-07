# KPMG Lighthouse

_KPMG Lighthouse_ est un produit générique qui permet de générer un rapport [Google Lighthouse](https://developers.google.com/web/tools/lighthouse) à partir d'un [script de parcours](#script-de-parcours).

Utilisez ce produit dans votre [CD](https://fr.wikipedia.org/wiki/D%C3%A9ploiement_continu) couplé avec votre script de parcours pour suivre l'évolution de vos performances front sur votre projet.

- [KPMG Lighthouse](#kpmg-lighthouse)
  - [Script de parcours](#script-de-parcours)
    - [Exemple de script](#exemple-de-script)
  - [Déploiement continu](#déploiement-continu)
  - [Utilisation en local](#utilisation-en-local)
  - [Contribuer](#contribuer)

## Script de parcours

Votre script de parcours doit obligatoirement :
* Etre au format ES2021 (type module)
* Exporter une variable `name` contenant son nom.
* Exporter une variable `viewport` contenant son la taille écran utilisé dans le parcours.
* Exporter une variable `settings` contenant les [paramètres du lighthouse](https://github.com/GoogleChrome/lighthouse/tree/master/docs).
* Exporter la function `flow` qui contiendra le parcours. Cette function prend 3 paramètres :
  * `logger` : Le logger pour afficher des résultats dans la console.
  * `lighthouse` qui contient l'instance de l'API Lighthouse.
  * `page` qui contient l'instance de la [page Pupetteer](https://devdocs.io/puppeteer-page/).

### Exemple de script

```js
export const name = 'Pulse Recette';

export const viewport = { width: 1350, height: 940 };
export const settings = {
  screenEmulation: {
    mobile: false,
    width: 1350,
    height: 940,
    deviceScaleFactor: 1,
    disabled: false,
  },
  formFactor: 'desktop',
};

export const flow = async ({ info, debug }, lighthouse, page) => {
  info('Start testing flow...');
  debug('URL', PULSE_URL);

  await lighthouse.startTimespan({ stepName: 'Start' });
  await page.goto(PULSE_URL);
  await page.waitForNavigation();
  await lighthouse.endTimespan();
  await lighthouse.snapshot({ stepName: 'Homepage' });
};

```

## Déploiement continu

**A remplir une fois le template CD terminé**

## Utilisation en local

**Pré-requis**

Vous aurez besoin de [Node.js](https://nodejs.org) en version LTS 16 au minimum pour pouvoir lancer le projet. L'utilisation de [NVM](https://github.com/nvm-sh/nvm) est grandement recommandé et un fichier de configuration est disponible pour l'utiliser.

* Le projet utilise la convention [airbnb coding style](https://github.com/airbnb/javascript) strictement.
* Node.js est configuré en [type _module_](https://nodejs.org/docs/latest-v13.x/api/esm.html#esm_enabling). Nous utilisons donc nativement les imports ([plus d'infos](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules)).
* Parce que Node.js est [cross-plateform](https://nodejs.org/en/about/), **tous** les fichiers sont en sauts de ligne au format Unix (`\n`) et non Windows (`\n\r`).

**Installation**
1. Clonez ce dépôt sur votre poste.
2. Si vous utilisez NVM, lancez la commande pour activer la bonne version de Node.js : `nvm use`.
3. Lancez l'installation des dépendances : `npm i`.
4. Ce projet utilise les variables d'environnement pour gérer ses configurations. Nativement, il utilise [DotEnv](https://github.com/motdotla/dotenv) et vous pouvez donc créer un fichier `.env` à la racine pour paramétrer vos variables. Un fichier `.env.dist` est disponible pour être copié-collé en `.env` plus facilement. Les variables sont décrites plus bas.
5. Lancez `npm run lighthouse`

**Variables d'environnement**
* `LIGHTHOUSE_DEBUG` (par défaut: _false_) : Active le debug. Les erreurs seront mieux décrites et les variables d'environnement affichées.
* `LIGHTHOUSE_HEADLESS` (par défaut: _true_) : Lance le [chromium en mode Headless](https://developers.google.com/web/updates/2017/04/headless-chrome).
* `LIGHTHOUSE_FLOW_CONFIG_PATH` (par défaut: _./config/flow.js_) : Chemin du script de parcours utilisé.
* `LIGHTHOUSE_OUTPUT` (par défaut: _./reports_) : Chemin d'écriture des rapports.

## Contribuer

Pour contribuer au projet, rien de plus simple :

1. Clonez le projet sur votre poste
2. Lisez et utilisez la [convention de commits](./.azuredevops/COMMIT_CONVENTION.md).
3. Faites vos modifications.
4. Mettez à jour les tests, **notre couverture est à 100%** avec la commande `npm test`.
5. Fixez tout problème de linter avec la commande `npm run lint`.
6. Créez une branche et soumettez votre PR à la branche `main`.

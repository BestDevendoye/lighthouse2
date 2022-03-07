## Conventions de commits GIT

> Ce document est adapté de _[Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular)_.

#### TL;DR:

Pour faire simple, les messages doivent matcher cette regex:

```js
/^(revert: )?(feat|fix|refactor|perf|doc|style|test|chore)(\(.+\))?: .{1,50}/
```

#### Exemples
Pour l'ajout d'une option dans la fonctionnalité du "compiler" :

```
feat(compiler): add 'comments' option
```

Pour la correction d'un bug sur la foncitonnalité du "logger avec un lien vers le ticket #28:

```
fix(logger): handle events on blur

close #28
```

Pour l'amélioration des performances du "core" avec l'ajout d'un "Breaking Changes" :

```
perf(core): improve vdom diffing by removing 'foo' option

BREAKING CHANGE: The 'foo' option has been removed.
```

### Format complet des messages

Un message de commit estomposé d'un **header**, un **body** et d'un **footer**. Le header possède un **type**, un **scope** et un **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Seul le **header** est obligatoire.

### Type

Si le prefix est `sub`, `fix` ou `stage`, il sera intégré dans le changelog. Dans tous les cas, si le commit contient un [BREAKING CHANGE](#footer), il sera ajouté au changelog.

Les autres prefixes sont à votre discretion.

### Scope

Le scope peut être n'importe quoi qui localise le changement. Généralement avec la section qui le contient. Par exemple `subject doc-as-code`, `A3 postmortem`, `share extensions vscode-git`, etc...

### Subject

Le subject contient une description succinte du changement:

* comme pour le reste, toujours en angais
* utiliser l'_imperative, present tense_ (anglais) : "change" et non "changed" ou "changes"
* ne pas mettre en majuscule la première lettre
* pas de point (.) à la fin

### Body

Comme pour le **subject**, il faut utiliser l'_imperative, present tense_ (anglais) : "change" et non "changed" ou "changes".
Le body doit inclure la motivation du changement et contraster avec le comportant précédant.

### Footer

Le footer doit contenir toute information à propos de **Breaking Changes**. Il est également l'endroit où l'on place les références aux tâches des backlogs avec les termes consacrés comme **Closes** par exemple.

**Breaking Changes** doit commencer avec le terme `BREAKING CHANGE:` avec un espace ou deux nouvelles lignes. Le reste du message est utilisé uniquement pour ça.

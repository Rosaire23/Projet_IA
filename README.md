# Projet_IA

Ce projet a été développé dans le cadre d'un exercice de programmation en JavaScript 
utilisant la bibliothèque p5.js pour créer un système de suivi de leader par des véhicules.

## Description du Projet

Le but de ce projet était de créer un système de simulation où des véhicules suivent un leader, 
en ajustant leur comportement en fonction de leur position par rapport au leader et en évitant les obstacles présents sur l'écran.
Vous verrez que je n'ai pas tous fait et mes représentations sont assez basiques et en ce qui concerne les numéros marqués optionnel je n'y ai pas touché.
Et bien évidemment, il y'a certaines parties où chatGPT y a contribué.

Le projet comporte plusieurs fonctionnalités principales :

- Suivi de leader avec comportements différents selon la position par rapport au leader.
- Gestion des obstacles pour éviter les collisions.
- Curseurs interactifs pour régler les paramètres de comportement des véhicules.
- Ajout de véhicules avec différents comportements (suivi, évitement d'obstacles, repoussés par les bords de l'écran).
- Basculer entre le suivi de leader standard et le suivi en queue leu leu avec la touche spécifique.

## Fonctionnalités Clés

- **Suivi de Leader :** Les véhicules ajustent leur comportement en fonction de leur position par rapport au leader. S'ils se trouvent derrière, ils suivent normalement. S'ils se trouvent devant, ils évitent le leader en adoptant un comportement d'évasion.
- **Gestion des Obstacles :** Les véhicules évitent les obstacles présents sur l'écran pour éviter les collisions.
- **Curseurs Interactifs :** Des curseurs sont utilisés pour ajuster en temps réel les paramètres de comportement des véhicules.
- **Ajout de Véhicules et Basculer Entre Comportements :** Possibilité d'ajouter de nouveaux véhicules avec des comportements spécifiques et de basculer entre le suivi de leader standard et le suivi en queue leu leu.
- **Gestion des Limites de l'Écran :** Les véhicules sont repoussés par les bords de l'écran pour rester dans les limites.

## Technologie Utilisée

- JavaScript
- Bibliothèque p5.js

## Auteur

Franciscaine Rosaire (lien_vers_profil_github)

---


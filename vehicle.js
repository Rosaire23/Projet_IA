class Vehicle{
    constructor(x, y, wanderForce){
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.maxSpeed = 4;
        this.maxForce = 0.1;
        this.r = 8;
        this.wanderForce = wanderForce;
    } 
    update(){
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.boundaries()// Appel de la méthode boundaries pour gérer les limites de l'écran
    }
 // Nouvelle méthode update prenant en compte le suivi du leader à la queue leu leu
      updateWithLeaderFollow(leader, vehicles, target) {
// Appliquer les comportements
      this.applyBehavior(leader, vehicles, target);

    // Mise à jour de la position en utilisant la vélocité pour suivre le leader à la queue leu leu
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
//===========================================================================================================================
    
    display(isLeader) {
        fill(255);
          noStroke(); // Ajout du trait de contour
          ellipse(this.position.x, this.position.y, 15, 15);
        if (isLeader) {
          fill(255, 0, 0);
          ellipse(this.position.x, this.position.y, 30, 30);
          
          //fill(255, 0, 0);
          //stroke(255, 0, 0, 100);
          
          //let direction = this.velocity.copy();
          //direction.normalize();
          //direction.mult(-this.r * 2);
          
          //let circlePosition = p5.Vector.add(this.position, direction);
          
          // Dessiner la ligne reliant le leader au cercle derrière lui
          //line(this.position.x, this.position.y, circlePosition.x, circlePosition.y);
          
          //ellipse(circlePosition.x, circlePosition.y, this.r * 4, this.r * 4);
        //} else {
      }
    }
//=================================================================================================
    applyBehavior(leader, vehicles, target){
 // Récupérer le véhicule précédent pour le suivi en queue leu leu
    let index = vehicles.indexOf(this);
    let prevVehicle = null;
    if (index > 0) {
      prevVehicle = vehicles[index - 1];
    }


     let separationForce = this.separate(vehicles);
     let followForce = this.follow(leader);
     let evadeForce = this.evade(leader);
     let wanderForce = this.wander();
     let avoidObstacleForce = this.avoidObstacles(obstacles);
    
     //Reglage des forces 
    separationForce.mult(1.5);
    followForce.mult(1.5);
    evadeForce.mult(4.0);
    wanderForce.mult(this.wanderForce);

    this.applyForce(separationForce);
    this.applyForce(followForce);
    this.applyForce(evadeForce);
    this.applyForce(wanderForce);
    this.applyForce(avoidObstacleForce);

    let seekTargetForce = this.seek(target); // Calculer la force pour suivre la cible
    seekTargetForce.mult(2.0); // Ajuster la force de suivi de cible
    this.applyForce(seekTargetForce); // Appliquer la force de suivi de cible
    
    // Ajout du comportement de suivi du véhicule précédent
    if (prevVehicle) {
      let followPrevForce = this.arrive(prevVehicle.position);
      followPrevForce.mult(1.5); // Ajuster la force pour arriver au véhicule précédent
      this.applyForce(followPrevForce);
    }
}

avoidObstacles(obstacles) {
    let avoidForce = createVector(0, 0);
    let detectionRadius = 50; // Rayon de détection des obstacles
  
    for (let obstacle of obstacles) {
      let obstaclePos = obstacle.position;
      let distance = p5.Vector.dist(this.position, obstaclePos);
  
      if (distance < detectionRadius + obstacle.radius) {
        let avoidDir = p5.Vector.sub(this.position, obstaclePos);
        avoidDir.normalize();
        avoidDir.mult(this.maxSpeed);
  
        let steer = p5.Vector.sub(avoidDir, this.velocity);
        steer.limit(this.maxForce);
  
        avoidForce.add(steer);
      }
    }
    return avoidForce;
  }  

  boundaries() {
    let d = 25; // Marge de détection pour les bords de l'écran
  
    if (this.position.x < d) {
      this.position.x = d;
      this.velocity.x *= -1;
    } else if (this.position.x > width - d) {
      this.position.x = width - d;
      this.velocity.x *= -1;
    }
  
    if (this.position.y < d) {
      this.position.y = d;
      this.velocity.y *= -1;
    } else if (this.position.y > height - d) {
      this.position.y = height - d;
      this.velocity.y *= -1;
    }
  }  
//================================================================================================
    
seek(target) {
    let desired = p5.Vector.sub(target, this.position); // Calculer le vecteur désiré vers la cible
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  }

  separate(vehicles) {
  // Définir la distance minimale souhaitée entre les véhicules pour la séparation
     let desiredSeparation = 25;
     let sum = createVector(); // Initialiser un vecteur somme pour stocker les forces de séparation
     let count = 0;
    

 // Parcourir tous les autres véhicules pour calculer la force de séparation
     for (let other of vehicles) {
        let d = p5.Vector.dist(this.position, other.position); // Calculer la distance entre ce véhicule et un autre
    

// Si la distance est plus grande que 0 et inférieure à la distance minimale souhaitée
     if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.position, other.position); // Calculer la différence de position entre les véhicules
        diff.normalize(); // Normaliser le vecteur de différence
        diff.div(d); // Diviser le vecteur pour réduire l'impact basé sur la distance
        sum.add(diff); // Ajouter la force de séparation au vecteur somme
        count++; // Augmenter le compteur pour calculer la moyenne de la force de séparation
                }
            }

// Si au moins un autre véhicule est à une distance de séparation souhaitée
    if (count > 0) {
         sum.div(count); // Calculer la moyenne des forces de séparation
         sum.normalize(); // Normaliser le vecteur somme
         sum.mult(this.maxSpeed); // Fixer la magnitude de la force de séparation
         sum.sub(this.velocity); // Soustraire la vitesse actuelle du véhicule pour obtenir la force de séparation finale
         sum.limit(this.maxForce); // Limiter la force de séparation pour ne pas dépasser une certaine valeur
            }
    
            return sum; // Retourner le vecteur force de séparation calculé
        }
//==================================================================================================================================================
follow(leader){
    let distance = p5.Vector.dist(this.position, leader.position); // Calculer la distance entre ce véhicule et le leader
    // Vérifier si le véhicule est à l'intérieur du cercle derrière le leader
    if (distance > leader.r) {
         // Si le véhicule est derrière le cercle, suivre normalement le leader
         let desired = p5.Vector.sub(leader.position, this.position); // Calculer le vecteur désiré pour suivre le leader
         desired.normalize(); // Normaliser le vecteur désiré
         desired.mult(this.maxSpeed); // Fixer la magnitude du vecteur désiré pour correspondre à la vitesse maximale
         let steer = p5.Vector.sub(desired, this.velocity); // Calculer la force de direction
         steer.limit(this.maxForce); // Limiter la force de direction
         return steer; // Retourner la force de direction pour suivre le leader
     }
     else {
        // Si le véhicule est devant le cercle, provoquer l'évasion
        let evadeDirection = p5.Vector.sub(this.position, leader.position); // Calculer le vecteur de direction pour s'échapper du cercle devant le leader
        // Implémenter le code nécessaire pour faire évader le véhicule du cercle devant le leader
        evadeDirection.normalize(); // Normaliser le vecteur de direction
        // Utiliser des vecteurs pour diriger le véhicule loin du cercle devant le leader
        // Retourner le vecteur force pour l'évasion
        // (Tu devras déterminer comment faire évader le véhicule dans cette condition spécifique)
        evadeDirection.mult(this.maxSpeed); // Fixer la magnitude du vecteur de direction pour correspondre à la vitesse maximale
        let evadeForce = p5.Vector.sub(evadeDirection, this.velocity); // Calculer la force d'évasion
        evadeForce.limit(this.maxForce); // Limiter la force d'évasion
        return evadeForce; // Retourner la force d'évasion pour échapper au cercle devant le leader
    }
}
//==================================================================================================================================

evade(leader) {
    let distance = p5.Vector.dist(this.position, leader.position); // Calculer la distance entre ce véhicule et le leader

    // Vérifier si le véhicule est à l'intérieur du cercle derrière le leader
    if (distance > leader.r) {
        // Si le véhicule est derrière le cercle, aucune évasion n'est nécessaire pour le moment
        return createVector(0, 0); // Retourner un vecteur nul car aucune évasion n'est requise
    } 
    else {
        // Si le véhicule est devant le cercle, provoquer l'évasion
        let evadeDirection = p5.Vector.sub(this.position, leader.position); // Calculer le vecteur de direction pour s'échapper du cercle devant le leader
        evadeDirection.normalize(); // Normaliser le vecteur de direction
        evadeDirection.mult(this.maxSpeed); // Fixer la magnitude du vecteur de direction pour correspondre à la vitesse maximale
        let evadeForce = p5.Vector.sub(evadeDirection, this.velocity); // Calculer la force d'évasion
        evadeForce.limit(this.maxForce); // Limiter la force d'évasion
        return evadeForce; // Retourner la force d'évasion pour échapper au cercle devant le leader
    }  
}

applyForce(force) {
    this.acceleration.add(force);
  
   }

}

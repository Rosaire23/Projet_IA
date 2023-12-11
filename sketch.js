let separationSlider;
let followSlider;
let evadeSlider;
let wanderSlider;
let vehicles =[];
let leader;
let obstacles = [];
let isQueueBehavior = false; // Variable pour suivre l'état du comportement


function setup() {
  createCanvas(800, 500);
// Initialisation des curseurs
separationSlider = createSlider(0, 5, 2, 0.1); // Exemple avec valeurs minimales, maximales et initiales
followSlider = createSlider(0, 5, 2, 0.1);
evadeSlider = createSlider(0, 5, 2, 0.1);
wanderSlider = createSlider(0, 2, 1, 0.1);

//initialisation des véhicules
  for (let i=0; i<10; i++) {
   vehicles.push(new Vehicle(random(width), random(height)));
  }

//initialisation du leader
   leader = new Vehicle(width / 2, height / 2);

// Création d'obstacles (à placer où vous le souhaitez)
  obstacles.push(new Obstacle(200, 300, 25));
  obstacles.push(new Obstacle(600, 400, 35));
  obstacles.push(new Obstacle(400, 200, 40));

}

function draw() {
  background(0);
   // Afficher et mettre à jour les obstacles
   for (let obstacle of obstacles) {
    obstacle.display();
   }
// Utilisation des valeurs des curseurs
let separationForce = separationSlider.value();
let followForce = followSlider.value();
let evadeForce = evadeSlider.value();
let wanderForce = wanderSlider.value();

if (keyIsPressed && key === 'w') {
  vehicles.push(new Vehicle(random(width), random(height), wanderForce));
}

// Mise à jour de la position du leader pour qu'il suive la souris
    leader.position.x = mouseX;
    leader.position.y = mouseY;

  // Calculer la position de la cible derrière le leader
  let direction = leader.velocity.copy();
  direction.normalize();
  direction.mult(-leader.r * 2);
  let targetPosition = p5.Vector.add(leader.position, direction);

// Appliquer les comportements pour chaque véhicule
    for(let vehicle of vehicles){ 
      if (isQueueBehavior) {
        vehicle.updateWithLeaderFollow(leader, vehicles, targetPosition);
      } 
      else  {
        vehicle.applyBehavior(leader, vehicles, targetPosition);
      }
      vehicle.applyForce(vehicle.avoidObstacles(obstacles));
      vehicle.update();
      vehicle.display(false);
  }
  
  // Afficher et mettre à jour le leader
    leader.applyBehavior(leader, vehicles);
    leader.update();
    leader.display(true);


    // Mise à jour des comportements pour chaque véhicule
  for (let i = vehicles.length - 1; i >= 0; i--) {
    if (isQueueBehavior) {
      vehicles[i].updateWithLeaderFollow(leader, vehicles, createVector(0, 0));
    } else {
      vehicles[i].applyBehavior(leader, vehicles, createVector(0, 0));
    }
    vehicles[i].applyForce(vehicles[i].avoidObstacles(obstacles));
    vehicles[i].boundaries(); // Appliquer les bords de l'écran
    vehicles[i].update();
    vehicles[i].display(false);

    // Supprimer les véhicules qui sortent de l'écran
    if (vehicles[i].position.x > width || vehicles[i].position.x < 0 || vehicles[i].position.y > height || vehicles[i].position.y < 0) {
      vehicles.splice(i, 1);
    }
  }

}

function keyPressed() {
  if (key === 'i' || key === 'I') {
    isQueueBehavior = !isQueueBehavior; // Inverser l'état du comportement
  }
}

function mouseClicked() {
  // Créer un nouvel obstacle à l'emplacement du clic de souris
  let obstacleRadius = random(20, 50);
  let newObstacle = new Obstacle(mouseX, mouseY, obstacleRadius);
  obstacles.push(newObstacle);
}


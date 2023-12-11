class Obstacle {
  constructor(x, y, radius) {
    this.position = createVector(x, y);
    this.radius = radius;
  }

  display() {
    fill(0, 255, 0);
    noStroke();
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }
}

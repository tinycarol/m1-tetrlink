class Game {
  constructor(id) {
    this.canvas = document.getElementById("canvas");
    this.canvas.style.border = "1px solid black";
    this.canvas.width = 500;
    this.canvas.height = 700;
    this.ctx = canvas.getContext("2d");
    this.frames = 0;
    this.oldPieces = [];
    this.currentPiece = this.generateRandomPiece();
    this.nextPiece = this.generateRandomPiece();
    this.speed = 50;
    this.paused = false;
  }

  pause() {
    this.paused = !this.paused;
  }

  start() {
    requestAnimationFrame(() => {
      if (!this.paused) {
        if (this.frames % this.speed === 0) {
          this.clear();
          this.draw();
          this.checkCollisions();
          this.move();
        }
        this.frames++;
      }
      this.start();
    });
  }

  clear() {
    this.ctx.clearRect(0, 0, 500, 1000);
  }

  draw() {
    this.oldPieces.forEach((p) => p.draw());
    this.currentPiece.draw();
  }

  move() {
    this.currentPiece.move();
  }

  generateMap() {
    const fullMap = [this.currentPiece, ...this.oldPieces].reduce(
      (acc, piece) => {
        const map = piece.generateMap();
        Object.keys(map).forEach((y) => {
          if (!acc[y]) {
            acc[y] = [];
          }
          acc[y] = [...new Set([...acc[y], ...map[y]])];
        });
        return acc;
      },
      {}
    );
    return fullMap;
  }

  checkCollisions() {
    const hasCollisions = this.currentPiece.checkCollisions(this.oldPieces);
    if (hasCollisions) {
      this.speed--;
      this.oldPieces.push(this.currentPiece);
      this.currentPiece = this.nextPiece;
      this.nextPiece = this.generateRandomPiece();
    }
    this.clearLines();
  }

  removeEmpties() {}

  clearLines() {
    const map = this.generateMap();
    const firstFullRow = Object.entries(map).find(
      ([row, values]) => values.length === 10
    );
    if (firstFullRow) {
      this.currentPiece.clearLine(firstFullRow[0]);
      this.oldPieces.forEach((p) => p.clearLine(firstFullRow[0]));
      this.clearLines();
    }
  }

  clearEmpties() {
    // TODO: remove empty pieces
  }

  onKeyEvent(e) {
    this.currentPiece.onKeyEvent(e);
    this.checkCollisions();
    this.clear();
    this.draw();
  }

  generateRandomPiece() {
    return new Piece(
      this.ctx,
      JSON.parse(
        JSON.stringify(LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)])
      )
    );
  }
}

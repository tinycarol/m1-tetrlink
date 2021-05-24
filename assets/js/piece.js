const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

class Piece {
  constructor(ctx, layout) {
    this.ctx = ctx;
    this.layout = layout;
    this.x = 0;
    this.y = -this.layout.length;
    this.squareSize = 50;
    this.color = generateRandomColor();
  }

  move() {
    this.y++;
  }

  nextLayout() {
    return this.generateLayout(1);
  }

  clearLine(position) {
    const deleteRow = position - this.y;
    if (deleteRow >= 0 && this.layout.length > deleteRow) {
      this.layout.splice(deleteRow, 1);
      this.y++;
    }
  }

  generateMap() {
    return this.layout.reduce((acc, row, y) => {
      row.forEach((hasElement, x) => {
        if (hasElement) {
          if (!acc[y + this.y]) {
            acc[y + this.y] = [];
          }
          acc[y + this.y].push(x + this.x);
        }
      })
      return acc;
    }, {});
  }

  generateLayout(yoffset = 0) {
    const layout = [];
    this.layout.forEach((row, y) => {
      row.forEach((v, x) => {
        if (v) {
          layout.push(`${this.y + y + yoffset},${this.x + x}`);
        }
      })
    });
    return layout;
  }

  checkCollisions(oldPieces) {
    if ((this.y + this.layout.length) * this.squareSize >= 700) {
      return true;
    } else {
      const currentLayout = this.nextLayout();
      return oldPieces.some(piece => {
        const l = [...currentLayout, ...piece.generateLayout()];
        return l.length !== [...new Set(l)].length;
      });
    }
  }

  rotate() {
    var rotated = [];
    this.layout.forEach((row, y) => {
      row.forEach((v, x) => {
        rotated[row.length - x - 1] = rotated[row.length - x - 1] || [];
        rotated[row.length - x - 1][y] = v;
      });
    });
    this.layout = rotated;
  }

  onKeyEvent(event) {
    switch (event.keyCode) {
      case KEY_DOWN:
        if ((this.y + 1 + this.layout.length - 1) * this.squareSize < 700) {
          this.y++;
        }
        break;
      case KEY_RIGHT:
        if ((this.x + 1 + this.layout[0].length - 1) * this.squareSize < 500) {
          this.x++;
        }
        break;
      case KEY_LEFT:
        if (this.x > 0) {
          this.x--;
        }
        break;
      case KEY_UP:
      case KEY_SPACE:
        this.rotate();
        break;
    }
  }

  draw() {
    this.layout.forEach((row, y) => {
      row.forEach((_, x) => {
        if (this.layout[y][x]) {
          this.ctx.save();
          this.ctx.beginPath();
          const xStart = (this.x + x) * this.squareSize;
          const yStart = (this.y + y) * this.squareSize;
          this.ctx.fillStyle = this.color;
          this.ctx.strokeStyle = "black";
          this.ctx.rect(xStart, yStart, this.squareSize, this.squareSize);
          this.ctx.stroke();
          this.ctx.fill();
          this.ctx.restore();
        }
      });
    });
  }
}

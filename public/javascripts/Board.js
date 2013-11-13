function Board() {
  this.init();
}

Board.prototype.generateEmptyRow = function() {
  return _.map(Array(this.width + 1).join('0').split(''), parseFloat);
};

Board.prototype.generateBody = function() {
  var body = [];
  for (var i = 0; i < this.height; ++i) {
    body.push(this.generateEmptyRow());
  }

  return body;
};

Board.prototype.init = function() {
  this.width = 10;
  this.height = 20;
  this.body = this.generateBody();

  this.piece = new Piece();
  this.position = this.getStartPosition();
};

Board.prototype.getBody = function() {
  return this.body;
};

Board.prototype.getFullBodyState = function() {
  var bodyClone       = this.getFullBodyDeepClone(),
      fallingPosition = this.getFallingPosition();

  for (var row = 0; row < this.piece.getHeight(); ++row) {
    for (var col = 0; col < this.piece.getWidth(); ++col) {
      if (this.piece.getBody()[row][col]) {
        bodyClone[fallingPosition[0] + row][fallingPosition[1] + col] = this.piece.getBody()[row][col];
      }
    }
  }

  return bodyClone;
};

Board.prototype.getFullBodyDeepClone = function() {
  var bodyClone = [];

  for (var row = 0; row < this.getHeight(); ++row) {
    bodyClone[row] = this.body[row].slice();
  }

  return bodyClone;
};

Board.prototype.getWidth = function() {
  return this.width;
};

Board.prototype.getHeight = function() {
  return this.height;
};

Board.prototype.place = function(piece, row, col) {
  for (var currentRow = 0; currentRow < piece.getHeight(); ++currentRow) {
    for (var currentCol = 0; currentCol < piece.getWidth(); ++currentCol) {
      if (this.body[row + currentRow][col + currentCol] === 0) {
        this.body[row + currentRow][col + currentCol] = piece.getBody()[currentRow][currentCol];
      }
    }
  }
};

Board.prototype.printBody = function(body) {
  this.print(this.getBody());
};

Board.prototype.printFullBodyState = function(body) {
  this.print(this.getFullBodyState());
};

Board.prototype.print = function(body) {
  var readableBoard = _.map(body, function(row) {
    return _.map(row, function(item) {
      return item ? '@' : ' ';
    });
  });
  for (var row = 0; row < readableBoard.length; ++row) {
    console.log(JSON.stringify(readableBoard[row]));
  }
};

Board.prototype.getFallingPiece = function() {
  return this.piece;
};

Board.prototype.getFallingPosition = function() {
  return this.position;
};

Board.prototype.setFallingPosition = function(row, column) {
  this.position[0] = row;
  this.position[1] = column;
};

Board.prototype.tick = function() {
  if (this.canPieceFall()) {
    this.position[0] += 1;
  }

  if (!this.canPieceFall()) {
    this.placeFallingPiece();
    this.clearFullRows();
    this.triggerNextPiece();
  }
};

Board.prototype.placeFallingPiece = function() {
  this.place(this.piece, this.position[0], this.position[1]);
};

Board.prototype.triggerNextPiece = function() {
  this.piece = new Piece();
  this.position = this.getStartPosition();
};

Board.prototype.movePieceLeft = function() {
  if (this.position[1]) {
    this.position[1] -= 1;
  }
};

Board.prototype.movePieceRight = function() {
  if (this.position[1] < this.width - this.piece.getWidth()) {
    this.position[1] += 1;
  }
};

Board.prototype.isEmpty = function() {
  var flattenBoard = _.flatten(this.body);
  return _.all(flattenBoard, function(e) { return e === 0 });
};

Board.prototype.canPieceFall = function() {
  var pieceSkirt = this.piece.skirt(),
      nextRowIndex,
      canPieceFall = true;

  for (var i = 0; i < pieceSkirt.length; ++i) {
    nextRowIndex = this.position[0] + pieceSkirt[i] + 1;
    canPieceFall &= nextRowIndex < this.getHeight() && this.body[nextRowIndex][this.position[1] + i] === 0;
  }

  return !!canPieceFall;
};

Board.prototype.getStartPosition = function() {
  return [0, this.getWidth() / 2];
};

Board.prototype.isFull = function() {
  return (this.position[0] === 0) && !(this.canPieceFall());
};

Board.prototype.rotatePiece90 = function() {
  var rotatedPieceClone = this.piece.clone().rotate90(),
      rotatedPieceCloneWidth = rotatedPieceClone.getWidth();

  for (var tries = 0; tries < rotatedPieceCloneWidth; tries++) {
    if (!this.willPieceOverlap(rotatedPieceClone, this.position[0], this.position[1] - tries)
        && !this.isPieceOutOfBoundaries(rotatedPieceClone, this.position[0], this.position[1] - tries)) {
      this.setFallingPosition(this.position[0], this.position[1] - tries);
      this.piece.rotate90();
      break;
    }
  }
};

Board.prototype.isPieceOutOfBoundaries = function(piece, row, col) {
  return (col + piece.getWidth() > this.getWidth());
};

Board.prototype.willPieceOverlap = function(piece, row, col) {
  for (var currentRow = 0; currentRow < piece.getHeight(); currentRow++) {
    for (var currentCol = 0; currentCol < piece.getWidth(); currentCol++) {
      if (this.body[row + currentRow][col + currentCol] === 1) {
        return true;
      }
    }
  }

  return false;
};

Board.prototype.clearFullRows = function() {
  _.each(this.body, function(row, index) {
    if (!_.contains(row, 0)) {
      this.body.splice(index, 1);
      this.body.unshift(_.map(row, function() { return 0; }));
    }
  }, this);
};

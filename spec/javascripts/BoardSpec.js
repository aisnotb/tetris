describe("Board", function() {
  var board;

  beforeEach(function() {
    board = new Board();
  });

  it("starts empty (all elements should be zero)", function() {
    var flattenBoard = _.flatten(board.getBody());

    expect(_.all(flattenBoard, function(e) { return e === 0 })).toBeTruthy();
  });

  it(".place(piece, x, y) places piece into boards X and Y coordinates", function() {
    var x = 5,
        y = 5,
        piece = new Piece();

    board.place(piece, x, y);

    for (var row = 0; row < piece.getHeight(); ++row) {
      for (var col = 0; col < piece.getWidth(); ++col) {
        expect(board.getBody()[x + row][y + col]).toBe(piece.getBody()[row][col]);
      }
    }
  });

  it("has a current falling piece", function() {
    expect(board.fallingPiece()).toBeDefined();
  });

  it("current falling piece is a Piece object", function() {
    expect(board.fallingPiece()).toEqual(jasmine.any(Piece));
  });

  it(".getWidth() returns its width", function() {
    expect(board.getWidth()).toBe(board.width);
  });

  it(".getHeight() return its height", function() {
    expect(board.getHeight()).toBe(board.height);
  });
});

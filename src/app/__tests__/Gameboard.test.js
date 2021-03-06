import Gameboard from "../factories/Gameboard";

describe("Gameboard Factory", () => {
  let gameBoard;
  let attackFunc;

  beforeEach(() => {
    gameBoard = Gameboard();
    attackFunc = function attack(size, x, y) {
      for (let i = 0; i <= size; i++) {
        gameBoard.receiveAttack(x + i, y);
      }
    };
  });

  test("Board Creation", () => {
    const boardArray = gameBoard.board;
    expect(boardArray).toEqual(
      expect.not.arrayContaining([expect.not.arrayContaining([""])])
    );
  });

  test("Ship placement for Carrier at x: 5, y:3", () => {
    gameBoard.placeShip("Carrier", [3, 5]);
    const board = gameBoard.getBoard();
    expect(board[5][3].type).toBe("Carrier");
  });

  test("Test for missed hit", () => {
    gameBoard.placeShip("Carrier", [3, 5]);
    const attack = gameBoard.receiveAttack(2, 5);
    expect(attack).toBe("Miss");
  });

  test("Test for successful hit", () => {
    gameBoard.placeShip("Carrier", [4, 5]);
    const attack = gameBoard.receiveAttack(4, 5);
    expect(attack).toBe("Hit");
  });

  test("Two missed hits should return two coordinates", () => {
    gameBoard.placeShip("Carrier", [2, 8]);
    gameBoard.receiveAttack(4, 5);
    gameBoard.receiveAttack(6, 6);
    const getMissedHits = gameBoard.getMissedHits();
    const missedArr = [
      { xCoord: 4, yCoord: 5 },
      { xCoord: 6, yCoord: 6 },
    ];
    expect(JSON.stringify(getMissedHits)).toBe(JSON.stringify(missedArr));
  });

  test("Returns true if all ships has sunk", () => {
    gameBoard.placeShip("Carrier", [5, 6]);
    gameBoard.placeShip("Battleship", [3, 2]);
    gameBoard.placeShip("Cruiser", [0, 4]);
    gameBoard.placeShip("Submarine", [5, 4]);
    gameBoard.placeShip("Destroyer", [7, 9]);
    attackFunc(5, 5, 6);
    attackFunc(4, 3, 2);
    attackFunc(3, 0, 4);
    attackFunc(3, 5, 4);
    attackFunc(2, 7, 9);
    expect(gameBoard.checkAllSunkShip()).toBeTruthy();
  });

  test("Returns false if all ships are still up", () => {
    gameBoard.placeShip("Carrier", [2, 8]);
    gameBoard.placeShip("Destroyer", [6, 2]);
    gameBoard.placeShip("Submarine", [4, 0]);
    expect(gameBoard.checkAllSunkShip()).toBeFalsy();
  });

  test("Should return false when a ship is already in place", () => {
    gameBoard.placeShip("Carrier", [2, 5]);
    gameBoard.placeShip("Destroyer", [1, 8]);
    expect(gameBoard.checkAvailableSpace(5, 5, "Carrier", 5)).toBeFalsy();
    expect(gameBoard.checkAvailableSpace(2, 8, "Destroyer", 2)).toBeFalsy();
  });

  test("Should test edges of the board", () => {
    const type = "Carrier";
    const xCoord = 7;
    const yCoord = 1;
    const xCoordNegative = -1;
    expect(gameBoard.checkBoardEdges(xCoord, yCoord, type)).toBeTruthy();
    expect(
      gameBoard.checkBoardEdges(xCoordNegative, yCoord, type)
    ).toBeTruthy();
  });

  test("Should not be able to attack outside the board", () => {
    const beyondXCoord = gameBoard.receiveAttack(10, 6);
    const beyondYCoord = gameBoard.receiveAttack(8, 14);
    expect(beyondXCoord).toBe("Invalid coordinates");
    expect(beyondYCoord).toBe("Invalid coordinates");
  });
});

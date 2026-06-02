function newBoard() {
  $("#sudoku input").filter(function () {
    $(this).removeAttr('disabled');
    $(this).removeClass("board-cell--error highlight-val");
  });
  mySudokuJS.clearBoard();
  mySudokuJS.generateBoard(getLevel());
}
var mySudokuJS = $("#sudoku").sudokuJS({
  difficulty: getLevel(),
  boardFinishedFn: function (data) {
    const message = "Congratulations \n\n You have completed the puzzle, would you like to play again?";
    if (confirm(message)) {
      newBoard();
    };
  }
});

$("#new-game").on("click", function () {
  newBoard();
});

function getLevel() {
  return $("input[name='sudoku-difficulty']:checked").val() || 'easy';
}

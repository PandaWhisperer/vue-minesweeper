var ROWS = 10;
var COLUMNS = 20;

var TILES = [];  // Matrix of false / true, true if there is a bomb.

function open_tile(td) {
  var td = $(td);
  var row = td.data('row');
  var column = td.data('column');

  if (TILES[row][column]) {  // Is there a bomb?
    td.removeClass().addClass('mine');
    unveal_all();
  } else {
    var neighbour_mines = count_neighbour_mines(td);
    if (neighbour_mines == 0) {
      td.removeClass().addClass('opened');
    } else {
      td.removeClass().addClass('mine-neighbour-' + neighbour_mines);
    }
  }
}

function roll_dice() {
  return Math.round(Math.random() * 6) + 1;
}

function unveal_all() {
  $('td.unopened').each(function(i, item) {
    open_tile(item);
  });
}

function count_neighbour_mines(td) {
  var td = $(td);
  var row = td.data('row');
  var column = td.data('column');
  var neighbour_mines = 0;
  for (var row_offset = -1; row_offset <= 1; row_offset++) {
    for (var column_offset = -1; column_offset <= 1; column_offset++) {
      if (row_offset != 0 || column_offset != 0) {
        var neighbour_row = row + row_offset;
        var neighbour_column = column + column_offset;
        if (within_range(neighbour_row, neighbour_column)) {
          if (TILES[neighbour_row][neighbour_column]) {
            neighbour_mines++;
          }
        }
      }
    }
  }
  return neighbour_mines;
}

function within_range(row, column) {
  if (row < 0 || row >= TILES.length) {
    return false;
  }
  if (column < 0 || column >= TILES[0].length) {
    return false;
  }
  return true;
}

function initialize(minesweep) {
  for (var row = 0; row < ROWS; row++) {
    var tr = $('<tr />');
    TILES[row] = [];

    for (var column = 0; column < COLUMNS; column++) {
      var td = $('<td class="unopened" />').data({ row: row, column: column})
      tr.append(td);

      // Is there a bomb?
      TILES[row][column] = roll_dice() == 6
    }
    minesweep.append(tr);
  }
}

$(document).ready(function() {
  var minesweep = $('#minesweep');
  initialize(minesweep);
  minesweep.find('td').on('click', function(e) {
    open_tile(e.target);
  });
});
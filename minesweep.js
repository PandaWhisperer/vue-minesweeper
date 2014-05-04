var ROWS = 10;
var COLUMNS = 20;

var TILES = [];  // Matrix of tiles (td elements)

function flagTile(td) {
  var td = $(td);
  if (td.hasClass('flagged')) {
    td.removeClass().addClass('unopened');
  } else {
    td.removeClass().addClass('flagged');
  }
}

function openTile(td, unvealing_all) {
  var td = $(td);
  if (!td.hasClass('unopened')) {
    return;
  }

  var row = td.data('row');
  var column = td.data('column');
  console.log("Opening tile " + row + ", " + column);

  if (TILES[row][column].data('mined')) {
    td.removeClass().addClass('mine');
    if (!unvealing_all) {
      unvealAll();
    }
  } else {
    var neighbour_mines = countNeighbourMines(td);
    if (neighbour_mines == 0) {
      td.removeClass().addClass('opened');

      if (!unvealing_all) {
        var the_neighbours = neighbours(td);
        for (var i = 0; i < the_neighbours.length; i++) {
          openTile(the_neighbours[i], false);
        }
      }
    } else {
      td.removeClass().addClass('mine-neighbour-' + neighbour_mines);
    }
  }
}

function rollDice() {
  return Math.round(Math.random() * 6) + 1;
}

function unvealAll() {
  $('td.unopened').each(function(i, item) {
    openTile(item, true);
  });
}

function countNeighbourMines(td) {
  var neighbour_mines = 0;
  var the_neighbours = neighbours(td);
  for (var i = 0; i < the_neighbours.length; i++) {
    var column = the_neighbours[i].data('column');
    var row = the_neighbours[i].data('row');
    if (TILES[row][column].data('mined')) {
      neighbour_mines++;
    }
  }
  return neighbour_mines;
}

function neighbours(td) {
  var td = $(td);
  var row = td.data('row');
  var column = td.data('column');
  var the_neighbours = [];

  for (var row_offset = -1; row_offset <= 1; row_offset++) {
    for (var column_offset = -1; column_offset <= 1; column_offset++) {
      if (row_offset != 0 || column_offset != 0) {
        var neighbour_row = row + row_offset;
        var neighbour_column = column + column_offset;
        if (within_range(neighbour_row, neighbour_column)) {
          the_neighbours.push(TILES[neighbour_row][neighbour_column]);
        }
      }
    }
  }

  return the_neighbours;
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
      var td = $('<td class="unopened" />').data({
        row: row,
        column: column,
        mined: (rollDice() == 6)
      });
      TILES[row][column] = td;
      tr.append(td);
    }
    minesweep.append(tr);
  }
}

$(document).ready(function() {
  document.oncontextmenu = function() {return false;};

  var minesweep = $('#minesweep');
  initialize(minesweep);
  minesweep.find('td').on('mousedown', function(event) {
    switch (event.which) {
      case 3:  // Right click
        flagTile(event.target);
        break;
      default:
        openTile(event.target, false);
    }
  });
});
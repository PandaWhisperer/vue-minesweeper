var app = new Vue({
  el: '#minesweep',
  data: {
    rows: 10,
    columns: 20,
    tiles: []
  },
  created() {
    this.newGame();
  },
  methods: {
    newGame() {
      console.log('newGame', arguments);
      this.tiles = Array(this.rows).fill(0).map((_, row) => {
        return Array(this.columns).fill(0).map((_, col) => ({
            row, col,
            mined: Math.random() * 6 > 5,
            classes: ['unopened']
          }));
        });
    },

    updateTile(row, column, cb) {
      // cannot manipulates `tiles` directly –
      // need to replace array in order to trigger re-render
      this.tiles = this.tiles.map(function(_row, r) {
        return _row.map(function(tile, c) {
          if (r == row && c == column) {
            tile = cb.call(this, tile);
          }
          return tile;
        });
      });
    },

    flagTile(row, column) {
      console.log('flagTile', arguments)
      this.updateTile(row, column, function(tile) {
        if (tile.classes.indexOf('flagged') >= 0) {
          tile.classes = ['unopened']
        } else {
          tile.classes = ['flagged']
        }
        return tile;
      });
    },

    openTile(row, column, unvealing_all) {
      console.log('openTile', arguments);
      var tile = this.tiles[row][column];

      // do nothing if tile isn't unopened
      if (tile.classes.indexOf('unopened') < 0) {
        return;
      }

      if (tile.mined) {
        this.updateTile(row, column, function(tile) {
          tile.classes = ['mine']; return tile;
        });
        if (!unvealing_all) {
          this.unvealAll();
        }
      } else {
        var neighbourMines = this.countNeighbourMines(tile);
        if (neighbourMines == 0) {
          this.updateTile(row, column, function(tile) {
            tile.classes = ['opened']; return tile;
          });

          if (!unvealing_all) {
            this.neighbours(tile).forEach(nTile => {
              this.openTile(nTile.row, nTile.col, false);
            });
          }
        } else {
          this.updateTile(row, column, function(tile) {
            tile.classes =
            ['mine-neighbour-' + neighbourMines]; return tile;
          });
        }
      }
    },

    unvealAll() {
      this.tiles.forEach((row, r) => {
        row.forEach((tile, c) => {
          this.openTile(r, c, true);
        });
      })
    },

    countNeighbourMines(tile) {
      return this.neighbours(tile).filter((neighbour) => {
        return neighbour.mined;
      }).length;
    },

    neighbours(tile) {
      var theNeighbours = [];

      [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1],
       [1, -1], [1, 0], [1, 1]].forEach((offset) => {
          var x = tile.row + offset[0],
              y = tile.col + offset[1];

          if (this.valid(x, y)) {
            theNeighbours.push(this.tiles[x][y]);
          }
       });

      return theNeighbours;
    },

    valid(row, column) {
      return (row >= 0 && row < this.tiles.length) &&
             (column >= 0 && column < this.tiles[0].length);
    }
  }
});

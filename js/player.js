/*jslint browser this */
/*global _, shipFactory, player, utils */

(function (global) {
    "use strict";
    
    var ship = {
        dom: {
            parentNode: {
                removeChild: function () {
                }
            }
        }
    };
    
    var player = {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        activeShip: 0,
        init: function () {
            // créé la flotte
            this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));
            
            // créé les grilles
            this.grid = utils.createGrid(10, 10);
            this.tries = utils.createGrid(10, 10);
        },
        play: function (col, line) {
            // appel la fonction fire du game, et lui passe une calback pour récupérer le résultat du tir
            this.game.fire(this, col, line, _.bind(function (hasSucced) {
                this.tries[line][col] = hasSucced;
            }, this));
        },
        // quand il est attaqué le joueur doit dire si il a un bateaux ou non à l'emplacement choisi par l'adversaire
        receiveAttack: function (col, line, callback) {
            var succeed = false;
            
            if (this.grid[line][col] !== 0) {
                succeed = true;
                this.grid[line][col] = 0;
            }
            callback.call(undefined, succeed);
        },
        setActiveShipPosition: function (x, y) {
            let self=this;
            const ship = this.fleet[this.activeShip];
            const round = Math.ceil(ship.getLife() / 2)
            const total = round+x
            const shipSize = ship.getLife()
            console.log("x= " + x + "| y=  " + y)
            console.log(this.grid[x][y])
            let a=-round+1
            console.log("a= "+a)
            while (a<shipSize){
                if(self.grid[y][x+a]>0){
                    console.log(self.grid[y][x+a])
                    return null
                }
                a++;
            }
            if (total > 10 || total < shipSize) {
                return null;
            }
            let i = -2;
            if (ship.getId() < 4) {
                while (i < ship.getLife() - 2) {
                    this.grid[y][x + i] = ship.getId();
                    i++;
                }
            } else {
                i = 0
                while (i < ship.getLife()) {
                    
                    this.grid[y][x + i - 1] = ship.getId();
                    i++;
                }
            }
            
            console.log(this.grid)
            
            return true;
        },
        clearPreview: function () {
            
            this.fleet.forEach(function (ship) {
                if (ship.dom.parentNode) {
                    ship.dom.parentNode.removeChild(ship.dom);
                }
            });
        },
        resetShipPlacement: function () {
            this.clearPreview();
            this.activeShip = 0;
            this.grid = utils.createGrid(10, 10);
        },
        activateNextShip: function () {
            if (this.activeShip < this.fleet.length - 1) {
                this.activeShip += 1;
                return true;
            } else {
                return false;
            }
        },
        renderTries: function (grid) {
            this.tries.forEach(function (row, rid) {
                row.forEach(function (val, col) {
                    var node = grid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (col + 1) + ')');
                    
                    if (val === true) {
                        node.style.backgroundColor = '#e60019';
                    } else if (val === false) {
                        node.style.backgroundColor = '#aeaeae';
                    }
                });
            });
        },
        renderShips: function (grid) {
        },
        setGame(game) {
            this.game = game;
        },
        isShipOk() {
            console.log(this.grid)
        }
    };
    
    global.player = player;
    
}(this));
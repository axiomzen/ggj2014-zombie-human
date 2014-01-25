/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Tile Map object. A Tile map consists of a set of tile data and tile sets. It is rendered to the display using a TilemapLayer.
* A map may have multiple layers. You can perform operations on the map data such as copying, pasting, filling and shuffling the tiles around.
*
* @class Phaser.Tilemap
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {string} [key] - The key of the tilemap data as stored in the Cache.
*/
Phaser.Tilemap = function (game, key) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {array} layers - An array of Tilemap layers.
    */
    this.layers = null;

    if (typeof key === 'string')
    {
        this.key = key;

        this.layers = game.cache.getTilemapData(key).layers;
        this.calculateIndexes();
    }
    else
    {
        this.layers = [];
    }

    /**
    * @property {number} currentLayer - The current layer.
    */
    this.currentLayer = 0;

    /**
    * @property {array} debugMap - Map data used for debug values only.
    */

    this.debugMap = [];

    /**
    * @property {boolean} dirty - Internal rendering related flag.
    */
    this.dirty = false;

    /**
    * @property {array} _results - Internal var.
    * @private
    */
    this._results = [];

    /**
    * @property {number} _tempA - Internal var.
    * @private
    */
    this._tempA = 0;

    /**
    * @property {number} _tempB - Internal var.
    * @private
    */
    this._tempB = 0;

};

/**
* @constant
* @type {number}
*/
Phaser.Tilemap.CSV = 0;

/**
* @constant
* @type {number}
*/
Phaser.Tilemap.TILED_JSON = 1;

Phaser.Tilemap.prototype = {

    /**
    * Creates an empty map of the given dimensions.
    *
    * @method Phaser.Tilemap#create
    * @param {string} name - The name of the map (mostly used for debugging)
    * @param {number} width - The width of the map in tiles.
    * @param {number} height - The height of the map in tiles.
    */
    create: function (name, width, height) {

        var data = [];

        for (var y = 0; y < height; y++)
        {
            data[y] = [];

            for (var x = 0; x < width; x++)
            {
                data[y][x] = 0;
            }
        }

        this.layers.push({

            name: name,
            width: width,
            height: height,
            alpha: 1,
            visible: true,
            tileMargin: 0,
            tileSpacing: 0,
            format: Phaser.Tilemap.CSV,
            data: data,
            indexes: []

        });

        this.currentLayer = this.layers.length - 1;

        this.dirty = true;

    },

    /**
    * Internal function that calculates the tile indexes for the map data.
    *
    * @method Phaser.Tilemap#calculateIndexes
    */
    calculateIndexes: function () {

        for (var layer = 0; layer < this.layers.length; layer++)
        {
            this.layers[layer].indexes = [];

            for (var y = 0; y < this.layers[layer].height ; y++)
            {
                for (var x = 0; x < this.layers[layer].width; x++)
                {
                    var idx = this.layers[layer].data[y][x];

                    if (this.layers[layer].indexes.indexOf(idx) === -1)
                    {
                        this.layers[layer].indexes.push(idx);
                    }
                }
            }
        }

    },

    /**
    * Sets the current layer to the given index.
    *
    * @method Phaser.Tilemap#setLayer
    * @param {number} layer - Sets the current layer to the given index.
    */
    setLayer: function (layer) {

        if (this.layers[layer])
        {
            this.currentLayer = layer;
        }

    },

    /**
    * Puts a tile of the given index value at the coordinate specified.
    * @method Phaser.Tilemap#putTile
    * @param {number} index - The index of this tile to set.
    * @param {number} x - X position to place the tile (given in tile units, not pixels)
    * @param {number} y - Y position to place the tile (given in tile units, not pixels)
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    putTile: function (index, x, y, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            this.layers[layer].data[y][x] = index;
        }

        this.dirty = true;

    },

    /**
    * Gets a tile from the Tilemap Layer. The coordinates are given in tile values.
    * @method Phaser.Tilemap#getTile
    * @param {number} x - X position to get the tile from (given in tile units, not pixels)
    * @param {number} y - Y position to get the tile from (given in tile units, not pixels)
    * @param {number} [layer] - The Tilemap Layer to operate on.
    * @return {number} The index of the tile at the given coordinates.
    */
    getTile: function (x, y, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            return this.layers[layer].data[y][x];
        }

    },

    /**
    * Gets a tile from the Tilemap layer. The coordinates are given in pixel values.
    * @method Phaser.Tilemap#getTileWorldXY
    * @param {number} x - X position to get the tile from (given in pixels)
    * @param {number} y - Y position to get the tile from (given in pixels)
    * @param {number} [layer] - The Tilemap Layer to operate on.
    * @return {number} The index of the tile at the given coordinates.
    */
    getTileWorldXY: function (x, y, tileWidth, tileHeight, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        x = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
        y = this.game.math.snapToFloor(y, tileHeight) / tileHeight;

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            return this.layers[layer].data[y][x];
        }

    },

    /**
    * Puts a tile into the Tilemap layer. The coordinates are given in pixel values.
    * @method Phaser.Tilemap#putTileWorldXY
    * @param {number} index - The index of the tile to put into the layer.
    * @param {number} x - X position to insert the tile (given in pixels)
    * @param {number} y - Y position to insert the tile (given in pixels)
    * @param {number} tileWidth - The width of the tile in pixels.
    * @param {number} tileHeight - The height of the tile in pixels.
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    putTileWorldXY: function (index, x, y, tileWidth, tileHeight, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        x = this.game.math.snapToFloor(x, tileWidth) / tileWidth;
        y = this.game.math.snapToFloor(y, tileHeight) / tileHeight;

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height)
        {
            this.layers[layer].data[y][x] = index;
        }

        this.dirty = true;

    },

    /**
    * Copies all of the tiles in the given rectangular block into the tilemap data buffer.
    * @method Phaser.Tilemap#copy
    * @param {number} x - X position of the top left of the area to copy (given in tiles, not pixels)
    * @param {number} y - Y position of the top left of the area to copy (given in tiles, not pixels)
    * @param {number} width - The width of the area to copy (given in tiles, not pixels)
    * @param {number} height - The height of the area to copy (given in tiles, not pixels)
    * @param {number} [layer] - The Tilemap Layer to operate on.
    * @return {array} An array of the tiles that were copied.
    */
    copy: function (x, y, width, height, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        if (!this.layers[layer])
        {
            this._results.length = 0;
            return;
        }

        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof width === "undefined") { width = this.layers[layer].width; }
        if (typeof height === "undefined") { height = this.layers[layer].height; }

        if (x < 0)
        {
            x = 0;
        }

        if (y < 0)
        {
            y = 0;
        }

        if (width > this.layers[layer].width)
        {
            width = this.layers[layer].width;
        }

        if (height > this.layers[layer].height)
        {
            height = this.layers[layer].height;
        }

        this._results.length = 0;

        this._results.push( { x: x, y: y, width: width, height: height, layer: layer });

        for (var ty = y; ty < y + height; ty++)
        {
            for (var tx = x; tx < x + width; tx++)
            {
                this._results.push({ x: tx, y: ty, index: this.layers[layer].data[ty][tx] });
            }
        }

        return this._results;

    },

    /**
    * Pastes a previously copied block of tile data into the given x/y coordinates. Data should have been prepared with Tilemap.copy.
    * @method Phaser.Tilemap#paste
    * @param {number} x - X position of the top left of the area to paste to (given in tiles, not pixels)
    * @param {number} y - Y position of the top left of the area to paste to (given in tiles, not pixels)
    * @param {array} tileblock - The block of tiles to paste.
    * @param {number} layer - The Tilemap Layer to operate on.
    */
    paste: function (x, y, tileblock, layer) {

        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof layer === "undefined") { layer = this.currentLayer; }

        if (!tileblock || tileblock.length < 2)
        {
            return;
        }

        //  Find out the difference between tileblock[1].x/y and x/y and use it as an offset, as it's the top left of the block to paste
        var diffX = tileblock[1].x - x;
        var diffY = tileblock[1].y - y;

        for (var i = 1; i < tileblock.length; i++)
        {
            this.layers[layer].data[ diffY + tileblock[i].y ][ diffX + tileblock[i].x ] = tileblock[i].index;
        }

        this.dirty = true;

    },

    /**
    * Swap tiles with 2 kinds of indexes.
    * @method Phaser.Tilemap#swapTile
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    */
    swap: function (tileA, tileB, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        this._tempA = tileA;
        this._tempB = tileB;

        this._results.forEach(this.swapHandler, this);

        this.paste(x, y, this._results);

    },

    /**
    * Internal function that handles the swapping of tiles.
    * @method Phaser.Tilemap#swapHandler
    * @param {number} value
    * @param {number} index
    */
    swapHandler: function (value, index) {

        if (value.index === this._tempA)
        {
            this._results[index].index = this._tempB;
        }
        else if (value.index === this._tempB)
        {
            this._results[index].index = this._tempA;
        }

    },

    /**
    * For each tile in the given area (defined by x/y and width/height) run the given callback.
    * @method Phaser.Tilemap#forEach
    * @param {number} callback - The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
    * @param {number} context - The context under which the callback should be run.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    forEach: function (callback, context, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        this._results.forEach(callback, context);

        this.paste(x, y, this._results);

    },

    /**
    * Replaces one type of tile with another in the given area (defined by x/y and width/height).
    * @method Phaser.Tilemap#replace
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    replace: function (tileA, tileB, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        for (var i = 1; i < this._results.length; i++)
        {
            if (this._results[i].index === tileA)
            {
                this._results[i].index = tileB;
            }
        }

        this.paste(x, y, this._results);

    },

    /**
    * Randomises a set of tiles in a given area.
    * @method Phaser.Tilemap#random
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    random: function (x, y, width, height, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        var indexes = [];

        for (var t = 1; t < this._results.length; t++)
        {
            var idx = this._results[t].index;

            if (indexes.indexOf(idx) === -1)
            {
                indexes.push(idx);
            }
        }

        for (var i = 1; i < this._results.length; i++)
        {
            this._results[i].index = this.game.rnd.pick(indexes);
        }

        this.paste(x, y, this._results);

    },

    /**
    * Shuffles a set of tiles in a given area. It will only randomise the tiles in that area, so if they're all the same nothing will appear to have changed!
    * @method Phaser.Tilemap#shuffle
    * @param {number} tileA - First tile index.
    * @param {number} tileB - Second tile index.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    shuffle: function (x, y, width, height, layer) {

        if (typeof layer === "undefined") { layer = this.currentLayer; }

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        var header = this._results.shift();

        Phaser.Utils.shuffle(this._results);

        this._results.unshift(header);

        this.paste(x, y, this._results);

    },

    /**
    * Fill a block with a specific tile index.
    * @method Phaser.Tilemap#fill
    * @param {number} index - Index of tiles you want to fill with.
    * @param {number} x - X position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} y - Y position of the top left of the area to operate one, given in tiles, not pixels.
    * @param {number} width - The width in tiles of the area to operate on.
    * @param {number} height - The height in tiles of the area to operate on.
    * @param {number} [layer] - The Tilemap Layer to operate on.
    */
    fill: function (index, x, y, width, height, layer) {

        this.copy(x, y, width, height, layer);

        if (this._results.length < 2)
        {
            return;
        }

        for (var i = 1; i < this._results.length; i++)
        {
            this._results[i].index = index;
        }

        this.paste(x, y, this._results);

    },

    /**
    * Removes all layers from this tile map.
    * @method Phaser.Tilemap#removeAllLayers
    */
    removeAllLayers: function () {

        this.layers.length = 0;
        this.currentLayer = 0;

    },

    /**
    * Dumps the tilemap data out to the console.
    * @method Phaser.Tilemap#dump
    */
    dump: function () {

        var txt = '';
        var args = [''];

        for (var y = 0; y < this.layers[this.currentLayer].height; y++)
        {
            for (var x = 0; x < this.layers[this.currentLayer].width; x++)
            {
                txt += "%c  ";

                if (this.layers[this.currentLayer].data[y][x] > 1)
                {
                    if (this.debugMap[this.layers[this.currentLayer].data[y][x]])
                    {
                        args.push("background: " + this.debugMap[this.layers[this.currentLayer].data[y][x]]);
                    }
                    else
                    {
                        args.push("background: #ffffff");
                    }
                }
                else
                {
                    args.push("background: rgb(0, 0, 0)");
                }
            }

            txt += "\n";
        }

        args[0] = txt;
        console.log.apply(console, args);

    },

    /**
    * Removes all layers from this tile map and nulls the game reference.
    * @method Phaser.Tilemap#destroy
    */
    destroy: function () {

        this.removeAllLayers();
        this.game = null;

    }

};

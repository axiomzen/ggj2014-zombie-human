/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.TilemapParser parses data objects from Phaser.Loader that need more preparation before they can be inserted into a Tilemap.
*
* @class Phaser.TilemapParser
*/
Phaser.TilemapParser = {

    /**
    * Creates a Tileset object.
    * @method Phaser.TilemapParser.tileset
    * @param {Phaser.Game} game - Game reference to the currently running game.
    * @param {string} key
    * @param {number} tileWidth
    * @param {number} tileHeight
    * @param {number} tileMax
    * @param {number} tileMargin
    * @param {number} tileSpacing
    * @return {Phaser.Tileset} Generated Tileset object.
    */
    tileset: function (game, key, tileWidth, tileHeight, tileMax, tileMargin, tileSpacing) {

        //  How big is our image?
        var img = game.cache.getTilesetImage(key);

        if (img == null)
        {
            return null;
        }

        var width = img.width;
        var height = img.height;

        //  If no tile width/height is given, try and figure it out (won't work if the tileset has margin/spacing)
        if (tileWidth <= 0)
        {
            tileWidth = Math.floor(-width / Math.min(-1, tileWidth));
        }

        if (tileHeight <= 0)
        {
            tileHeight = Math.floor(-height / Math.min(-1, tileHeight));
        }

        var row = Math.round(width / tileWidth);
        var column = Math.round(height / tileHeight);
        var total = row * column;
        
        if (tileMax !== -1)
        {
            total = tileMax;
        }

        //  Zero or smaller than tile sizes?
        if (width === 0 || height === 0 || width < tileWidth || height < tileHeight || total === 0)
        {
            console.warn("Phaser.TilemapParser.tileSet: width/height zero or width/height < given tileWidth/tileHeight");
            return null;
        }

        //  Let's create some tiles
        var x = tileMargin;
        var y = tileMargin;

        var tileset = new Phaser.Tileset(img, key, tileWidth, tileHeight, tileMargin, tileSpacing);

        for (var i = 0; i < total; i++)
        {
            tileset.addTile(new Phaser.Tile(tileset, i, x, y, tileWidth, tileHeight));

            x += tileWidth + tileSpacing;

            if (x === width)
            {
                x = tileMargin;
                y += tileHeight + tileSpacing;
            }
        }

        return tileset;

    },

    /**
    * Parse tileset data from the cache and creates a Tileset object.
    * @method Phaser.TilemapParser.parse
    * @param {Phaser.Game} game - Game reference to the currently running game.
    * @param {object} data
    * @param {string} format
    * @return {Phaser.Tileset} Generated Tileset object.
    */
    parse: function (game, data, format) {

        if (format === Phaser.Tilemap.CSV)
        {
            return this.parseCSV(data);
        }
        else if (format === Phaser.Tilemap.TILED_JSON)
        {
            return this.parseTiledJSON(data);
        }

    },

    /**
    * Parses a CSV file into valid map data.
    * @method Phaser.TilemapParser.parseCSV
    * @param {string} data - The CSV file data.
    * @return {object} Generated map data.
    */
    parseCSV: function (data) {

        //  Trim any rogue whitespace from the data
        data = data.trim();

        var output = [];
        var rows = data.split("\n");
        var height = rows.length;
        var width = 0;

        for (var i = 0; i < rows.length; i++)
        {
            output[i] = [];

            var column = rows[i].split(",");

            for (var c = 0; c < column.length; c++)
            {
                output[i][c] = parseInt(column[c], 10);
            }

            if (width === 0)
            {
                width = column.length;
            }
        }

        return [{ name: 'csv', width: width, height: height, alpha: 1, visible: true, indexes: [], tileMargin: 0, tileSpacing: 0, data: output }];

    },

    /**
    * Parses a Tiled JSON file into valid map data.
    * @method Phaser.TilemapParser.parseJSON
    * @param {object} json- The Tiled JSON data.
    * @return {object} Generated map data.
    */
    parseTiledJSON: function (json) {

        var layers = [];

        for (var i = 0; i < json.layers.length; i++)
        {
            //  Check it's a data layer
            if (!json.layers[i].data)
            {
                continue;
            }

            //  json.tilewidth
            //  json.tileheight

            var layer = {

                name: json.layers[i].name,
                width: json.layers[i].width,
                height: json.layers[i].height,
                alpha: json.layers[i].opacity,
                visible: json.layers[i].visible,
                indexes: [],

                tileMargin: json.tilesets[0].margin,
                tileSpacing: json.tilesets[0].spacing

            };

            var output = [];
            var c = 0;
            var row;

            for (var t = 0; t < json.layers[i].data.length; t++)
            {
                if (c === 0)
                {
                    row = [];
                }

                row.push(json.layers[i].data[t]);
                c++;

                if (c == json.layers[i].width)
                {
                    output.push(row);
                    c = 0;
                }
            }

            layer.data = output;
            
            layers.push(layer);

        }

        return layers;

    }

}

/// <reference path="../../_definitions.ts" />

/**
* Phaser - Physics - Projection
*/

module Phaser.Physics.Projection {

    export class CircleConcave {

        public static Collide(x, y, oH, oV, obj: Phaser.Physics.Circle, t: Phaser.Physics.TileMapCell) {

            //if we're colliding diagonally:
            //	-if obj is in the diagonal pointed to by the slope normal: we can't collide, do nothing
            //  -else, collide vs. the appropriate vertex
            //if obj is in this tile: perform collision as for aabb
            //if obj is horiz OR very neighb in direction of slope: collide vs vert
            //if obj is horiz or vert neigh against direction of slope: collide vs. face

            var signx = t.signx;
            var signy = t.signy;
            var lenP;

            if (oH == 0)
            {
                if (oV == 0)
                {
                    //colliding with current tile

                    var ox = (t.pos.x + (signx * t.xw)) - obj.pos.x;//(ox,oy) is the vector from the circle to 
                    var oy = (t.pos.y + (signy * t.yw)) - obj.pos.y;//tile-circle's center

                    var twid = t.xw * 2;
                    var trad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
                    //note that this should be precomputed at compile-time since it's constant

                    var len = Math.sqrt(ox * ox + oy * oy);
                    var pen = (len + obj.radius) - trad;

                    if (0 < pen)
                    {
                        //find the smallest axial projection vector
                        if (x < y)
                        {
                            //penetration in x is smaller
                            lenP = x;
                            y = 0;

                            //get sign for projection along x-axis		
                            if ((obj.pos.x - t.pos.x) < 0)
                            {
                                x *= -1;
                            }
                        }
                        else
                        {
                            //penetration in y is smaller
                            lenP = y;
                            x = 0;

                            //get sign for projection along y-axis		
                            if ((obj.pos.y - t.pos.y) < 0)
                            {
                                y *= -1;
                            }
                        }


                        if (lenP < pen)
                        {
                            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                            return Phaser.Physics.Circle.COL_AXIS;
                        }
                        else
                        {
                            //we can assume that len >0, because if we're here then
                            //(len + obj.radius) > trad, and since obj.radius <= trad
                            //len MUST be > 0
                            ox /= len;
                            oy /= len;

                            obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                            return Phaser.Physics.Circle.COL_OTHER;
                        }
                    }
                    else
                    {
                        return Phaser.Physics.Circle.COL_NONE;
                    }

                }
                else
                {
                    //colliding vertically
                    if ((signy * oV) < 0)
                    {
                        //colliding with face/edge
                        obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);

                        return Phaser.Physics.Circle.COL_AXIS;
                    }
                    else
                    {
                        //we could only be colliding vs the vertical tip

                        //get diag vertex position
                        var vx = t.pos.x - (signx * t.xw);
                        var vy = t.pos.y + (oV * t.yw);

                        var dx = obj.pos.x - vx;//calc vert->circle vector		
                        var dy = obj.pos.y - vy;

                        var len = Math.sqrt(dx * dx + dy * dy);
                        var pen = obj.radius - len;
                        if (0 < pen)
                        {
                            //vertex is in the circle; project outward
                            if (len == 0)
                            {
                                //project out vertically
                                dx = 0;
                                dy = oV;
                            }
                            else
                            {
                                dx /= len;
                                dy /= len;
                            }

                            obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                            return Phaser.Physics.Circle.COL_OTHER;
                        }
                    }
                }
            }
            else if (oV == 0)
            {
                //colliding horizontally
                if ((signx * oH) < 0)
                {
                    //colliding with face/edge
                    obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);

                    return Phaser.Physics.Circle.COL_AXIS;
                }
                else
                {
                    //we could only be colliding vs the horizontal tip

                    //get diag vertex position
                    var vx = t.pos.x + (oH * t.xw);
                    var vy = t.pos.y - (signy * t.yw);

                    var dx = obj.pos.x - vx;//calc vert->circle vector		
                    var dy = obj.pos.y - vy;

                    var len = Math.sqrt(dx * dx + dy * dy);
                    var pen = obj.radius - len;
                    if (0 < pen)
                    {
                        //vertex is in the circle; project outward
                        if (len == 0)
                        {
                            //project out horizontally
                            dx = oH;
                            dy = 0;
                        }
                        else
                        {
                            dx /= len;
                            dy /= len;
                        }

                        obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                        return Phaser.Physics.Circle.COL_OTHER;
                    }
                }
            }
            else
            {
                //colliding diagonally
                if (0 < ((signx * oH) + (signy * oV)))
                {
                    //the dotprod of slope normal and cell offset is strictly positive,
                    //therefore obj is in the diagonal neighb pointed at by the normal, and
                    //it cannot possibly reach/touch/penetrate the slope
                    return Phaser.Physics.Circle.COL_NONE;
                }
                else
                {
                    //collide vs. vertex
                    //get diag vertex position
                    var vx = t.pos.x + (oH * t.xw);
                    var vy = t.pos.y + (oV * t.yw);

                    var dx = obj.pos.x - vx;//calc vert->circle vector		
                    var dy = obj.pos.y - vy;

                    var len = Math.sqrt(dx * dx + dy * dy);
                    var pen = obj.radius - len;
                    if (0 < pen)
                    {
                        //vertex is in the circle; project outward
                        if (len == 0)
                        {
                            //project out by 45deg
                            dx = oH / Math.SQRT2;
                            dy = oV / Math.SQRT2;
                        }
                        else
                        {
                            dx /= len;
                            dy /= len;
                        }

                        obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                        return Phaser.Physics.Circle.COL_OTHER;
                    }

                }

            }

            return Phaser.Physics.Circle.COL_NONE;

        }

    }

}
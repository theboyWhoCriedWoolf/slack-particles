import Pixel        from './Pixel';
import randRange    from 'utils/randRange';

const   NUM_PARTICLES   = 10,
        RADIUS          = 10;

/**
 * handlels all rendering of particles to screen
 * @param {object} PIXI instance
 * @param {object} opts
 */
export default function SceneRender( _pixi, opts ) {
    Object.assign(this, {
        pixi : _pixi
    }, opts);

    this.particleSystem = [];
    this.lines          = [];
    this.linesActive    = false;

    this.pixelLine = new PIXI.Graphics();
    this.pixi.stage.addChild(this.pixelLine);

    this.activeLines = 0;

}

/**
 * extend prototype class
 * @type {Object}
 */
SceneRender.prototype = {

    /**
     * setup class
     * @param  {object} PIXI texture resources
     */
    setup( resources ) {
        this.pixelResource = resources.pixel;
        for( var i = 0; i <  NUM_PARTICLES; ++i ) {
            let pos = {x:randRange( 0, this.width), y:randRange(0,this.height)};
            this.addPixel( pos, true );
        }
    },

    /**
     * resize canvas
     */
    resize( width, height ) {
        this.pixi.renderer.resize(width,height);
    },

    /**
     * update text particles
     */
    updateText ( positionArray, colour = 0xffffff ) {
        this.linesActive = false;

        let lines           = [...positionArray],
            totalLines      = lines.length,
            bonusPixels     = totalLines,
            randomTotal     = this._getRandomTotal(Math.abs(this.particleSystem.length-totalLines)),
            fx, fy,
            index,
            pixel,
            len;

        // fetch extra particles if needed
        while( this.particleSystem.length < bonusPixels ) {
            let pos = {x:randRange( 0, this.width) ,y:randRange(0,this.height)};
            this.addPixel( pos, true );
        }

        len = this.particleSystem.length;
        for(var i = 0 ; i < len; i++) {
            pixel = this.particleSystem[i];
            pixel.alive       = true;

            if (lines.length <= 0 || randRange(0,100) > 90) {
                fx = (randRange(-200,200) / 10.0);
                fy = (randRange(-200,200) / 10.0);
                pixel.addForce({x:fx, y:fy});

                pixel.scale = Math.min(0.3 + (Math.random() * 3), 0.4);

                pixel.fixedPos = false;
                pixel.setTint(0xcccccc);

                // reduce number of over all pixels
                pixel.canDraw = (randRange(0,100) > randomTotal);
                continue;
            }

            index = Math.floor(Math.random()*lines.length);
            pixel.setTint( colour );
            pixel.startPos.x  = lines[index].x;
			pixel.startPos.y  = lines[index].y;
			pixel.fixedPos    = true;
            pixel.alpha       = 1;
            pixel.alive       = true;
            pixel.canDraw     = true;

            // remove from lines
			lines.splice(index,1);
        }

        this.linesActive = true;
    },

    /**
     * calculate random total of particles to be kept alove
     */
    _getRandomTotal( value ) {
        if(value >= 5000) { return 96; }
        else if (value >= 4000) { return 94; }
        else if (value >= 3000) { return 92; }
        return 90;
    },

    /**
     * add filter to PIXI
     */
    setFilter( filters ) {
        this.pixi.stage.filters = filters.length > 0 ? filters : null;
    },

    /**
     * add an individual pizel
     * @param {object} pos
     * @param {boolean} _static
     */
    addPixel( pos, _static ) {
        let pixel = new Pixel( RADIUS, pos, true );
        pixel.draw( 'textures/sprites/disc.png' );
        this.pixi.stage.addChild(pixel.graphics);
        this.particleSystem[ this.particleSystem.length ] = pixel;
    },

    /**
     * animation step
     */
    step() {
        this._updatePixels();

        if(this.linesActive) {
            this._clearLines();
            this._checkLines();
        }
        this._render();
    },

    /**
     * render view
     */
    _render() {
        this.pixi.renderer.render(this.pixi.stage);
    },

    /**
     * checl interconnecting lines bwteween particles
     */
    _checkLines() {
        let length = this.particleSystem.length,
            pixel;

        for( var i = 0; i < length; ++i ) {

            let p1 = this.particleSystem[i];
            if( p1.fixedPos || !p1.alive || !p1.canDraw ){ continue; }

            for( var j = i + 1; j < length; ++ j ) {

                let p2 = this.particleSystem[j];
                if( p2.fixedPos || !p2.alive || !p2.canDraw ){ continue; }

                let dx = p2.pos.x - p1.pos.x;
                let dy = p2.pos.y - p1.pos.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if(dist < 100) {
                    this._drawLine( p1, p2, dist );
                }
            }
        }
    },

    /**
     * draw line
     */
    _drawLine( p1, p2, dist ) {

        let line = this.pixelLine;
        line.lineStyle(0.5, 0xffffff, (1 - dist*0.01) );
        line.moveTo(p1.pos.x,p1.pos.y);
        line.lineTo(p2.pos.x,p2.pos.y);
    },

    /**
     * clear all lines
     */
    _clearLines() {
        this.pixelLine.clear();
        this.activeLines = 0;
    },

    /**
     * loop and update pixel animation
     */
    _updatePixels() {
        let i = this.particleSystem.length,
            pixel;

        while(--i > -1) {
            pixel = this.particleSystem[i];
            if(!pixel.alive) {
                this.particleSystem.splice( i, 1 );
                continue;
            }

            pixel.move();
            pixel.update();

        }
    }



}

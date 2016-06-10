/**
 * PIXI wrapper class
 */
export default function PixiRender( params ) {

    params = Object.assign( this, {
        el : 'root--canvas'
    }, params)

    this.renderer = PIXI.autoDetectRenderer( this.width, this.height, {antialias: false, transparent : true, resolution:2});
    this.stage    = new PIXI.Container();
    this.stage.interactive = true;
    document.getElementsByClassName(params.el)[0].appendChild(this.renderer.view);

    this.particleContainer = new PIXI.ParticleContainer(10000, {
        scale       : true,
        position    : true,
        rotation    : true,
        roundPixels : false,
        uvs         : true,
        alpha       : true,
        interactiveChildren : false
    });

    this.stage.addChild( this.particleContainer );
}


/**
 * extend Class prototype
 * @type {Object}
 */
PixiRender.prototype = {

    loadAssets( assets ) {
        if(!assets) { return Promise.reject(); }

        return new Promise( ( resolve, reject )=> {
            var loader = PIXI.loader; // pixi exposes a premade instance for you to use.

            assets.forEach( ( loadItem )=> {
                loader.add( loadItem.name, loadItem.src );
            });

            loader.once('complete', ( asset )=> {
                resolve( asset.resources )
            });
            loader.load();
        })
    }
}

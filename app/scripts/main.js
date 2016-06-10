import '../sass/main.scss';

import SceneRender       from './SceneRender'
import CanvasText        from './CanvasText';
import PixiRender        from './PixiRender';
import Stats             from 'stats-js';
import socketio          from './socketConnect';
import Gui               from './utils/Gui';
import toPixiColour      from './utils/toPixiColour';
import InfoPanel         from './InfoPanel';
import debounce          from 'mout/function/debounce'

const words            = ['Welcome to slack particles'],
      PIXEL_COLOURS    = [ 0x69D2E7, 0xA7DBD8, 0xE0E4CC, 0xF38630, 0xFA6900, 0xFF4E50, 0xF9D423 ];

let   stats,
      infoPanel,
      gui,
      canvasText,
      sceneRender,
      index = 0;

/**
 * Document content finished loading
 */
function DOMContentLoaded() {
      console.log('---- Application  initiated ----');
     setup();

     let _resize = debounce(resize, 300);
     window.addEventListener('resize', _resize, false);
}

/**
 * set everything up
 */
function setup() {

    let opts = {
        width       : document.body.clientWidth,
        height      : document.body.clientHeight,
        lineHeight  : 4,
        debug       : false,
        typeface    : 'futura'
    };

    infoPanel = new InfoPanel();

    let   pixiRender    = new PixiRender( opts ),
          textures      = [{ name : 'pixel', src : 'textures/sprites/disc.png' }];

      canvasText    = new CanvasText(opts);
      sceneRender   = new SceneRender( pixiRender, opts ),
      pixiRender.loadAssets( textures ).then( ( resources )=> {
          sceneRender.setup( resources );
          animate();
          updateMessage( words[Math.floor(Math.random()*words.length)] );
      });

      // connect to socket io
      socketio.io.on('slack.message', ( data )=> {
          let animateFuntion = infoPanel.isVisible ? infoPanel.updatePanel.bind(infoPanel)
                                                     : infoPanel.animateIn.bind(infoPanel);
          animateFuntion( data.user ).then( ()=> {
             updateMessage( data.text );
          });
      });

      if(DEV) {
          addStats();
      }
}

/**
 * update message content
 */
function updateMessage( text ) {
    canvasText.drawText( text ).then( ( points )=>{
         let colour = PIXEL_COLOURS[ Math.floor(Math.random()*PIXEL_COLOURS.length) ];
         sceneRender.updateText( points, colour );
    });
}

/**
 * add stats in debug mode
 */
function addStats() {
    stats = new Stats();
    stats.setMode( 2 );
    stats.domElement.style.position     = 'absolute';
    stats.domElement.style.left         = '0px';
    stats.domElement.style.top          = '0px';
    stats.domElement.style.zIndex       = 100;
    document.body.appendChild( stats.domElement );
}

/**
 * handle canvas and window resizing
 */
function resize( event ) {
     let width  = document.body.clientWidth,
         height = document.body.clientHeight,
         colour = PIXEL_COLOURS[ Math.floor(Math.random()*PIXEL_COLOURS.length) ];

    sceneRender.resize(width, height);
    canvasText.resize(width, height);

    canvasText.drawText( canvasText.currentString ).then( ( points )=> {
        sceneRender.updateText( points, colour );
    });
}

/**
 * animation loop
 */
function animate() {
    if(stats){ stats.begin(); }
    sceneRender.step();
    if(stats){ stats.end(); }
    requestAnimationFrame( animate );
}

/**
 * check page ready state
 */
if( document.readyState === 'loading' || document.readyState === 'interactive' || document.readyState === 'complete') {
  DOMContentLoaded();
}
else {
  document.addEventListener( 'DOMContentLoaded', DOMContentLoaded, false );
}

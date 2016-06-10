import gsap from 'gsap';

/**
 * infor panel class
 */
export default function InfoPanel() {

    // define panel elements
    this.tl        = new TimelineMax();
    this.panel     = document.getElementsByClassName('slack__info-panel')[0];
    this.inner     = document.getElementsByClassName('slack__info-panel-inner')[0];
    this.bg        = document.getElementsByClassName('slack__info-panel-background')[0];

    // image
    this.square    = document.getElementsByClassName('slack__user-square')[0];
    this.fill      = document.getElementsByClassName('slack__user-square-fill')[0];
    this.icon      = document.getElementsByClassName('slack__user-icon')[0];

    // content
    this.content   = document.getElementsByClassName('slack__user-content')[0];
    this.username  = document.getElementsByClassName('slack__user-name')[0];

    // is panel visible
    this.isVisible = false;
    this.setup();

}

/**
 * extend prototype methods
 * @type {Object}
 */
InfoPanel.prototype = {

    /**
     * setup tween and Dom elements
     */
    setup() {
        let containerWidth = this.panel.clientWidth;
        TweenLite.set( this.icon, { autoAlpha : 0 });
        TweenLite.set( this.panel, { x :  '50%' });
        TweenLite.set( this.content, {  x : '-100%', autoAlpha : 0 });
        TweenLite.set( this.bg, {  x : '-100%', autoAlpha : 0 });
        TweenLite.set( this.fill, { scale : 0 });
    },

    /**
     * animate use in for the first time
     * @param  {object} user
     * @return {promise}
     */
    animateIn( user ) {

        this.updateLabels( user );

        let ease        = new BezierPlugin(0.4, 0, 0.2, 1),
            squareTime  = 0.5;

        this.tl.insertMultiple([
            TweenLite.to(this.fill, squareTime, { scale : 1, ease : ease }),
            TweenLite.to( this.fill, squareTime+0.2, { autoAlpha : 0, ease : Power2.easeInOut, delay : 0.5 } ),

            TweenLite.to( this.bg, squareTime+0.2, { x :  '0%', autoAlpha : 1, ease : Power2.easeInOut, delay :  0.5 } ),
            TweenLite.to( this.panel, squareTime+0.2, { x : '0%', ease : Power2.easeInOut, delay : 0.5 } ),
            TweenLite.to( this.icon, squareTime+0.2, { autoAlpha : 1, ease : Power2.easeInOut, delay : 0.5 } ),
            TweenLite.to( this.content, squareTime+0.2, { x : '0%', ease : Power2.easeInOut, delay : 0.5 } ),
            TweenLite.to( this.content, 0.5, { autoAlpha : 1, ease : Power2.easeInOut, delay : 0.8 } )
        ]);

        this.isVisible = true;
        this.tl.play();
        return Promise.resolve();
    },

    /**
     * animates panel out
     * @return {promise}
     */
    hidePanel() {
        if(!this.isVisible) { return Promise.resolve(); }
        this._doOutro();
        this.isVisible = false;
        return Promise.resolve();
    },

    /**
     * update DOM label test
     * @param  {object} user
     */
    updateLabels( user ) {
        let { username, real_name, image } = user;
        this.username.innerHTML = `${real_name || username} sent a message`;
        this.icon.style.backgroundImage = `url(${image})`;
    },

    /**
     * checks to see if the user has changed since last
     * user detected
     * @param  {object}  user
     * @return {Boolean}
     */
    _hasUserChanged( user ) {
        let { username, real_name } = user;
        return  (this.username.innerHTML !== `${real_name || username} sent a message`);
    },

    /**
     * loads the user image to make sure it is visible
     * before animation begins
     * @param  {string} url
     * @return {promise}
     */
    _loadImage( url ) {
        return new Promise( ( resolve, reject )=> {
            let img = new Image();
            img.onload = resolve;
            img.src = url;
        })
    },

    /**
     * do animation outro
     */
    _doOutro() {
        this.tl.timeScale(2);
        this.tl.eventCallback('onReverseComplete', ()=> {
            this.tl.timeScale(1);
        });
        this.tl.reverse();
    },

    /**
     * update panel with new content
     * @param  {object} user
     * @return {promise}
     */
    updatePanel( user ) {
        if(!this.isVisible){ return this.animateIn( user ); }

        return new Promise( ( resolve, reject ) => {
            if(!this._hasUserChanged(user)) { resolve(); return false; }

            this._loadImage( user.image ).then( ()=>{
                resolve();

                this.tl.timeScale(2);
                this.tl.eventCallback('onReverseComplete', ()=> {
                    this.updateLabels( user );
                    this.tl.timeScale(1);
                    this.tl.play();
                });
                this.tl.reverse();
            })

        });
    }


}

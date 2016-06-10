

export default function setup() {

    let gui             = new dat.GUI({}),
        filtersSwitchs  = [false, false, false, false, false, false, false];

    ////

	let pixelateFilter = new PIXI.filters.PixelateFilter();

	let pixelateFolder = gui.addFolder('Pixelate');
	pixelateFolder.add(filtersSwitchs, '0').name("apply");
	pixelateFolder.add(pixelateFilter.size, 'x', 1, 32).name("PixelSizeX");
	pixelateFolder.add(pixelateFilter.size, 'y', 1, 32).name("PixelSizeY");

	////

	let invertFilter = new PIXI.filters.InvertFilter();

	var invertFolder = gui.addFolder('Invert');
	invertFolder.add(filtersSwitchs, '1').name("apply");
	invertFolder.add(invertFilter, 'invert', 0, 1).name("Invert");

	////

	let grayFilter = new PIXI.filters.GrayFilter();

	let grayFolder = gui.addFolder('Gray');
	grayFolder.add(filtersSwitchs, '2').name("apply");
	grayFolder.add(grayFilter, 'gray', 0, 1).name("Gray");

	////

	let sepiaFilter = new PIXI.filters.SepiaFilter();

	let sepiaFolder = gui.addFolder('Sepia');
	sepiaFolder.add(filtersSwitchs, '3').name("apply");
	sepiaFolder.add(sepiaFilter, 'sepia', 0, 1).name("Sepia");

	////

    let dotScreenFilter = new PIXI.filters.DotScreenFilter();

	let dotScreenFolder = gui.addFolder('DotScreen');
	dotScreenFolder.add(filtersSwitchs, '4').name("apply");
	dotScreenFolder.add(dotScreenFilter, 'angle', 0, 10);
	dotScreenFolder.add(dotScreenFilter, 'scale', 0, 1);

	////

	let colorStepFilter = new PIXI.filters.ColorStepFilter();

	let colorStepFolder = gui.addFolder('ColorStep');
	colorStepFolder.add(filtersSwitchs, '5').name("apply");

	colorStepFolder.add(colorStepFilter, 'step', 1, 100);
	colorStepFolder.add(colorStepFilter, 'step', 1, 100);

	////

	let crossHatchFilter = new PIXI.filters.CrossHatchFilter();

	let crossHatchFolder = gui.addFolder('CrossHatch');
	crossHatchFolder.add(filtersSwitchs, '6').name("apply");

    var filterCollection = [pixelateFilter, invertFilter, grayFilter, sepiaFilter, dotScreenFilter, colorStepFilter, crossHatchFilter];

    return  {
        filterCollection : filterCollection,
        filtersSwitchs   : filtersSwitchs,
        gui              : gui
    }
}

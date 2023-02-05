class WhiteNoiseGenerator extends AudioWorkletProcessor {
	constructor() {
		super();
	}
	process(inputList, outputList) {
		for (var ch = 0; ch < outputList[0].length; ch++) {
			for (var i = 0; i < outputList[0][ch].length; i++) {
				outputList[0][ch][i] = Math.random() * 2 - 1;
			}
		}
	}
};

registerProcessor("white-noise-generator", WhiteNoiseGenerator);

export default function processAudioData(source: MediaStreamAudioSourceNode, audioContext: AudioContext): Promise<number> {
    return new Promise((resolve, reject) => {
      // Create an analyser node
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048  // Size of the FFT, controls the resolution of the frequency analysis
      const bufferLength = analyser.fftSize
      const dataArray = new Float32Array(bufferLength)
  
      // Connect the analyser to the source (microphone input)
      source.connect(analyser)
  
      // Define the function to capture audio and estimate frequency
      function detectPitch() {
        analyser.getFloatTimeDomainData(dataArray)  // Fill the dataArray with the time-domain data from the audio input
  
        // const frequency = autoCorrelate(dataArray, audioContext.sampleRate)
        const frequency = 444.44
        if (frequency !== -1) {
          resolve(frequency)
        } else {
          reject('Could not determine frequency')
        }
      }
  
      detectPitch()
    })
  }
  
//   // Auto-correlation algorithm to find pitch (frequency)
//   function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
//     const SIZE = buffer.length
//     const MAX_SAMPLES = Math.floor(SIZE / 2)
//     let bestOffset = -1
//     let bestCorrelation = 0
//     let rms = 0
//     let foundGoodCorrelation = false
//     const correlations = new Array(MAX_SAMPLES)
  
//     // Calculate RMS to check for silence
//     for (let i = 0; i < SIZE; i++) {
//       const val = buffer[i]
//       rms += val * val
//     }
//     rms = Math.sqrt(rms / SIZE)
  
//     if (rms < 0.01) { // If too quiet, return -1 to indicate no sound
//       return -1
//     }
  
//     let lastCorrelation = 1
//     for (let offset = 0; offset < MAX_SAMPLES; offset++) {
//       let correlation = 0
  
//       // Compute the correlation for this offset
//       for (let i = 0; i < MAX_SAMPLES; i++) {
//         correlation += Math.abs(buffer[i] - buffer[i + offset])
//       }
//       correlation = 1 - (correlation / MAX_SAMPLES)
//       correlations[offset] = correlation
  
//       if (correlation > 0.9 && correlation > lastCorrelation) {
//         foundGoodCorrelation = true
//         if (correlation > bestCorrelation) {
//           bestCorrelation = correlation
//           bestOffset = offset
//         }
//       } else if (foundGoodCorrelation) {
//         const shift = (correlations[bestOffset + 1] - correlations[bestOffset - 1]) / correlations[bestOffset]
//         return sampleRate / (bestOffset + 8 * shift)
//       }
//       lastCorrelation = correlation
//     }
  
//     if (bestCorrelation > 0.01) {
//       return sampleRate / bestOffset
//     }
  
//     return -1  // No frequency detected
//   }
  
import { pipeline } from '@xenova/transformers'
class MyTranscriptionPipeline {
  static task = 'automatic-speech-recognition';
  static model = 'openai/whisper-tiny.en';
  static instance = null;

  static async getInstance() {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model);
    }
    return this.instance;
  }
}

self.addEventListener('message', async (event) => {
  const { type, audio } = event.data;
  if (type === 'INFERENCE_REQUEST') {
    const pipeline = await MyTranscriptionPipeline.getInstance();
    const audioArrayBuffer = new Uint8Array(audio);
    const transcription = await pipeline(audioArrayBuffer, {
      return_timestamps: false
    });
    self.postMessage({ type: 'RESULT', text: transcription.text });
  }
});

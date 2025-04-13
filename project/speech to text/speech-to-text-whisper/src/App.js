import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);
  const workerRef = useRef(null);

  const handleStart = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          const audioChunks = [];
          mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const reader = new FileReader();
            reader.onload = () => {
              const audioData = reader.result;
              workerRef.current.postMessage({ type: 'INFERENCE_REQUEST', audio: audioData });
            };
            reader.readAsArrayBuffer(audioBlob);
          };
          mediaRecorder.start();
          audioRef.current = mediaRecorder;
          setLoading(true);
        })
        .catch(error => console.error('Error accessing microphone:', error));
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.stop();
      setLoading(false);
    }
  };

  React.useEffect(() => {
    workerRef.current = new Worker('/worker.js'); // Ensure the path is correct
    workerRef.current.onmessage = event => {
      const { type, text } = event.data;
      if (type === 'RESULT') {
        setTranscription(text);
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return (
    <div className="App">
      <h1>Speech to Text</h1>
      <button onClick={handleStart} disabled={loading}>Start Recording</button>
      <button onClick={handleStop} disabled={!loading}>Stop Recording</button>
      <div>
        <h2>Transcription:</h2>
        <p>{transcription}</p>
      </div>
    </div>
  );
}

export default App;

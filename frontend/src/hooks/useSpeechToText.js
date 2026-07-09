import { useCallback, useEffect, useRef, useState } from 'react';

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const useSpeechToText = ({ onPermissionDenied } = {}) => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [status, setStatus] = useState('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const pausedTranscriptRef = useRef('');
  const statusRef = useRef('idle');

  const isSupported = Boolean(SpeechRecognition);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
  }, [clearTimer]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {
        // ignore stop errors
      }
      recognitionRef.current = null;
    }
    clearTimer();
  }, [clearTimer]);

  useEffect(() => () => {
    stopRecognition();
  }, [stopRecognition]);

  const startRecording = useCallback(() => {
    if (!isSupported) return;

    stopRecognition();
    setInterimTranscript('');
    setRecordingSeconds(0);

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = '';
      let finalText = pausedTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          const chunk = result[0].transcript.trim();
          finalText = finalText ? `${finalText.trim()} ${chunk}` : chunk;
          finalText = finalText ? `${finalText} ` : '';
        } else {
          interim += result[0].transcript;
        }
      }

      pausedTranscriptRef.current = finalText;
      setTranscript(finalText.trim());
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setStatus('idle');
        stopRecognition();
        onPermissionDenied?.();
        return;
      }

      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        setStatus('idle');
        stopRecognition();
      }
    };

    recognition.onend = () => {
      if (statusRef.current === 'recording' && recognitionRef.current) {
        try {
          recognition.start();
        } catch {
          setStatus('idle');
          clearTimer();
        }
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setStatus('recording');
      startTimer();
    } catch {
      onPermissionDenied?.();
    }
  }, [clearTimer, isSupported, onPermissionDenied, startTimer, stopRecognition]);

  const pauseRecording = useCallback(() => {
    if (statusRef.current !== 'recording') return;

    const combined = `${transcript}${interimTranscript ? ` ${interimTranscript}` : ''}`.trim();
    pausedTranscriptRef.current = combined ? `${combined} ` : '';
    setTranscript(combined);
    setInterimTranscript('');
    stopRecognition();
    setStatus('paused');
  }, [interimTranscript, stopRecognition, transcript]);

  const stopRecording = useCallback(() => {
    const combined = `${transcript}${interimTranscript ? ` ${interimTranscript}` : ''}`.trim();
    pausedTranscriptRef.current = combined ? `${combined} ` : '';
    setTranscript(combined);
    setInterimTranscript('');
    stopRecognition();
    setStatus('stopped');
  }, [interimTranscript, stopRecognition, transcript]);

  const retryRecording = useCallback(() => {
    stopRecognition();
    pausedTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    setRecordingSeconds(0);
    setStatus('idle');
  }, [stopRecognition]);

  const setTranscriptText = useCallback((text) => {
    pausedTranscriptRef.current = text ? `${text} ` : '';
    setTranscript(text);
    setInterimTranscript('');
  }, []);

  const displayTranscript = `${transcript}${interimTranscript ? (transcript ? ' ' : '') + interimTranscript : ''}`.trim();

  return {
    isSupported,
    transcript,
    interimTranscript,
    displayTranscript,
    status,
    recordingSeconds,
    isRecording: status === 'recording',
    isPaused: status === 'paused',
    isStopped: status === 'stopped',
    startRecording,
    pauseRecording,
    stopRecording,
    retryRecording,
    setTranscriptText,
    stopRecognition,
  };
};

export default useSpeechToText;

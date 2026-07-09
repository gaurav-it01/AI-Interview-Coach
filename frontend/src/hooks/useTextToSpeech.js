import { useCallback, useEffect, useRef, useState } from 'react';

const pickEnglishVoice = (voices) => {
  if (!voices?.length) return null;

  const preferred = [
    (v) => v.lang === 'en-US' && /Google US English|Samantha|Microsoft.*English.*United States/i.test(v.name),
    (v) => v.lang === 'en-US' && v.localService,
    (v) => v.lang.startsWith('en-US'),
    (v) => v.lang.startsWith('en'),
  ];

  for (const matcher of preferred) {
    const voice = voices.find(matcher);
    if (voice) return voice;
  }

  return voices.find((v) => v.lang.startsWith('en')) || null;
};

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const onEndRef = useRef(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSupported) return undefined;

    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback((text, onEnd) => {
    if (!isSupported || !text?.trim()) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    onEndRef.current = onEnd;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voice = pickEnglishVoice(window.speechSynthesis.getVoices());
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEndRef.current?.();
      onEndRef.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onEndRef.current?.();
      onEndRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [isSupported]);

  return { speak, cancel, isSpeaking, isSupported };
};

export default useTextToSpeech;

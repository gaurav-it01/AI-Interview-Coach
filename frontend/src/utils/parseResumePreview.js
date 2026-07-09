const SECTION_PATTERNS = [
  { key: 'skills', labels: ['skills', 'technical skills', 'core competencies', 'technologies'] },
  { key: 'experience', labels: ['experience', 'work experience', 'employment', 'professional experience'] },
  { key: 'education', labels: ['education', 'academic', 'qualifications'] },
  { key: 'projects', labels: ['projects', 'personal projects', 'key projects'] },
];

const normalizeLine = (line) => line.trim().replace(/\s+/g, ' ');

const isSectionHeader = (line) => {
  const lower = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  return SECTION_PATTERNS.some(({ labels }) =>
    labels.some((label) => lower === label || lower.startsWith(`${label} `))
  );
};

const getSectionKey = (line) => {
  const lower = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const match = SECTION_PATTERNS.find(({ labels }) =>
    labels.some((label) => lower === label || lower.startsWith(`${label} `))
  );
  return match?.key || null;
};

const parseResumePreview = (text) => {
  if (!text || typeof text !== 'string') {
    return { sections: null, preview: '' };
  }

  const cleaned = text.replace(/\r\n/g, '\n').trim();
  const lines = cleaned.split('\n').map(normalizeLine).filter(Boolean);

  const sections = {};
  let currentKey = null;

  lines.forEach((line) => {
    const sectionKey = getSectionKey(line);
    if (sectionKey) {
      currentKey = sectionKey;
      if (!sections[currentKey]) sections[currentKey] = [];
      return;
    }

    if (currentKey) {
      sections[currentKey].push(line);
    }
  });

  const hasSections = Object.keys(sections).length > 0;

  if (!hasSections) {
    return {
      sections: null,
      preview: cleaned.length > 600 ? `${cleaned.slice(0, 600)}…` : cleaned,
    };
  }

  const formatted = {};
  Object.entries(sections).forEach(([key, items]) => {
    formatted[key] = items.slice(0, 6);
  });

  return { sections: formatted, preview: null };
};

export { parseResumePreview, isSectionHeader };

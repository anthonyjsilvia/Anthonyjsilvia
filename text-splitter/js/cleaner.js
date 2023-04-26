function splitAndCleanText() {
  const wordsPerChunk = 2980;
  const textInput = document.getElementById('textInput').value.trim();
  const sentences = textInput.match(/[^\.!\?]+[\.!\?]+/g);
  let output = '';
  let buttons = '';

  if (sentences) {
    let chunkIndex = 1;
    let wordsCount = 0;
    let currentChunk = '';

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      const words = sentence.split(' ');

      if (wordsCount + words.length <= wordsPerChunk) {
        currentChunk += ' ' + sentence;
        wordsCount += words.length;
      } else {
        const cleanedChunk = cleanTranscript(splitTranscript(currentChunk));
        output += `<div class="chunk" id="chunk${chunkIndex}"><h3>Part ${chunkIndex}</h3><p>Provide a summary: ${cleanedChunk}</p></div>`;
        buttons += `<button class="copy-button" onclick="copyChunk(${chunkIndex})">Copy Part ${chunkIndex}</button>`;
        chunkIndex++;
        wordsCount = words.length;
        currentChunk = sentence;
      }
    }

    if (currentChunk) {
      const cleanedChunk = cleanTranscript(splitTranscript(currentChunk));
      output += `<div class="chunk" id="chunk${chunkIndex}"><h3>Part ${chunkIndex}</h3><p>${cleanedChunk}</p></div>`;
      buttons += `<button class="copy-button" onclick="copyChunk(${chunkIndex})">Copy Part ${chunkIndex}</button>`;
    }

  } else {
    output = '<p>No sentences found.</p>';
  }

  document.getElementById('output').innerHTML = output;
  document.getElementById('buttons').innerHTML = buttons;
  document.getElementById('results').innerHTML = '<h1>Results</h1><p>Copy each part into Chat GPT, along with a prompt. (E.g. Provide a summary:)';
}

function splitTranscript(input) {
  // replace timestamps (e.g., 0:50:30.100 --> 0:50:30.600) with a new line
  var cleaned = input.replace(/\d{1,2}:\d{1,2}:\s*\d{1,2}\.\d{1,3}\s*-->\s*\d{1,2}:\d{1,2}:\s*\d{1,2}\.\d{1,3}\s*/g, '\n');
  // separate speaker names from quotes
  cleaned = cleaned.replace(/([A-Za-z]+:)(.*)/g, '<p><strong>$1</strong> $2</p>');
  // return cleaned text
  return cleaned;
}

function cleanTranscript(input) {
  // remove speaker names
  cleaned = input.replace(/[A-Za-z]+:/g, '');
  // remove filler words (e.g., um, uh, like)
  cleaned = cleaned.replace(/\b(um|uh|like)\b/gi, '');
  // remove extra white space
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  // return cleaned text
  return cleaned;
}


function copyChunk(chunkIndex) {
  const chunkText = document.getElementById(`chunk${chunkIndex}`).querySelector('p');
  const range = document.createRange();
  range.selectNode(chunkText);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('copy');
  selection.removeAllRanges();
  alert(`Part ${chunkIndex} copied to clipboard!`);
}

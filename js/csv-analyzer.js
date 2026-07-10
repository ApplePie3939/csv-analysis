'use strict';

const fileInput = document.getElementById('csvFile');
const resultBox = document.getElementById('result');
const tableArea = document.getElementById('tableArea');
const controls = document.getElementById('controls');
const searchInput = document.getElementById('searchInput');
const dropArea = document.getElementById('dropArea');

fileInput.addEventListener('change', () => {
  loadFile(fileInput.files[0]);
});

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, event => {
    event.preventDefault();
    dropArea.classList.add('is-dragover');
  });
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, event => {
    event.preventDefault();
    dropArea.classList.remove('is-dragover');
  });
});

dropArea.addEventListener('drop', event => {
  loadFile(event.dataTransfer.files[0]);
});

function loadFile(file) {
  if (!file) return;

  if (!file.name.toLowerCase().endsWith('.csv')) {
    alert('CSVファイルを選択してください。');
    fileInput.value = '';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('ファイルサイズは5MB以内にしてください。');
    fileInput.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => parseCSV(reader.result);
  reader.readAsText(file, 'UTF-8');
}

function parseCSV(text) {
  const rows = parseCSVRows(text.replace(/^\uFEFF/, ''));

  if (rows.length > 10000) {
    alert('行数が多すぎます（最大10,000行）。');
    return;
  }

  const table = document.createElement('table');
  table.id = 'csvTable';

  rows.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');

    row.forEach(cell => {
      const cellEl = document.createElement(rowIndex === 0 ? 'th' : 'td');
      cellEl.textContent = cell.trim();
      tr.appendChild(cellEl);
    });

    table.appendChild(tr);
  });

  tableArea.innerHTML = '';
  tableArea.appendChild(table);

  enableSearch();
  resultBox.style.display = 'block';
}

function parseCSVRows(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  if (cell !== '' || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function enableSearch() {
  controls.style.display = 'block';
  searchInput.value = '';

  searchInput.oninput = () => {
    const keyword = searchInput.value.toLowerCase();
    document.querySelectorAll('#csvTable tr').forEach((row, index) => {
      if (index === 0) return;
      row.style.display = row.textContent.toLowerCase().includes(keyword)
        ? ''
        : 'none';
    });
  };
}

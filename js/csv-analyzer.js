'use strict';

const fileInput = document.getElementById('csvFile');
const resultBox = document.getElementById('result');
const tableArea = document.getElementById('tableArea');
const controls = document.getElementById('controls');
const searchInput = document.getElementById('searchInput');

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
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
});

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);

  if (lines.length > 10000) {
    alert('行数が多すぎます（最大10,000行）。');
    return;
  }

  const table = document.createElement('table');
  table.id = 'csvTable';

  lines.forEach((line, rowIndex) => {
    const tr = document.createElement('tr');

    line.split(',').forEach(cell => {
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

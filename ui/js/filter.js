// fastFiltering using Memory not DOM
function fastFilter(query) {
  const filterText = query.toLowerCase();

  // 2. High-speed loop over the JavaScript array, not the DOM
  let rcount = 0;
  for (const item of tableIndex) {
    const isVisible = item.text.includes(filterText);

    // 3. Use the 'hidden' attribute for the fastest UI update
    //item.element.hidden = !isVisible;
    requestAnimationFrame(() => {
       item.element.hidden = !isVisible;
    });
    if (isVisible) rcount++;
  }

  if (document.getElementById("rowcount")) {
	  document.getElementById("rowcount").innerHTML = rcount;
  }
}
// Sort columns in memory instead of DOM
function sortColumns(colIndex, ascending) {
    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[colIndex].textContent.trim();
        const cellB = rowB.cells[colIndex].textContent.trim();

        // Check if the content is numeric
        const valA = isNaN(cellA) ? cellA : parseFloat(cellA);
        const valB = isNaN(cellB) ? cellB : parseFloat(cellB);

        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
            comparison = valA - valB;
        } else {
            comparison = valA.toString().localeCompare(valB);
        }

	return ascending ? comparison : -comparison;
    });
    // Switching sort direction
    columnLabels[colIndex] = columnLabels[colIndex] == 1 ? 0 : 1;

    // 3. Re-append rows (moves them in the DOM)
    rows.forEach(row => table.appendChild(row));
}
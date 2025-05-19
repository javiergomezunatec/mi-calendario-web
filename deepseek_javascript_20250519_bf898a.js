// ... (Código previo de autenticación OAuth y carga de API)

function renderEvents(events) {
  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';

  events.forEach(event => {
    const cell = document.createElement('div');
    cell.className = 'event-cell';
    cell.dataset.eventId = event.id; // Guardamos el ID del evento

    // Contenido de la celda (título + fecha)
    cell.innerHTML = `
      <div class="event-title">${event.summary || 'Sin título'}</div>
      <div class="event-date">${formatDate(event.start.dateTime || event.start.date)}</div>
    `;

    // Doble clic para editar
    cell.addEventListener('dblclick', () => {
      enableInlineEdit(cell, event.summary);
    });

    grid.appendChild(cell);
  });
}

// Función para activar la edición inline
function enableInlineEdit(cell, currentTitle) {
  const titleElement = cell.querySelector('.event-title');
  const originalText = titleElement.textContent;

  // Reemplazar el título con un input
  titleElement.innerHTML = `<input type="text" value="${originalText}" class="edit-input">`;
  const input = titleElement.querySelector('.edit-input');
  input.focus();

  // Guardar al presionar Enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const newTitle = input.value.trim();
      const eventId = cell.dataset.eventId;
      
      if (newTitle && newTitle !== originalText) {
        updateEventTitle(eventId, newTitle).then(() => {
          titleElement.textContent = newTitle;
        });
      } else {
        titleElement.textContent = originalText;
      }
    } else if (e.key === 'Escape') {
      titleElement.textContent = originalText;
    }
  });

  // Cancelar si se hace clic fuera
  input.addEventListener('blur', () => {
    titleElement.textContent = originalText;
  });
}

// Función para actualizar el evento (usa Promesas)
function updateEventTitle(eventId, newTitle) {
  return gapi.client.calendar.events.patch({
    calendarId: 'primary',
    eventId: eventId,
    resource: { summary: newTitle },
  }).then(() => {
    console.log('Evento actualizado');
  }).catch(err => {
    console.error('Error al actualizar:', err);
    throw err;
  });
}
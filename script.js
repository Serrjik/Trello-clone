// Здесь хранится ID следующей создаваемой колонки.
let columnIdCounter = 4

// Создание новой карточки.
document
	// Найти все колонки, что есть на сайте.
	.querySelectorAll('.column')
	/*
		Сделать действие над каждой колонкой из всех найденных
		(навешать обработчики кнопкам "+ Добавить карточку").
	*/
	.forEach(columnProcess)

// Создание новой колонки.
document
	// Найти кнопку "+ Добавить колонку" по data-атрибуту.
	.querySelector('[data-action-addColumn]')
	// Добавить этой кнопке обработчик события "Click".
	.addEventListener('click', function (event) {
		// Создать новую колонку.
		const columnElement = document.createElement('div')
		/*
			Добавить в неё содержимое, которое должно в ней быть
			(классы, HTML-атрибуты).
		*/
		columnElement.classList.add('column')
		columnElement.setAttribute('draggable', 'true')
		columnElement.setAttribute('data-column-id', columnIdCounter)

		// Создать содержимое колонки.
		columnElement.innerHTML = 
`<p class="column-header">В плане</p>
<div data-notes></div>
<p class="column-footer">
	<span data-action-addNote class="action">+ Добавить карточку</span>
</p>`

		columnIdCounter++

		// Вставить колонку в элемент, в котором содержатся все колонки.
		document.querySelector('.columns').append(columnElement)
		
		/*
			Сделать действие над созданной колонкой
			(повесить обработчик кнопке "+ Добавить карточку").
		*/
		columnProcess(columnElement)
	})

// Сделать карточку редактируемой по двойному клику на ней.
	document
	// Найти все карточки.
	.querySelectorAll('.note')
	// Добавить ей обработчики событий "Двойной клик" и "Потеря фокуса".
	.forEach(Note.process)

// Функция вешает обработчик события "click" кнопке "+ Добавить карточку".
function columnProcess (columnElement) {
		// Найти кнопку "+ Добавить карточку"
		const spanAction_addNote = columnElement.querySelector('[data-action-addNote]')

		// Добавить этой кнопке обработчик события "Click".
		spanAction_addNote.addEventListener('click', function (event) {
			console.log(this)
			// Создать новую карточку для колонки.
			const noteElement = document.createElement('div')
			/*
				Добавить в неё содержимое, которое должно в ней быть
				(классы, HTML-атрибуты).
			*/
			noteElement.classList.add('note')
			// Атрибут draggable указывает, что элемент можно перетаскивать.
			noteElement.setAttribute('draggable', 'true')
			noteElement.setAttribute('data-note-id', Note.idCounter)

			Note.idCounter++

			// Вставить созданную карточку в конец колонки.
			columnElement.querySelector('[data-notes]').append(noteElement)
			/*
				Добавить вновь созданной карточке
				обработчики событий "Двойной клик" и "Потеря фокуса".
			*/
			Note.process(noteElement)

			/*
				Чтобы вновь созданную карточку сразу же можно было редактировать,
				добавить ей атрибут contenteditable и передать фокус.
			*/
			noteElement.setAttribute('contenteditable', 'true')
			noteElement.focus()
		})

		// Найти заголовок колонки.
		const headerElement = columnElement.querySelector('.column-header')

		// Повесить обработчик события "Двойной клик" заголовку колонки.
		headerElement.addEventListener('dblclick', function (event) {
			// Сделать элемент редактируемым.
			headerElement.setAttribute('contenteditable', 'true')
			// И передать ему фокус.
			headerElement.focus()
		})

		// Повесить обработчик события "Потеря фокуса" заголовку колонки.
		headerElement.addEventListener('blur', function (event) {
			// Сделать элемент нередактируемым.
			headerElement.removeAttribute('contenteditable')
		})

		// Сделать так, чтобы карточки можно было перетаскивать и на пустые колонки.
		columnElement.addEventListener('dragover', function (event) {
			event.preventDefault()
		})

		// Сделать так, чтобы карточки можно было перетаскивать и на пустые колонки.
		columnElement.addEventListener('drop', function (event) {
			// Если есть перетаскиваемая карточка:
			if (Note.dragged) {
				return columnElement.querySelector('[data-notes]').append(Note.dragged)
			}
		})
	}

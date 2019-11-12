// Здесь хранится ID следующей создаваемой карточки.
noteIdCounter = 8
// Здесь хранится ID следующей создаваемой колонки.
columnIdCounter = 4

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
`<p class="column-header" contenteditable="true">В плане</p>
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
			noteElement.setAttribute('data-note-id', noteIdCounter)

			noteIdCounter++

			// Вставить созданную карточку в конец колонки.
			columnElement.querySelector('[data-notes]').append(noteElement)
		})
	}
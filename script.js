// Здесь хранится ID следующей создаваемой карточки.
let noteIdCounter = 8
// Здесь хранится ID следующей создаваемой колонки.
let columnIdCounter = 4
// Ссылка на перетаскиваемый элемент.
let draggedNote = null

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
	.forEach(noteProcess)

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
			/*
				Добавить вновь созданной карточке
				обработчики событий "Двойной клик" и "Потеря фокуса".
			*/
			noteProcess(noteElement)

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
			if (draggedNote) {
				return columnElement.querySelector('[data-notes]').append(draggedNote)
			}
		})
	}

/*
	Функция обрабатывает карточки.
	Делает карточку редактируемой по двойному щелчку
	и не редактируемой при потере фокуса.
*/
function noteProcess (noteElement) {
	// Повесить обработчик события "dblclick" на карточку.
	noteElement.addEventListener('dblclick', function (event) {
		// Атрибут contenteditable делает элемент редактируемым.
		noteElement.setAttribute('contenteditable', 'true')
		// При редактировании карточки сделать карточку неперетаскиваемой.
		noteElement.removeAttribute('draggable')
		// При редактировании карточки сделать родительскую колонку неперетаскиваемой.
		// closest - поиск элемента вверх по иерархии (по родительским элементам).
		noteElement.closest('.column').removeAttribute('draggable')
		// Передать фокус элементу.
		noteElement.focus()
	})

	// Что делать после редактирования карточки.
	// По событию потери фокуса:
	noteElement.addEventListener('blur', function (event) {
		// Убрать атрибут contenteditable у элемента.
		noteElement.removeAttribute('contenteditable')
		// Сделать карточку обратно перетаскиваемой.
		noteElement.setAttribute('draggable', 'true')
		// Сделать родительскую колонку обратно перетаскиваемой.
		// closest - поиск элемента вверх по иерархии (по родительским элементам).
		noteElement.closest('.column').setAttribute('draggable', 'true')

		// Если карточка пустая, удалить её!
		if (!noteElement.textContent.trim().length) {
			noteElement.remove()
		}
	})

	// Событие dragstart для карточки, которую перетаскивают.
	noteElement.addEventListener('dragstart', dragstart_noteHandler)
	// Событие dragend для карточки, которую перетаскивают.
	noteElement.addEventListener('dragend', dragend_noteHandler)
	// Событие dragenter для карточки, над которой водят.
	noteElement.addEventListener('dragenter', dragenter_noteHandler)
	// Событие dragover для карточки, над которой водят.
	noteElement.addEventListener('dragover', dragover_noteHandler)
	// Событие dragleave для карточки, над которой водят.
	noteElement.addEventListener('dragleave', dragleave_noteHandler)
	// Событие drop для карточки, над которой водят.
	noteElement.addEventListener('drop', drop_noteHandler)
}

function dragstart_noteHandler (event) {
	// console.log('dragstart', event, this)

	// Какой элемент перетаскиваем.
	draggedNote = this
	// Добавить стиль, чтобы элемент не было видно.
	this.classList.add('dragged')

	// Отменить всплытие текущего события.
	event.stopPropagation()
}

function dragend_noteHandler (event) {
	// console.log('dragend', event, this)

	// Удалить ссылку на перетаскиваемый элемент при окончании перетаскивания.
	draggedNote = this
	// Удалить стиль, чтобы элемент было видно.
	this.classList.remove('dragged')

	/*
		Удалять класс с прозрачностью у всех карточек
		при отпускании перетаскиваемой карточки.
	*/
	document
		.querySelectorAll('.note')
		.forEach(x => x.classList.remove('under'))
}

function dragenter_noteHandler (event) {
	/*
		Сделать так, чтобы текущее событие не срабатывало,
		когда перетаскиваемая карточка находится сама над собой.
	*/
	if (this === draggedNote) {
		return
	}

	// Добавить класс с прозрачностью элементу, над которым водят.
	this.classList.add('under')
}

function dragover_noteHandler (event) {
	/*
		Отменить стандартную обработку события dragover,
		потому что это событие будет отслеживаться программно.
	*/
	event.preventDefault()
	/*
		Сделать так, чтобы текущее событие не срабатывало,
		когда перетаскиваемая карточка находится сама над собой.
	*/
	if (this === draggedNote) {
		return
	}
}

function dragleave_noteHandler (event) {
	/*
		Сделать так, чтобы текущее событие не срабатывало,
		когда перетаскиваемая карточка находится сама над собой.
	*/
	if (this === draggedNote) {
		return
	}

	// Удалить класс с прозрачностью у элемента, над которым водят.
	this.classList.remove('under')
}

function drop_noteHandler (event) {
	/*
		Сделать так, что если drop сработал над карточкой,
		чтобы это событие не всплыло и не сработало над колонкой.
	*/
	event.stopPropagation()
	/*
		Сделать так, чтобы текущее событие не срабатывало,
		когда перетаскиваемая карточка находится сама над собой.
	*/
	if (this === draggedNote) {
		return
	}

	// this - куда нужно поставить элемент.
	// console.log(this)
	// draggedNote - перетаскиваемый элемент.
	// console.log(draggedNote)

	/*
		Если отпускаемая карточка находится над карточкой в той же самой колонке,
		значит нужно изменить порядок карточек.
	*/
	if (this.parentElement === draggedNote.parentElement) {
		// Найти все карточки в колонке (и сразу преобразовать в массив).
		const note = Array.from(this.parentElement.querySelectorAll('.note'))
		// Найти индекс элемента, перед которым нужно вставить карточку.
		const indexA = note.indexOf(this)
		console.log('indexA:', indexA)
		// Найти индекс элемента, который нужно вставить.
		const indexB = note.indexOf(draggedNote)
		console.log('indexB:', indexB)

		// Если вставляемый элемент находился выше в колонке:
		if (indexA < indexB) {
			this.parentElement.insertBefore(draggedNote, this)
		}
		// Если вставляемый элемент находился ниже в колонке:
		else {
			/*
				Вставить элемент перед следующим соседом элемента,
				над которым отпустили перетаскиваемый элемент.
			*/
			this.parentElement.insertBefore(draggedNote, this.nextElementSibling)
		}
	}
	/*
		Если отпускаемая карточка находится над карточкой в другой колонке,
		значит нужно перенести карточку из одного столбца в другой.
	*/
	else {
		/*
			Вставить элемент: insertBefore(какой элемент вставить,
			перед_каким_элементом_вставить).
		*/
		this.parentElement.insertBefore(draggedNote, this)
	}
}

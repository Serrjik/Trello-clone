// Модуль отвечает за обработку колонок.
const Column = {
	// Здесь хранится ID следующей создаваемой колонки.
	idCounter: 4,
	// Ссылка на перетаскиваемый элемент.
	dragged: null,

	// Ссылка на элемент, над которым произошло бросание перетаскиваемого.
	dropped:  null,

	// Метод обрабатывает колонки, кнопку "+ Добавить карточку".
	process (columnElement) {
		// Найти кнопку "+ Добавить карточку"
		const spanAction_addNote = columnElement.querySelector('[data-action-addNote]')

		// Добавить этой кнопке обработчик события "Click" - создать новую карточку.
		spanAction_addNote.addEventListener('click', function (event) {
			// Создать карточку.
			const noteElement = Note.create()
			// Вставить созданную карточку в конец колонки.
			columnElement.querySelector('[data-notes]').append(noteElement)
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

			// Сохранить состояние приложения в localStorage().
			Application.save()
		})

		// Повесить обработчик события dragstart колонке.
		columnElement.addEventListener('dragstart', Column.dragstart)
		// Повесить обработчик события dragend колонке.
		columnElement.addEventListener('dragend', Column.dragend)

		// // Повесить обработчик события dragenter колонке.
		// columnElement.addEventListener('dragenter', Column.dragenter)
		/*
			Повесить обработчик события dragover колонке, чтобы
			сделать так, чтобы карточки можно было перетаскивать и на пустые колонки.
		*/
		columnElement.addEventListener('dragover', Column.dragover)
		// // Повесить обработчик события dragleave колонке.
		// columnElement.addEventListener('dragleave', Column.dragleave)

		// Сделать так, чтобы карточки можно было перетаскивать и на пустые колонки.
		columnElement.addEventListener('drop', Column.drop)
	},

	create (id = null, title) {
		// Создать новую колонку.
		const columnElement = document.createElement('div')
		/*
			Добавить в неё содержимое, которое должно в ней быть
			(классы, HTML-атрибуты).
		*/
		columnElement.classList.add('column')
		columnElement.setAttribute('draggable', 'true')

		// Если передают id (восстановить колонку из сохранения):
		if (id) {
			columnElement.setAttribute('data-column-id', id)
		}
		// Если не передают id (создают новую колонку):
		else {
			columnElement.setAttribute('data-column-id', Column.idCounter)
			Column.idCounter++
		}

		// Создать содержимое колонки.
		columnElement.innerHTML = 
`<p class="column-header">Новая колонка</p>
<div data-notes></div>
<p class="column-footer">
	<span data-action-addNote class="action">+ Добавить карточку</span>
</p>`
		/*
			Сделать действие над созданной колонкой
			(повесить обработчик кнопке "+ Добавить карточку").
		*/
		Column.process(columnElement, title)

		// Если заголовок колонки существует (колонка восстанавливается из сохранения):
		if (title) {
			// Найти заголовок созданной колонки.
			const headerElement = columnElement.querySelector('.column-header')
			// Восстановить заголовок созданной колонки из сохранения.
			headerElement.textContent = title
		}

		return columnElement
	},

	dragstart (event) {
		// Запомнить, какой элемент перетаскивается.
		Column.dragged = this
		// Добавить этому элементу класс dragged.
		Column.dragged.classList.add('dragged')

		// Отменить всплытие текущего события.
		event.stopPropagation()

		// Отменить свойство draggable у всех карточек.
		document
			.querySelectorAll('.note')
			.forEach(noteElement => noteElement.removeAttribute('draggable'))
	},

	dragend (event) {
		/*
			Удалить у перетаскиваемого элемента класс dragged
			при окончании перетаскивания.
		*/
		Column.dragged.classList.remove('dragged')
		// Забыть, какой элемент перетаскивается.
		Column.dragged = null
		// Забыть, над каким элементом произошло бросание.
		Column.dropped = null

		// Добавить свойство draggable всем карточкам.
		document
			.querySelectorAll('.note')
			.forEach(noteElement => noteElement.setAttribute('draggable', 'true'))

		// Сохранить состояние приложения в localStorage().
		Application.save()
	},

	// dragenter (event) {
	// 	/*
	// 		Не обрабатывать перемещение колонки над самой собой,
	// 		либо перемещение не колонки (перемещаемая колонка отсутствует).
	// 	*/
	// 	if (!Column.dragged || Column.dragged === this) {
	// 		return
	// 	}

	// 	// Добавить класс under тем колонкам, над которыми перетаскивают колонку.
	// 	this.classList.add('under')

	// 	console.log('+')
	// },

	// dragleave (event) {
	// 	/*
	// 		Не обрабатывать перемещение колонки над самой собой,
	// 		либо перемещение не колонки (перемещаемая колонка отсутствует).
	// 	*/
	// 	if (!Column.dragged || Column.dragged === this) {
	// 		return
	// 	}

	// 	/*
	// 		Убрать класс under у тех колонок,
	// 		над которыми уже убрали перетаскиваемую колонку.
	// 	*/
	// 	this.classList.remove('under')

	// 	console.log('-')
	// },

	dragover (event) {
		/*
			Отменить стандартную обработку события dragover,
			потому что это событие будет отслеживаться программно.
		*/
		event.preventDefault()
		event.stopPropagation()

		// Если текущая колонка является перетаскиваемой:
		if (Column.dragged === this) {
			/*
				Если уже есть колонка, над которой бросили элемент
				убрать у неё класс under.
			*/
			if (Column.dropped) {
				Column.dropped.classList.remove('under')
			}
			// Не будет элемента, над которым можно бросить карточку.
			Column.dropped = null
		}

		/*
			Не обрабатывать перемещение колонки над самой собой,
			либо перемещение не колонки (перемещаемая колонка отсутствует).
		*/
		if (!Column.dragged || Column.dragged === this) {
			return
		}

		// Элемент, над которым бросили перетаскиваемую карточку.
		Column.dropped = this

		// Удалить для всех колонок класс under.
		document
			.querySelectorAll('.column')
			.forEach(columnElement => columnElement.classList.remove('under'))

		// Колонке, над которой бросили перетаскиваемую карточку, присвоить класс under.
		this.classList.add('under')
	},

	drop () {
		// Если бросается перетаскиваемая карточка:
		if (Note.dragged) {
			return this.querySelector('[data-notes]').append(Note.dragged)
		}
		// Если бросается перетаскиваемая колонка:
		else if (Column.dragged) {
			// Найдем все колонки в DOM-дереве и преобразуем в массив.
			const children = Array.from(document.querySelector('.columns').children)
			// Найти порядковой номер колонки, на которую бросили.
			const indexA = children.indexOf(this)
			// Найти порядковой номер колонки, которую перетаскивают.
			const indexB = children.indexOf(Column.dragged)

			if (indexA < indexB) {
				/*
					Вставить элемент, который переносили,
					перед тем элементом, над которым бросили.
				*/
				document.querySelector('.columns').insertBefore(Column.dragged, this)
			}
			else {
				/*
					Вставить элемент, который переносили,
					перед следующим соседом того элемента, над которым бросили.
				*/
				document.querySelector('.columns').insertBefore(Column.dragged, this.nextElementSibling)
			}
			
			// Удалить для всех колонок класс under.
			document
				.querySelectorAll('.column')
				.forEach(columnElement => columnElement.classList.remove('under'))
		}
	}
}

// Модуль отвечает за обработку колонок.
const Column = {
	// Здесь хранится ID следующей создаваемой колонки.
	idCounter: 4,
	// Ссылка на перетаскиваемый элемент.
	dragged: null,

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
		})

		// Повесить обработчик события dragstart колонке.
		columnElement.addEventListener('dragstart', Column.dragstart)
		// Повесить обработчик события dragend колонке.
		columnElement.addEventListener('dragend', Column.dragend)

		// Повесить обработчик события dragenter колонке.
		columnElement.addEventListener('dragenter', Column.dragenter)
		// // Повесить обработчик события dragover колонке.
		// columnElement.addEventListener('dragover', Column.dragover)
		// Повесить обработчик события dragleave колонке.
		columnElement.addEventListener('dragleave', Column.dragleave)

		//terСделать так, чтобы карточки можно было перетаскивать и на пустые колонки.
		columnElement.addEventListener('dragover', Column.dragover)

		// Сделать так, чтобы карточки можно было перетаскивать и на пустые колонки.
		columnElement.addEventListener('drop', Column.drop)
	},

	dragstart (event) {
		// Запомнить, какой элемент перетаскивается.
		Column.dragged = this
		// Добавить этому элементу класс dragged.
		Column.dragged.classList.add('dragged')

		// Отменить всплытие текущего события.
		event.stopPropagation()
	},

	dragend (event) {
		/*
			Удалить у перетаскиваемого элемента класс dragged
			при окончании перетаскивания.
		*/
		Column.dragged.classList.remove('dragged')
		// Забыть, какой элемент перетаскивается.
		Column.dragged = null
	},

	dragenter (event) {
		/*
			Не обрабатывать перемещение колонки над самой собой,
			либо перемещение не колонки (перемещаемая колонка отсутствует).
		*/
		if (!Column.dragged || Column.dragged === this) {
			return
		}

		console.log('dragenter')
	},

	dragleave (event) {
		/*
			Не обрабатывать перемещение колонки над самой собой,
			либо перемещение не колонки (перемещаемая колонка отсутствует).
		*/
		if (!Column.dragged || Column.dragged === this) {
			return
		}

		console.log('dragleave')
	},

	dragover (event) {
		/*
			Отменить стандартную обработку события dragover,
			потому что это событие будет отслеживаться программно.
		*/
		event.preventDefault()
		/*
			Не обрабатывать перемещение колонки над самой собой,
			либо перемещение не колонки (перемещаемая колонка отсутствует).
		*/
		if (!Column.dragged || Column.dragged === this) {
			return
		}

		console.log('dragover')
	},

	drop () {
		// Если бросается перетаскиваемая карточка:
		if (Note.dragged) {
			return this.querySelector('[data-notes]').append(Note.dragged)
		}
		// Если бросается перетаскиваемая колонка:
		else if (Column.dragged) {
			console.log('drop column')
		}
	}
}

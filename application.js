// Модуль реализует сериализацию и десериализацию данных.
const Application = {
	// Функция сохраняет состояние приложения в localStorage.
	save () {
		// Объект для сохранения.
		const object = {
			// Колонки
			columns: {
				idCounter: Column.idCounter,
				items: []
			},
			// Карточки
			notes: {
				idCounter: Note.idCounter,
				items: []
			}
		}

		// Пройти по всем колонкам и добавить их в массив items объекта для сохранения.
		document
			.querySelectorAll('.column')
			.forEach(columnElement => {
				const column = {
					// Заголовок колонки.
					title: columnElement.querySelector('.column-header').textContent,
					id: parseInt(columnElement.getAttribute('data-column-id')),
					noteIds: []
				}

				/*
					Пройти по всем карточкам в колонке
					и добавить значения их атрубутов data-note-id
					в массив noteIds объекта column для сохранения.
				*/
				columnElement
					.querySelectorAll('.note')
					.forEach(noteElement => {
						column.noteIds.push(parseInt(noteElement.getAttribute('data-note-id')))
					})

				object.columns.items.push(column)
			})

		// Пройти по всем карточкам.
		document
			.querySelectorAll('.note')
			.forEach(noteElement => {
				const note = {
					id: parseInt(noteElement.getAttribute('data-note-id')),
					content: noteElement.textContent
				}

				// Добавить элемент карточки в массив всех карточек.
				object.notes.items.push(note)
			})
console.log(object)
		// Сериализация объекта для сохранения.
		const json = JSON.stringify(object)

		localStorage.setItem('trello', json)

		// console.log(json)

		// return object
	},

	// Функция загружает состояние приложения из localStorage.
	load () {
		// Если нет сохранения приложения, завершить работу функции.
		if (!localStorage.getItem('trello')) {
			return
		}

		// Очистить контейнер для колонок.
		const mountPoint = document.querySelector('.columns')
		mountPoint.innerHTML = ''

		// Если есть сохраненные данные, десериализовать.
		const object = JSON.parse(localStorage.getItem('trello'))
		// Функция возвращает карточку по id.
		const getNoteById = id => object.notes.items.find(note => note.id === id)
console.log(object)
		// Пройти по всем колонкам.
		for (const { id, title, noteIds } of object.columns.items) {
			// Создать колонку.
			const column = new Column(id, title)

			// Вставить колонку в контейнер для колонок.
			mountPoint.append(column.element)

			// Пройти по всем карточкам.
			for (const noteId of noteIds) {
				// Найти карточку по noteId.
				const { id, content } = getNoteById(noteId)

				const note = new Note(id, content)
				// Вставить карточку в колонку.
				column.add(note)
				// column.element.querySelector('[data-notes]').append(note.element)
			}
		}
	}
}
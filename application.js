// Модуль реализует сериализацию и десериализацию данных.
const Application = {
	// Функция сохраняет состояние приложения.
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

		// Сериализация объекта для сохранения.
		const json = JSON.stringify(object)

		localStorage.setItem('trello', json)

		// console.log(json)

		// return object
	},

	// Функция загружает состояние приложения.
	load () {}
}
// Модуль отвечает за обработку карточек.
const Note = {
	// Здесь хранится ID следующей создаваемой карточки.
	idCounter: 8,
	// Ссылка на перетаскиваемый элемент.
	dragged: null,
	
	/*
		Метод обрабатывает карточки.
		Делает карточку редактируемой по двойному щелчку
		и не редактируемой при потере фокуса.
	*/
	process (noteElement) {
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
		noteElement.addEventListener('dragstart', Note.dragstart)
		// Событие dragend для карточки, которую перетаскивают.
		noteElement.addEventListener('dragend', Note.dragend)
		// Событие dragenter для карточки, над которой водят.
		noteElement.addEventListener('dragenter', Note.dragenter)
		// Событие dragover для карточки, над которой водят.
		noteElement.addEventListener('dragover', Note.dragover)
		// Событие dragleave для карточки, над которой водят.
		noteElement.addEventListener('dragleave', Note.dragleave)
		// Событие drop для карточки, над которой водят.
		noteElement.addEventListener('drop', Note.drop)
	},

	dragstart (event) {
		// console.log('dragstart', event, this)

		// Какой элемент перетаскиваем.
		Note.dragged = this
		// Добавить стиль, чтобы элемент не было видно.
		this.classList.add('dragged')

		// Отменить всплытие текущего события.
		event.stopPropagation()
	},

	dragend (event) {
		// console.log('dragend', event, this)

		// Удалить ссылку на перетаскиваемый элемент при окончании перетаскивания.
		Note.dragged = this
		// Удалить стиль, чтобы элемент было видно.
		this.classList.remove('dragged')

		/*
			Удалять класс с прозрачностью у всех карточек
			при отпускании перетаскиваемой карточки.
		*/
		document
			.querySelectorAll('.note')
			.forEach(x => x.classList.remove('under'))
	},

	dragenter (event) {
		/*
			Сделать так, чтобы текущее событие не срабатывало,
			когда перетаскиваемая карточка находится сама над собой.
		*/
		if (this === Note.dragged) {
			return
		}

		// Добавить класс с прозрачностью элементу, над которым водят.
		this.classList.add('under')
	},

	dragover (event) {
		/*
			Отменить стандартную обработку события dragover,
			потому что это событие будет отслеживаться программно.
		*/
		event.preventDefault()
		/*
			Сделать так, чтобы текущее событие не срабатывало,
			когда перетаскиваемая карточка находится сама над собой.
		*/
		if (this === Note.dragged) {
			return
		}
	},

	dragleave (event) {
		/*
			Сделать так, чтобы текущее событие не срабатывало,
			когда перетаскиваемая карточка находится сама над собой.
		*/
		if (this === Note.dragged) {
			return
		}

		// Удалить класс с прозрачностью у элемента, над которым водят.
		this.classList.remove('under')
	},

	drop (event) {
		/*
			Сделать так, что если drop сработал над карточкой,
			чтобы это событие не всплыло и не сработало над колонкой.
		*/
		event.stopPropagation()
		/*
			Сделать так, чтобы текущее событие не срабатывало,
			когда перетаскиваемая карточка находится сама над собой.
		*/
		if (this === Note.dragged) {
			return
		}

		// this - куда нужно поставить элемент.
		// console.log(this)
		// Note.dragged - перетаскиваемый элемент.
		// console.log(Note.dragged)

		/*
			Если отпускаемая карточка находится над карточкой в той же самой колонке,
			значит нужно изменить порядок карточек.
		*/
		if (this.parentElement === Note.dragged.parentElement) {
			// Найти все карточки в колонке (и сразу преобразовать в массив).
			const note = Array.from(this.parentElement.querySelectorAll('.note'))
			// Найти индекс элемента, перед которым нужно вставить карточку.
			const indexA = note.indexOf(this)
			console.log('indexA:', indexA)
			// Найти индекс элемента, который нужно вставить.
			const indexB = note.indexOf(Note.dragged)
			console.log('indexB:', indexB)

			// Если вставляемый элемент находился выше в колонке:
			if (indexA < indexB) {
				this.parentElement.insertBefore(Note.dragged, this)
			}
			// Если вставляемый элемент находился ниже в колонке:
			else {
				/*
					Вставить элемент перед следующим соседом элемента,
					над которым отпустили перетаскиваемый элемент.
				*/
				this.parentElement.insertBefore(Note.dragged, this.nextElementSibling)
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
			this.parentElement.insertBefore(Note.dragged, this)
		}
	}
}
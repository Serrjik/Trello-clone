// Класс отвечает за обработку карточек.
class Note {
	constructor (id = null, content = '') {
		/*
			Для обращения к родительскому контексту в функции,
			которая не поддерживает this.
		*/
		const instance = this

		/*
			Создать новую карточку для колонки
			(this.element - представление элемента в DOM-дереве).
		*/
		const element = this.element = document.createElement('div')
		/*
			Добавить в неё содержимое, которое должно в ней быть
			(классы, HTML-атрибуты).
		*/
		element.classList.add('note')
		// Атрибут draggable указывает, что элемент можно перетаскивать.
		element.setAttribute('draggable', 'true')
		element.textContent = content

		// Если передан id (сохраненная карточка создается из функции load):
		if (id) {
			element.setAttribute('data-note-id', id)
		}
		// Если не передан id (создается новая карточка):
		else {
			element.setAttribute('data-note-id', Note.idCounter)
			Note.idCounter++
		}

		/*
			Добавить вновь созданной карточке
			обработчики событий "Двойной клик" и "Потеря фокуса".
		*/
		// Повесить обработчик события "dblclick" на карточку.
		element.addEventListener('dblclick', function (event) {
			// Атрибут contenteditable делает элемент редактируемым.
			element.setAttribute('contenteditable', 'true')
			// При редактировании карточки сделать карточку неперетаскиваемой.
			element.removeAttribute('draggable')
			// При редактировании карточки сделать родительскую колонку неперетаскиваемой.
			instance.column.removeAttribute('draggable')
			// Передать фокус элементу.
			element.focus()
		})

		// Что делать после редактирования карточки.
		// По событию потери фокуса:
		element.addEventListener('blur', function (event) {
			// Убрать атрибут contenteditable у элемента.
			element.removeAttribute('contenteditable')
			// Сделать карточку обратно перетаскиваемой.
			element.setAttribute('draggable', 'true')
			// Сделать родительскую колонку обратно перетаскиваемой.
			instance.column.setAttribute('draggable', 'true')

			// Если карточка пустая, удалить её!
			if (!element.textContent.trim().length) {
				element.remove()
			}

			// Сохранить состояние приложения в localStorage().
			Application.save()
		})

		/*
			С помощью bind жестко привяжем контекст,
			чтобы при возникновении события контекст ссылался на экземпляр класса,
			а не на DOM-элемент.
		*/
		// Событие dragstart для карточки, которую перетаскивают.
		element.addEventListener('dragstart', this.dragstart.bind(this))
		// Событие dragend для карточки, которую перетаскивают.
		element.addEventListener('dragend', this.dragend.bind(this))
		// Событие dragenter для карточки, над которой водят.
		element.addEventListener('dragenter', this.dragenter.bind(this))
		// Событие dragover для карточки, над которой водят.
		element.addEventListener('dragover', this.dragover.bind(this))
		// Событие dragleave для карточки, над которой водят.
		element.addEventListener('dragleave', this.dragleave.bind(this))
		// Событие drop для карточки, над которой водят.
		element.addEventListener('drop', this.drop.bind(this))
	}

	// Возвращает колонку-родитель элемента.
	get column () {
		// closest - поиск элемента вверх по иерархии (по родительским элементам).
		return this.element.closest('.column')
	}

	dragstart (event) {
		// console.log('dragstart', event, this)

		// Какой элемент перетаскиваем.
		Note.dragged = this.element
		// Добавить стиль, чтобы элемент не было видно.
		this.element.classList.add('dragged')

		// Отменить всплытие текущего события.
		event.stopPropagation()
	}

	dragend (event) {
		/*
			Сделать так, что если drop сработал над карточкой,
			чтобы это событие не всплыло и не сработало над колонкой.
		*/
		event.stopPropagation()
		// console.log('dragend', event, this)

		// Удалить ссылку на перетаскиваемый элемент при окончании перетаскивания.
		Note.dragged = this.element
		// Удалить стиль, чтобы элемент было видно.
		this.element.classList.remove('dragged')

		/*
			Удалять класс с прозрачностью у всех карточек
			при отпускании перетаскиваемой карточки.
		*/
		document
			.querySelectorAll('.note')
			.forEach(x => x.classList.remove('under'))

		// Сохранить состояние приложения в localStorage().
		Application.save()
	}

	dragenter (event) {
		/*
			Сделать так, что если drop сработал над карточкой,
			чтобы это событие не всплыло и не сработало над колонкой.
		*/
		event.stopPropagation()
		/*
			Сделать так, чтобы текущее событие не срабатывало,
			когда перетаскиваемая карточка находится сама над собой.
		*/
		if (this.element === Note.dragged) {
			return
		}

		// Добавить класс с прозрачностью элементу, над которым водят.
		this.element.classList.add('under')
	}

	dragover (event) {
		/*
			Сделать так, что если drop сработал над карточкой,
			чтобы это событие не всплыло и не сработало над колонкой.
		*/
		event.stopPropagation()
		/*
			Отменить стандартную обработку события dragover,
			потому что это событие будет отслеживаться программно.
		*/
		event.preventDefault()
		/*
			Сделать так, чтобы текущее событие не срабатывало,
			когда перетаскиваемая карточка находится сама над собой,
			и когда над карточкой перетаскивается колонка, а не карточка.
		*/
		if (!Note.dragged || this.element === Note.dragged) {
			return
		}
	}

	dragleave (event) {
		/*
			Сделать так, что если drop сработал над карточкой,
			чтобы это событие не всплыло и не сработало над колонкой.
		*/
		event.stopPropagation()
		/*
			Сделать так, чтобы текущее событие не срабатывало,
			когда перетаскиваемая карточка находится сама над собой,
			и когда над карточкой перетаскивается колонка, а не карточка.
		*/
		if (!Note.dragged || this.element === Note.dragged) {
			return
		}

		// Удалить класс с прозрачностью у элемента, над которым водят.
		this.element.classList.remove('under')
	}

	drop (event) {
		/*
			Сделать так, что если drop сработал над карточкой,
			чтобы это событие не всплыло и не сработало над колонкой.
		*/
		event.stopPropagation()
		/*
			Сделать так, чтобы текущее событие не срабатывало,
			когда перетаскиваемая карточка находится сама над собой,
			и когда над карточкой перетаскивается колонка, а не карточка.
		*/
		if (!Note.dragged || this.element === Note.dragged) {
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
		if (this.element.parentElement === Note.dragged.parentElement) {
			// Найти все карточки в колонке (и сразу преобразовать в массив).
			const note = Array.from(this.element.parentElement.querySelectorAll('.note'))
			// Найти индекс элемента, перед которым нужно вставить карточку.
			const indexA = note.indexOf(this.element)
			console.log('indexA:', indexA)
			// Найти индекс элемента, который нужно вставить.
			const indexB = note.indexOf(Note.dragged)
			console.log('indexB:', indexB)

			// Если вставляемый элемент находился выше в колонке:
			if (indexA < indexB) {
				this.element.parentElement.insertBefore(Note.dragged, this.element)
			}
			// Если вставляемый элемент находился ниже в колонке:
			else {
				/*
					Вставить элемент перед следующим соседом элемента,
					над которым отпустили перетаскиваемый элемент.
				*/
				this.element.parentElement.insertBefore(Note.dragged, this.element.nextElementSibling)
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
			this.element.parentElement.insertBefore(Note.dragged, this.element)
		}
	}
}

// Здесь хранится ID следующей создаваемой карточки (поле принадлежит классу).
Note.idCounter = 1
// Ссылка на перетаскиваемый элемент (поле принадлежит классу).
Note.dragged = null

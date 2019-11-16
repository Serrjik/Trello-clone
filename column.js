// Класс отвечает за обработку колонок.
class Column {
	constructor (id = null, title) {
		/*
			Для обращения к родительскому контексту в функции,
			которая не поддерживает this.
		*/
		const instance = this

		// Дочерние карточки.
		this.notes = []

		// Создать новую колонку.
		const element = this.element = document.createElement('div')
		/*
			Добавить в неё содержимое, которое должно в ней быть
			(классы, HTML-атрибуты).
		*/
		element.classList.add('column')
		element.setAttribute('draggable', 'true')

		// Если передают id (восстановить колонку из сохранения):
		if (id) {
			element.setAttribute('data-column-id', id)
		}
		// Если не передают id (создают новую колонку):
		else {
			element.setAttribute('data-column-id', Column.idCounter)
			Column.idCounter++
		}

		// Создать содержимое колонки.
		element.innerHTML = 
`<p class="column-header">Новая колонка</p>
<div data-notes></div>
<p class="column-footer">
	<span data-action-addNote class="action">+ Добавить карточку</span>
</p>`
		/*
			Сделать действие над созданной колонкой
			(повесить обработчик кнопке "+ Добавить карточку").
		*/
		// Найти кнопку "+ Добавить карточку"
		const spanAction_addNote = element.querySelector('[data-action-addNote]')

		// Добавить этой кнопке обработчик события "Click" - создать новую карточку.
		spanAction_addNote.addEventListener('click', function (event) {
			// Создать карточку.
			const note = new Note
			// instance хранит родительский контекст.
			instance.add(note)

			// Вставить созданную карточку в конец колонки.
			element.querySelector('[data-notes]').append(note.element)
			/*
				Чтобы вновь созданную карточку сразу же можно было редактировать,
				добавить ей атрибут contenteditable и передать фокус.
			*/
			note.element.setAttribute('contenteditable', 'true')
			note.element.focus()
		})

		// Найти заголовок колонки.
		const headerElement = element.querySelector('.column-header')

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

		/*
			С помощью bind жестко привяжем контекст,
			чтобы при возникновении события контекст ссылался на экземпляр класса,
			а не на DOM-элемент.
		*/
		// Повесить обработчик события dragstart колонке.
		element.addEventListener('dragstart', this.dragstart.bind(this))
		// Повесить обработчик события dragend колонке.
		element.addEventListener('dragend', this.dragend.bind(this))

		// // Повесить обработчик события dragenter колонке.
		// columnElement.addEventListener('dragenter', Column.dragenter)
		/*
			Повесить обработчик события dragover колонке, чтобы
			сделать так, чтобы карточки можно было перетаскивать и на пустые колонки.
		*/
		element.addEventListener('dragover', this.dragover.bind(this))
		// // Повесить обработчик события dragleave колонке.
		// columnElement.addEventListener('dragleave', Column.dragleave)

		// Сделать так, чтобы карточки можно было перетаскивать и на пустые колонки.
		element.addEventListener('drop', this.drop.bind(this))

		// Если заголовок колонки существует (колонка восстанавливается из сохранения):
		if (title) {
			// Найти заголовок созданной колонки.
			const headerElement = element.querySelector('.column-header')
			// Восстановить заголовок созданной колонки из сохранения.
			headerElement.textContent = title
		}
	}

	/*
		Метод добавляет карточки в колонку.
		Добавляет в notes нужные данные и размещает карточки в вёрстке.
	*/
	add (...notes) {
		// Пройти по всем заметкам, которые пришли в метод.
		for (const note of notes) {
			// Если они отсутствуют в списке, добавить!
			if (!this.notes.includes(note)) {
				this.notes.push(note)

				/*
					Также добавить отсутствующие карточки
					в конец списка элементов в вёрстке.
				*/
				this.element.querySelector('[data-notes]').append(note.element)
			}
		}
	}

	dragstart (event) {
		// Запомнить, какой элемент перетаскивается.
		Column.dragged = this.element
		// Добавить этому элементу класс dragged.
		Column.dragged.classList.add('dragged')

		// Отменить всплытие текущего события.
		event.stopPropagation()

		// Отменить свойство draggable у всех карточек.
		document
			.querySelectorAll('.note')
			.forEach(noteElement => noteElement.removeAttribute('draggable'))
	}

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

		// Удалить для всех колонок класс under.
		document
			.querySelectorAll('.column')
			.forEach(columnElement => columnElement.classList.remove('under'))

		// Сохранить состояние приложения в localStorage().
		Application.save()
	}

	dragover (event) {
		/*
			Отменить стандартную обработку события dragover,
			потому что это событие будет отслеживаться программно.
		*/
		event.preventDefault()
		event.stopPropagation()

		// Если текущая колонка является перетаскиваемой:
		if (Column.dragged === this.element) {
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
		if (!Column.dragged || Column.dragged === this.element) {
			return
		}

		// Элемент, над которым бросили перетаскиваемую карточку.
		Column.dropped = this.element

		// Удалить для всех колонок класс under.
		document
			.querySelectorAll('.column')
			.forEach(columnElement => columnElement.classList.remove('under'))

		// Колонке, над которой бросили перетаскиваемую карточку, присвоить класс under.
		this.element.classList.add('under')
	}

	drop () {
		// Если бросается перетаскиваемая карточка:
		if (Note.dragged) {
			return this.element.querySelector('[data-notes]').append(Note.dragged)
		}
		// Если бросается перетаскиваемая колонка:
		else if (Column.dragged) {
			// Найдем все колонки в DOM-дереве и преобразуем в массив.
			const children = Array.from(document.querySelector('.columns').children)
			// Найти порядковой номер колонки, на которую бросили.
			const indexA = children.indexOf(this.element)
			// Найти порядковой номер колонки, которую перетаскивают.
			const indexB = children.indexOf(Column.dragged)

			if (indexA < indexB) {
				/*
					Вставить элемент, который переносили,
					перед тем элементом, над которым бросили.
				*/
				document.querySelector('.columns').insertBefore(Column.dragged, this.element)
			}
			else {
			/*
				Вставить элемент, который переносили,
				перед следующим соседом того элемента, над которым бросили.
			*/
			document.querySelector('.columns').insertBefore(Column.dragged, this.element.nextElementSibling)
			}

			// Удалить для всех колонок класс under.
			document
				.querySelectorAll('.column')
				.forEach(columnElement => columnElement.classList.remove('under'))
		}
	}
}

// Здесь хранится ID следующей создаваемой колонки (поле принадлежит классу).
Column.idCounter = 1
// Ссылка на перетаскиваемый элемент (поле принадлежит классу).
Column.dragged = null
/*
	Ссылка на элемент, над которым произошло бросание перетаскиваемого
	(поле принадлежит классу).
*/
Column.dropped =  null

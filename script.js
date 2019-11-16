Application.load()

// Создание новой карточки.
// document
// 	// Найти все колонки, что есть на сайте.
// 	.querySelectorAll('.column')
	/*
		Сделать действие над каждой колонкой из всех найденных
		(навешать обработчики кнопкам "+ Добавить карточку").
	*/
	// .forEach(Column.process)

// Создание новой колонки.
document
	// Найти кнопку "+ Добавить колонку" по data-атрибуту.
	.querySelector('[data-action-addColumn]')
	// Добавить этой кнопке обработчик события "Click".
	.addEventListener('click', function (event) {
		/*
			Создать колонки, в каждую колонку записать карточки,
			затем вставить это всё на страницу.
		*/
		// Создать колонку.
		const columnElement = Column.create()

		// Вставить колонку в элемент, в котором содержатся все колонки.
		document.querySelector('.columns').append(columnElement)

		// После создания новой колонки сохранить состояние приложения в localStorage.
		Application.save()
	})

// // Сделать карточку редактируемой по двойному клику на ней.
// document
// 	// Найти все карточки.
// 	.querySelectorAll('.note')
// 	// Добавить ей обработчики событий "Двойной клик" и "Потеря фокуса".
// 	.forEach(Note.process)

// Создание новой карточки.
document
	// Найти все колонки, что есть на сайте.
	.querySelectorAll('.column')
	/*
		Сделать действие над каждой колонкой из всех найденных
		(навешать обработчики кнопкам "+ Добавить карточку").
	*/
	.forEach(Column.process)

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
		columnElement.setAttribute('data-column-id', Column.idCounter)

		// Создать содержимое колонки.
		columnElement.innerHTML = 
`<p class="column-header">В плане</p>
<div data-notes></div>
<p class="column-footer">
	<span data-action-addNote class="action">+ Добавить карточку</span>
</p>`

		Column.idCounter++

		// Вставить колонку в элемент, в котором содержатся все колонки.
		document.querySelector('.columns').append(columnElement)
		
		/*
			Сделать действие над созданной колонкой
			(повесить обработчик кнопке "+ Добавить карточку").
		*/
		Column.process(columnElement)
	})

// Сделать карточку редактируемой по двойному клику на ней.
	document
	// Найти все карточки.
	.querySelectorAll('.note')
	// Добавить ей обработчики событий "Двойной клик" и "Потеря фокуса".
	.forEach(Note.process)

// ---------- переменные ----------

// -------- nav --------
// Получаем все секции страницы, кнопки в навигации, основной элемент страницы

let sections = document.querySelectorAll(`.page`);
// let nav = document.querySelectorAll(`nav button`);
let nav = document.querySelectorAll(`.nav-link`);
let mainSection = document.querySelector(`main`);

// -------- form --------
// Получаем форму

let form = document.querySelector(`form`);

// -------- dialog --------
// Получаем все кнопки для закрытия диалогов, диалог для записи/работы
// и кнопки, которые предназначены для открытия диалогов

let closeBtnList = document.querySelectorAll(`.close-dialog`);
let enrollDialog = document.querySelector(`#enroll-question`);
let workDialog = document.querySelector(`#work-question`);
let openDialogBtnList = document.querySelectorAll(
	`button[data-open*="dialog"]`
);

// -------- копирование --------

let copyBtnList = document.querySelectorAll(`button[data-copy]`);

// ---------- навигация ----------

// Активация целевой секции и обновление связанных элементов интерфейса
function activateSection(target) {
	sections.forEach((section) => {
		let sectionName = section.id;
		let isActive = target === sectionName;

		section.classList.toggle(`hidden`, !isActive); // Показываем/скрываем секции
		// Прокручиваем вверх если была нажата кнопка из секции "О занятиях", а не nav
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});

		let correspondingButton = document.querySelector(
			`nav button[data-link="${sectionName}"]`
		);
		if (correspondingButton) {
			correspondingButton.classList.toggle(`active`, isActive); // Подсвечиваем активную кнопку
		}

		if (isActive) {
			mainSection.classList.remove(`colored`, `dark`); // Убираем старые классы
			if (sectionName.includes(`education`)) {
				mainSection.classList.add(`dark`); // Добавляем класс `dark` для секции `education`
			} else if (sectionName.includes(`enroll`)) {
				mainSection.classList.add(`colored`); // Добавляем класс `colored` для секции `enroll`
			}
		}
	});
}

// Определяем активную секцию
let savedSection = localStorage.getItem(`activeSection`);
// Активируем сохранённую секцию если есть, иначе самую первую
if (savedSection) {
	activateSection(savedSection);
} else {
	let defaultSection = sections[0].id;
	activateSection(defaultSection);
}

// Активируем целевую секцию и сохраняем активную секцию в localStorage
nav.forEach((button) => {
	button.addEventListener(`click`, () => {
		let target = button.getAttribute(`data-link`);
		let dataLession = button.getAttribute(`data-lession`);

		// Устанавливаем значение select в enroll form если возможно
		if (target === `enroll` && dataLession) {
			let desiredLessionSelect = document.querySelector(`#desiredLession`);
			if (desiredLessionSelect) {
				desiredLessionSelect.value = dataLession;
			}
		}

		activateSection(target);
		localStorage.setItem(`activeSection`, target);
	});
});

// ---------- форма ----------

// Функция для сохранения данных формы в localStorage
function saveFormData() {
	let formData = new FormData(form);
	formData.forEach((value, key) => {
		localStorage.setItem(key, value);
	});
}

// Функция для восстановления данных формы из localStorage
function restoreFormData() {
	let formElements = form.elements;
	for (let element of formElements) {
		if (element.name) {
			let savedValue = localStorage.getItem(element.name);
			if (savedValue !== null) {
				if (element.type === `checkbox` || element.type === `radio`) {
					element.checked = savedValue === `on`;
				} else {
					element.value = savedValue;
				}
			}
		}
	}
}

// Сохраняем данные формы при изменении
form.addEventListener(`input`, saveFormData);

// Восстанавливаем данные формы при загрузке страницы
document.addEventListener(`DOMContentLoaded`, restoreFormData);

// ---------- диалоги ----------

// Показываем диалог
openDialogBtnList.forEach((button) => {
	button.addEventListener(`click`, () => {
		let dataOpen = button.getAttribute(`data-open`);

		if (dataOpen.includes(`work`)) {
			workDialog.showModal();
			enrollDialog.close();
		} else if (dataOpen.includes(`enroll`)) {
			enrollDialog.showModal();
			workDialog.close();
		}
	});
});

// Закрываем все открытые диалоги
closeBtnList.forEach((close) => {
	close.addEventListener(`click`, () => {
		enrollDialog.close();
		workDialog.close();
	});
});

// Скопировать содержимое data-copy - номер/почта
copyBtnList.forEach((button) => {
	button.addEventListener(`click`, () => {
		let data = button.getAttribute(`data-copy`);

		// Уведомляем о результате действия
		navigator.clipboard
			.writeText(data)
			.then(() => {
				// Показываем номер если нажата соответсвующая кнопка
				if (data.startsWith(`+7`)) {
					button.closest(`.field`).querySelector(`p`).innerHTML = data;
				}
				console.log(`Содержимое скопировано в буфер обмена:`, data);
			})
			.catch((error) => {
				console.error(`Ошибка при копировании в буфер обмена:`, error);
			});

		button.innerHTML = `Скопировано`;

		// Восстанавливаем изначальный вид
		setTimeout(() => {
			if (data.startsWith(`+7`)) {
				// Скрываем номер
				button
					.closest(`.field`)
					.querySelector(`p`).innerHTML = `+7 ••• ••• •• ••`;
				button.innerHTML = `Посмотреть номер`;
			} else {
				button.innerHTML = `Скопировать почту`;
			}
		}, 3000);
	});
});

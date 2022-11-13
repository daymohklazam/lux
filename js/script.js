let user_icon = document.querySelector('.user-header__icon');
user_icon.addEventListener("click", function(e){
   let user_menu = document.querySelector('.user-header__menu');
   user_menu.classList.toggle('_active')
});
// Меню бургер
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
}
//клик по свободному пространству
document.documentElement.addEventListener("click", function(e){
if(!e.target.closest('.user-header')){
   let user_menu = document.querySelector('.user-header__menu');
   user_menu.classList.remove('_active');
}
}); 


// Dynamic Adapt v.1
// HTML data-move="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-move="item,2,992"
// Andrikanych Yevhen 2020
var move_array = [];
var move_objects = document.querySelectorAll("[data-move]");

if (move_objects.length > 0) {
	for (var _index10 = 0; _index10 < move_objects.length; _index10++) {
		var _el6 = move_objects[_index10];

		var data_move = _el6.getAttribute("data-move");

		if (data_move != "" || data_move != null) {
			_el6.setAttribute("data-move-index", _index10);

			move_array[_index10] = {
				parent: _el6.parentNode,
				index: index_in_parent(_el6)
			};
		}
	}
}

function dynamic_adapt() {
	var w = document.querySelector("body").offsetWidth;

	if (move_objects.length > 0) {
		for (var _index11 = 0; _index11 < move_objects.length; _index11++) {
			var _el7 = move_objects[_index11];

			var _data_move = _el7.getAttribute("data-move");

			if (_data_move != "" || _data_move != null) {
				var data_array = _data_move.split(",");

				var data_parent = document.querySelector("." + data_array[0]);
				var data_index = data_array[1];
				var data_bp = data_array[2];

				if (w < data_bp) {
					if (!_el7.classList.contains("js-move_done_" + data_bp)) {
						if (data_index > 0) {
							//insertAfter
							var actual_index = index_of_elements(data_parent)[data_index];
							data_parent.insertBefore(_el7, data_parent.childNodes[actual_index]);
						} else {
							data_parent.insertBefore(_el7, data_parent.firstChild);
						}

						_el7.classList.add("js-move_done_" + data_bp);
					}
				} else {
					if (_el7.classList.contains("js-move_done_" + data_bp)) {
						dynamic_adaptive_back(_el7);

						_el7.classList.remove("js-move_done_" + data_bp);
					}
				}
			}
		}
	}

	custom_adapt(w);
}

function dynamic_adaptive_back(el) {
	var index_original = el.getAttribute("data-move-index");
	var move_place = move_array[index_original];
	var parent_place = move_place["parent"];
	var index_place = move_place["index"];

	if (index_place > 0) {
		//insertAfter
		var actual_index = index_of_elements(parent_place)[index_place];
		parent_place.insertBefore(el, parent_place.childNodes[actual_index]);
	} else {
		parent_place.insertBefore(el, parent_place.firstChild);
	}
}

function index_in_parent(node) {
	var children = node.parentNode.childNodes;
	var num = 0;

	for (var _i2 = 0; _i2 < children.length; _i2++) {
		if (children[_i2] == node) return num;
		if (children[_i2].nodeType == 1) num++;
	}

	return -1;
}

function index_of_elements(parent) {
	var children = [];

	for (var _i3 = 0; _i3 < parent.childNodes.length; _i3++) {
		if (parent.childNodes[_i3].nodeType == 1 && parent.childNodes[_i3].getAttribute("data-move") == null) {
			children.push(_i3);
		}
	}

	return children;
}

window.addEventListener("resize", function (event) {
	dynamic_adapt();
});
dynamic_adapt();

function custom_adapt(w) { }

var btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');

if (btn) {
	for (var _index12 = 0; _index12 < btn.length; _index12++) {
		var _el8 = btn[_index12];

		_el8.addEventListener('click', form_submit);
	}
}

function form_submit() {
	var error = 0;
	var btn = event.target;
	var form = btn.closest('form');
	var form_req = form.querySelectorAll('._req');

	if (form_req) {
		for (var _index13 = 0; _index13 < form_req.length; _index13++) {
			var _el9 = form_req[_index13];
			error += form_validate(_el9);
		}
	}

	if (error == 0) {
		//SendForm
		form_clean(form);
		popup_close(); //popup_open('message');
		//event.preventDefault();
	} else {
		var form_error = form.querySelectorAll('._error');

		if (form_error && form.classList.contains('_goto-error')) {
			_goto(form_error[0], 1000, 50);
		}

		event.preventDefault();
	}
}

function form_validate(input) {
	var error = 0;
	var input_g_value = input.getAttribute('data-value');

	if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
		if (input.value != input_g_value) {
			var em = input.value.replace(" ", "");
			input.value = em;
		}

		if (email_test(input) || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	} else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
		form_add_error(input);
		error++;
	} else {
		if (input.value == '' || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	}

	return error;
}

function form_add_error(input) {
	input.classList.add('_error');
	input.parentElement.classList.add('_error');
	var input_error = input.parentElement.querySelector('.form__error');

	if (input_error) {
		input.parentElement.removeChild(input_error);
	}

	var input_error_text = input.getAttribute('data-error');

	if (input_error_text && input_error_text != '') {
		input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
	}
}

function form_remove_error(input) {
	input.classList.remove('_error');
	input.parentElement.classList.remove('_error');
	var input_error = input.parentElement.querySelector('.form__error');

	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
}

function form_clean(form) {
	var inputs = form.querySelectorAll('input,textarea');

	for (var _index14 = 0; _index14 < inputs.length; _index14++) {
		var _el10 = inputs[_index14];

		_el10.parentElement.classList.remove('_focus');

		_el10.classList.remove('_focus');

		_el10.value = _el10.getAttribute('data-value');
	}

	var selects = form.querySelectorAll('select');

	if (inputs.length > 0) {
		for (var _index15 = 0; _index15 < selects.length; _index15++) {
			var select = selects[_index15];
			var select_default_value = select.getAttribute('data-default');
			select.value = select_default_value;
			select_item(select);
		}
	}
}
// Инициализируем Swiper
let myImageSlider = new Swiper('.image-slider', {
	// Стрелки
	navigation: {
		nextEl: '.control-main-slider__arrow_next',
		prevEl: '.control-main-slider__arrow_prev'
	},
   		// Бесконечный слайдер
		loop: true,
});
// Инициализируем Swiper
let myImageSlider2 = new Swiper('.lots__slider', {
	// Стрелки
	navigation: {
		nextEl: '.control-slider-lots__arrow-next',
		prevEl: '.control-slider-lots__arrow-prev'
	},
   		// Бесконечный слайдер
		loop: true,
		//autoHeight: true,

			// Брейк поинты (адаптив)
	// Брейк поинты (адаптив)
	// Ширина экрана
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 150,
		},
		480: {
			slidesPerView: 2,
			spaceBetween: 20,
		},
		767.98: {
			slidesPerView: 3,
			spaceBetween: 30,
		}
	},
	
});
// Инициализируем Swiper
let myImageSlider3 = new Swiper('.quotes__slider', {
	// Стрелки
	navigation: {
		nextEl: '.control-slider-quotes__link',
	},
   		// Бесконечный слайдер
		loop: true,
			// Cмена прозрачности
});
const menuLinks = document.querySelectorAll('.goto[data-goto]');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const iconMenu = document.querySelector('.menu__icon');
			const menuBody = document.querySelector('.menu__body');
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;
			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			iconMenu.classList.remove('_active');
			menuBody.classList.remove('_active');
			e.preventDefault();
		}
	}
}

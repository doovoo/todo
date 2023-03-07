'use strict'

const TODO_ELEMENT = function () {
	/**
	 * @param {{
	 * 	className: String?
	 * }?} option
	 * @returns HTMLDivElement
	 */
	let createDiv = function (option) {
		let div = document.createElement("div");
		div.className = option?.className;
		return div;
	};

	/**
	 * @param {{
	 * 	className: String?
	 * 	text: String?
	 * }?} option
	 * @returns HTMLSpanElement
	 */
	let createSpan = function (option) {
		let span = document.createElement("span");
		span.className = option?.className;
		if (option?.text) span.innerText = option.text;
		return span;
	};

	/**
	 * @param {{
	 * 	icon: String
	 * 	text: String
	 * }} option
	 * @returns HTMLDivElement
	 */
	let createTodo = function (option) {
		let div = createDiv({ className: "todo d-flex fade-in-animation" });
		div.value = option.text;

		let items = [
			createSpan({ className: `${option.icon}` }),
			createSpan({ className: "title d-flex", text: option.text }),
			createSpan({ className: "context-menu-btn icon-todo-control cursor" }),
			createSpan({ className: "check icon-todo-move cursor" }),
		];
		div.append(...items);
		return div;
	};

	return {
		/**
		 * @param {{
		 * 	icon: String
		 * 	text: String
		 * }} option
		 * @returns HTMLDivElement
		 */
		TODO: function (option) {
			return createTodo(option);
		},
	};
}();

let todo = function () {
	/** @type {HTMLDivElement} */
	const _input = document.querySelector(".todo-input");
	/** @type {HTMLDivElement} */
	const _list = document.querySelector(".todo-list");

	let inputFocus = function () {
		/** @type {HTMLInputElement} */
		let input = _input.querySelector(".input input");
		input.focus();
	};

	let inputIconHover = function () {
		/** @type {HTMLSpanElement} */
		let iconSelect = _input.querySelector(".todo-icon-select");
		/** @type {HTMLSpanElement} */
		let selected = iconSelect.querySelector(".select");
		/** @type {HTMLSpanElement} */
		let iconOption = iconSelect.querySelector(".icon-option");

		/** @type {HTMLInputElement} */
		let input = _input.querySelector(".input input");

		Array.from(iconOption.querySelectorAll("span"))
			.forEach(option => option.addEventListener("click", function () {
				let that = this;
				selected.className = `select ${that.className}`;
			}));
		Array.from(iconOption.querySelectorAll("span"))
			.forEach(option => option.addEventListener("keydown", function (e) {
				if (e.key === "Enter") {
					let that = this;
					selected.className = `select ${that.className}`;
					leave();
				}
			}));

		let enter = function () {
			input.blur();

			if (iconOption.classList.contains("hide"))
				iconOption.classList.remove("hide");

			if (iconOption.classList.contains("fade-out-animation"))
				iconOption.classList.remove("fade-out-animation");
			if (!iconOption.classList.contains("fade-in-animation"))
				iconOption.classList.add("fade-in-animation");
		}

		let leave = function () {
			input.focus();

			if (!iconOption.classList.contains("hide"))
				iconOption.classList.add("hide");

			if (iconOption.classList.contains("fade-in-animation"))
				iconOption.classList.remove("fade-in-animation");
			if (!iconOption.classList.contains("fade-out-animation"))
				iconOption.classList.add("fade-out-animation");
		}

		iconSelect.addEventListener("focus", enter);
		iconSelect.addEventListener("mouseenter", enter);
		iconSelect.addEventListener("mouseleave", leave);
	}

	let initInput = function () {
		/** @type {HTMLInputElement} */
		let input = _input.querySelector(".input input");
		let iconSelect = _input.querySelector(".todo-icon-select");
		let selected = iconSelect.querySelector(".select");

		inputFocus();
		inputIconHover();
		input.value = null;

		input.addEventListener("keyup", function (e) {
			let that = this;

			if (that.value.length > 0) {
				if (iconSelect.classList.contains("hide"))
					iconSelect.classList.remove("hide");

				if (iconSelect.classList.contains("fade-out-animation"))
					iconSelect.classList.remove("fade-out-animation");
				if (!iconSelect.classList.contains("fade-in-animation")) {
					selected.className = `select icon-todo-heart`;
					iconSelect.classList.add("fade-in-animation");
				}

			} else {
				if (!iconSelect.classList.contains("hide"))
					iconSelect.classList.add("hide");

				if (iconSelect.classList.contains("fade-in-animation"))
					iconSelect.classList.remove("fade-in-animation");
				if (!iconSelect.classList.contains("fade-out-animation"))
					iconSelect.classList.add("fade-out-animation");
			}
		})

		input.addEventListener("keydown", function (e) {
			let that = this;

			if (that.value.length > 0) {
				if (e.key === "Enter") {
					let option = {
						icon: Array.from(selected.classList.values())
							.filter(name => name !== 'select'),
						text: that.value,
					};
					_list.appendChild(TODO_ELEMENT.TODO(option));
					that.value = null;
				}
			}
		});
	};

	return {
		init: function () {
			initInput();
		},
	};
}();

document.addEventListener("DOMContentLoaded", todo.init);
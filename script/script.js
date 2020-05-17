document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    //! Отримуємо елементи для роботи зі сторінки.
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const burgerBtn = document.getElementById('burger');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const modalDialog = document.querySelector('.modal-dialog');
    const sendButton = document.querySelector('#send');


    //? Обєкт інформації
    const questions = [{
            "question": "Какого цвета бургер?",
            "answers": [{
                    "title": "Стандарт",
                    "url": "./image/burger.png"
                },
                {
                    "title": "Черный",
                    "url": "./image/burgerBlack.png"
                }
            ],
            "type": "radio"
        },
        {
            "question": "Из какого мяса котлета?",
            "answers": [{
                    "title": "Курица",
                    "url": "./image/chickenMeat.png"
                },
                {
                    "title": "Говядина",
                    "url": "./image/beefMeat.png"
                },
                {
                    "title": "Свинина",
                    "url": "./image/porkMeat.png"
                }
            ],
            "type": "radio"
        },
        {
            "question": "Дополнительные ингредиенты?",
            "answers": [{
                    "title": "Помидор",
                    "url": "./image/tomato.png"
                },
                {
                    "title": "Огурец",
                    "url": "./image/cucumber.png"
                },
                {
                    "title": "Салат",
                    "url": "./image/salad.png"
                },
                {
                    "title": "Лук",
                    "url": "./image/onion.png"
                }
            ],
            "type": "checkbox"
        },
        {
            "question": "Добавить соус?",
            "answers": [{
                    "title": "Чесночный",
                    "url": "./image/sauce1.png"
                },
                {
                    "title": "Томатный",
                    "url": "./image/sauce2.png"
                },
                {
                    "title": "Горчичный",
                    "url": "./image/sauce3.png"
                }
            ],
            "type": "radio"
        }
    ];

    let count = -100;
    let interval;
    modalDialog.style.top = count + '%';

    const animateModal = () => {
        modalDialog.style.top = count + '%';
        count += 3;
        interval = requestAnimationFrame(animateModal);

        if (count >= 0) {
            cancelAnimationFrame(interval);
            count = -100;
        }
        // if (count >= 0) {
        //     clearInterval(interval);
        //     count = -100;
        // }
    };

    //? Функція відкриття модального вікна
    const openModal = () => {
        interval = requestAnimationFrame(animateModal);
        // interval = setInterval(animateModal, 5);
        modalBlock.classList.add('d-block');
        playTest();
    };

    //? Робота з розмірами екрану.
    let clientWidth = document.documentElement.clientWidth;

    if (clientWidth < 768) {
        burgerBtn.style.display = 'flex';
    } else {
        burgerBtn.style.display = 'none';
    }

    window.addEventListener('resize', function() {
        clientWidth = document.documentElement.clientWidth;
        if (clientWidth < 768) {
            burgerBtn.style.display = 'flex';
        } else {
            burgerBtn.style.display = 'none';
        }
    });

    //todo Робота з модальним вікном старт тесту.
    const playTest = () => {
        const finalAnswers = [];

        let numberQuestion = 0;

        //* Фунція рендеру карточок з відповідями.
        const renderAnswers = (index) => {
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');

                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

                answerItem.innerHTML = `
                <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                        <img class="answerImg" src="${answer.url}" alt="burger">
                        <span>${answer.title}</span>
                    </label>
                `;
                formAnswers.appendChild(answerItem);
            });
        };
        //? Функція рендеру запитань.
        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';

            if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                questionTitle.textContent = `${questions[indexQuestion].question}`;
                renderAnswers(indexQuestion);
                nextButton.classList.remove('d-none');
                prevButton.classList.remove('d-none');
                sendButton.classList.add('d-none');
            }


            //* Приховання кнопки назад
            if (numberQuestion === 0) {
                prevButton.classList.add('d-none');
            }
            //* Приховання кнопки вперед
            // if (numberQuestion === questions.length - 1) {
            //     nextButton.classList.add('d-none');
            // }

            //! Виведення подяки за пройдення тесту та введення номеру телефону.
            if (numberQuestion === questions.length) {
                nextButton.classList.add('d-none');
                prevButton.classList.add('d-none');
                sendButton.classList.remove('d-none');
                formAnswers.innerHTML = `
                    <div class="form-group">
                        <label for="numberPhone">Enter your number</label>
                        <input type="phone" class="form-control" id="numberPhone">
                    </div>
                `;
            }

            if (numberQuestion === questions.length + 1) {
                formAnswers.textContent = 'Дякуємо за пройдений тест!';
                setTimeout(() => {
                    modalBlock.classList.remove('d-block');
                }, 2000);
            }


        };
        renderQuestions(numberQuestion);

        //! Функція для вибору відповідей
        const checkAnswer = () => {
            const obj = {};
            //? Фільтрація вибраних елементів
            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');


            //? Перебір відфільтрованих елементів
            inputs.forEach((input, index) => {
                if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                }

                if (numberQuestion === questions.length) {
                    obj['Номер телефону'] = input.value;
                }
            });
            finalAnswers.push(obj);

        };

        //! Подія для переходу по карточках вперед.
        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        };

        //! Подія для переходу по карточках назад.
        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        };
        //! Подія на кнопку відправлення номеру телефону в об'єкт.
        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        }
    };

    //? Функція закриття модально вікна
    const closeModalWindow = () => {
        modalBlock.classList.remove('d-block');
        burgerBtn.classList.remove('active');
    };

    //? Функція для появи бургер кнопки.
    const burgerBtnMenu = () => {
        burgerBtn.classList.add('active');
        modalBlock.classList.add('d-block');
        playTest();
    };

    document.addEventListener('click', function(event) {
        const target = event.target;
        if (!target.closest('.modal-dialog') &&
            !target.closest('.openModalButton') &&
            !target.closest('.burger')) {
            modalBlock.classList.remove('d-block');
            burgerBtn.classList.remove('active');
        }
    });

    //! Подія для роботи бургера.
    burgerBtn.addEventListener('click', burgerBtnMenu);
    //! Подія для закриття модально вікна.
    closeModal.addEventListener('click', closeModalWindow);
    //! Подія для відкриття модального вікна.
    btnOpenModal.addEventListener('click', openModal);

});
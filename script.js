const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

const accordions = document.querySelectorAll('.accordion-item');
accordions.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        accordions.forEach(acc => acc.classList.remove('active'));
        if (!isActive) {
            item.classList.add('active');
        }
    });
});
if (accordions.length) {
    accordions[0].classList.add('active');
}

const exerciseCards = document.querySelectorAll('.exercise-card');
exerciseCards.forEach(card => {
    const input = card.querySelector('input');
    const button = card.querySelector('.check-answer');
    const feedback = card.querySelector('.feedback');
    const answer = Number(card.dataset.answer);

    button.addEventListener('click', () => {
        const userAnswer = Number(input.value);
        if (Number.isNaN(userAnswer)) {
            feedback.textContent = 'Please enter a valid number.';
            feedback.style.color = '#ff8a8a';
            return;
        }
        if (Math.abs(userAnswer - answer) < 0.001) {
            feedback.textContent = 'Correct! Great job.';
            feedback.style.color = '#4ef0ff';
        } else {
            feedback.textContent = `Not quite. Try again!`;
            feedback.style.color = '#ff8a8a';
        }
    });
});

const questionBank = [
    {
        question: 'What is the solution to 2x + 5 = 17?',
        options: ['x = 5', 'x = 6', 'x = 7', 'x = 8'],
        answer: 'x = 6'
    },
    {
        question: 'The derivative of x² is…',
        options: ['2x', 'x', 'x²', '1'],
        answer: '2x'
    },
    {
        question: 'What is the area of a circle with radius 3?',
        options: ['6π', '9π', '12π', '18π'],
        answer: '9π'
    },
    {
        question: 'Simplify: (3a²)(2a³)',
        options: ['6a⁵', '6a⁶', '5a⁵', '6a⁴'],
        answer: '6a⁵'
    },
    {
        question: 'Which of the following is an even function?',
        options: ['f(x) = x³', 'f(x) = sin(x)', 'f(x) = cos(x)', 'f(x) = eˣ'],
        answer: 'f(x) = cos(x)'
    },
    {
        question: 'Find the slope of the line passing through (2,3) and (5,12).',
        options: ['3', '4', '5', '9'],
        answer: '3'
    },
    {
        question: 'Evaluate the limit: limₓ→0 (sin x)/x',
        options: ['0', '1', 'Does not exist', '∞'],
        answer: '1'
    },
    {
        question: 'What is the length of the hypotenuse of a 5-12-? right triangle?',
        options: ['10', '11', '12', '13'],
        answer: '13'
    },
    {
        question: 'If f(x) = x³, what is f′(x)?',
        options: ['3x²', 'x²', '3x', 'x³'],
        answer: '3x²'
    },
    {
        question: 'Solve: ∫ 2x dx',
        options: ['x² + C', 'x²', '2x² + C', 'x + C'],
        answer: 'x² + C'
    }
];

const startQuizButton = document.getElementById('start-quiz');
const quizForm = document.getElementById('quiz-form');
const submitQuizButton = document.getElementById('submit-quiz');
const quizStatus = document.querySelector('.quiz-status');
const quizScore = document.getElementById('quiz-score');

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

function generateQuiz() {
    quizForm.innerHTML = '';
    quizScore.textContent = '';
    const questions = shuffle(questionBank).slice(0, 5);
    questions.forEach((q, index) => {
        const fieldset = document.createElement('fieldset');
        fieldset.className = 'quiz-question';
        const legend = document.createElement('h3');
        legend.textContent = `Question ${index + 1}`;
        const prompt = document.createElement('p');
        prompt.textContent = q.question;
        fieldset.appendChild(legend);
        fieldset.appendChild(prompt);

        shuffle(q.options).forEach(option => {
            const id = `q${index}-${option}`.replace(/[^a-zA-Z0-9-]/g, '');
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `q${index}`;
            input.value = option;
            input.id = id;
            label.setAttribute('for', id);
            label.textContent = option;
            label.prepend(input);
            fieldset.appendChild(label);
        });

        fieldset.dataset.answer = q.answer;
        quizForm.appendChild(fieldset);
    });
    quizForm.classList.remove('hidden');
    submitQuizButton.classList.remove('hidden');
    quizStatus.textContent = 'Quiz generated! Select the best answer for each question.';
}

startQuizButton.addEventListener('click', generateQuiz);

submitQuizButton.addEventListener('click', () => {
    const questions = quizForm.querySelectorAll('.quiz-question');
    let score = 0;
    questions.forEach(question => {
        const answer = question.dataset.answer;
        const selected = question.querySelector('input:checked');
        if (selected && selected.value === answer) {
            score += 1;
        }
    });
    quizScore.textContent = `You scored ${score} out of ${questions.length}.`;
    quizStatus.textContent = score === questions.length ? 'Perfect score! Outstanding comprehension.' : 'Great effort! Review and try generating a new quiz.';
});

function safeEvaluate(expression) {
    const sanitized = expression.replace(/[^0-9+\-*/().^% ]/g, '');
    const normalized = sanitized.replace(/\^/g, '**');
    if (!normalized.trim()) return NaN;
    try {
        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${normalized})`)();
        return Number.isFinite(result) ? result : NaN;
    } catch (err) {
        return NaN;
    }
}

const toolOutputs = document.querySelectorAll('.tool-output');

function setOutput(element, message, success = true) {
    element.textContent = message;
    element.style.color = success ? '#4ef0ff' : '#ff8a8a';
}

document.querySelectorAll('.tool-action').forEach(button => {
    button.addEventListener('click', event => {
        event.preventDefault();
        const action = button.dataset.action;
        const card = button.closest('.tool-card');
        const output = card.querySelector('.tool-output');

        if (action === 'basic') {
            const expression = card.querySelector('input').value;
            const result = safeEvaluate(expression);
            if (Number.isNaN(result)) {
                setOutput(output, 'Invalid expression. Try numbers and + - * / ( ).', false);
            } else {
                setOutput(output, `Result: ${Number(result.toFixed(6))}`);
            }
        }

        if (action === 'quadratic') {
            const a = Number(document.getElementById('coef-a').value);
            const b = Number(document.getElementById('coef-b').value);
            const c = Number(document.getElementById('coef-c').value);
            if (a === 0) {
                if (b === 0) {
                    setOutput(output, 'Please enter a valid equation.', false);
                    return;
                }
                const root = -c / b;
                setOutput(output, `Linear root: x = ${Number(root.toFixed(4))}`);
                return;
            }
            const discriminant = b * b - 4 * a * c;
            if (discriminant < 0) {
                const real = (-b / (2 * a)).toFixed(4);
                const imaginary = (Math.sqrt(Math.abs(discriminant)) / (2 * a)).toFixed(4);
                setOutput(output, `Complex roots: ${real} ± ${imaginary}i`);
            } else {
                const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                setOutput(output, `Roots: x₁ = ${root1.toFixed(4)}, x₂ = ${root2.toFixed(4)}`);
            }
        }
    });
});

document.querySelectorAll('#scientific-calculator .scientific-buttons button').forEach(button => {
    button.addEventListener('click', event => {
        event.preventDefault();
        const fn = button.dataset.fn;
        const input = document.getElementById('scientific-input');
        const value = Number(input.value);
        const output = document.querySelector('#scientific-calculator .tool-output');

        if (Number.isNaN(value)) {
            setOutput(output, 'Enter a number to evaluate.', false);
            return;
        }

        let result;
        switch (fn) {
            case 'sin':
                result = Math.sin(value);
                break;
            case 'cos':
                result = Math.cos(value);
                break;
            case 'tan':
                result = Math.tan(value);
                break;
            case 'log':
                if (value <= 0) {
                    setOutput(output, 'Logarithm defined for positive numbers only.', false);
                    return;
                }
                result = Math.log10(value);
                break;
            case 'exp':
                result = Math.exp(value);
                break;
            case 'sqrt':
                if (value < 0) {
                    setOutput(output, 'Square root defined for non-negative numbers.', false);
                    return;
                }
                result = Math.sqrt(value);
                break;
            default:
                result = NaN;
        }

        setOutput(output, `${fn}(x) = ${Number(result.toFixed(6))}`);
    });
});

const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        alert('Please fill in all fields before submitting.');
        return;
    }

    alert(`Thank you, ${name}! Your message has been received.`);
    contactForm.reset();
});

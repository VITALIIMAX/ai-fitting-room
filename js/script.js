document.addEventListener('DOMContentLoaded', () => {
    /* --- Мобильное меню --- */
    const burger = document.getElementById('headerBurger');
    const nav = document.getElementById('headerNav');
    const body = document.body;

    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('is-active');
            nav.classList.toggle('is-open');
            // Блокируем скролл фона
            if (nav.classList.contains('is-open')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Закрытие меню при клике на ссылку
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('is-active');
                nav.classList.remove('is-open');
                body.style.overflow = '';
            });
        });

        // Закрытие меню при клике вне меню
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('is-open') && !nav.contains(e.target) && !burger.contains(e.target)) {
                burger.classList.remove('is-active');
                nav.classList.remove('is-open');
                body.style.overflow = '';
            }
        });
    }

    /* --- Sticky Header --- */
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                header.classList.add('is-sticky');
            } else {
                header.classList.remove('is-sticky');
            }
        });
    }

    /* --- Модальные окна --- */
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modalCloseButtons = document.querySelectorAll('.modal__close');
    const modals = document.querySelectorAll('.modal-overlay');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('is-open');
            body.style.overflow = 'hidden';
        }
    }

    function closeModal(modal) {
        modal.classList.remove('is-open');
        body.style.overflow = '';
    }

    modalTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-modal-target');
            openModal(targetId);
        });
    });

    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Закрытие по Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal-overlay.is-open');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });

    /* --- Табы --- */
    const tabsBtns = document.querySelectorAll('.tabs-nav__btn');
    const tabsPanes = document.querySelectorAll('.tab-pane');

    if (tabsBtns.length > 0) {
        tabsBtns.forEach(btn => {
            // Check if this button is part of the pricing nav, if so skip it (handled separately)
            if (btn.closest('.pricing-nav')) return;

            btn.addEventListener('click', () => {
                // Убираем активный класс у всех кнопок в этой группе
                const siblings = btn.parentElement.querySelectorAll('.tabs-nav__btn');
                siblings.forEach(b => b.classList.remove('is-active'));
                
                // Добавляем активный класс нажатой кнопке
                btn.classList.add('is-active');

                // Получаем id таба
                const tabId = btn.getAttribute('data-tab');

                // Скрываем все панели в этом контейнере
                const contentContainer = btn.closest('.section').querySelector('.tabs-content');
                if (contentContainer) {
                    const panes = contentContainer.querySelectorAll('.tab-pane');
                    panes.forEach(pane => pane.classList.remove('is-active'));
                    
                    // Показываем нужную панель
                    const activePane = contentContainer.querySelector(`#${tabId}`);
                    if (activePane) {
                        activePane.classList.add('is-active');
                    }
                }
            });
        });
    }

    /* --- Pricing Toggles --- */
    const pricingBtns = document.querySelectorAll('.pricing-nav .tabs-nav__btn');
    const pricingPanes = document.querySelectorAll('.pricing-pane');

    if (pricingBtns.length > 0) {
        pricingBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                pricingBtns.forEach(b => b.classList.remove('is-active'));
                // Add active class to clicked button
                btn.classList.add('is-active');

                // Get pricing category id
                const pricingId = btn.getAttribute('data-pricing');

                // Hide all pricing panes
                pricingPanes.forEach(pane => pane.classList.remove('is-active'));
                
                // Show selected pricing pane
                const activePane = document.getElementById(`pricing-${pricingId}`);
                if (activePane) {
                    activePane.classList.add('is-active');
                }
            });
        });
    }

    /* --- FAQ --- */
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            
            // Если хотим аккордеон (закрывать другие при открытии одного)
            // faqQuestions.forEach(q => {
            //     if (q !== question) {
            //         q.parentElement.classList.remove('is-active');
            //         q.parentElement.querySelector('.faq-answer').style.maxHeight = null;
            //     }
            // });

            item.classList.toggle('is-active');
            
            if (item.classList.contains('is-active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    /* --- Demo Interaction --- */
    const modelBtns = document.querySelectorAll('.model-btn');
    const garmentItems = document.querySelectorAll('.garment-item');
    const tryOnBtn = document.getElementById('tryOnBtn');
    const demoPreviewImage = document.querySelector('.demo-preview__image');
    const demoPreviewBg = document.querySelector('.demo-preview__bg');
    const demoLoader = document.querySelector('.demo-loader');

    // Храним данные для отображения (в реальном проекте это были бы ID изображений)
    let selectedModel = 'Model 1';
    let selectedGarment = 'Футболка';

    modelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modelBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            
            // Получаем src картинки модели
            const img = btn.querySelector('img');
            if (img) {
                if (demoPreviewImage) {
                    demoPreviewImage.src = img.src;
                    demoPreviewImage.alt = img.alt;
                }
                if (demoPreviewBg) {
                    demoPreviewBg.src = img.src;
                }
            }
        });
    });

    garmentItems.forEach(item => {
        item.addEventListener('click', () => {
            garmentItems.forEach(i => i.classList.remove('is-selected'));
            item.classList.add('is-selected');
            selectedGarment = item.querySelector('span').textContent;
        });
    });

    if (tryOnBtn) {
        tryOnBtn.addEventListener('click', () => {
            // Показываем лоадер
            if (demoPreviewImage) demoPreviewImage.style.opacity = '0.5';
            if (demoPreviewBg) demoPreviewBg.style.opacity = '0.5';
            demoLoader.classList.remove('hidden');
            tryOnBtn.disabled = true;
            tryOnBtn.textContent = 'Обработка...';

            // Имитация задержки генерации
            setTimeout(() => {
                demoLoader.classList.add('hidden');
                if (demoPreviewImage) {
                    demoPreviewImage.style.opacity = '1';
                    // Show result image
                    demoPreviewImage.src = 'img/result-example.png';
                }
                if (demoPreviewBg) {
                    demoPreviewBg.style.opacity = '1';
                    demoPreviewBg.src = 'img/result-example.png';
                }
                
                tryOnBtn.disabled = false;
                tryOnBtn.textContent = 'Готово! ✨';
                
                setTimeout(() => {
                     tryOnBtn.textContent = 'Примерить';
                }, 2000);

            }, 2000);
        });
    }

    /* --- Form Submission (Simulation) --- */
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
                form.reset();
                btn.textContent = originalText;
                btn.disabled = false;
                
                // Close modal if form is inside one
                const modal = form.closest('.modal-overlay');
                if (modal) {
                    closeModal(modal);
                }
            }, 1000);
        });
    });

    /* --- Mobile Pricing Carousel Dots & Drag-to-Scroll --- */
    const pricingPagination = document.querySelector('.pricing-pagination');
    // pricingPanes уже объявлен выше, используем существующую переменную
    
    // Drag-to-Scroll Logic
    if (pricingPanes.length > 0) {
        pricingPanes.forEach(pane => {
        let isDown = false;
        let startX;
        let scrollLeft;

        pane.addEventListener('mousedown', (e) => {
            isDown = true;
            pane.classList.add('is-dragging');
            startX = e.pageX - pane.offsetLeft;
            scrollLeft = pane.scrollLeft;
            pane.style.cursor = 'grabbing';
        });

        pane.addEventListener('mouseleave', () => {
            isDown = false;
            pane.classList.remove('is-dragging');
            pane.style.cursor = 'grab';
        });

        pane.addEventListener('mouseup', () => {
            isDown = false;
            pane.classList.remove('is-dragging');
            pane.style.cursor = 'grab';
        });

        pane.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - pane.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast
            pane.scrollLeft = scrollLeft - walk;
        });
        
        // Initial cursor style
        pane.style.cursor = 'grab';
    });
    }

    if (pricingPagination) {
        const dots = pricingPagination.querySelectorAll('.pricing-dot');

        function updateDots(scrollLeft, cardWidth) {
            // Gap is 16px
            const index = Math.round(scrollLeft / (cardWidth + 16));
            dots.forEach((dot, i) => {
                if (i === index) dot.classList.add('is-active');
                else dot.classList.remove('is-active');
            });
        }

        pricingPanes.forEach(pane => {
            pane.addEventListener('scroll', () => {
                const card = pane.querySelector('.pricing-card');
                if (card) {
                    updateDots(pane.scrollLeft, card.offsetWidth);
                }
            });
        });

        // Update dots when switching pricing tabs
        const pricingTabBtns = document.querySelectorAll('.pricing-nav .tabs-nav__btn');
        pricingTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Wait for pane to become active and visible
                setTimeout(() => {
                    const activePane = document.querySelector('.pricing-pane.is-active');
                    if (activePane) {
                        const card = activePane.querySelector('.pricing-card');
                        if (card) {
                            updateDots(activePane.scrollLeft, card.offsetWidth);
                        }
                    }
                }, 50);
            });
        });
    }
});
// Swiper Initialization
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // FEATURED CARDS SWIPER
    // ==========================================================================
    
    // Dynamic scaling effect variables
    let lastTime = performance.now();
    let lastTranslate = 0;
    let velocity = 0;
    let rafId = null;

    const featuresSlider = document.querySelector('.features-cards-carousel');
    if (featuresSlider) {
        // Check if cards have scaling effect elements
        const hasFeatureCards = !!featuresSlider.querySelectorAll('.swiper-slide .feature-card').length > 0;
        
        const featuredCardsSwiper = new Swiper('.features-cards-carousel', {
            // Core swiper configuration
            speed: 900,
            spaceBetween: 30,
            resistance: false,
            slidesPerView: 3, 
            grabCursor: false, 
            
            breakpoints: {
                // Mobile
                320: {
                    slidesPerView: 1.25,
                    spaceBetween: 10,
                },
                // Tablet
                768: {
                    slidesPerView: 2.5,
                    spaceBetween: 25,
                },
                // Desktop 
                1024: {
                    slidesPerView: 3.5,
                    
                }
            },
            
            // Navigation
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            // Dynamic scaling effect on drag
            on: {
                setTranslate(swiper, translate) {
                    if(hasFeatureCards) {
                        trackDragVelocity(swiper);
                    }
                },
                touchEnd(swiper) {
                    if(hasFeatureCards) {
                        continueDragTracking(swiper);
                    }
                },
                transitionStart(swiper) {
                    if(hasFeatureCards) {
                        simulateTransitionEffect(swiper);
                    }
                },
                transitionEnd(swiper) {
                    if(hasFeatureCards) {
                        stopDragEffect();
                    }
                }
            }
        });
    }

    // Dynamic scaling effect functions
    function trackDragVelocity(swiper) {
        const currentTime = performance.now();
        const currentTranslate = swiper.translate;
        const deltaTime = currentTime - lastTime;
        const deltaTranslate = currentTranslate - lastTranslate;
        velocity = Math.abs(deltaTranslate / deltaTime);
        applyCardScaling(velocity, swiper);
        lastTranslate = currentTranslate;
        lastTime = currentTime;
    }

    function continueDragTracking(swiper) {
        cancelAnimationFrame(rafId);
        const track = () => {
            trackDragVelocity(swiper);
            if (velocity > 0.01) {
                rafId = requestAnimationFrame(track);
            } else {
                stopDragEffect();
            }
        };
        rafId = requestAnimationFrame(track);
    }

    function simulateTransitionEffect(swiper) {
        cancelAnimationFrame(rafId);
        velocity = 2.5;
        const friction = 0.92;
        const animate = () => {
            applyCardScaling(velocity, swiper);
            velocity *= friction;
            if (velocity > 0.01) {
                rafId = requestAnimationFrame(animate);
            } else {
                stopDragEffect();
            }
        };
        rafId = requestAnimationFrame(animate);
    }

    function stopDragEffect() {
        cancelAnimationFrame(rafId);
        velocity = 0;
    }

    function applyCardScaling(velocity, swiper) {
        const maxVelocity = 3.0;
        const minVelocity = 0.01;
        const maxScale = 1;
        const minScale = 0.7; // 30% zoom out effect
        const normalized = 1 - Math.min(Math.max((velocity - minVelocity) / (maxVelocity - minVelocity), 0), 1);
        const scaleValue = minScale + (maxScale - minScale) * normalized;
        
        // Apply dynamic scaling to feature cards
        swiper.el.querySelectorAll('.swiper-slide .feature-card').forEach((card) => {
            card.style.transform = `scale(${scaleValue.toFixed(3)})`;
        });
    }
    
    // ==========================================================================
    // TESTIMONIAL AUDIO SWIPER
    // ==========================================================================
    
    // Initialize the testimonial audio swiper
    const sliderEl = document.querySelector('.testimonial-audio-slider');
    const slideCount = sliderEl ? sliderEl.querySelectorAll('.swiper-slide').length : 0;
    const testimonialAudioSwiper = new Swiper('.testimonial-audio-slider', {
        // Basic configuration
        slidesPerView: 1,
        spaceBetween: 0,
        loop: slideCount >= 3,
        speed: 600,
        
        // Navigation
        navigation: {
            nextEl: '.testimonial-audio-navigation .arrow-navigation__arrow--right',
            prevEl: '.testimonial-audio-navigation .arrow-navigation__arrow--left',
        },
        
        // Pagination (optional - can be added if needed)
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        // Autoplay (optional - can be enabled if needed)
        autoplay: {
            delay: 5000,
            disableOnInteraction: true,
        },
        
        // Effect
        effect: 'slide',
        
        // Responsive breakpoints
        breakpoints: {
            // When window width is >= 768px
            768: {
                slidesPerView: 1,
                spaceBetween: 0,
            },
            // When window width is >= 1024px
            1024: {
                slidesPerView: 1,
                spaceBetween: 0,
            }
        },
        
        // Events
        on: {
            init: function() {},
            slideChange: function() {}
        }
    });
    
    // Audio player functionality (basic implementation)
    const audioPlayers = document.querySelectorAll('.testimonial-audio-player');
    
    audioPlayers.forEach(player => {
        const waveform = player.querySelector('.testimonial-audio-waveform');
        const duration = player.querySelector('.testimonial-audio-duration');
        
        // Add click event for play/pause functionality
        waveform.addEventListener('click', function() {
            // Toggle play/pause state
            this.classList.toggle('playing');
            
            // Update progress bar (simulation)
            const progressBar = this.querySelector('.testimonial-audio-waveform-progress');
            if (this.classList.contains('playing')) {
                // Simulate progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 2;
                    progressBar.style.width = progress + '%';
                    
                    if (progress >= 100) {
                        clearInterval(interval);
                        this.classList.remove('playing');
                        progressBar.style.width = '0%';
                    }
                }, 100);
            } else {
                // Reset progress when paused
                progressBar.style.width = '0%';
            }
        });
    });
    
    // ==========================================================================
    // MOMENTS ARC CAROUSEL
    // ==========================================================================
    
    const momentsCarousel = document.querySelector('.moments-arc-carousel');
    if (momentsCarousel) {
        const momentsSwiper = new Swiper('.moments-arc-carousel', {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 50,
            speed: 600,
            loop: false,
            grabCursor: true,
            effect: 'slide',
            freeMode: false,
            
            breakpoints: {
                320: {
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 'auto',
                    spaceBetween: 50,
                }
            },
            
            on: {
                init: function() {
                    applyArcEffect(this);
                },
                slideChange: function() {
                    applyArcEffect(this);
                },
                setTranslate: function() {
                    applyArcEffect(this);
                }
            }
        });
        
        // Function to apply arc effect to slides
        function applyArcEffect(swiper) {
            const slides = swiper.slides;
            const activeIndex = swiper.activeIndex;
            const totalSlides = slides.length;
            
            slides.forEach((slide, index) => {
                const card = slide.querySelector('.moments-card');
                if (!card) return;
                
                // Calculate distance from center
                let distance = index - activeIndex;
                
                // Calculate rotation and translation for arc effect
                // Based on Figma design: cards rotate and move up to create arc
                const maxRotation = 5; // Maximum rotation in degrees (matches Figma: -5deg to +5deg)
                const maxTranslateY = 25; // Maximum vertical translation for arc effect
                const maxScale = 0.96; // Scale for non-active slides
                
                // Apply transformations based on distance from center
                if (distance === 0) {
                    // Center slide - no rotation, full scale, no translation
                    slide.style.transform = 'translateY(0) rotateY(0deg) scale(1) translateZ(0)';
                    card.style.opacity = '1';
                    slide.style.zIndex = '10';
                } else {
                    // Side slides - rotated and translated to create arc
                    const absDistance = Math.abs(distance);
                    // Rotation: negative for left, positive for right
                    const rotation = -distance * maxRotation;
                    // Vertical translation: cards further from center move up more
                    const translateY = absDistance * maxTranslateY;
                    // Scale: cards further from center are smaller
                    const scale = 1 - (absDistance * (1 - maxScale));
                    // Opacity: cards further from center are more transparent
                    const opacity = Math.max(1 - (absDistance * 0.15), 0.7);
                    
                    // Apply transform to slide for proper arc positioning
                    slide.style.transform = `translateY(${translateY}px) rotateY(${rotation}deg) scale(${scale}) translateZ(0)`;
                    card.style.opacity = opacity;
                    slide.style.zIndex = String(10 - absDistance);
                }
            });
        }
    }
});

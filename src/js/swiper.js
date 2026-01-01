let swiper_tl_speech = null; // global reference
let testimonial_audio = null;
const WORD_DURATION = 0.4;

function setAudioGraphicProgress(audio) {
    
}
function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function playTestimonialAudio() {

    // 🔴 Kill previous timeline
    if (swiper_tl_speech) {
        swiper_tl_speech.kill();
        swiper_tl_speech = null;
    }

    if (testimonial_audio) {
        testimonial_audio.pause();
        testimonial_audio.currentTime = 0;
    }

    const activeSlide = document.querySelector(
        ".testimonial-audio-slide.swiper-slide-active"
    );

    if (!activeSlide) return;

    // 🔴 Reset word states
    activeSlide
        .querySelectorAll(".word.active")
        .forEach(el => el.classList.remove("active"));

    // 🟢 Create new timeline
    swiper_tl_speech = gsap.timeline({ paused: true });

    const words = activeSlide.querySelectorAll(".word");
    testimonial_audio = activeSlide.querySelector(".audio");

    const currentTimeEl = activeSlide.querySelector(".audio-current-time");
    const durationEl = activeSlide.querySelector(".testimonial-audio-duration");
    console.log('durationEl:', durationEl);

    if (testimonial_audio) {

        // ▶️ Play audio
        testimonial_audio.play().catch(() => {});
        if (durationEl) {
                
                durationEl.innerHTML = formatTime(testimonial_audio.duration);
            }

        const waveform = activeSlide.querySelector(".waveform");
        waveform.innerHTML = ""; // 🔴 important reset

        const BAR_COUNT = 60;

        const heights = Array.from({ length: BAR_COUNT }, () =>
            Math.floor(Math.random() * 60) + 20
        );

        heights.forEach(h => {
            const bar = document.createElement("div");
            bar.className = "bar";
            bar.style.height = h + "%";
            waveform.appendChild(bar);
        });

        const bars = waveform.querySelectorAll(".bar");

        // 🔘 Click on waveform bar → seek audio
        bars.forEach((bar, index) => {
            bar.addEventListener("click", () => {

                if (!testimonial_audio.duration) return;

                const percent = index / bars.length;
                const newTime = percent * testimonial_audio.duration;

                // 🎧 Seek audio
                testimonial_audio.currentTime = newTime;
                testimonial_audio.play().catch(() => {});

                // 🔥 SYNC GSAP TIMELINE
                if (swiper_tl_speech) {
                    swiper_tl_speech.pause();
                    swiper_tl_speech.time(newTime);
                    swiper_tl_speech.play();
                }

                // 🔄 update waveform UI
                bars.forEach((b, i) => {
                    b.classList.toggle("played", i <= index);
                });
            });
        });


        // ⏱️ Update progress + time
        testimonial_audio.addEventListener("timeupdate", () => {

            const current = testimonial_audio.currentTime;

            // 🎯 Sync GSAP continuously
            if (swiper_tl_speech && Math.abs(swiper_tl_speech.time() - current) > 0.1) {
                swiper_tl_speech.time(current);
            }

            const progress = current / testimonial_audio.duration;
            const activeBars = Math.floor(progress * bars.length);

            bars.forEach((bar, i) => {
                bar.classList.toggle("played", i < activeBars);
            });

            if (currentTimeEl) {
                currentTimeEl.textContent = formatTime(current);
            }
        });

        // 🔁 Reset when ended
        testimonial_audio.addEventListener("ended", () => {
            if (currentTimeEl) currentTimeEl.textContent = "00:00";
        }, { once: true });
    }

    // 📝 Word animation
    words.forEach((el, i) => {
        swiper_tl_speech.to(el, {
            opacity: 1,
            duration: WORD_DURATION,
            onStart: () => el.classList.add("active"),
            onComplete: () => el.classList.remove("active")
        }, i * WORD_DURATION);
    });

    swiper_tl_speech.play();
}

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
        
        // Pagination
        pagination: {
            el: '.testimonial-audio-pagination',
            clickable: true,
            bulletClass: 'testimonial-audio-pagination-dot',
            bulletActiveClass: 'testimonial-audio-pagination-dot--active',
        },
        
        // Autoplay (optional - can be enabled if needed)
        autoplay:false, /*{
            delay: 5000,
            disableOnInteraction: true,
        },*/
        
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
            init: function() {
               // playTestimonialAudio()
            },
            slideChangeTransitionEnd: function () {
                playTestimonialAudio();    
            }
        }   
    });
    
    // Audio player functionality (basic implementation)
    /*const audioPlayers = document.querySelectorAll('.testimonial-audio-player');
    
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
    });*/
    
    // ==========================================================================
    // MOMENTS ARC CAROUSEL
    // ==========================================================================
    
    // Check if mobile for moments carousel
    const isMomentsMobile = window.innerWidth <= 768;
    
    // Configuration for moments carousel
    let MOMENTS_CONFIG = {
        spacing: isMomentsMobile ? 36 : 55,
        curveHeight: isMomentsMobile ? 1 : 1.5,
        tiltAngle: isMomentsMobile ? 4 : 3,
        // Individual card vertical positions (5 cards)
        cardOffsets: [0, 0, 0, 0, 0]
    };

    // Initialize moments arc carousel
    const momentsCarousel = document.querySelector('.moments-arc-carousel');
    if (momentsCarousel) {
        const momentsSwiper = new Swiper('.moments-arc-carousel', {
            effect: 'creative',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 30,
            loop: false,
            initialSlide: 2, // Start with center card
            speed: 600,
            
            creativeEffect: {
                limitProgress: 5,
                shadowPerProgress: false,
                progressMultiplier: 1,
                
                prev: {
                    translate: [`-${MOMENTS_CONFIG.spacing * 2}%`, `${MOMENTS_CONFIG.curveHeight * 10}px`, 0],
                    rotate: [0, 0, -MOMENTS_CONFIG.tiltAngle],
                    scale: 1.0,
                    opacity: 1.0
                },
                next: {
                    translate: [`${MOMENTS_CONFIG.spacing * 2}%`, `${MOMENTS_CONFIG.curveHeight * 10}px`, 0],
                    rotate: [0, 0, MOMENTS_CONFIG.tiltAngle],
                    scale: 1.0,
                    opacity: 1.0
                }
            },
            
            // Mobile responsive
            breakpoints: {
                320: {
                    spaceBetween: 20,
                    creativeEffect: {
                        prev: {
                            translate: [`-${MOMENTS_CONFIG.spacing * 3}%`, `${MOMENTS_CONFIG.curveHeight * 8}px`, 0],
                            rotate: [0, 0, -MOMENTS_CONFIG.tiltAngle * 0.8],
                            scale: 1.0,
                            opacity: 1.0
                        },
                        next: {
                            translate: [`${MOMENTS_CONFIG.spacing * 3}%`, `${MOMENTS_CONFIG.curveHeight * 8}px`, 0],
                            rotate: [0, 0, MOMENTS_CONFIG.tiltAngle * 0.8],
                            scale: 1.0,
                            opacity: 1.0
                        }
                    }
                },
                768: {
                    spaceBetween: 30,
                }
            }
        });

        // Function to apply individual card positions for moments
        function applyMomentsCardPositions() {
            if (!momentsSwiper) return;
            
            momentsSwiper.slides.forEach((slide, index) => {
                const card = slide.querySelector('.moments-card');
                if (card && MOMENTS_CONFIG.cardOffsets[index] !== undefined) {
                    const existingTransform = card.style.transform || '';
                    const cleanTransform = existingTransform.replace(/translateY\([^)]*\)/g, '').trim();
                    card.style.transform = `${cleanTransform} translateY(${MOMENTS_CONFIG.cardOffsets[index]}px)`.trim();
                }
            });
        }

        // Apply card positions after initialization
        setTimeout(() => {
            applyMomentsCardPositions();
        }, 100);
    }
    
    });

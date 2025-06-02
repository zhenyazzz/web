document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('slider');
    const sliderMessage = document.getElementById('slider-message');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const slidesCountInput = document.getElementById('slides-count');
    const intervalInput = document.getElementById('interval');
    
    const imagesMap = new Map();
    
    imagesMap.set(1, { url: 'images/GooglePixel.png', title: 'Google Pixel' });
    imagesMap.set(2, { url: 'images/iphone13.png', title: 'iphone 13' });
    imagesMap.set(3, { url: 'images/PocoX6Pro.png', title: 'Poco X6 Pro'});
    imagesMap.set(4, { url: 'images/samsung21.png', title: 'samsung 21' });
    imagesMap.set(5, { url: 'images/xiaomi11.png', title: 'xiaomi 11' });
    
    
    let slideshowInterval = null;
    let currentSlide = 0;
    let slidesToShow = parseInt(slidesCountInput.value);
    let currentImages = [];
    
    function initSlider() {
        slider.innerHTML = '';
        currentImages = [];
        
        slidesToShow = parseInt(slidesCountInput.value);
        if (slidesToShow > imagesMap.size) {
            slidesToShow = imagesMap.size;
            slidesCountInput.value = slidesToShow;
        }
        
        for (let i = 1; i <= slidesToShow; i++) {
            if (imagesMap.has(i)) {
                currentImages.push(imagesMap.get(i));
            }
        }
        
        currentImages.forEach((image, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = image.url;
            imgElement.alt = image.title;
            imgElement.dataset.index = index;
            
            if (index === 0) {
                imgElement.classList.add('active');
            }
            
            slider.appendChild(imgElement);
        });
        
        currentSlide = 0;
    }
    
    function showNextSlide() {
        const slides = slider.querySelectorAll('img');
        
        slides[currentSlide].classList.remove('active');
        
        currentSlide++;
        
        if (currentSlide >= slides.length) {
            showCompletionMessage();
            return;
        }
        
        slides[currentSlide].classList.add('active');
    }
    
    function showCompletionMessage() {
        stopSlideshow();
        
        sliderMessage.style.display = 'flex';
        sliderMessage.textContent = 'Показ слайдов завершен!';
        
        setTimeout(() => {
            sliderMessage.style.display = 'none';
            
            resetSlider();
        }, 3000);
    }
    
    function resetSlider() {
        const slides = slider.querySelectorAll('img');
        slides.forEach(slide => slide.classList.remove('active'));
        
        currentSlide = 0;
        if (slides.length > 0) {
            slides[0].classList.add('active');
        }
    }
    
    function startSlideshow() {
        if (slideshowInterval) {
            stopSlideshow();
        }
        
        resetSlider();
        
        sliderMessage.style.display = 'none';
        
        const interval = parseInt(intervalInput.value);
        
        slideshowInterval = setInterval(showNextSlide, interval);
        
        startBtn.textContent = 'Возобновить показ';
    }
    
    function stopSlideshow() {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
    }
    
    startBtn.addEventListener('click', startSlideshow);
    stopBtn.addEventListener('click', stopSlideshow);
    
    slidesCountInput.addEventListener('change', function() {
        stopSlideshow();
        initSlider();
    });
    
    initSlider();
}); 
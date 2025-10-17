/*
document.addEventListener("DOMContentLoaded", function() {
    // --- Get ALL Element References ---
    const gridView = document.getElementById('grid-view');
    const profileView = document.getElementById('profile-view');
    const notificationView = document.getElementById('notification-view');
    const contentView = document.getElementById('content-view');

    // Menu Elements
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sliderMenu = document.getElementById('slider-menu');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    // Content Page Elements
    const contentTitle = document.getElementById('content-title');
    const contentBody = document.getElementById('content-body');
    const contentCloseBtn = document.getElementById('content-close-btn');

    // Grid and Search Elements
    const gridContainer = document.getElementById("profile-grid");
    const searchInput = document.getElementById("search-input");
    const noMatchMessage = document.getElementById("no-match-message");
    const suggestionsContainer = document.getElementById("suggestions-container");
    const backButton = document.getElementById('back-button');

    // Notification Elements
    const notificationBellBtn = document.getElementById('notification-bell-button');
    const notificationBadge = document.getElementById('notification-badge');
    const notificationList = document.getElementById('notification-list');
    const notificationBackBtn = document.getElementById('notification-back-button');

    // API Endpoints
    const profilesApiUrl = 'http://localhost:8080/api/images';
    const notificationsApiUrl = 'http://localhost:8080/api/notifications';

    let allProfilesData = [];
    let currentProfileId = null;

    // --- SLIDER MENU & CONTENT PAGE LOGIC ---
    const dummyData = {
        about: { title: "About Us", content: "<p>We are a passionate team dedicated to creating amazing digital experiences. Our mission is to connect people through innovative technology and beautiful design.</p>" },
        help: { title: "Help Center", content: "<p>If you need assistance, please contact our support team at <b>support@example.com</b>.</p>" },
        faq: { title: "FAQs", content: "<h4>How do I search for a profile?</h4><p>Use the search bar to search by name or description.</p>" }
    };

    function openMenu() { sliderMenu.classList.add('open'); }
    function closeMenu() { sliderMenu.classList.remove('open'); }
    function showContentPage(pageKey) {
        const data = dummyData[pageKey];
        if (data) {
            contentTitle.textContent = data.title;
            contentBody.innerHTML = data.content;
            contentView.style.display = 'flex';
            closeMenu();
        }
    }
    function closeContentPage() { contentView.style.display = 'none'; }

    // --- View Switching Logic ---
    function showProfilePage(profileIndex) {
        const profile = allProfilesData[profileIndex];
        currentProfileId = profile.id;
        document.getElementById('profile-img').src = profile.url;
        document.getElementById('profile-name').textContent = profile.name;
        document.getElementById('profile-desc').textContent = profile.description;
        document.getElementById('profile-mobile').textContent = `Contact: ${profile.mobile}`;
        document.getElementById('profile-long-desc').textContent = profile.longDescription;
        setupInteractiveStars(profile.rating.average);
        gridView.style.display = 'none';
        profileView.style.display = 'block';
        window.scrollTo(0, 0);
    }

    function showGridView() {
        profileView.style.display = 'none';
        gridView.style.display = 'block';
    }

    // --- RATING LOGIC ---
    function setupInteractiveStars(currentRating) {
        const container = document.getElementById('profile-rating');
        const ratingData = allProfilesData.find(p => p.id === currentProfileId).rating;
        container.innerHTML = `(${ratingData.count} reviews)`;
        const starContainer = document.createElement('div');
        starContainer.className = 'interactive-stars';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.dataset.value = i;
            starContainer.appendChild(star);
        }
        container.prepend(starContainer);
        starContainer.addEventListener('mouseover', (e) => { if (e.target.tagName === 'SPAN') highlightStars(e.target.dataset.value); });
        starContainer.addEventListener('mouseout', () => { highlightStars(Math.round(currentRating)); });
        starContainer.addEventListener('click', (e) => { if (e.target.tagName === 'SPAN') submitRating(currentProfileId, e.target.dataset.value); });
        highlightStars(Math.round(currentRating));
    }

    function highlightStars(value) {
        const stars = document.querySelectorAll('.interactive-stars span');
        stars.forEach((star, index) => { star.classList.toggle('lit', index < value); });
    }

    function submitRating(profileId, ratingValue) {
        fetch(`${profilesApiUrl}/${profileId}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: parseInt(ratingValue) })
        }).then(response => {
            if (response.ok) alert('Thank you for your rating!');
            else alert('Error: Could not submit rating.');
        }).catch(error => console.error('Error submitting rating:', error));
    }

    // --- Filtering and Suggestions Logic ---
    function filterProfiles() {
        const searchTerm = searchInput.value.toLowerCase();
        let matchesFound = 0;
        const allProfileCards = gridContainer.querySelectorAll('.profile-card');
        allProfileCards.forEach((card, index) => {
            const profile = allProfilesData[index];
            const isMatch = profile.name.toLowerCase().includes(searchTerm) || profile.description.toLowerCase().includes(searchTerm);
            card.classList.toggle('hidden', !isMatch);
            if (isMatch) matchesFound++;
        });
        noMatchMessage.style.display = matchesFound > 0 ? 'none' : 'block';
    }

    function showSuggestions() {
        const searchTerm = searchInput.value.toLowerCase();
        suggestionsContainer.innerHTML = '';
        if (searchTerm.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        const matchingProfiles = allProfilesData.filter(p => p.name.toLowerCase().startsWith(searchTerm));
        if (matchingProfiles.length > 0) {
            matchingProfiles.forEach(profile => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = profile.name;
                item.addEventListener('click', () => {
                    searchInput.value = profile.name;
                    suggestionsContainer.style.display = 'none';
                    filterProfiles();
                });
                suggestionsContainer.appendChild(item);
            });
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }

    // --- NOTIFICATION LOGIC ---
    function fetchNotifications() {
        fetch(notificationsApiUrl).then(response => response.json()).then(notifications => {
            notifications.sort((a, b) => b.timestamp - a.timestamp);
            const unreadCount = notifications.filter(n => !n.read).length;
            updateNotificationBadge(unreadCount);
            renderNotifications(notifications);
        }).catch(error => console.error('Error fetching notifications:', error));
    }
    function updateNotificationBadge(count) {
        notificationBadge.style.display = count > 0 ? 'block' : 'none';
        notificationBadge.textContent = count;
    }
    function renderNotifications(notifications) {
        notificationList.innerHTML = '';
        notifications.forEach(n => {
            const item = document.createElement('div');
            item.className = 'notification-item';
            if (!n.read) item.classList.add('unread');
            const date = new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
            item.innerHTML = `<h3>${n.title}</h3><p>${n.message}</p><small>${date}</small>`;
            notificationList.appendChild(item);
        });
    }

    // --- Main Fetch and Build Logic ---
    fetch(profilesApiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`Network response was not ok`);
            return response.json();
        })
        .then(imageData => {
            allProfilesData = imageData;
            gridContainer.innerHTML = '';
            allProfilesData.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'profile-card';
                // THIS IS THE LINE THAT WAS FIXED
                card.innerHTML = `<div class="image-wrapper"><img src="${item.url}" alt="${item.name}"></div><div class="details-wrapper"><div class="person-name">${item.name}</div><div class="person-description">${item.description}</div></div>`;
                card.addEventListener('click', () => showProfilePage(index));
                gridContainer.appendChild(card);
            });
        }).catch(error => {
            console.error('Failed to fetch profiles:', error);
            noMatchMessage.textContent = "Error: Could not load profiles. Please check the API.";
            noMatchMessage.style.display = 'block';
        });

    // --- Attach All Event Listeners ---
    backButton.addEventListener('click', showGridView);
    searchInput.addEventListener('input', () => {
        showSuggestions();
        filterProfiles();
    });
    notificationBellBtn.addEventListener('click', () => notificationView.style.display = 'flex');
    notificationBackBtn.addEventListener('click', () => notificationView.style.display = 'none');
    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });

    // New Menu Listeners
    menuToggleBtn.addEventListener('click', openMenu);
    menuCloseBtn.addEventListener('click', closeMenu);
    contentCloseBtn.addEventListener('click', closeContentPage);
    menuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const pageKey = event.target.dataset.page;
            showContentPage(pageKey);
        });
    });

    // --- Initial Load ---
    fetchNotifications();
});
*//*
*/
/*
*//*

*/
/*
*//*
*/
/*

*//*

*/
/*


document.addEventListener("DOMContentLoaded", function() {
    // --- Get ALL Element References ---
    const gridView = document.getElementById('grid-view');
    const profileView = document.getElementById('profile-view');
    const notificationView = document.getElementById('notification-view');
    const contentView = document.getElementById('content-view');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sliderMenu = document.getElementById('slider-menu');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const contentTitle = document.getElementById('content-title');
    const contentBody = document.getElementById('content-body');
    const contentCloseBtn = document.getElementById('content-close-btn');
    const gridContainer = document.getElementById("profile-grid");
    const searchInput = document.getElementById("search-input");
    const noMatchMessage = document.getElementById("no-match-message");
    const suggestionsContainer = document.getElementById("suggestions-container");
    const backButton = document.getElementById('back-button');
    const notificationBellBtn = document.getElementById('notification-bell-button');
    const notificationBadge = document.getElementById('notification-badge');
    const notificationList = document.getElementById('notification-list');
    const notificationBackBtn = document.getElementById('notification-back-button');
    const bannerContainer = document.getElementById('banner-container'); // New
        const imageModal = document.getElementById('image-modal');         // New
        const modalImage = document.getElementById('modal-image');         // New
        const modalCloseBtn = document.querySelector('.modal-close-btn');  // New

        const bannerApiUrl = 'http://localhost:8080/api/banners'; // New
    const profilesApiUrl = 'http://localhost:8080/api/images';
    const notificationsApiUrl = 'http://localhost:8080/api/notifications';

    let allProfilesData = [];
    let currentProfileId = null;

    let currentProfileId = null;
    let bannerImages = [];
    let currentBannerIndex = 0;
    // --- SLIDER MENU & CONTENT PAGE LOGIC ---
    const dummyData = {
        about: { title: "About Us", content: "<p>We are a passionate team dedicated to creating amazing digital experiences. Our mission is to connect people through innovative technology and beautiful design.</p>" },
        help: { title: "Help Center", content: "<p>If you need assistance, please contact our support team at <b>support@example.com</b>.</p>" },
        faq: { title: "FAQs", content: "<h4>How do I search for a profile?</h4><p>Use the search bar to search by name or description.</p>" }
    };
    function openMenu() { sliderMenu.classList.add('open'); }
    function closeMenu() { sliderMenu.classList.remove('open'); }
    function showContentPage(pageKey) {
        const data = dummyData[pageKey];
        if (data) {
            contentTitle.textContent = data.title;
            contentBody.innerHTML = data.content;
            contentView.style.display = 'flex';
            closeMenu();
        }
    }
    function closeContentPage() { contentView.style.display = 'none'; }

    // --- View Switching Logic ---
    function showProfilePage(profileIndex) {
        const profile = allProfilesData[profileIndex];
        currentProfileId = profile.id;
        incrementProfileVisit(profile.id);
        document.getElementById('profile-img').src = profile.url;
        document.getElementById('profile-name').textContent = profile.name;
        document.getElementById('profile-desc').textContent = profile.description;
        document.getElementById('profile-mobile').textContent = `Contact: ${profile.mobile}`;
        document.getElementById('profile-long-desc').textContent = profile.longDescription;
        document.getElementById('profile-visits').textContent = `👁️ ${profile.visits || 0} Visits`;

        setupInteractiveStars(profile.rating.average);

        gridView.style.display = 'none';
        profileView.style.display = 'block';
        window.scrollTo(0, 0);
    }
    function showGridView() {
        profileView.style.display = 'none';
        gridView.style.display = 'block';
    }
    function incrementProfileVisit(profileId) { //to automaticallyincrease ratings
            fetch(`${profilesApiUrl}/${profileId}/visit`, {
                method: 'POST'
            })
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to increment visit count.');
                }
            })
            .catch(error => console.error('Error sending visit update:', error));
        }

    // --- RATING LOGIC ---
    function setupInteractiveStars(currentRating) {
         const container = document.getElementById('profile-rating');
                const ratingData = allProfilesData.find(p => p.id === currentProfileId).rating;
                container.innerHTML = `(${ratingData.count} reviews)`;
                const starContainer = document.createElement('div');
                starContainer.className = 'interactive-stars';
                for (let i = 1; i <= 5; i++) {
                    const star = document.createElement('span');
                    star.textContent = '★';
                    star.dataset.value = i;
                    starContainer.appendChild(star);
                }
                container.prepend(starContainer);
                starContainer.addEventListener('mouseover', (e) => { if (e.target.tagName === 'SPAN') highlightStars(e.target.dataset.value); });
                starContainer.addEventListener('mouseout', () => { highlightStars(Math.round(currentRating)); });
                starContainer.addEventListener('click', (e) => { if (e.target.tagName === 'SPAN') submitRating(currentProfileId, e.target.dataset.value); });
                highlightStars(Math.round(currentRating));
    }
    function highlightStars(value) {
        const stars = document.querySelectorAll('.interactive-stars span');
        stars.forEach((star, index) => { star.classList.toggle('lit', index < value); });
    }
    function submitRating(profileId, ratingValue) {
        // ... submit rating logic ...
        fetch(`${profilesApiUrl}/${profileId}/rate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rating: parseInt(ratingValue) })
                }).then(response => {
                    if (response.ok) alert('Thank you for your rating!');
                    else alert('Error: Could not submit rating.');
                }).catch(error => console.error('Error submitting rating:', error));
    }

    //...... here is Marketing Banners
    function fetchBanners() {
            fetch(bannerApiUrl)
                .then(response => response.json())
                .then(data => {
                    bannerImages = data;
                    renderBanners();
                    startSlideshow();
                })
                .catch(error => console.error('Error fetching banners:', error));
        }

        function renderBanners() {
            bannerContainer.innerHTML = '';
            bannerImages.forEach((banner, index) => {
                const img = document.createElement('img');
                img.src = banner.imageUrl;
                img.className = 'banner-slide';
                if (index === 0) {
                    img.classList.add('active'); // Show the first image initially
                }
                // Open modal on click
                img.addEventListener('click', () => {
                    imageModal.style.display = 'block';
                    modalImage.src = banner.imageUrl;
                });
                bannerContainer.appendChild(img);
            });
        }

         modalCloseBtn.addEventListener('click', () => {
                imageModal.style.display = 'none';
            });


        function startSlideshow() {
            setInterval(() => {
                const slides = document.querySelectorAll('.banner-slide');
                if (slides.length === 0) return;

                slides[currentBannerIndex].classList.remove('active');
                currentBannerIndex = (currentBannerIndex + 1) % slides.length; // Loop back to the first image
                slides[currentBannerIndex].classList.add('active');
            }, 3000); // 3 seconds delay
        }

    // --- Filtering and Suggestions Logic ---
    function filterProfiles() {
        // ... filtering logic ...
        const searchTerm = searchInput.value.toLowerCase();
                let matchesFound = 0;
                const allProfileCards = gridContainer.querySelectorAll('.profile-card');

                allProfileCards.forEach((card, index) => {
                    const profile = allProfilesData[index];
                    const isMatch = profile.name.toLowerCase().includes(searchTerm) || profile.description.toLowerCase().includes(searchTerm);
                    card.classList.toggle('hidden', !isMatch);
                    if (isMatch) matchesFound++;
                });

                noMatchMessage.style.display = matchesFound > 0 ? 'none' : 'block';

                // Fix for single-item grid layout
                if (matchesFound === 1) {
                    gridContainer.style.gridTemplateColumns = '300px';
                    gridContainer.style.justifyContent = 'center';
                } else {
                    gridContainer.style.gridTemplateColumns = '';
                    gridContainer.style.justifyContent = '';
                }
    }
    function showSuggestions() {
        // ... suggestion logic ...
        const searchTerm = searchInput.value.toLowerCase();
                suggestionsContainer.innerHTML = '';
                if (searchTerm.length === 0) {
                    suggestionsContainer.style.display = 'none';
                    return;
                }
                const matchingProfiles = allProfilesData.filter(p => p.name.toLowerCase().startsWith(searchTerm));
                if (matchingProfiles.length > 0) {
                    matchingProfiles.forEach(profile => {
                        const item = document.createElement('div');
                        item.className = 'suggestion-item';
                        item.textContent = profile.name;
                        item.addEventListener('click', () => {
                            searchInput.value = profile.name;
                            suggestionsContainer.style.display = 'none';
                            filterProfiles();
                        });
                        suggestionsContainer.appendChild(item);
                    });
                    suggestionsContainer.style.display = 'block';
                } else {
                    suggestionsContainer.style.display = 'none';
                }
    }

    // --- NOTIFICATION LOGIC ---
    function fetchNotifications() {
        // ... notification fetching logic ...
        fetch(notificationsApiUrl).then(response => response.json()).then(notifications => {
                    notifications.sort((a, b) => b.timestamp - a.timestamp);
                    const unreadCount = notifications.filter(n => !n.read).length;
                    updateNotificationBadge(unreadCount);
                    renderNotifications(notifications);
                }).catch(error => console.error('Error fetching notifications:', error));
    }
    function updateNotificationBadge(count) {
        // ... badge logic ...
        notificationBadge.style.display = count > 0 ? 'block' : 'none';
                notificationBadge.textContent = count;
    }
    function renderNotifications(notifications) {
        // ... render logic ...
        notificationList.innerHTML = '';
                notifications.forEach(n => {
                    const item = document.createElement('div');
                    item.className = 'notification-item';
                    if (!n.read) item.classList.add('unread');
                    const date = new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
                    item.innerHTML = `<h3>${n.title}</h3><p>${n.message}</p><small>${date}</small>`;
                    notificationList.appendChild(item);
                });
    }

    // --- Main Fetch and Build Logic ---
    fetch(profilesApiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`Network response was not ok`);
            return response.json();
        })
        .then(imageData => {
            allProfilesData = imageData;
            gridContainer.innerHTML = '';
            allProfilesData.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'profile-card';
                card.innerHTML = `<div class="image-wrapper"><img src="${item.url}" alt="${item.name}"></div><div class="details-wrapper"><div class="person-name">${item.name}</div><div class="person-description">${item.description}</div></div>`;
                card.addEventListener('click', () => showProfilePage(index));
                gridContainer.appendChild(card);
            });
        }).catch(error => {
            console.error('Failed to fetch profiles:', error);
            noMatchMessage.textContent = "Error: Could not load profiles. Please check the API.";
            noMatchMessage.style.display = 'block';
        });

    // --- Attach All Event Listeners ---
    backButton.addEventListener('click', showGridView);
    searchInput.addEventListener('input', () => { showSuggestions(); filterProfiles(); });
    notificationBellBtn.addEventListener('click', () => notificationView.style.display = 'flex');
    notificationBackBtn.addEventListener('click', () => notificationView.style.display = 'none');
    document.addEventListener('click', (event) => { if (!searchInput.contains(event.target)) { suggestionsContainer.style.display = 'none'; } });
    menuToggleBtn.addEventListener('click', openMenu);
    menuCloseBtn.addEventListener('click', closeMenu);
    contentCloseBtn.addEventListener('click', closeContentPage);
    menuItems.forEach(item => { item.addEventListener('click', (e) => { e.preventDefault(); showContentPage(e.target.dataset.page); }); });

    // --- Initial Load ---
    fetchNotifications();
    fetchBanners();
});*//*
*/
/*
*//*

*/
/*


document.addEventListener("DOMContentLoaded", function() {
    // --- Get ALL Element References ---
    const gridView = document.getElementById('grid-view');
    const profileView = document.getElementById('profile-view');
    const notificationView = document.getElementById('notification-view');
    const contentView = document.getElementById('content-view');

    // Menu & Banner
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sliderMenu = document.getElementById('slider-menu');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const bannerContainer = document.getElementById('banner-container');

    // Content & Modal
    const contentTitle = document.getElementById('content-title');
    const contentBody = document.getElementById('content-body');
    const contentCloseBtn = document.getElementById('content-close-btn');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    // Grid and Search
    const gridContainer = document.getElementById("profile-grid");
    const searchInput = document.getElementById("search-input");
    const noMatchMessage = document.getElementById("no-match-message");
    const suggestionsContainer = document.getElementById("suggestions-container");
    const backButton = document.getElementById('back-button');

    // Notifications
    const notificationBellBtn = document.getElementById('notification-bell-button');
    const notificationBadge = document.getElementById('notification-badge');
    const notificationList = document.getElementById('notification-list');
    const notificationBackBtn = document.getElementById('notification-back-button');

    // API Endpoints
    const profilesApiUrl = 'http://localhost:8080/api/images';
    const notificationsApiUrl = 'http://localhost:8080/api/notifications';
    const bannerApiUrl = 'http://localhost:8080/api/banners';

    let allProfilesData = [];
    let currentProfileId = null;
    let bannerImages = [];
    let currentBannerIndex = 0;

    // --- SLIDER MENU & CONTENT PAGE LOGIC ---
    const dummyData = {
        about: { title: "About Us", content: "<p>We are a passionate team dedicated to creating amazing digital experiences. Our mission is to connect people through innovative technology and beautiful design.</p>" },
        help: { title: "Help Center", content: "<p>If you need assistance, please contact our support team at <b>support@example.com</b>.</p>" },
        faq: { title: "FAQs", content: "<h4>How do I search for a profile?</h4><p>Use the search bar to search by name or description.</p>" }
    };
    function openMenu() { sliderMenu.classList.add('open'); }
    function closeMenu() { sliderMenu.classList.remove('open'); }
    function showContentPage(pageKey) {
        const data = dummyData[pageKey];
        if (data) {
            contentTitle.textContent = data.title;
            contentBody.innerHTML = data.content;
            contentView.style.display = 'flex';
            closeMenu();
        }
    }
    function closeContentPage() { contentView.style.display = 'none'; }

    // --- View Switching & Profile Visits ---
    function showProfilePage(profileIndex) {
        const profile = allProfilesData[profileIndex];
        currentProfileId = profile.id;
        incrementProfileVisit(profile.id);
        document.getElementById('profile-img').src = profile.url;
        document.getElementById('profile-name').textContent = profile.name;
        document.getElementById('profile-desc').textContent = profile.description;
        document.getElementById('profile-mobile').textContent = `Contact: ${profile.mobile}`;
        document.getElementById('profile-long-desc').textContent = profile.longDescription;
        document.getElementById('profile-visits').textContent = `👁️ ${profile.visits || 0} Visits`;
        setupInteractiveStars(profile.rating.average);
        gridView.style.display = 'none';
        profileView.style.display = 'block';
        window.scrollTo(0, 0);
    }
    function showGridView() {
        profileView.style.display = 'none';
        gridView.style.display = 'block';
    }
    function incrementProfileVisit(profileId) {
        fetch(`${profilesApiUrl}/${profileId}/visit`, { method: 'POST' })
            .catch(error => console.error('Error sending visit update:', error));
    }

    // --- RATING LOGIC ---
    function setupInteractiveStars(currentRating) {
        const container = document.getElementById('profile-rating');
        const ratingData = allProfilesData.find(p => p.id === currentProfileId).rating;
        container.innerHTML = `(${ratingData.count} reviews)`;
        const starContainer = document.createElement('div');
        starContainer.className = 'interactive-stars';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span'); star.textContent = '★'; star.dataset.value = i; starContainer.appendChild(star);
        }
        container.prepend(starContainer);
        starContainer.addEventListener('mouseover', (e) => { if (e.target.tagName === 'SPAN') highlightStars(e.target.dataset.value); });
        starContainer.addEventListener('mouseout', () => { highlightStars(Math.round(currentRating)); });
        starContainer.addEventListener('click', (e) => { if (e.target.tagName === 'SPAN') submitRating(currentProfileId, e.target.dataset.value); });
        highlightStars(Math.round(currentRating));
    }
    function highlightStars(value) {
        document.querySelectorAll('.interactive-stars span').forEach((star, index) => { star.classList.toggle('lit', index < value); });
    }
    function submitRating(profileId, ratingValue) {
        fetch(`${profilesApiUrl}/${profileId}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: parseInt(ratingValue) })
        }).then(response => { if (response.ok) alert('Thank you for your rating!'); else alert('Error: Could not submit rating.'); })
        .catch(error => console.error('Error submitting rating:', error));
    }

    // --- BANNER SLIDESHOW LOGIC ---
    function fetchBanners() {
        fetch(bannerApiUrl).then(response => response.json()).then(data => {
            bannerImages = data;
            renderBanners();
            startSlideshow();
        }).catch(error => console.error('Error fetching banners:', error));
    }
    function renderBanners() {
        bannerContainer.innerHTML = '';
        bannerImages.forEach((banner, index) => {
            const img = document.createElement('img');
            img.src = banner.imageUrl;
            img.className = 'banner-slide';
            if (index === 0) img.classList.add('active');
            img.addEventListener('click', () => { imageModal.style.display = 'block'; modalImage.src = banner.imageUrl; });
            bannerContainer.appendChild(img);
        });
    }
    function startSlideshow() {
        setInterval(() => {
            const slides = document.querySelectorAll('.banner-slide');
            if (slides.length === 0) return;
            slides[currentBannerIndex].classList.remove('active');
            currentBannerIndex = (currentBannerIndex + 1) % slides.length;
            slides[currentBannerIndex].classList.add('active');
        }, 3000);
    }

    // --- Filtering and Suggestions Logic ---
    function filterProfiles() {
        const searchTerm = searchInput.value.toLowerCase();
        let matchesFound = 0;
        gridContainer.querySelectorAll('.profile-card').forEach((card, index) => {
            const profile = allProfilesData[index];
            const isMatch = profile.name.toLowerCase().includes(searchTerm) || profile.description.toLowerCase().includes(searchTerm);
            card.classList.toggle('hidden', !isMatch);
            if (isMatch) matchesFound++;
        });
        noMatchMessage.style.display = matchesFound > 0 ? 'none' : 'block';
        if (matchesFound === 1) { gridContainer.style.gridTemplateColumns = '300px'; gridContainer.style.justifyContent = 'center'; }
        else { gridContainer.style.gridTemplateColumns = ''; gridContainer.style.justifyContent = ''; }
    }
    function showSuggestions() {
        const searchTerm = searchInput.value.toLowerCase();
        suggestionsContainer.innerHTML = '';
        if (searchTerm.length === 0) { suggestionsContainer.style.display = 'none'; return; }
        const matchingProfiles = allProfilesData.filter(p => p.name.toLowerCase().startsWith(searchTerm));
        if (matchingProfiles.length > 0) {
            matchingProfiles.forEach(profile => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = profile.name;
                item.addEventListener('click', () => { searchInput.value = profile.name; suggestionsContainer.style.display = 'none'; filterProfiles(); });
                suggestionsContainer.appendChild(item);
            });
            suggestionsContainer.style.display = 'block';
        } else { suggestionsContainer.style.display = 'none'; }
    }

    // --- NOTIFICATION LOGIC ---
    function fetchNotifications() {
        fetch(notificationsApiUrl).then(response => response.json()).then(notifications => {
            notifications.sort((a, b) => b.timestamp - a.timestamp);
            const unreadCount = notifications.filter(n => !n.read).length;
            updateNotificationBadge(unreadCount);
            renderNotifications(notifications);
        }).catch(error => console.error('Error fetching notifications:', error));
    }
    function updateNotificationBadge(count) {
        notificationBadge.style.display = count > 0 ? 'block' : 'none';
        notificationBadge.textContent = count;
    }
    function renderNotifications(notifications) {
        notificationList.innerHTML = '';
        notifications.forEach(n => {
            const item = document.createElement('div');
            item.className = 'notification-item';
            if (!n.read) item.classList.add('unread');
            const date = new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
            item.innerHTML = `<h3>${n.title}</h3><p>${n.message}</p><small>${date}</small>`;
            notificationList.appendChild(item);
        });
    }

    // --- Main Fetch and Build Logic ---
   *//*
*/
/*

*//*

*/
/* fetch(profilesApiUrl)
        .then(response => { if (!response.ok) throw new Error(`API Error: Server responded with status ${response.status}`); return response.json(); })
        .then(imageData => {
            allProfilesData = imageData;
            gridContainer.innerHTML = '';
            if (imageData.length === 0) { noMatchMessage.textContent = "No profiles found from API."; noMatchMessage.style.display = 'block'; return; }
            imageData.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'profile-card';
                card.innerHTML = `<div class="image-wrapper"><img src="${item.url}" alt="${item.name}"></div><div class="details-wrapper"><div class="person-name">${item.name}</div><div class="person-description">${item.description}</div></div>`;
                card.addEventListener('click', () => showProfilePage(index));
                gridContainer.appendChild(card);
            });
        }).catch(error => {
            console.error('Failed to fetch profiles:', error);
            noMatchMessage.textContent = `Error: Could not load profiles. Please ensure the backend server is running. (${error.message})`;
            noMatchMessage.style.display = 'block';
        });
    *//*
*/
/*
*//*

*/
/*

    fetch(profilesApiUrl)
            .then(response => {
                if (!response.ok) {
                    // This makes the error visible on the page
                    throw new Error(`API Error: Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then(imageData => {
                allProfilesData = imageData;
                gridContainer.innerHTML = '';
                if (imageData.length === 0) {
                    noMatchMessage.textContent = "No profiles found from the API.";
                    noMatchMessage.style.display = 'block';
                    return;
                }
                imageData.forEach((item, index) => {
                    const card = document.createElement('div');
                    card.className = 'profile-card';
                    card.innerHTML = `<div class="image-wrapper"><img src="${item.url}" alt="${item.name}"></div><div class="details-wrapper"><div class="person-name">${item.name}</div><div class="person-description">${item.description}</div></div>`;
                    card.addEventListener('click', () => showProfilePage(index));
                    gridContainer.appendChild(card);
                });
            }).catch(error => {
                console.error('Failed to fetch profiles:', error);
                noMatchMessage.textContent = `Error: Could not load profiles. Please ensure the backend server is running. (${error.message})`;
                noMatchMessage.style.display = 'block';
            });

    // --- Attach All Event Listeners ---
    backButton.addEventListener('click', showGridView);
    searchInput.addEventListener('input', () => { showSuggestions(); filterProfiles(); });
    notificationBellBtn.addEventListener('click', () => notificationView.style.display = 'flex');
    notificationBackBtn.addEventListener('click', () => notificationView.style.display = 'none');
    document.addEventListener('click', (event) => { if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) { suggestionsContainer.style.display = 'none'; } });
    menuToggleBtn.addEventListener('click', openMenu);
    menuCloseBtn.addEventListener('click', closeMenu);
    contentCloseBtn.addEventListener('click', closeContentPage);
    menuItems.forEach(item => { item.addEventListener('click', (e) => { e.preventDefault(); showContentPage(e.target.dataset.page); }); });
    modalCloseBtn.addEventListener('click', () => imageModal.style.display = 'none');

    // --- Initial Load ---
    fetchNotifications();
    fetchBanners();
});*//*
*/
/*


// This function runs once the entire HTML document has been loaded and is ready.
document.addEventListener("DOMContentLoaded", function() {

    // --- Get ALL Element References ---
    // This section gets references to all the HTML elements we need to interact with.

    // Main page views
    const gridView = document.getElementById('grid-view');
    const profileView = document.getElementById('profile-view');
    const notificationView = document.getElementById('notification-view');
    const contentView = document.getElementById('content-view');

    // Menu & Banner elements
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sliderMenu = document.getElementById('slider-menu');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const bannerContainer = document.getElementById('banner-container');

    // Content & Modal elements
    const contentTitle = document.getElementById('content-title');
    const contentBody = document.getElementById('content-body');
    const contentCloseBtn = document.getElementById('content-close-btn');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    // Grid and Search elements
    const gridContainer = document.getElementById("profile-grid");
    const searchInput = document.getElementById("search-input");
    const noMatchMessage = document.getElementById("no-match-message");
    const suggestionsContainer = document.getElementById("suggestions-container");
    const backButton = document.getElementById('back-button');

    // Notification elements
    const notificationBellBtn = document.getElementById('notification-bell-button');
    const notificationBadge = document.getElementById('notification-badge');
    const notificationList = document.getElementById('notification-list');
    const notificationBackBtn = document.getElementById('notification-back-button');

    // API Endpoints - The URLs for our backend services
    const profilesApiUrl = 'http://localhost:8080/api/images';
    const notificationsApiUrl = 'http://localhost:8080/api/notifications';
    const bannerApiUrl = 'http://localhost:8080/api/banners';

    // Global variables to store data fetched from the API
    let allProfilesData = [];
    let currentProfileId = null;
    let bannerImages = [];
    let currentBannerIndex = 0;

    // --- SLIDER MENU & CONTENT PAGE LOGIC ---
    const dummyData = {
        about: { title: "About Us", content: "<p>We are a passionate team dedicated to creating amazing digital experiences. Our mission is to connect people through innovative technology and beautiful design.</p>" },
        help: { title: "Help Center", content: "<p>If you need assistance, please contact our support team at <b>support@example.com</b>.</p>" },
        faq: { title: "FAQs", content: "<h4>How do I search for a profile?</h4><p>Use the search bar to search by name or description.</p>" }
    };
    function openMenu() { sliderMenu.classList.add('open'); }
    function closeMenu() { sliderMenu.classList.remove('open'); }
    function showContentPage(pageKey) {
        const data = dummyData[pageKey];
        if (data) {
            contentTitle.textContent = data.title;
            contentBody.innerHTML = data.content;
            contentView.style.display = 'flex';
            closeMenu();
        }
    }
    function closeContentPage() { contentView.style.display = 'none'; }

    // --- View Switching & Profile Visits ---
    function showProfilePage(profileIndex) {
        const profile = allProfilesData[profileIndex];
        currentProfileId = profile.id;
        incrementProfileVisit(profile.id);
        document.getElementById('profile-img').src = profile.url;
        document.getElementById('profile-name').textContent = profile.name;
        document.getElementById('profile-desc').textContent = profile.description;
        document.getElementById('profile-mobile').textContent = `Contact: ${profile.mobile}`;
        document.getElementById('profile-long-desc').textContent = profile.longDescription;
        document.getElementById('profile-visits').textContent = `👁️ ${profile.visits || 0} Visits`;
        setupInteractiveStars(profile.rating.average);
        gridView.style.display = 'none';
        profileView.style.display = 'block';
        window.scrollTo(0, 0);
    }
    function showGridView() {
        profileView.style.display = 'none';
        gridView.style.display = 'block';
    }
    function incrementProfileVisit(profileId) {
        fetch(`${profilesApiUrl}/${profileId}/visit`, { method: 'POST' })
            .catch(error => console.error('Error sending visit update:', error));
    }

    // --- RATING LOGIC ---
    function setupInteractiveStars(currentRating) {
        const container = document.getElementById('profile-rating');
        const ratingData = allProfilesData.find(p => p.id === currentProfileId).rating;
        container.innerHTML = `(${ratingData.count} reviews)`;
        const starContainer = document.createElement('div');
        starContainer.className = 'interactive-stars';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span'); star.textContent = '★'; star.dataset.value = i; starContainer.appendChild(star);
        }
        container.prepend(starContainer);
        starContainer.addEventListener('mouseover', (e) => { if (e.target.tagName === 'SPAN') highlightStars(e.target.dataset.value); });
        starContainer.addEventListener('mouseout', () => { highlightStars(Math.round(currentRating)); });
        starContainer.addEventListener('click', (e) => { if (e.target.tagName === 'SPAN') submitRating(currentProfileId, e.target.dataset.value); });
        highlightStars(Math.round(currentRating));
    }
    function highlightStars(value) {
        document.querySelectorAll('.interactive-stars span').forEach((star, index) => { star.classList.toggle('lit', index < value); });
    }
    function submitRating(profileId, ratingValue) {
        fetch(`${profilesApiUrl}/${profileId}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: parseInt(ratingValue) })
        }).then(response => { if (response.ok) alert('Thank you for your rating!'); else alert('Error: Could not submit rating.'); })
        .catch(error => console.error('Error submitting rating:', error));
    }

    // --- BANNER SLIDESHOW LOGIC ---
    function fetchBanners() {
        fetch(bannerApiUrl).then(response => response.json()).then(data => {
            bannerImages = data;
            renderBanners();
            startSlideshow();
        }).catch(error => console.error('Error fetching banners:', error));
    }
    function renderBanners() {
        bannerContainer.innerHTML = '';
        bannerImages.forEach((banner, index) => {
            const img = document.createElement('img');
            img.src = banner.imageUrl;
            img.className = 'banner-slide';
            if (index === 0) img.classList.add('active');
            img.addEventListener('click', () => { imageModal.style.display = 'block'; modalImage.src = banner.imageUrl; });
            bannerContainer.appendChild(img);
        });
    }
    function startSlideshow() {
        setInterval(() => {
            const slides = document.querySelectorAll('.banner-slide');
            if (slides.length === 0) return;
            slides[currentBannerIndex].classList.remove('active');
            currentBannerIndex = (currentBannerIndex + 1) % slides.length;
            slides[currentBannerIndex].classList.add('active');
        }, 3000);
    }

    // --- Filtering and Suggestions Logic ---
    function filterProfiles() {
        const searchTerm = searchInput.value.toLowerCase();
        let matchesFound = 0;
        gridContainer.querySelectorAll('.profile-card').forEach((card, index) => {
            const profile = allProfilesData[index];
            const isMatch = profile.name.toLowerCase().includes(searchTerm) || profile.description.toLowerCase().includes(searchTerm);
            card.classList.toggle('hidden', !isMatch);
            if (isMatch) matchesFound++;
        });
        noMatchMessage.style.display = matchesFound > 0 ? 'none' : 'block';
        if (matchesFound === 1) { gridContainer.style.gridTemplateColumns = '300px'; gridContainer.style.justifyContent = 'center'; }
        else { gridContainer.style.gridTemplateColumns = ''; gridContainer.style.justifyContent = ''; }
    }
    function showSuggestions() {
        const searchTerm = searchInput.value.toLowerCase();
        suggestionsContainer.innerHTML = '';
        if (searchTerm.length === 0) { suggestionsContainer.style.display = 'none'; return; }
        const matchingProfiles = allProfilesData.filter(p => p.name.toLowerCase().startsWith(searchTerm));
        if (matchingProfiles.length > 0) {
            matchingProfiles.forEach(profile => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = profile.name;
                item.addEventListener('click', () => { searchInput.value = profile.name; suggestionsContainer.style.display = 'none'; filterProfiles(); });
                suggestionsContainer.appendChild(item);
            });
            suggestionsContainer.style.display = 'block';
        } else { suggestionsContainer.style.display = 'none'; }
    }

    // --- NOTIFICATION LOGIC ---
    function fetchNotifications() {
        fetch(notificationsApiUrl).then(response => response.json()).then(notifications => {
            notifications.sort((a, b) => b.timestamp - a.timestamp);
            const unreadCount = notifications.filter(n => !n.read).length;
            updateNotificationBadge(unreadCount);
            renderNotifications(notifications);
        }).catch(error => console.error('Error fetching notifications:', error));
    }
    function updateNotificationBadge(count) {
        notificationBadge.style.display = count > 0 ? 'block' : 'none';
        notificationBadge.textContent = count;
    }
    function renderNotifications(notifications) {
        notificationList.innerHTML = '';
        notifications.forEach(n => {
            const item = document.createElement('div');
            item.className = 'notification-item';
            if (!n.read) item.classList.add('unread');
            const date = new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
            item.innerHTML = `<h3>${n.title}</h3><p>${n.message}</p><small>${date}</small>`;
            notificationList.appendChild(item);
        });
    }

    // --- Main Fetch and Build Logic ---
    fetch(profilesApiUrl)
        .then(response => { if (!response.ok) throw new Error(`API Error: Server responded with status ${response.status}`); return response.json(); })
        .then(imageData => {
            allProfilesData = imageData;
            gridContainer.innerHTML = '';
            if (imageData.length === 0) { noMatchMessage.textContent = "No profiles found from API."; noMatchMessage.style.display = 'block'; return; }
            imageData.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'profile-card';
                // THE FIX IS HERE: The typo 'class.' has been corrected to 'class='
                card.innerHTML = `<div class="image-wrapper"><img src="${item.url}" alt="${item.name}"></div><div class="details-wrapper"><div class="person-name">${item.name}</div><div class="person-description">${item.description}</div></div>`;
                card.addEventListener('click', () => showProfilePage(index));
                gridContainer.appendChild(card);
            });
        }).catch(error => {
            console.error('Failed to fetch profiles:', error);
            noMatchMessage.textContent = `Error: Could not load profiles. Please ensure the backend server is running. (${error.message})`;
            noMatchMessage.style.display = 'block';
        });

    // --- Attach All Event Listeners ---
    backButton.addEventListener('click', showGridView);
    searchInput.addEventListener('input', () => { showSuggestions(); filterProfiles(); });
    notificationBellBtn.addEventListener('click', () => notificationView.style.display = 'flex');
    notificationBackBtn.addEventListener('click', () => notificationView.style.display = 'none');
    document.addEventListener('click', (event) => { if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) { suggestionsContainer.style.display = 'none'; } });
    menuToggleBtn.addEventListener('click', openMenu);
    menuCloseBtn.addEventListener('click', closeMenu);
    contentCloseBtn.addEventListener('click', closeContentPage);
    menuItems.forEach(item => { item.addEventListener('click', (e) => { e.preventDefault(); showContentPage(e.target.dataset.page); }); });
    modalCloseBtn.addEventListener('click', () => imageModal.style.display = 'none');

    // --- Initial Load ---
    fetchNotifications();
    fetchBanners();
});
*//*


// This function runs once the entire HTML document has been loaded and is ready.
document.addEventListener("DOMContentLoaded", function() {

    // --- Get ALL Element References ---
    const gridView = document.getElementById('grid-view');
    const profileView = document.getElementById('profile-view');
    const notificationView = document.getElementById('notification-view');
    const contentView = document.getElementById('content-view');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sliderMenu = document.getElementById('slider-menu');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const bannerContainer = document.getElementById('banner-container');
    const contentTitle = document.getElementById('content-title');
    const contentBody = document.getElementById('content-body');
    const contentCloseBtn = document.getElementById('content-close-btn');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const gridContainer = document.getElementById("profile-grid");
    const searchInput = document.getElementById("search-input");
    const noMatchMessage = document.getElementById("no-match-message");
    const suggestionsContainer = document.getElementById("suggestions-container");
    const backButton = document.getElementById('back-button');
    const notificationBellBtn = document.getElementById('notification-bell-button');
    const notificationBadge = document.getElementById('notification-badge');
    const notificationList = document.getElementById('notification-list');
    const notificationBackBtn = document.getElementById('notification-back-button');

    // API Endpoints
    const profilesApiUrl = 'http://localhost:8080/api/images';
    const notificationsApiUrl = 'http://localhost:8080/api/notifications';
    const bannerApiUrl = 'http://localhost:8080/api/banners';

    let allProfilesData = [];
    let currentProfileId = null;
    let bannerImages = [];
    let currentBannerIndex = 0;

    // --- SLIDER MENU & CONTENT PAGE LOGIC ---
    // (This section is correct and unchanged)

    // --- View Switching & Profile Visits ---
    function showProfilePage(profileIndex) {
        const profile = allProfilesData[profileIndex];
        if (!profile) return; // Defensive check
        currentProfileId = profile.id;
        incrementProfileVisit(profile.id);

        // Defensive population of elements
        document.getElementById('profile-img').src = profile.url || '';
        document.getElementById('profile-name').textContent = profile.name || 'No Name';
        document.getElementById('profile-desc').textContent = profile.description || 'No Description';
        document.getElementById('profile-mobile').textContent = `Contact: ${profile.mobile || 'N/A'}`;
        document.getElementById('profile-long-desc').textContent = profile.longDescription || '';
        document.getElementById('profile-visits').textContent = `👁️ ${profile.visits || 0} Visits`;

        // Check if rating object exists before using it
        if (profile.rating) {
            setupInteractiveStars(profile.rating.average);
        }

        gridView.style.display = 'none';
        profileView.style.display = 'block';
        window.scrollTo(0, 0);
    }

    // (All other functions are correct and unchanged, but included for completeness)
    function showGridView() { profileView.style.display = 'none'; gridView.style.display = 'block'; }
    function incrementProfileVisit(profileId) { fetch(`${profilesApiUrl}/${profileId}/visit`, { method: 'POST' }).catch(error => console.error('Error sending visit update:', error));}
    //--const dummyData = { about: { title: "About Us", content: "<p>We are a passionate team dedicated to creating amazing digital experiences.</p>" }, help: { title: "Help Center", content: "<p>Contact our support team at <b>support@example.com</b>.</p>" }, faq: { title: "FAQs", content: "<h4>How do I search?</h4><p>Use the search bar.</p>" }};----
    const dummyData = {
            about: { title: "About Us", content: "<p>We are a passionate team dedicated to creating amazing digital experiences. Our mission is to connect people through innovative technology and beautiful design.</p>" },
            help: { title: "Help Center", content: "<p>If you need assistance, please contact our support team at <b>support@example.com</b>.</p>" },
            faq: { title: "FAQs", content: "<h4>How do I search for a profile?</h4><p>Use the search bar to search by name or description.</p>" }
        };

    function openMenu() { sliderMenu.classList.add('open'); }
    function closeMenu() { sliderMenu.classList.remove('open'); }
    function showContentPage(pageKey) { const data = dummyData[pageKey]; if(data){ contentTitle.textContent = data.title; contentBody.innerHTML = data.content; contentView.style.display = 'flex'; closeMenu(); } }
    function closeContentPage() { contentView.style.display = 'none'; }

    function setupInteractiveStars(currentRating) { */
/* rating logic *//*

             const container = document.getElementById('profile-rating');
             const ratingData = allProfilesData.find(p => p.id === currentProfileId).rating;
             container.innerHTML = `(${ratingData.count} reviews)`;
             const starContainer = document.createElement('div');
             starContainer.className = 'interactive-stars';
             for (let i = 1; i <= 5; i++) {
                 const star = document.createElement('span'); star.textContent = '★'; star.dataset.value = i; starContainer.appendChild(star);
             }
             container.prepend(starContainer);
             starContainer.addEventListener('mouseover', (e) => { if (e.target.tagName === 'SPAN') highlightStars(e.target.dataset.value); });
             starContainer.addEventListener('mouseout', () => { highlightStars(Math.round(currentRating)); });
             starContainer.addEventListener('click', (e) => { if (e.target.tagName === 'SPAN') submitRating(currentProfileId, e.target.dataset.value); });
             highlightStars(Math.round(currentRating));
     }
    function highlightStars(value) { */
/* rating logic *//*

        document.querySelectorAll('.interactive-stars span').forEach((star, index) => { star.classList.toggle('lit', index < value); });
    }

    function submitRating(profileId, ratingValue) { */
/* rating logic *//*

        fetch(`${profilesApiUrl}/${profileId}/rate`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ rating: parseInt(ratingValue) })
                        }).then(response => { if (response.ok) alert('Thank you for your rating!'); else alert('Error: Could not submit rating.'); })
                        .catch(error => console.error('Error submitting rating:', error));
    }

    function fetchBanners() {
           fetch(bannerApiUrl).then(response => response.json()).then(data => {
               bannerImages = data;
               renderBanners();
               startSlideshow();
           }).catch(error => console.error('Error fetching banners:', error));
       }
       function renderBanners() {
           bannerContainer.innerHTML = '';
           bannerImages.forEach((banner, index) => {
               const img = document.createElement('img');
               img.src = banner.imageUrl;
               img.className = 'banner-slide';
               if (index === 0) img.classList.add('active');
               img.addEventListener('click', () => { imageModal.style.display = 'block'; modalImage.src = banner.imageUrl; });
               bannerContainer.appendChild(img);
           });
       }
       function startSlideshow() {
           setInterval(() => {
               const slides = document.querySelectorAll('.banner-slide');
               if (slides.length === 0) return;
               slides[currentBannerIndex].classList.remove('active');
               currentBannerIndex = (currentBannerIndex + 1) % slides.length;
               slides[currentBannerIndex].classList.add('active');
           }, 3000);
       }

       // --- Filtering and Suggestions Logic ---
       function filterProfiles() {
           const searchTerm = searchInput.value.toLowerCase();
           let matchesFound = 0;
           gridContainer.querySelectorAll('.profile-card').forEach((card, index) => {
               const profile = allProfilesData[index];
               const isMatch = profile.name.toLowerCase().includes(searchTerm) || profile.description.toLowerCase().includes(searchTerm);
               card.classList.toggle('hidden', !isMatch);
               if (isMatch) matchesFound++;
           });
           noMatchMessage.style.display = matchesFound > 0 ? 'none' : 'block';
           if (matchesFound === 1) { gridContainer.style.gridTemplateColumns = '300px'; gridContainer.style.justifyContent = 'center'; }
           else { gridContainer.style.gridTemplateColumns = ''; gridContainer.style.justifyContent = ''; }
       }
       function showSuggestions() {
           const searchTerm = searchInput.value.toLowerCase();
           suggestionsContainer.innerHTML = '';
           if (searchTerm.length === 0) { suggestionsContainer.style.display = 'none'; return; }
           const matchingProfiles = allProfilesData.filter(p => p.name.toLowerCase().startsWith(searchTerm));
           if (matchingProfiles.length > 0) {
               matchingProfiles.forEach(profile => {
                   const item = document.createElement('div');
                   item.className = 'suggestion-item';
                   item.textContent = profile.name;
                   item.addEventListener('click', () => { searchInput.value = profile.name; suggestionsContainer.style.display = 'none'; filterProfiles(); });
                   suggestionsContainer.appendChild(item);
               });
               suggestionsContainer.style.display = 'block';
           } else { suggestionsContainer.style.display = 'none'; }
       }

       // --- NOTIFICATION LOGIC ---
       function fetchNotifications() {
           fetch(notificationsApiUrl).then(response => response.json()).then(notifications => {
               notifications.sort((a, b) => b.timestamp - a.timestamp);
               const unreadCount = notifications.filter(n => !n.read).length;
               updateNotificationBadge(unreadCount);
               renderNotifications(notifications);
           }).catch(error => console.error('Error fetching notifications:', error));
       }
       function updateNotificationBadge(count) {
           notificationBadge.style.display = count > 0 ? 'block' : 'none';
           notificationBadge.textContent = count;
       }
       function renderNotifications(notifications) {
           notificationList.innerHTML = '';
           notifications.forEach(n => {
               const item = document.createElement('div');
               item.className = 'notification-item';
               if (!n.read) item.classList.add('unread');
               const date = new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
               item.innerHTML = `<h3>${n.title}</h3><p>${n.message}</p><small>${date}</small>`;
               notificationList.appendChild(item);
           });
       }

    // --- Main Fetch and Build Logic ---
    console.log("Starting to fetch profiles..."); // Log to confirm script is running

    */
/*fetch(profilesApiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`API Error: Server responded with status ${response.status}`);
            return response.json();
        })
        .then(imageData => {
            console.log("Successfully fetched profiles:", imageData); // Log the data we received
            allProfilesData = imageData;
            gridContainer.innerHTML = ''; // Clear any previous content
            if (!imageData || imageData.length === 0) {
                noMatchMessage.textContent = "No profiles were found from the API.";
                noMatchMessage.style.display = 'block';
                return;
            }

            // Loop through each profile and build the card
            imageData.forEach((item, index) => {
                // Defensive checks: use default values if data is missing
                const imageUrl = item.url || '';
                const name = item.name || 'Unnamed Profile';
                const description = item.description || 'No description available.';

                const card = document.createElement('div');
                card.className = 'profile-card';
                card.innerHTML = `<div class="image-wrapper"><img src="${imageUrl}" alt="${name}"></div><div class="details-wrapper"><div class="person-name">${name}</div><div class="person-description">${description}</div></div>`;

                // Only add the click event if the item is valid
                if(item && item.id) {
                    card.addEventListener('click', () => showProfilePage(index));
                }

                gridContainer.appendChild(card);
            });
        }).catch(error => {
            console.error('CRITICAL ERROR - Failed to fetch profiles:', error);
            noMatchMessage.textContent = `Error: Could not load profiles. Please ensure the backend server is running and check the console for details. (${error.message})`;
            noMatchMessage.style.display = 'block';
        });*//*


        // --- Main Fetch and Build Logic ---
        fetch(profilesApiUrl)
            // Step 1: Send a request to the backend API to get the profile data.
            .then(response => {
                // Check if the server responded successfully (e.g., status 200 OK).
                if (!response.ok) throw new Error(`API Error: Server responded with status ${response.status}`);
                // Convert the raw response into usable JSON data.
                return response.json();
            })
            // Step 2: This block runs only if the fetch was successful.
            .then(imageData => {
                // Store the fetched data in our global variable for other functions (like search) to use.
                allProfilesData = imageData;
                // Clear any old content from the grid container.
                gridContainer.innerHTML = '';
                // If the API returned no profiles, show a message and stop.
                if (imageData.length === 0) {
                    noMatchMessage.textContent = "No profiles found from API.";
                    noMatchMessage.style.display = 'block';
                    return;
                }
                // Loop through each profile object in the imageData array.
                imageData.forEach((item, index) => {
                    // Create a new <div> element for the card.
                    const card = document.createElement('div');
                    // Add the 'profile-card' class for styling.
                    card.className = 'profile-card';
                    // **THE FIX IS HERE**: This line now has the correct class attribute for the person's description.
                    card.innerHTML = `<div class="image-wrapper"><img src="${item.url}" alt="${item.name}"></div><div class="details-wrapper"><div class="person-name">${item.name}</div><div class="person-description">${item.description}</div></div>`;
                    // Add a click listener to the card that opens the detailed profile view.
                    card.addEventListener('click', () => showProfilePage(index));
                    // Add the newly created card to the grid on the webpage.
                    gridContainer.appendChild(card);
                });
            // Step 3: This block runs if the fetch failed (e.g., backend is down).
            }).catch(error => {
                // Log the detailed error to the browser's developer console for debugging.
                console.error('Failed to fetch profiles:', error);
                // Display a user-friendly error message on the page.
                noMatchMessage.textContent = `Error: Could not load profiles. Please ensure the backend server is running. (${error.message})`;
                noMatchMessage.style.display = 'block';
            });

    // --- Attach All Event Listeners ---
    backButton.addEventListener('click', showGridView);
    searchInput.addEventListener('input', () => { showSuggestions(); filterProfiles(); });
    notificationBellBtn.addEventListener('click', () => notificationView.style.display = 'flex');
    notificationBackBtn.addEventListener('click', () => notificationView.style.display = 'none');
    document.addEventListener('click', (event) => { if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) { suggestionsContainer.style.display = 'none'; } });
    menuToggleBtn.addEventListener('click', openMenu);
    menuCloseBtn.addEventListener('click', closeMenu);
    contentCloseBtn.addEventListener('click', closeContentPage);
    menuItems.forEach(item => { item.addEventListener('click', (e) => { e.preventDefault(); showContentPage(e.target.dataset.page); }); });
    modalCloseBtn.addEventListener('click', () => imageModal.style.display = 'none');

    // --- Initial Load ---
    fetchNotifications();
    fetchBanners();
});*/


// This function runs once the entire HTML document has been loaded and is ready.
document.addEventListener("DOMContentLoaded", function() {

    // --- Get ALL Element References ---
    // This section gets references to all the HTML elements we need to interact with.

    // Main page views
    const gridView = document.getElementById('grid-view'); // The main view with the search bar and profile grid
    const profileView = document.getElementById('profile-view'); // The hidden view for a single profile's details
    const notificationView = document.getElementById('notification-view'); // The hidden view for the notification list
    const contentView = document.getElementById('content-view'); // The hidden view for content like "About Us"

    // Menu & Banner elements
    const menuToggleBtn = document.getElementById('menu-toggle-btn'); // The hamburger icon (☰) to open the menu
    const sliderMenu = document.getElementById('slider-menu'); // The slide-out menu itself
    const menuCloseBtn = document.getElementById('menu-close-btn'); // The '×' button to close the menu
    const menuItems = document.querySelectorAll('.menu-item'); // All the links inside the menu (About, Help, etc.)
    const bannerContainer = document.getElementById('banner-container'); // The container for the image slideshow

    // Content & Modal elements
    const contentTitle = document.getElementById('content-title'); // The title in the content popup (e.g., "About Us")
    const contentBody = document.getElementById('content-body'); // The main text area in the content popup
    const contentCloseBtn = document.getElementById('content-close-btn'); // The '×' button to close the content popup
    const imageModal = document.getElementById('image-modal'); // The hidden black overlay for the full-screen image
    const modalImage = document.getElementById('modal-image'); // The <img> tag inside the modal
    const modalCloseBtn = document.querySelector('.modal-close-btn'); // The '×' button to close the full-screen image

    // Grid and Search elements
    const gridContainer = document.getElementById("profile-grid"); // The container where all profile cards will be placed
    const searchInput = document.getElementById("search-input"); // The search bar input field
    const noMatchMessage = document.getElementById("no-match-message"); // The paragraph that shows "No match found" or errors
    const suggestionsContainer = document.getElementById("suggestions-container"); // The dropdown for search suggestions
    const backButton = document.getElementById('back-button'); // The "Back to Profiles" button on the profile detail page

    // Notification elements
    const notificationBellBtn = document.getElementById('notification-bell-button'); // The bell icon (🔔)
    const notificationBadge = document.getElementById('notification-badge'); // The red circle with the unread count
    const notificationList = document.getElementById('notification-list'); // The container for the list of notifications
    const notificationBackBtn = document.getElementById('notification-back-button'); // The '×' button to close the notification panel

    // API Endpoints - The URLs for our backend services
    const profilesApiUrl = 'http://localhost:8080/api/images';
    const notificationsApiUrl = 'http://localhost:8080/api/notifications';
    const bannerApiUrl = 'http://localhost:8080/api/banners';

    // Global variables to store data fetched from the API
    let allProfilesData = []; // Will hold the array of all 20 profile objects
    let currentProfileId = null; // Will store the ID of the profile being viewed (e.g., "image1")
    let bannerImages = []; // Will hold the array of banner image objects
    let currentBannerIndex = 0; // Tracks the currently visible banner slide

    // --- SLIDER MENU & CONTENT PAGE LOGIC ---
    // Dummy data for the menu pages
    const dummyData = {
        about: { title: "About Us", content: "<p>We are a passionate team dedicated to creating amazing digital experiences. Our mission is to connect people through innovative technology and beautiful design.</p>" },
        help: { title: "Help Center", content: "<p>If you need assistance, please contact our support team at <b>support@example.com</b>.</p>" },
        faq: { title: "FAQs", content: "<h4>How do I search for a profile?</h4><p>Use the search bar to search by name or description.</p>" }
    };
    function openMenu() { sliderMenu.classList.add('open'); } // Adds the 'open' class to slide the menu into view
    function closeMenu() { sliderMenu.classList.remove('open'); } // Removes the 'open' class to hide the menu
    function showContentPage(pageKey) { // Shows the content popup based on the link clicked (e.g., "about")
        const data = dummyData[pageKey]; // Gets the correct title and content from dummyData
        if (data) {
            contentTitle.textContent = data.title; // Sets the title of the popup
            contentBody.innerHTML = data.content; // Sets the HTML content of the popup
            contentView.style.display = 'flex'; // Makes the popup visible
            closeMenu(); // Closes the side menu
        }
    }
    function closeContentPage() { contentView.style.display = 'none'; } // Hides the content popup

    // --- View Switching & Profile Visits ---
    function showProfilePage(profileIndex) { // Function to show the detailed profile view
        const profile = allProfilesData[profileIndex]; // Get the specific profile object from our data array
        currentProfileId = profile.id; // Store the ID of this profile for rating and visits
        incrementProfileVisit(profile.id); // Call the function to tell the backend this profile was visited
        // Populate the HTML elements with the data from the profile object
        document.getElementById('profile-img').src = profile.url;
        document.getElementById('profile-name').textContent = profile.name;
        document.getElementById('profile-desc').textContent = profile.description;
        document.getElementById('profile-mobile').textContent = `Contact: ${profile.mobile}`;
        document.getElementById('profile-long-desc').textContent = profile.longDescription;
        document.getElementById('profile-visits').textContent = `👁️ ${profile.visits || 0} Visits`;
        setupInteractiveStars(profile.rating.average); // Set up the clickable rating stars
        gridView.style.display = 'none'; // Hide the main grid view
        profileView.style.display = 'block'; // Show the profile detail view
        window.scrollTo(0, 0); // Scroll to the top of the page
    }
    function showGridView() { // Hides the profile detail view and shows the main grid view
        profileView.style.display = 'none';
        gridView.style.display = 'block';
    }
    function incrementProfileVisit(profileId) { // Sends a request to the backend to increment the visit count
        fetch(`${profilesApiUrl}/${profileId}/visit`, { method: 'POST' })
            .catch(error => console.error('Error sending visit update:', error));
    }

    // --- RATING LOGIC ---
    function setupInteractiveStars(currentRating) { // Creates the interactive rating stars
        const container = document.getElementById('profile-rating');
        const ratingData = allProfilesData.find(p => p.id === currentProfileId).rating; // Find the rating data for the current profile
        container.innerHTML = `(${ratingData.count} reviews)`; // Display the review count
        const starContainer = document.createElement('div'); // Create a container for the stars
        starContainer.className = 'interactive-stars';
        for (let i = 1; i <= 5; i++) { // Create 5 star spans
            const star = document.createElement('span'); star.textContent = '★'; star.dataset.value = i; starContainer.appendChild(star);
        }
        container.prepend(starContainer); // Add the stars before the review count text
        // Add event listeners for hover and click actions on the stars
        starContainer.addEventListener('mouseover', (e) => { if (e.target.tagName === 'SPAN') highlightStars(e.target.dataset.value); });
        starContainer.addEventListener('mouseout', () => { highlightStars(Math.round(currentRating)); });
        starContainer.addEventListener('click', (e) => { if (e.target.tagName === 'SPAN') submitRating(currentProfileId, e.target.dataset.value); });
        highlightStars(Math.round(currentRating)); // Initially light up the correct number of stars
    }
    function highlightStars(value) { // Fills stars up to the given value
        document.querySelectorAll('.interactive-stars span').forEach((star, index) => { star.classList.toggle('lit', index < value); });
    }
    function submitRating(profileId, ratingValue) { // Sends the new rating to the backend API
        fetch(`${profilesApiUrl}/${profileId}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: parseInt(ratingValue) })
        }).then(response => { if (response.ok) alert('Thank you for your rating!'); else alert('Error: Could not submit rating.'); })
        .catch(error => console.error('Error submitting rating:', error));
    }

    // --- BANNER SLIDESHOW LOGIC ---
    function fetchBanners() { // Gets banner image URLs from the banner API
        fetch(bannerApiUrl).then(response => response.json()).then(data => {
            bannerImages = data; // Store the banner data
            renderBanners(); // Create the banner HTML elements
            startSlideshow(); // Start the automatic rotation
        }).catch(error => console.error('Error fetching banners:', error));
    }

    function renderBanners() { // Creates the <img> tags for the banner
        bannerContainer.innerHTML = '';
        bannerImages.forEach((banner, index) => {
            const img = document.createElement('img');
            img.src = banner.imageUrl;
            img.className = 'banner-slide';
            if (index === 0) img.classList.add('active'); // Make the first one visible
            //img.addEventListener('click', () => { imageModal.style.display = 'block'; modalImage.src = banner.imageUrl; });
            bannerContainer.appendChild(img);
        });
    }
    function startSlideshow() { // Rotates the 'active' class every 3 seconds
        setInterval(() => {
            const slides = document.querySelectorAll('.banner-slide');
            if (slides.length === 0) return;
            slides[currentBannerIndex].classList.remove('active');
            currentBannerIndex = (currentBannerIndex + 1) % slides.length; // Loop back to the beginning
            slides[currentBannerIndex].classList.add('active');
        }, 3000);
    }

    // --- Filtering and Suggestions Logic ---
    function filterProfiles() { // Hides or shows profile cards based on search input
        const searchTerm = searchInput.value.toLowerCase();
        let matchesFound = 0;
        gridContainer.querySelectorAll('.profile-card').forEach((card, index) => {
            const profile = allProfilesData[index];
            const isMatch = profile.name.toLowerCase().includes(searchTerm) || profile.description.toLowerCase().includes(searchTerm);
            card.classList.toggle('hidden', !isMatch); // 'toggle' adds 'hidden' if not a match, removes it if it is
            if (isMatch) matchesFound++;
        });
        noMatchMessage.style.display = matchesFound > 0 ? 'none' : 'block'; // Show "no match" message if needed
        // Fix for single search result looking too wide
        if (matchesFound === 1) { gridContainer.style.gridTemplateColumns = '300px'; gridContainer.style.justifyContent = 'center'; }
        else { gridContainer.style.gridTemplateColumns = ''; gridContainer.style.justifyContent = ''; }
    }
    function showSuggestions() { // Shows the autocomplete dropdown as the user types
        const searchTerm = searchInput.value.toLowerCase();
        suggestionsContainer.innerHTML = '';
        if (searchTerm.length === 0) { suggestionsContainer.style.display = 'none'; return; }
        const matchingProfiles = allProfilesData.filter(p => p.name.toLowerCase().startsWith(searchTerm));
        if (matchingProfiles.length > 0) {
            matchingProfiles.forEach(profile => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = profile.name;
                item.addEventListener('click', () => { searchInput.value = profile.name; suggestionsContainer.style.display = 'none'; filterProfiles(); });
                suggestionsContainer.appendChild(item);
            });
            suggestionsContainer.style.display = 'block';
        } else { suggestionsContainer.style.display = 'none'; }
    }

    // --- NOTIFICATION LOGIC ---
    function fetchNotifications() { // Gets notification data from the notification API
        fetch(notificationsApiUrl).then(response => response.json()).then(notifications => {
            notifications.sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
            const unreadCount = notifications.filter(n => !n.read).length; // Count unread items
            updateNotificationBadge(unreadCount); // Update the red badge
            renderNotifications(notifications); // Display the list
        }).catch(error => console.error('Error fetching notifications:', error));
    }
    function updateNotificationBadge(count) {
        notificationBadge.style.display = count > 0 ? 'block' : 'none';
        notificationBadge.textContent = count;
    }
    function renderNotifications(notifications) {
        notificationList.innerHTML = '';
        notifications.forEach(n => {
            const item = document.createElement('div');
            item.className = 'notification-item';
            if (!n.read) item.classList.add('unread');
            const date = new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
            item.innerHTML = `<h3>${n.title}</h3><p>${n.message}</p><small>${date}</small>`;
            notificationList.appendChild(item);
        });
    }

    // --- Main Fetch and Build Logic ---
    // This is the first thing that runs to get the profile data and build the grid
    fetch(profilesApiUrl)
        .then(response => { if (!response.ok) throw new Error(`API Error: Server responded with status ${response.status}`); return response.json(); })
        .then(imageData => {
            allProfilesData = imageData; // Store the fetched data in our global variable
            gridContainer.innerHTML = ''; // Clear any previous content
            if (imageData.length === 0) { noMatchMessage.textContent = "No profiles found from API."; noMatchMessage.style.display = 'block'; return; }
            // Loop through each profile object in the imageData array
            imageData.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'profile-card';
                // This line creates the HTML for each card, with the correct classes for styling.
                card.innerHTML = `<div class="image-wrapper"><img src="${item.url}" alt="${item.name}"></div><div class="details-wrapper"><div class="person-name">${item.name}</div><div class="person-description">${item.description}</div></div>`;
                card.addEventListener('click', () => showProfilePage(index));
                gridContainer.appendChild(card);
            });
        }).catch(error => { // This runs if the fetch fails (e.g., backend is not running)
            console.error('Failed to fetch profiles:', error);
            // Display a user-friendly error message on the page.
            noMatchMessage.textContent = `Error: Could not load profiles. Please ensure the backend server is running. (${error.message})`;
            noMatchMessage.style.display = 'block';
        });

    // --- Attach All Event Listeners ---
    // This section connects all our functions to the buttons and inputs
    backButton.addEventListener('click', showGridView);
    searchInput.addEventListener('input', () => { showSuggestions(); filterProfiles(); });
    notificationBellBtn.addEventListener('click', () => notificationView.style.display = 'flex');
    notificationBackBtn.addEventListener('click', () => notificationView.style.display = 'none');
    document.addEventListener('click', (event) => { if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) { suggestionsContainer.style.display = 'none'; } });
    menuToggleBtn.addEventListener('click', openMenu);
    menuCloseBtn.addEventListener('click', closeMenu);
    contentCloseBtn.addEventListener('click', closeContentPage);
    menuItems.forEach(item => { item.addEventListener('click', (e) => { e.preventDefault(); showContentPage(e.target.dataset.page); }); });
    modalCloseBtn.addEventListener('click', () => imageModal.style.display = 'none');

    // --- Initial Load ---
    // These functions run once when the page first loads
    fetchNotifications();
    fetchBanners();
});
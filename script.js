// script.js - Fixed version with proper image saving and CFA currency


// Add this at the beginning of your script.js file
// Check if we're on index.html or admin.html and initialize accordingly
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS classes that might be missing
    addDynamicStyles();
    
    // Check if user is already logged in
    if (localStorage.getItem('currentUser')) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (window.location.pathname.includes('admin.html')) {
            showAdminDashboard();
        } else {
            showLoginButton();
        }
    } else {
        showLoginButton();
    }

    // Load initial data if empty
    if (folders.length === 0) {
        loadSampleData();
    }

    // Set up event listeners
    setupEventListeners();

    // Show home page by default (only on index.html)
    if (!window.location.pathname.includes('admin.html')) {
        showHomePage();
    }
});

// Function to add dynamic styles that might be missing
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Dynamic styles for the main site */
        .folders-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 25px;
            margin-top: 2rem;
        }
        
        .folder-card {
            background: white;
            border-radius: 25px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(67, 97, 238, 0.15);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-align: center;
            cursor: pointer;
            border: none;
            position: relative;
            overflow: hidden;
        }
        
        .folder-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
        }
        
        .folder-card:hover {
            transform: translateY(-10px) scale(1.03);
            box-shadow: 0 20px 40px rgba(67, 97, 238, 0.25);
        }
        
        .folder-image i {
            font-size: 4rem;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            transition: all 0.3s ease;
        }
        
        .folder-card:hover .folder-image i {
            transform: scale(1.2) rotate(5deg);
        }
        
        .folder-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0.5rem 0;
            color: #212529;
        }
        
        .folder-count {
            color: #666;
            font-size: 1rem;
            margin: 0;
        }
        
        .pictures-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 25px;
        }
        
        .picture-card {
            background: white;
            border-radius: 25px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(67, 97, 238, 0.15);
            transition: all 0.4s ease;
        }
        
        .picture-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(67, 97, 238, 0.25);
        }
        
        .picture-image {
            height: 200px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
        }
        
        .picture-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        
        .picture-card:hover .picture-image img {
            transform: scale(1.1);
        }
        
        .picture-image i {
            font-size: 4rem;
            color: #dee2e6;
        }
        
        .picture-info {
            padding: 1.5rem;
        }
        
        .picture-title {
            font-size: 1.3rem;
            font-weight: 700;
            margin: 0 0 0.5rem 0;
            color: #212529;
        }
        
        .picture-description {
            color: #666;
            line-height: 1.5;
            margin: 0 0 1rem 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .picture-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .picture-price {
            font-size: 1.2rem;
            font-weight: 700;
            color: #4361ee;
        }
        
        .section-title {
            background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            display: inline-block;
            font-weight: 800;
            font-size: 2.5rem;
            margin-bottom: 2rem;
        }
        
        .hero {
            background: linear-gradient(135deg, rgba(67, 97, 238, 0.1) 0%, rgba(58, 12, 163, 0.1) 100%);
            padding: 5rem 0;
            text-align: center;
            border-radius: 0 0 50px 50px;
        }
        
        .hero h2 {
            font-size: 3rem;
            font-weight: 800;
            color: #212529;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.2rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto 2rem auto;
            line-height: 1.6;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            padding: 0.5rem 1rem;
            border-radius: 50px;
        }
        
        .nav-links a.active {
            background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
            color: white;
        }
        
        .nav-links a:hover:not(.active) {
            background: rgba(67, 97, 238, 0.1);
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .logo i {
            font-size: 2rem;
            color: #4361ee;
        }
        
        .logo h1 {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0;
            color: #212529;
        }
        
        .btn {
            padding: 0.8rem 1.8rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
            color: white;
            box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(67, 97, 238, 0.4);
        }
        
        .btn-secondary {
            background: rgba(67, 97, 238, 0.1);
            color: #4361ee;
            border: 2px solid #4361ee;
        }
        
        .btn-secondary:hover {
            background: #4361ee;
            color: white;
        }
    `;
    document.head.appendChild(style);
}


// Global variables
let currentUser = null;
let folders = JSON.parse(localStorage.getItem('folders')) || [];
let pictures = JSON.parse(localStorage.getItem('pictures')) || [];
let currentFolderId = null;

// CFA Format function
function formatCFA(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount).replace('XOF', 'CFA');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (localStorage.getItem('currentUser')) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (window.location.pathname.includes('admin.html')) {
            showAdminDashboard();
        } else {
            showLoginButton();
        }
    } else {
        showLoginButton();
    }

    // Load initial data if empty
    if (folders.length === 0) {
        loadSampleData();
    }

    // Set up event listeners
    setupEventListeners();

    // Show home page by default
    if (!window.location.pathname.includes('admin.html')) {
        showHomePage();
    }
});

// Updated loadSampleData function
function loadSampleData() {
    // Start with just one empty folder
    folders = [
        {
            id: 1,
            title: "My Pictures",
            image: "fas fa-folder",
            pictureCount: 0
        }
    ];

    // Start with empty pictures array
    pictures = [];

    saveToLocalStorage();
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation links
    document.getElementById('home-link')?.addEventListener('click', showHomePage);
    document.getElementById('gallery-link')?.addEventListener('click', showGalleryPage);
    document.getElementById('about-link')?.addEventListener('click', showAboutPage);
    document.getElementById('contact-link')?.addEventListener('click', showContactPage);

    // Buttons
    document.getElementById('explore-btn')?.addEventListener('click', showGalleryPage);
    document.getElementById('login-btn')?.addEventListener('click', showLoginModal);
    document.getElementById('back-to-folders')?.addEventListener('click', showFoldersView);

    // Modal close buttons
    const closeModalBtn = document.getElementById('close-modal');
    const closeLoginModalBtn = document.getElementById('close-login-modal');
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', closePictureModal);
    if (closeLoginModalBtn) closeLoginModalBtn.addEventListener('click', closeLoginModal);

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const pictureModal = document.getElementById('picture-modal');
        const loginModal = document.getElementById('login-modal');

        if (event.target === pictureModal) {
            closePictureModal();
        }

        if (event.target === loginModal) {
            closeLoginModal();
        }
    });
}

// Show home page
function showHomePage() {
    setActiveNav('home-link');
    document.getElementById('home-section').style.display = 'block';
    document.getElementById('gallery-section').style.display = 'none';
    document.getElementById('about-section').style.display = 'none';
    document.getElementById('contact-section').style.display = 'none';
    showFoldersView();
    renderFolders();
}

// Show gallery page
function showGalleryPage() {
    setActiveNav('gallery-link');
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('gallery-section').style.display = 'block';
    document.getElementById('about-section').style.display = 'none';
    document.getElementById('contact-section').style.display = 'none';
    renderFolders();
}

// Show about page
function showAboutPage() {
    setActiveNav('about-link');
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('gallery-section').style.display = 'none';
    document.getElementById('about-section').style.display = 'block';
    document.getElementById('contact-section').style.display = 'none';
}

// Show contact page
function showContactPage() {
    setActiveNav('contact-link');
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('gallery-section').style.display = 'none';
    document.getElementById('about-section').style.display = 'none';
    document.getElementById('contact-section').style.display = 'block';
}

// Set active navigation link
function setActiveNav(activeId) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => link.classList.remove('active'));

    // Add active class to clicked link
    const activeLink = document.getElementById(activeId);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Render folders to the page
function renderFolders() {
    const foldersContainer = document.getElementById('folders-container');
    if (!foldersContainer) return;

    // Load current data
    folders = JSON.parse(localStorage.getItem('folders')) || [];

    foldersContainer.innerHTML = '';

    if (folders.length === 0) {
        foldersContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-folder-open" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No folders yet</h3>
                <p>Login as admin to create folders and add pictures.</p>
            </div>
        `;
        return;
    }

    folders.forEach(folder => {
        const folderCard = document.createElement('div');
        folderCard.className = 'folder-card';
        folderCard.innerHTML = `
            <div class="folder-image">
                <i class="${folder.image}"></i>
            </div>
            <div class="folder-info">
                <h3 class="folder-title">${folder.title}</h3>
                <p class="folder-count">${folder.pictureCount || 0} pictures</p>
            </div>
        `;

        folderCard.addEventListener('click', () => openFolder(folder.id));
        foldersContainer.appendChild(folderCard);
    });
}

// Open folder and show its pictures
function openFolder(folderId) {
    currentFolderId = folderId;
    folders = JSON.parse(localStorage.getItem('folders')) || [];
    const folder = folders.find(f => f.id === folderId);

    if (!folder) return;

    // Update folder name display
    const folderNameDisplay = document.getElementById('folder-name-display');
    if (folderNameDisplay) folderNameDisplay.textContent = folder.title;

    // Show pictures section, hide folders
    const foldersContainer = document.getElementById('folders-container');
    const picturesSection = document.getElementById('pictures-section');
    
    if (foldersContainer) foldersContainer.style.display = 'none';
    if (picturesSection) picturesSection.style.display = 'block';

    // Render pictures for this folder
    renderPictures(folderId);
}

// FIXED: Render pictures for a specific folder
function renderPictures(folderId) {
    const picturesGrid = document.getElementById('pictures-grid');
    if (!picturesGrid) return;

    pictures = JSON.parse(localStorage.getItem('pictures')) || [];
    const folderPictures = pictures.filter(p => p.folderId === folderId);

    picturesGrid.innerHTML = '';

    if (folderPictures.length === 0) {
        picturesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-image" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No pictures in this folder</h3>
                <p>Login as admin to add pictures to this folder.</p>
            </div>
        `;
        return;
    }

    folderPictures.forEach(picture => {
        const pictureCard = document.createElement('div');
        pictureCard.className = 'picture-card';

        // Check if picture has actual image data
        const hasImage = picture.image && picture.image.startsWith('data:image');

        pictureCard.innerHTML = `
            <div class="picture-image">
                ${hasImage ? 
                    `<img src="${picture.image}" alt="${picture.title}" loading="lazy">` : 
                    `<i class="fas fa-image"></i>`
                }
            </div>
            <div class="picture-info">
                <h3 class="picture-title">${picture.title}</h3>
                <p class="picture-description">${picture.description}</p>
                <div class="picture-footer">
                    <div class="picture-price">${formatCFA(picture.price)}</div>
                    <button class="btn btn-primary view-picture-btn" data-id="${picture.id}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        `;

        picturesGrid.appendChild(pictureCard);

        // Add event listener to the button
        const viewBtn = pictureCard.querySelector('.view-picture-btn');
        viewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const pictureId = parseInt(this.getAttribute('data-id'));
            openPictureModal(pictureId);
        });
    });
}

// Show folders view (hide pictures)
function showFoldersView() {
    const foldersContainer = document.getElementById('folders-container');
    const picturesSection = document.getElementById('pictures-section');

    if (foldersContainer) foldersContainer.style.display = 'grid';
    if (picturesSection) picturesSection.style.display = 'none';
}

// Open picture modal with details
function openPictureModal(pictureId) {
    pictures = JSON.parse(localStorage.getItem('pictures')) || [];
    const picture = pictures.find(p => p.id === pictureId);
    if (!picture) return;

    // Update modal content
    document.getElementById('modal-picture-title').textContent = picture.title;
    document.getElementById('modal-picture-description').textContent = picture.description;
    document.getElementById('modal-picture-price').textContent = formatCFA(picture.price);

    // Update modal image
    const modalImage = document.getElementById('modal-picture-image');
    if (modalImage) {
        if (picture.image && picture.image.startsWith('data:image')) {
            modalImage.src = picture.image;
            modalImage.style.display = 'block';
        } else {
            modalImage.style.display = 'none';
        }
    }

    // Set up buy button
    const buyBtn = document.getElementById('buy-btn');
    if (buyBtn) {
        const whatsappMessage = `Hello, I would like to buy "${picture.title}" from Marwana Bin Mano. Price: ${formatCFA(picture.price)}.`;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        buyBtn.onclick = () => {
            window.open(`https://wa.me/12345678900?text=${encodedMessage}`, '_blank');
        };
    }

    // Show modal
    const pictureModal = document.getElementById('picture-modal');
    if (pictureModal) pictureModal.style.display = 'flex';
}

// Close picture modal
function closePictureModal() {
    const pictureModal = document.getElementById('picture-modal');
    if (pictureModal) pictureModal.style.display = 'none';
}

// Show login modal
function showLoginModal() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) loginModal.style.display = 'flex';
}

// Close login modal
function closeLoginModal() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) loginModal.style.display = 'none';
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple authentication
    if (username === 'admin' && password === 'password123') {
        currentUser = {
            username: username,
            isAdmin: true
        };

        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Close modal
        closeLoginModal();

        // Update button
        showLogoutButton();

        // Redirect to admin page if not already there
        if (!window.location.pathname.includes('admin.html')) {
            window.location.href = 'admin.html';
        } else {
            // If already on admin page, reload dashboard
            showAdminDashboard();
        }
    } else {
        alert('Invalid username or password. Try admin/password123');
    }
}

// Show login button (when not logged in)
function showLoginButton() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-user-shield"></i> Admin Login';
        loginBtn.onclick = showLoginModal;
    }
}

// Show logout button (when logged in)
function showLogoutButton() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        loginBtn.onclick = logout;
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showLoginButton();

        // If on admin page, redirect to home
        if (window.location.pathname.includes('admin.html')) {
            window.location.href = 'index.html';
        }
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('folders', JSON.stringify(folders));
    localStorage.setItem('pictures', JSON.stringify(pictures));
}

// ============ ADMIN DASHBOARD FUNCTIONS ============

// Show admin dashboard
function showAdminDashboard() {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        currentUser = JSON.parse(storedUser);
    } catch (e) {
        window.location.href = 'index.html';
        return;
    }

    // Set up admin page event listeners
    setupAdminEventListeners();

    // Show dashboard by default
    showDashboardSection('dashboard');

    // Load stats and data
    updateAdminStats();
    loadFoldersTable();
    loadPicturesTable();
    
    // Show logout button
    showLogoutButton();
}

function setupAdminEventListeners() {
    // Admin navigation
    const dashboardLink = document.getElementById('dashboard-link');
    const foldersLink = document.getElementById('folders-link');
    const picturesLink = document.getElementById('pictures-link');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (dashboardLink) dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        showDashboardSection('dashboard');
    });
    
    if (foldersLink) foldersLink.addEventListener('click', (e) => {
        e.preventDefault();
        showDashboardSection('folders');
    });
    
    if (picturesLink) picturesLink.addEventListener('click', (e) => {
        e.preventDefault();
        showDashboardSection('pictures');
    });
    
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // Action buttons
    const addFolderBtn = document.getElementById('add-folder-btn');
    const addPictureBtn = document.getElementById('add-picture-btn');
    
    if (addFolderBtn) addFolderBtn.addEventListener('click', showAddFolderForm);
    if (addPictureBtn) addPictureBtn.addEventListener('click', showAddPictureForm);

    // Form submissions
    const folderForm = document.getElementById('folder-form');
    const pictureForm = document.getElementById('picture-form');
    
    if (folderForm) folderForm.addEventListener('submit', handleFolderSubmit);
    if (pictureForm) pictureForm.addEventListener('submit', handlePictureSubmit);

    // File upload preview
    const fileInput = document.getElementById('picture-file');
    const preview = document.getElementById('image-preview');

    if (fileInput && preview) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (10MB limit)
                if (file.size > 10 * 1024 * 1024) {
                    alert('File is too large. Maximum size is 10MB.');
                    this.value = '';
                    preview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Tap here or click to select image</p>';
                    return;
                }

                // Validate file type
                if (!file.type.match('image.*')) {
                    alert('Please select an image file (JPG, PNG, GIF).');
                    this.value = '';
                    preview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Tap here or click to select image</p>';
                    return;
                }

                // Create preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 10px;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function showDashboardSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Update active nav
    const navLinks = document.querySelectorAll('.admin-nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.getElementById(`${sectionId}-link`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function updateAdminStats() {
    // Load fresh data
    folders = JSON.parse(localStorage.getItem('folders')) || [];
    pictures = JSON.parse(localStorage.getItem('pictures')) || [];

    const totalFolders = folders.length;
    const totalPictures = pictures.length;
    const totalValue = pictures.reduce((sum, picture) => sum + (picture.price || 0), 0);

    const totalFoldersEl = document.getElementById('total-folders');
    const totalPicturesEl = document.getElementById('total-pictures');
    const totalValueEl = document.getElementById('total-value');
    
    if (totalFoldersEl) totalFoldersEl.textContent = totalFolders;
    if (totalPicturesEl) totalPicturesEl.textContent = totalPictures;
    if (totalValueEl) totalValueEl.textContent = formatCFA(totalValue);
}

function loadFoldersTable() {
    // Load fresh data
    folders = JSON.parse(localStorage.getItem('folders')) || [];

    const foldersTable = document.getElementById('folders-table');
    if (!foldersTable) return;

    foldersTable.innerHTML = '';

    if (folders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4" style="text-align: center; padding: 3rem; color: #999;">No folders created yet. Click "Add New Folder" to get started.</td>`;
        foldersTable.appendChild(row);
        return;
    }

    folders.forEach(folder => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${folder.id}</td>
            <td><i class="${folder.image || 'fas fa-folder'}"></i> ${folder.title}</td>
            <td>${folder.pictureCount || 0}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-sm edit-folder-btn" data-id="${folder.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-folder-btn" data-id="${folder.id}">Delete</button>
                </div>
            </td>
        `;
        foldersTable.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.edit-folder-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const folderId = parseInt(this.getAttribute('data-id'));
            editFolder(folderId);
        });
    });

    document.querySelectorAll('.delete-folder-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const folderId = parseInt(this.getAttribute('data-id'));
            deleteFolder(folderId);
        });
    });
}

function loadPicturesTable() {
    // Load fresh data
    pictures = JSON.parse(localStorage.getItem('pictures')) || [];
    folders = JSON.parse(localStorage.getItem('folders')) || [];

    const picturesTable = document.getElementById('pictures-table');
    if (!picturesTable) return;

    picturesTable.innerHTML = '';

    if (pictures.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" style="text-align: center; padding: 3rem; color: #999;">No pictures added yet. Click "Add New Picture" to get started.</td>`;
        picturesTable.appendChild(row);
        return;
    }

    pictures.forEach(picture => {
        const folder = folders.find(f => f.id === picture.folderId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${picture.id}</td>
            <td>${picture.title}</td>
            <td>${folder ? folder.title : 'Unknown'}</td>
            <td>${formatCFA(picture.price)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-sm edit-picture-btn" data-id="${picture.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-picture-btn" data-id="${picture.id}">Delete</button>
                </div>
            </td>
        `;
        picturesTable.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.edit-picture-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pictureId = parseInt(this.getAttribute('data-id'));
            editPicture(pictureId);
        });
    });

    document.querySelectorAll('.delete-picture-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pictureId = parseInt(this.getAttribute('data-id'));
            deletePicture(pictureId);
        });
    });
}

function showAddFolderForm() {
    document.getElementById('folder-form-title').textContent = 'Add New Folder';
    document.getElementById('folder-id').value = '';
    document.getElementById('folder-title').value = '';
    document.getElementById('folder-icon').value = 'fas fa-folder';

    showDashboardSection('folders');

    // Scroll to form
    const folderForm = document.getElementById('folder-form');
    if (folderForm) folderForm.scrollIntoView({ behavior: 'smooth' });
}

function showAddPictureForm() {
    document.getElementById('picture-form-title').textContent = 'Add New Picture';
    document.getElementById('picture-id').value = '';
    document.getElementById('picture-title').value = '';
    document.getElementById('picture-description').value = '';
    document.getElementById('picture-price').value = '5000'; // Default CFA price
    
    const preview = document.getElementById('image-preview');
    if (preview) preview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Tap here or click to select image</p>';

    // Load folder options
    const folderSelect = document.getElementById('picture-folder');
    if (folderSelect) {
        folderSelect.innerHTML = '<option value="">Select a folder</option>';
        folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder.id;
            option.textContent = folder.title;
            folderSelect.appendChild(option);
        });
    }

    showDashboardSection('pictures');

    // Scroll to form
    const pictureForm = document.getElementById('picture-form');
    if (pictureForm) pictureForm.scrollIntoView({ behavior: 'smooth' });
}

function handleFolderSubmit(e) {
    e.preventDefault();

    const folderId = document.getElementById('folder-id').value;
    const title = document.getElementById('folder-title').value;
    const icon = document.getElementById('folder-icon').value;

    // Load current data
    folders = JSON.parse(localStorage.getItem('folders')) || [];

    if (folderId) {
        // Edit existing folder
        const index = folders.findIndex(f => f.id === parseInt(folderId));
        if (index !== -1) {
            folders[index].title = title;
            folders[index].image = icon;
        }
    } else {
        // Add new folder
        const newId = folders.length > 0 ? Math.max(...folders.map(f => f.id)) + 1 : 1;
        folders.push({
            id: newId,
            title: title,
            image: icon,
            pictureCount: 0
        });
    }

    // Save to localStorage
    saveToLocalStorage();

    // Update UI
    loadFoldersTable();
    updateAdminStats();

    // Reset form
    const folderForm = document.getElementById('folder-form');
    if (folderForm) {
        folderForm.reset();
        document.getElementById('folder-id').value = '';
    }

    alert('Folder saved successfully!');
}

function handlePictureSubmit(e) {
    e.preventDefault();

    const pictureId = document.getElementById('picture-id').value;
    const title = document.getElementById('picture-title').value;
    const description = document.getElementById('picture-description').value;
    const price = parseFloat(document.getElementById('picture-price').value) || 0;
    const folderId = parseInt(document.getElementById('picture-folder').value);
    const fileInput = document.getElementById('picture-file');

    // Validate
    if (!folderId) {
        alert('Please select a folder for the picture.');
        return;
    }

    if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price greater than 0.');
        return;
    }

    // Load current data
    pictures = JSON.parse(localStorage.getItem('pictures')) || [];
    folders = JSON.parse(localStorage.getItem('folders')) || [];

    // Handle image upload
    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const imageData = e.target.result;
            completePictureSave(pictureId, title, description, price, folderId, imageData);
        };
        reader.readAsDataURL(file);
    } else if (pictureId) {
        // For editing without changing image - keep existing image
        const existingPicture = pictures.find(p => p.id === parseInt(pictureId));
        completePictureSave(pictureId, title, description, price, folderId, existingPicture ? existingPicture.image : null);
    } else {
        alert('Please select an image file to upload.');
        return;
    }
}

function completePictureSave(pictureId, title, description, price, folderId, imageData) {
    // Load fresh data
    pictures = JSON.parse(localStorage.getItem('pictures')) || [];
    folders = JSON.parse(localStorage.getItem('folders')) || [];

    if (pictureId) {
        // Edit existing picture
        const index = pictures.findIndex(p => p.id === parseInt(pictureId));
        if (index !== -1) {
            // Update picture count if folder changed
            const oldFolderId = pictures[index].folderId;
            if (oldFolderId !== folderId) {
                updateFolderPictureCount(oldFolderId, -1);
                updateFolderPictureCount(folderId, 1);
            }

            // Update the picture
            pictures[index] = {
                ...pictures[index],
                title: title,
                description: description,
                price: price,
                folderId: folderId,
                image: imageData || pictures[index].image
            };
        }
    } else {
        // Add new picture
        const newId = pictures.length > 0 ? Math.max(...pictures.map(p => p.id)) + 1 : 1;
        pictures.push({
            id: newId,
            title: title,
            description: description,
            price: price,
            folderId: folderId,
            image: imageData || ''
        });

        updateFolderPictureCount(folderId, 1);
    }

    // Save to localStorage
    saveToLocalStorage();

    // Update UI
    loadPicturesTable();
    updateAdminStats();

    // Reset form
    const pictureForm = document.getElementById('picture-form');
    if (pictureForm) {
        pictureForm.reset();
        document.getElementById('picture-id').value = '';
        document.getElementById('picture-price').value = '5000'; // Reset to default CFA
    }
    
    const preview = document.getElementById('image-preview');
    if (preview) preview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Tap here or click to select image</p>';

    alert('Picture saved successfully!');
}

function updateFolderPictureCount(folderId, change) {
    const folderIndex = folders.findIndex(f => f.id === folderId);
    if (folderIndex !== -1) {
        folders[folderIndex].pictureCount = (folders[folderIndex].pictureCount || 0) + change;
        if (folders[folderIndex].pictureCount < 0) {
            folders[folderIndex].pictureCount = 0;
        }

        // Save updated folders
        localStorage.setItem('folders', JSON.stringify(folders));
    }
}

function editFolder(folderId) {
    folders = JSON.parse(localStorage.getItem('folders')) || [];
    const folder = folders.find(f => f.id === folderId);

    if (folder) {
        document.getElementById('folder-form-title').textContent = 'Edit Folder';
        document.getElementById('folder-id').value = folder.id;
        document.getElementById('folder-title').value = folder.title;
        document.getElementById('folder-icon').value = folder.image;

        showDashboardSection('folders');
        const folderForm = document.getElementById('folder-form');
        if (folderForm) folderForm.scrollIntoView({ behavior: 'smooth' });
    }
}

function editPicture(pictureId) {
    pictures = JSON.parse(localStorage.getItem('pictures')) || [];
    folders = JSON.parse(localStorage.getItem('folders')) || [];
    const picture = pictures.find(p => p.id === pictureId);

    if (picture) {
        document.getElementById('picture-form-title').textContent = 'Edit Picture';
        document.getElementById('picture-id').value = picture.id;
        document.getElementById('picture-title').value = picture.title;
        document.getElementById('picture-description').value = picture.description;
        document.getElementById('picture-price').value = picture.price;

        // Load folder options
        const folderSelect = document.getElementById('picture-folder');
        if (folderSelect) {
            folderSelect.innerHTML = '<option value="">Select a folder</option>';
            folders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder.id;
                option.textContent = folder.title;
                option.selected = folder.id === picture.folderId;
                folderSelect.appendChild(option);
            });
        }

        // Show image preview if exists
        const preview = document.getElementById('image-preview');
        if (preview) {
            if (picture.image && picture.image.startsWith('data:image')) {
                preview.innerHTML = `<img src="${picture.image}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 10px;">`;
            } else {
                preview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Tap here or click to select image</p>';
            }
        }

        showDashboardSection('pictures');
        const pictureForm = document.getElementById('picture-form');
        if (pictureForm) pictureForm.scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteFolder(folderId) {
    if (!confirm('Are you sure you want to delete this folder? All pictures in this folder will also be deleted.')) {
        return;
    }

    // Load current data
    pictures = JSON.parse(localStorage.getItem('pictures')) || [];
    folders = JSON.parse(localStorage.getItem('folders')) || [];

    // Delete pictures in this folder
    pictures = pictures.filter(p => p.folderId !== folderId);

    // Delete the folder
    folders = folders.filter(f => f.id !== folderId);

    // Save to localStorage
    localStorage.setItem('folders', JSON.stringify(folders));
    localStorage.setItem('pictures', JSON.stringify(pictures));

    // Update UI
    loadFoldersTable();
    loadPicturesTable();
    updateAdminStats();

    alert('Folder deleted successfully!');
}

function deletePicture(pictureId) {
    if (!confirm('Are you sure you want to delete this picture?')) {
        return;
    }

    // Load current data
    pictures = JSON.parse(localStorage.getItem('pictures')) || [];
    folders = JSON.parse(localStorage.getItem('folders')) || [];

    // Get picture to update folder count
    const picture = pictures.find(p => p.id === pictureId);
    if (picture) {
        updateFolderPictureCount(picture.folderId, -1);
    }

    // Delete the picture
    pictures = pictures.filter(p => p.id !== pictureId);

    // Save to localStorage
    localStorage.setItem('pictures', JSON.stringify(pictures));

    // Update UI
    loadPicturesTable();
    updateAdminStats();

    alert('Picture deleted successfully!');
}

// Export functions for use in HTML
window.showAdminDashboard = showAdminDashboard;
window.openFolder = openFolder;
window.openPictureModal = openPictureModal;
window.closePictureModal = closePictureModal;
window.showLoginModal = showLoginModal;
window.closeLoginModal = closeLoginModal;
window.logout = logout;
window.formatCFA = formatCFA;
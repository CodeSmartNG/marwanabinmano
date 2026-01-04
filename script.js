// script.js - Complete with working image display

// Global variables
let currentUser = null;
let folders = JSON.parse(localStorage.getItem('folders')) || [];
let pictures = JSON.parse(localStorage.getItem('pictures')) || [];
let currentFolderId = null;

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
    document.getElementById('close-modal')?.addEventListener('click', closePictureModal);
    document.getElementById('close-login-modal')?.addEventListener('click', closeLoginModal);
    
    // Login form
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
    
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
    document.getElementById('folder-name-display').textContent = folder.title;
    
    // Show pictures section, hide folders
    document.getElementById('folders-container').style.display = 'none';
    document.getElementById('pictures-section').style.display = 'block';
    
    // Render pictures for this folder
    renderPictures(folderId);
}

// Render pictures for a specific folder
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
                    `<img src="${picture.image}" alt="${picture.title}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                    `<i class="fas fa-image"></i>`
                }
            </div>
            <div class="picture-info">
                <h3 class="picture-title">${picture.title}</h3>
                <p class="picture-description">${picture.description}</p>
                <div class="picture-footer">
                    <div class="picture-price">$${picture.price.toFixed(2)}</div>
                    <button class="btn btn-primary view-picture-btn" data-id="${picture.id}">View Details</button>
                </div>
            </div>
        `;
        
        picturesGrid.appendChild(pictureCard);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-picture-btn').forEach(btn => {
        btn.addEventListener('click', function() {
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
    document.getElementById('modal-picture-price').textContent = `$${picture.price.toFixed(2)}`;
    
    // Update modal image
    const modalImage = document.getElementById('modal-picture-image');
    if (picture.image && picture.image.startsWith('data:image')) {
        modalImage.src = picture.image;
        modalImage.style.display = 'block';
    } else {
        modalImage.style.display = 'none';
    }
    
    // Set up buy button
    const buyBtn = document.getElementById('buy-btn');
    const whatsappMessage = `Hello, I would like to buy "${picture.title}" from Marwana Bin Mano. Price: $${picture.price.toFixed(2)}.`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    buyBtn.onclick = () => {
        window.open(`https://wa.me/12345678900?text=${encodedMessage}`, '_blank');
    };
    
    // Show modal
    document.getElementById('picture-modal').style.display = 'flex';
}

// Close picture modal
function closePictureModal() {
    document.getElementById('picture-modal').style.display = 'none';
}

// Show login modal
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
}

// Close login modal
function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
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
        
        // Redirect to admin page
        window.location.href = 'admin.html';
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
    // Only show if user is logged in
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'index.html';
        return;
    }
    
    // Set up admin page event listeners
    setupAdminEventListeners();
    
    // Show dashboard by default
    showDashboardSection('dashboard');
    
    // Load stats
    updateAdminStats();
}

function setupAdminEventListeners() {
    // Admin navigation
    document.getElementById('dashboard-link')?.addEventListener('click', () => showDashboardSection('dashboard'));
    document.getElementById('folders-link')?.addEventListener('click', () => showDashboardSection('folders'));
    document.getElementById('pictures-link')?.addEventListener('click', () => showDashboardSection('pictures'));
    document.getElementById('logout-btn')?.addEventListener('click', logout);
    
    // Action buttons
    document.getElementById('add-folder-btn')?.addEventListener('click', showAddFolderForm);
    document.getElementById('add-picture-btn')?.addEventListener('click', showAddPictureForm);
    
    // Form submissions
    document.getElementById('folder-form')?.addEventListener('submit', handleFolderSubmit);
    document.getElementById('picture-form')?.addEventListener('submit', handlePictureSubmit);
    
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
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Load data for tables
    loadFoldersTable();
    loadPicturesTable();
}

function showDashboardSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${sectionId}-section`).classList.add('active');
    
    // Update active nav
    document.querySelectorAll('.admin-nav a').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(`${sectionId}-link`).classList.add('active');
}

function updateAdminStats() {
    // Load fresh data
    folders = JSON.parse(localStorage.getItem('folders')) || [];
    pictures = JSON.parse(localStorage.getItem('pictures')) || [];
    
    const totalFolders = folders.length;
    const totalPictures = pictures.length;
    const totalValue = pictures.reduce((sum, picture) => sum + (picture.price || 0), 0);
    
    document.getElementById('total-folders').textContent = totalFolders;
    document.getElementById('total-pictures').textContent = totalPictures;
    document.getElementById('total-value').textContent = `$${totalValue.toFixed(2)}`;
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
            <td>$${picture.price.toFixed(2)}</td>
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
    document.getElementById('folder-form').scrollIntoView({ behavior: 'smooth' });
}

function showAddPictureForm() {
    document.getElementById('picture-form-title').textContent = 'Add New Picture';
    document.getElementById('picture-id').value = '';
    document.getElementById('picture-title').value = '';
    document.getElementById('picture-description').value = '';
    document.getElementById('picture-price').value = '';
    document.getElementById('image-preview').innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Tap here or click to select image</p>';
    
    // Load folder options
    const folderSelect = document.getElementById('picture-folder');
    folderSelect.innerHTML = '<option value="">Select a folder</option>';
    folders.forEach(folder => {
        const option = document.createElement('option');
        option.value = folder.id;
        option.textContent = folder.title;
        folderSelect.appendChild(option);
    });
    
    showDashboardSection('pictures');
    
    // Scroll to form
    document.getElementById('picture-form').scrollIntoView({ behavior: 'smooth' });
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
    document.getElementById('folder-form').reset();
    document.getElementById('folder-id').value = '';
    
    alert('Folder saved successfully!');
}

function handlePictureSubmit(e) {
    e.preventDefault();
    
    const pictureId = document.getElementById('picture-id').value;
    const title = document.getElementById('picture-title').value;
    const description = document.getElementById('picture-description').value;
    const price = parseFloat(document.getElementById('picture-price').value);
    const folderId = parseInt(document.getElementById('picture-folder').value);
    const fileInput = document.getElementById('picture-file');
    
    // Validate
    if (!folderId) {
        alert('Please select a folder for the picture.');
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
    document.getElementById('picture-form').reset();
    document.getElementById('picture-id').value = '';
    document.getElementById('image-preview').innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Tap here or click to select image</p>';
    
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
        document.getElementById('folder-form').scrollIntoView({ behavior: 'smooth' });
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
        folderSelect.innerHTML = '<option value="">Select a folder</option>';
        folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder.id;
            option.textContent = folder.title;
            option.selected = folder.id === picture.folderId;
            folderSelect.appendChild(option);
        });
        
        // Show image preview if exists
        const preview = document.getElementById('image-preview');
        if (picture.image && picture.image.startsWith('data:image')) {
            preview.innerHTML = `<img src="${picture.image}" alt="Preview" style="max-width: 100%; max-height: 200px;">`;
        } else {
            preview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Tap here or click to select image</p>';
        }
        
        showDashboardSection('pictures');
        document.getElementById('picture-form').scrollIntoView({ behavior: 'smooth' });
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

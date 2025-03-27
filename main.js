$(document).ready(function() {
    // Check if user is logged in
    checkUserLogin();
    
    // Load Featured Tours
    loadFeaturedTours();
    
    // Login Button Click
    $('#loginBtn').click(function() {
        $('#loginModal').modal('show');
    });
    
    // Register Link Click
    $('#registerLink').click(function(e) {
        e.preventDefault();
        // Here we would normally switch to registration form
        alert('Chức năng đăng ký sẽ được phát triển sau');
    });
    
    // Login Form Submit
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        
        const username = $('#username').val();
        const password = $('#password').val();
        
        // Call login API
        loginUser(username, password);
    });
    
    // My Bookings Button Click
    $('#myBookingsBtn').click(function() {
        loadUserBookings();
        $('#myBookingsModal').modal('show');
    });
    
    // Book Tour Button Click in Tour Detail Modal
    $('#bookTourBtn').click(function() {
        const isLoggedIn = localStorage.getItem('userLoggedIn');
        
        if (isLoggedIn) {
            $('#tourDetailModal').modal('hide');
            $('#bookingModal').modal('show');
        } else {
            $('#tourDetailModal').modal('hide');
            $('#loginModal').modal('show');
            alert('Vui lòng đăng nhập để đặt tour');
        }
    });
    
    // Submit Booking Form
    $('#submitBookingBtn').click(function() {
        // Validate form
        if (!$('#bookingForm')[0].checkValidity()) {
            $('#bookingForm')[0].reportValidity();
            return;
        }
        
        // Get form data
        const bookingData = {
            tourId: $('#tourId').val(),
            fullName: $('#fullName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            travelDate: $('#travelDate').val(),
            numPersons: $('#numPersons').val(),
            notes: $('#notes').val(),
            userId: localStorage.getItem('userId') || null
        };
        
        // Call API to create booking
        createBooking(bookingData);
    });
    
    // Contact Form Submit
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        alert('Cảm ơn bạn đã gửi tin nhắn. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất!');
        this.reset();
    });
});

function checkUserLogin() {
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');
    
    if (isLoggedIn) {
        // Hide login button, show user menu
        $('#loginBtnGroup').addClass('d-none');
        $('#userMenuGroup').removeClass('d-none');
        
        // Set username
        $('#usernameDisplay').text(username);
        
        // Show admin link if user is admin
        if (userRole === 'admin') {
            $('#goToAdminBtn').show();
        } else {
            $('#goToAdminBtn').hide();
        }
    } else {
        // Show login button, hide user menu
        $('#loginBtnGroup').removeClass('d-none');
        $('#userMenuGroup').addClass('d-none');
    }
}

// Function to load featured tours
function loadFeaturedTours() {
    // Call API to get featured tours
    getFeaturedTours()
        .then(tours => {
            displayTours(tours);
        })
        .catch(error => {
            console.error('Error loading tours:', error);
        });
}

// Function to display tours
function displayTours(tours) {
    const tourContainer = $('#featuredTours');
    tourContainer.empty();
    
    if (tours.length === 0) {
        tourContainer.html('<div class="col-12 text-center"><p>Không có tour nào để hiển thị</p></div>');
        return;
    }
    
    tours.forEach(tour => {
        // Calculate discounted price
        const discountedPrice = tour.discount ? tour.price * (1 - tour.discount / 100) : tour.price;
        
        // Create tour card
        const tourCard = `
            <div class="col-lg-4 col-md-6">
                <div class="card tour-card">
                    <img src="${tour.image}" class="card-img-top" alt="${tour.name}">
                    <div class="card-body">
                        <h5 class="card-title">${tour.name}</h5>
                        <p class="card-text">${tour.shortDescription || tour.description.substring(0, 100)}...</p>
                        <div class="tour-info">
                            <span><i class="fas fa-map-marker-alt me-1"></i> ${tour.destination}</span>
                            <span><i class="fas fa-clock me-1"></i> ${tour.duration}</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="tour-price">
                                ${formatCurrency(discountedPrice)}
                                ${tour.discount ? `<span class="original-price">${formatCurrency(tour.price)}</span>` : ''}
                            </div>
                            <button class="btn btn-primary btn-sm view-tour-btn" data-id="${tour.id}">
                                Chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        tourContainer.append(tourCard);
    });
    
    // Add event listeners to view tour buttons
    $('.view-tour-btn').click(function() {
        const tourId = $(this).data('id');
        viewTourDetails(tourId);
    });
}

// Function to view tour details
function viewTourDetails(tourId) {
    // Call API to get tour details
    getTourDetails(tourId)
        .then(tour => {
            // Calculate discounted price
            const discountedPrice = tour.discount ? tour.price * (1 - tour.discount / 100) : tour.price;
            
            // Set tour title
            $('#tourTitle').text(tour.name);
            
            // Build tour details HTML
            const tourDetailHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <img src="${tour.image}" class="img-fluid rounded" alt="${tour.name}">
                    </div>
                    <div class="col-md-6">
                        <h4>${tour.name}</h4>
                        <div class="tour-features">
                            <div class="feature-item">
                                <div class="feature-icon">
                                    <i class="fas fa-map-marker-alt"></i>
                                </div>
                                <div>
                                    <strong>Điểm đến:</strong> ${tour.destination}
                                </div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div>
                                    <strong>Thời gian:</strong> ${tour.duration}
                                </div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div>
                                    <strong>Số người tối đa:</strong> ${tour.groupSize} người
                                </div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">
                                    <i class="fas fa-tag"></i>
                                </div>
                                <div>
                                    <strong>Giá:</strong> ${formatCurrency(discountedPrice)}
                                    ${tour.discount ? `<span class="original-price">${formatCurrency(tour.price)}</span>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-12">
                        <h5>Mô tả</h5>
                        <p>${tour.description}</p>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-12">
                        <h5>Lịch trình</h5>
                        <div class="itinerary">
                            ${formatItinerary(tour.itinerary)}
                        </div>
                    </div>
                </div>
            `;
            
            // Set tour details content
            $('#tourDetailContent').html(tourDetailHTML);
            
            // Set tour ID for booking
            $('#tourId').val(tour.id);
            
            // Show modal
            $('#tourDetailModal').modal('show');
        })
        .catch(error => {
            console.error('Error loading tour details:', error);
            alert('Không thể tải thông tin tour. Vui lòng thử lại sau.');
        });
}

// Function to format itinerary
function formatItinerary(itinerary) {
    // If itinerary is a string, convert to HTML
    if (typeof itinerary === 'string') {
        // Split by day
        const days = itinerary.split('\n\n');
        
        return days.map((day, index) => {
            const lines = day.split('\n');
            const title = lines[0];
            const details = lines.slice(1).join('<br>');
            
            return `
                <div class="itinerary-day">
                    <h5>Ngày ${index + 1}: ${title}</h5>
                    <p>${details}</p>
                </div>
            `;
        }).join('');
    }
    
    // If itinerary is already an array
    if (Array.isArray(itinerary)) {
        return itinerary.map((day, index) => {
            return `
                <div class="itinerary-day">
                    <h5>Ngày ${index + 1}: ${day.title}</h5>
                    <p>${day.description}</p>
                </div>
            `;
        }).join('');
    }
    
    return '<p>Không có thông tin lịch trình</p>';
}

// Function to login user
function loginUser(username, password) {
    // Call API to login
    login(username, password)
        .then(response => {
            if (response.success) {
                // Save user info to localStorage
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userId', response.userId);
                localStorage.setItem('username', response.username);
                
                // Close modal and update UI
                $('#loginModal').modal('hide');
                checkUserLogin();
                
                // Show success message
                alert('Đăng nhập thành công!');
            } else {
                alert('Đăng nhập thất bại: ' + response.message);
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            alert('Đăng nhập thất bại. Vui lòng thử lại sau.');
        });
}

// Function to create booking
function createBooking(bookingData) {
    // Call API to create booking
    addBooking(bookingData)
        .then(response => {
            if (response.success) {
                // Close modal and show success message
                $('#bookingModal').modal('hide');
                alert('Đặt tour thành công! Mã đơn hàng của bạn là: ' + response.bookingId);
                
                // Reset form
                $('#bookingForm')[0].reset();
            } else {
                alert('Đặt tour thất bại: ' + response.message);
            }
        })
        .catch(error => {
            console.error('Booking error:', error);
            alert('Đặt tour thất bại. Vui lòng thử lại sau.');
        });
}

// Function to load user bookings
function loadUserBookings() {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        $('#myBookingsList').html('<tr><td colspan="6" class="text-center">Vui lòng đăng nhập để xem đơn hàng</td></tr>');
        return;
    }
    
    // Call API to get user bookings
    getUserBookings(userId)
        .then(bookings => {
            displayUserBookings(bookings);
        })
        .catch(error => {
            console.error('Error loading bookings:', error);
            $('#myBookingsList').html('<tr><td colspan="6" class="text-center">Không thể tải đơn hàng. Vui lòng thử lại sau.</td></tr>');
        });
}

// Function to display user bookings
function displayUserBookings(bookings) {
    const bookingsContainer = $('#myBookingsList');
    bookingsContainer.empty();
    
    if (bookings.length === 0) {
        bookingsContainer.html('<tr><td colspan="6" class="text-center">Bạn chưa có đơn đặt tour nào</td></tr>');
        return;
    }
    
    bookings.forEach(booking => {
        const statusClass = getStatusClass(booking.status);
        const statusText = getStatusText(booking.status);
        
        const bookingRow = `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.tourName}</td>
                <td>${formatDate(booking.travelDate)}</td>
                <td>${booking.numPersons}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>${formatCurrency(booking.totalAmount)}</td>
            </tr>
        `;
        
        bookingsContainer.append(bookingRow);
    });
}

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Helper function to get status class
function getStatusClass(status) {
    switch (status) {
        case 'pending':
            return 'bg-warning';
        case 'confirmed':
            return 'bg-success';
        case 'cancelled':
            return 'bg-danger';
        case 'completed':
            return 'bg-info';
        default:
            return 'bg-secondary';
    }
}

// Helper function to get status text
function getStatusText(status) {
    switch (status) {
        case 'pending':
            return 'Chờ xác nhận';
        case 'confirmed':
            return 'Đã xác nhận';
        case 'cancelled':
            return 'Đã hủy';
        case 'completed':
            return 'Hoàn thành';
        default:
            return 'Không xác định';
    }
}
// Logout Button Click
$('#logoutBtn').click(function() {
    logoutUser();
});
// Function to logout user
function logoutUser() {
    // Clear localStorage
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    
    // Update UI
    checkUserLogin();
    
    // Show success message
    alert('Đăng xuất thành công!');
}
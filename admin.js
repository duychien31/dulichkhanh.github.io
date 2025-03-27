$(document).ready(function () {
    // Check if admin is logged in
    checkAdminLogin();

    // Sidebar toggle
    $('#sidebarToggle').click(function () {
        $('#sidebar').toggleClass('collapsed');
        $('.main-content').toggleClass('expanded');
    });

    // Navigation links
    $('.nav-link[data-page]').click(function (e) {
        e.preventDefault();
        const page = $(this).data('page');
        navigateToPage(page);
    });

    // Admin Login Form Submit
    $('#adminLoginForm').submit(function (e) {
        e.preventDefault();

        const username = $('#adminUsername').val();
        const password = $('#adminPassword').val();

        // Call login API
        adminLogin(username, password);
    });

    // Logout Button Click
    $('#logoutBtn, #dropdownLogout').click(function (e) {
        e.preventDefault();
        logoutAdmin();
    });

    // Add Tour Button Click
    $('#addTourBtn').click(function () {
        // Reset form
        $('#tourForm')[0].reset();
        $('#tourId').val('');
        $('#tourModalTitle').text('Thêm tour mới');

        // Show modal
        $('#tourModal').modal('show');
    });

    // Save Tour Button Click
    $('#saveTourBtn').click(function () {
        // Validate form
        if (!$('#tourForm')[0].checkValidity()) {
            $('#tourForm')[0].reportValidity();
            return;
        }

        // Get form data
        const tourId = $('#tourId').val();
        const tourData = {
            name: $('#tourName').val(),
            category: $('#tourCategory').val(),
            destination: $('#tourDestination').val(),
            duration: $('#tourDuration').val(),
            groupSize: $('#tourGroupSize').val(),
            price: $('#tourPrice').val(),
            discount: $('#tourDiscount').val(),
            status: $('#tourStatus').val(),
            description: $('#tourDescription').val(),
            itinerary: $('#tourItinerary').val(),
            image: 'https://source.unsplash.com/800x600/?travel,' + $('#tourDestination').val()
        };

        // Call API to save tour
        if (tourId) {
            // Update existing tour
            tourData.id = tourId;
            updateTour(tourData)
                .then(response => {
                    if (response.success) {
                        // Close modal and refresh tours list
                        $('#tourModal').modal('hide');
                        loadTours();

                        // Show success message
                        alert('Cập nhật tour thành công!');
                    } else {
                        alert('Cập nhật tour thất bại: ' + response.message);
                    }
                })
                .catch(error => {
                    console.error('Update tour error:', error);
                    alert('Cập nhật tour thất bại. Vui lòng thử lại sau.');
                });
        } else {
            // Add new tour
            addTour(tourData)
                .then(response => {
                    if (response.success) {
                        // Close modal and refresh tours list
                        $('#tourModal').modal('hide');
                        loadTours();

                        // Show success message
                        alert('Thêm tour mới thành công!');
                    } else {
                        alert('Thêm tour mới thất bại: ' + response.message);
                    }
                })
                .catch(error => {
                    console.error('Add tour error:', error);
                    alert('Thêm tour mới thất bại. Vui lòng thử lại sau.');
                });
        }
    });

    // Add User Button Click
    $('#addUserBtn').click(function () {
        // Reset form
        $('#userForm')[0].reset();
        $('#userId').val('');
        $('#userModalTitle').text('Thêm người dùng mới');

        // Show modal
        $('#userModal').modal('show');
    });

    // Save User Button Click
    $('#saveUserBtn').click(function () {
        // Validate form
        if (!$('#userForm')[0].checkValidity()) {
            $('#userForm')[0].reportValidity();
            return;
        }

        // Get form data
        const userId = $('#userId').val();
        const userData = {
            name: $('#userName').val(),
            email: $('#userEmail').val(),
            phone: $('#userPhone').val(),
            password: $('#userPassword').val(),
            role: $('#userRole').val(),
            status: $('#userStatus').val()
        };

        // Call API to save user
        if (userId) {
            // Update existing user
            userData.id = userId;
            updateUser(userData)
                .then(response => {
                    if (response.success) {
                        // Close modal and refresh users list
                        $('#userModal').modal('hide');
                        loadUsers();

                        // Show success message
                        alert('Cập nhật người dùng thành công!');
                    } else {
                        alert('Cập nhật người dùng thất bại: ' + response.message);
                    }
                })
                .catch(error => {
                    console.error('Update user error:', error);
                    alert('Cập nhật người dùng thất bại. Vui lòng thử lại sau.');
                });
        } else {
            // Add new user
            addUser(userData)
                .then(response => {
                    if (response.success) {
                        // Close modal and refresh users list
                        $('#userModal').modal('hide');
                        loadUsers();

                        // Show success message
                        alert('Thêm người dùng mới thành công!');
                    } else {
                        alert('Thêm người dùng mới thất bại: ' + response.message);
                    }
                })
                .catch(error => {
                    console.error('Add user error:', error);
                    alert('Thêm người dùng mới thất bại. Vui lòng thử lại sau.');
                });
        }
    });

    // Filter Tour Button Click
    $('#tourFilterBtn').click(function () {
        loadTours();
    });

    // Filter Booking Button Click
    $('#bookingFilterBtn').click(function () {
        loadBookings();
    });

    // Filter User Button Click
    $('#userFilterBtn').click(function () {
        loadUsers();
    });

    // Export Bookings Button Click
    $('#exportBookingsBtn').click(function () {
        alert('Chức năng xuất Excel sẽ được phát triển sau');
    });

    // Settings Forms Submit
    $('#generalSettingsForm, #paymentSettingsForm, #adminProfileForm, #changePasswordForm').submit(function (e) {
        e.preventDefault();
        alert('Cài đặt đã được lưu thành công!');
    });
});

// Function to check if admin is logged in
function checkAdminLogin() {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');

    if (!isAdminLoggedIn) {
        // Show login modal
        $('#loginCheckModal').modal('show');
    } else {
        // Load dashboard data
        loadDashboardData();

        // Set active page to dashboard
        navigateToPage('dashboard');
    }
}

// Function to admin login
function adminLogin(username, password) {
    // Call API to login
    adminLoginApi(username, password)
        .then(response => {
            if (response.success) {
                // Save admin info to localStorage
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminId', response.adminId);

                // Close modal
                $('#loginCheckModal').modal('hide');

                // Load dashboard data
                loadDashboardData();

                // Set active page to dashboard
                navigateToPage('dashboard');
            } else {
                // Show error message
                $('#loginError').removeClass('d-none');
            }
        })
        .catch(error => {
            console.error('Admin login error:', error);
            $('#loginError').removeClass('d-none');
        });
}

// Function to logout admin
function logoutAdmin() {
    // Clear localStorage
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminId');

    // Redirect to login
    window.location.href = 'admin.html';
}

// Function to navigate to page
function navigateToPage(page) {
    // Hide all pages
    $('.page').removeClass('active');

    // Show selected page
    $(`#${page}-page`).addClass('active');

    // Update navigation
    $('.nav-link').removeClass('active');
    $(`.nav-link[data-page="${page}"]`).addClass('active');

    // Load page data
    switch (page) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'tours':
            loadTours();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

// Function to load dashboard data
function loadDashboardData() {
    // Call API to get dashboard stats
    getDashboardStats()
        .then(stats => {
            // Update stats
            $('#totalTours').text(stats.totalTours);
            $('#totalBookings').text(stats.totalBookings);
            $('#totalUsers').text(stats.totalUsers);
            $('#totalRevenue').text(formatCurrency(stats.totalRevenue));

            // Load recent bookings
            loadRecentBookings();

            // Load popular tours
            loadPopularTours();
        })
        .catch(error => {
            console.error('Error loading dashboard stats:', error);
        });
}

// Function to load recent bookings
function loadRecentBookings() {
    // Call API to get recent bookings
    getRecentBookings()
        .then(bookings => {
            displayRecentBookings(bookings);
        })
        .catch(error => {
            console.error('Error loading recent bookings:', error);
        });
}

// Function to display recent bookings
function displayRecentBookings(bookings) {
    const bookingsContainer = $('#recentBookings');
    bookingsContainer.empty();

    if (bookings.length === 0) {
        bookingsContainer.html('<tr><td colspan="6" class="text-center">Không có đơn đặt tour nào</td></tr>');
        return;
    }

    bookings.forEach(booking => {
        const statusClass = getStatusClass(booking.status);
        const statusText = getStatusText(booking.status);

        const bookingRow = `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.tourName}</td>
                <td>${booking.customerName}</td>
                <td>${formatDate(booking.bookingDate)}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>${formatCurrency(booking.totalAmount)}</td>
            </tr>
        `;

        bookingsContainer.append(bookingRow);
    });
}

// Function to load popular tours
function loadPopularTours() {
    // Call API to get popular tours
    getPopularTours()
        .then(tours => {
            displayPopularTours(tours);
        })
        .catch(error => {
            console.error('Error loading popular tours:', error);
        });
}

// Function to display popular tours
function displayPopularTours(tours) {
    const toursContainer = $('#popularTours');
    toursContainer.empty();

    if (tours.length === 0) {
        toursContainer.html('<tr><td colspan="5" class="text-center">Không có tour nào</td></tr>');
        return;
    }

    tours.forEach(tour => {
        const statusClass = getTourStatusClass(tour.status);
        const statusText = getTourStatusText(tour.status);

        const tourRow = `
            <tr>
                <td>${tour.name}</td>
                <td>${tour.bookingCount}</td>
                <td>
                    <div class="rating">
                        ${getRatingStars(tour.rating)}
                    </div>
                </td>
                <td>${formatCurrency(tour.price)}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;

        toursContainer.append(tourRow);
    });
}

// Function to load tours
function loadTours() {
    // Get filter values
    const search = $('#tourSearchInput').val();
    const category = $('#tourCategoryFilter').val();
    const status = $('#tourStatusFilter').val();

    // Call API to get tours
    getTours(search, category, status)
        .then(tours => {
            displayTours(tours);
        })
        .catch(error => {
            console.error('Error loading tours:', error);
        });
}

// Function to display tours
function displayTours(tours) {
    const toursContainer = $('#toursList');
    toursContainer.empty();

    if (tours.length === 0) {
        toursContainer.html('<tr><td colspan="8" class="text-center">Không có tour nào</td></tr>');
        return;
    }

    tours.forEach(tour => {
        const statusClass = getTourStatusClass(tour.status);
        const statusText = getTourStatusText(tour.status);

        const tourRow = `
            <tr>
                <td>${tour.id}</td>
                <td>
                    <img src="${tour.image}" alt="${tour.name}" width="50" height="50" class="rounded">
                </td>
                <td>${tour.name}</td>
                <td>${tour.destination}</td>
                <td>${tour.duration}</td>
                <td>${formatCurrency(tour.price)}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-info edit-tour-btn" data-id="${tour.id}" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-tour-btn" data-id="${tour.id}" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;

        toursContainer.append(tourRow);
    });

    // Add event listeners to edit and delete buttons
    $('.edit-tour-btn').click(function () {
        const tourId = $(this).data('id');
        editTour(tourId);
    });

    $('.delete-tour-btn').click(function () {
        const tourId = $(this).data('id');
        deleteTour(tourId);
    });
}

// Function to edit tour
function editTour(tourId) {
    // Call API to get tour details
    getTourDetails(tourId)
        .then(tour => {
            // Set form values
            $('#tourId').val(tour.id);
            $('#tourName').val(tour.name);
            $('#tourCategory').val(tour.category);
            $('#tourDestination').val(tour.destination);
            $('#tourDuration').val(tour.duration);
            $('#tourGroupSize').val(tour.groupSize);
            $('#tourPrice').val(tour.price);
            $('#tourDiscount').val(tour.discount);
            $('#tourStatus').val(tour.status);
            $('#tourDescription').val(tour.description);
            $('#tourItinerary').val(tour.itinerary);

            // Set modal title
            $('#tourModalTitle').text('Chỉnh sửa tour');

            // Show modal
            $('#tourModal').modal('show');
        })
        .catch(error => {
            console.error('Error loading tour details:', error);
            alert('Không thể tải thông tin tour. Vui lòng thử lại sau.');
        });
}

// Function to delete tour
function deleteTour(tourId) {
    if (confirm('Bạn có chắc muốn xóa tour này?')) {
        // Call API to delete tour
        deleteTourApi(tourId)
            .then(response => {
                if (response.success) {
                    // Refresh tours list
                    loadTours();

                    // Show success message
                    alert('Xóa tour thành công!');
                } else {
                    alert('Xóa tour thất bại: ' + response.message);
                }
            })
            .catch(error => {
                console.error('Delete tour error:', error);
                alert('Xóa tour thất bại. Vui lòng thử lại sau.');
            });
    }
}

// Function to load bookings
function loadBookings() {
    // Get filter values
    const search = $('#bookingSearchInput').val();
    const status = $('#bookingStatusFilter').val();
    const date = $('#bookingDateFilter').val();

    // Call API to get bookings
    getBookings(search, status, date)
        .then(bookings => {
            displayBookings(bookings);
        })
        .catch(error => {
            console.error('Error loading bookings:', error);
        });
}

// Function to display bookings
function displayBookings(bookings) {
    const bookingsContainer = $('#bookingsList');
    bookingsContainer.empty();

    if (bookings.length === 0) {
        bookingsContainer.html('<tr><td colspan="8" class="text-center">Không có đơn đặt tour nào</td></tr>');
        return;
    }

    bookings.forEach(booking => {
        const statusClass = getStatusClass(booking.status);
        const statusText = getStatusText(booking.status);

        const bookingRow = `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.tourName}</td>
                <td>${booking.customerName}</td>
                <td>${booking.numPersons}</td>
                <td>${formatDate(booking.travelDate)}</td>
                <td>${formatCurrency(booking.totalAmount)}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary view-booking-btn" data-id="${booking.id}" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-booking-btn" data-id="${booking.id}" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;

        bookingsContainer.append(bookingRow);
    });

    // Add event listeners to view and delete buttons
    $('.view-booking-btn').click(function () {
        const bookingId = $(this).data('id');
        viewBookingDetails(bookingId);
    });

    $('.delete-booking-btn').click(function () {
        const bookingId = $(this).data('id');
        deleteBooking(bookingId);
    });
}

// Function to view booking details
function viewBookingDetails(bookingId) {
    // Call API to get booking details
    getBookingDetails(bookingId)
        .then(booking => {
            // Build booking details HTML
            const bookingDetailHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="booking-detail-section">
                            <h5>Thông tin khách hàng</h5>
                            <div class="booking-info-item">
                                <span class="label">Họ và tên:</span>
                                <span>${booking.customerName}</span>
                            </div>
                            <div class="booking-info-item">
                                <span class="label">Email:</span>
                                <span>${booking.email}</span>
                            </div>
                            <div class="booking-info-item">
                                <span class="label">Số điện thoại:</span>
                                <span>${booking.phone}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="booking-detail-section">
                            <h5>Thông tin đơn hàng</h5>
                            <div class="booking-info-item">
                                <span class="label">Mã đơn:</span>
                                <span>${booking.id}</span>
                            </div>
                            <div class="booking-info-item">
                                <span class="label">Ngày đặt:</span>
                                <span>${formatDate(booking.bookingDate)}</span>
                            </div>
                            <div class="booking-info-item">
                                <span class="label">Trạng thái:</span>
                                <span class="badge ${getStatusClass(booking.status)}">${getStatusText(booking.status)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <div class="booking-detail-section">
                            <h5>Thông tin tour</h5>
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="booking-info-item">
                                        <span class="label">Tên tour:</span>
                                        <span>${booking.tourName}</span>
                                    </div>
                                    <div class="booking-info-item">
                                        <span class="label">Điểm đến:</span>
                                        <span>${booking.destination}</span>
                                    </div>
                                    <div class="booking-info-item">
                                        <span class="label">Thời gian:</span>
                                        <span>${booking.duration}</span>
                                    </div>
                                    <div class="booking-info-item">
                                        <span class="label">Ngày khởi hành:</span>
                                        <span>${formatDate(booking.travelDate)}</span>
                                    </div>
                                    <div class="booking-info-item">
                                        <span class="label">Số người:</span>
                                        <span>${booking.numPersons}</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <img src="${booking.tourImage}" alt="${booking.tourName}" class="img-fluid rounded">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-6">
                        <div class="booking-detail-section">
                            <h5>Ghi chú</h5>
                            <p>${booking.notes || 'Không có ghi chú'}</p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="booking-detail-section">
                            <h5>Chi tiết thanh toán</h5>
                            <div class="booking-price-summary">
                                <div class="booking-price-item">
                                    <span>Giá tour:</span>
                                    <span>${formatCurrency(booking.price)}</span>
                                </div>
                                <div class="booking-price-item">
                                    <span>Số người:</span>
                                    <span>${booking.numPersons}</span>
                                </div>
                                ${booking.discount ? `
                                <div class="booking-price-item">
                                    <span>Giảm giá:</span>
                                    <span>-${booking.discount}%</span>
                                </div>` : ''}
                                <div class="booking-price-item total">
                                    <span>Tổng tiền:</span>
                                    <span>${formatCurrency(booking.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Set booking details content
            $('#bookingDetailContent').html(bookingDetailHTML);

            // Set button visibility based on status
            if (booking.status === 'pending') {
                $('#confirmBookingBtn').show();
                $('#cancelBookingBtn').show();
            } else if (booking.status === 'confirmed') {
                $('#confirmBookingBtn').hide();
                $('#cancelBookingBtn').show();
            } else {
                $('#confirmBookingBtn').hide();
                $('#cancelBookingBtn').hide();
            }

            // Set booking ID for buttons
            $('#confirmBookingBtn').data('id', booking.id);
            $('#cancelBookingBtn').data('id', booking.id);

            // Show modal
            $('#bookingDetailModal').modal('show');
        })
        .catch(error => {
            console.error('Error loading booking details:', error);
            alert('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
        });
}

// Function to delete booking
function deleteBooking(bookingId) {
    if (confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
        // Call API to delete booking
        deleteBookingApi(bookingId)
            .then(response => {
                if (response.success) {
                    // Refresh bookings list
                    loadBookings();

                    // Show success message
                    alert('Xóa đơn hàng thành công!');
                } else {
                    alert('Xóa đơn hàng thất bại: ' + response.message);
                }
            })
            .catch(error => {
                console.error('Delete booking error:', error);
                alert('Xóa đơn hàng thất bại. Vui lòng thử lại sau.');
            });
    }
}

// Function to load users
function loadUsers() {
    // Get filter values
    const search = $('#userSearchInput').val();
    const role = $('#userRoleFilter').val();

    // Call API to get users
    getUsers(search, role)
        .then(users => {
            displayUsers(users);
        })
        .catch(error => {
            console.error('Error loading users:', error);
        });
}

// Function to display users
function displayUsers(users) {
    const usersContainer = $('#usersList');
    usersContainer.empty();

    if (users.length === 0) {
        usersContainer.html('<tr><td colspan="8" class="text-center">Không có người dùng nào</td></tr>');
        return;
    }

    users.forEach(user => {
        const statusClass = user.status === 'active' ? 'status-active' : 'status-inactive';
        const statusText = user.status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa';

        const userRow = `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${user.role === 'admin' ? 'Admin' : 'Người dùng'}</td>
                <td>${formatDate(user.registrationDate)}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-info edit-user-btn" data-id="${user.id}" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-user-btn" data-id="${user.id}" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;

        usersContainer.append(userRow);
    });

    // Add event listeners to edit and delete buttons
    $('.edit-user-btn').click(function () {
        const userId = $(this).data('id');
        editUser(userId);
    });

    $('.delete-user-btn').click(function () {
        const userId = $(this).data('id');
        deleteUser(userId);
    });
}

// Function to edit user
function editUser(userId) {
    // Call API to get user details
    getUserDetails(userId)
        .then(user => {
            // Set form values
            $('#userId').val(user.id);
            $('#userName').val(user.name);
            $('#userEmail').val(user.email);
            $('#userPhone').val(user.phone);
            $('#userPassword').val(''); // Don't show password
            $('#userRole').val(user.role);
            $('#userStatus').val(user.status);

            // Set modal title
            $('#userModalTitle').text('Chỉnh sửa người dùng');

            // Show modal
            $('#userModal').modal('show');
        })
        .catch(error => {
            console.error('Error loading user details:', error);
            alert('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
        });
}

// Function to delete user
function deleteUser(userId) {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
        // Call API to delete user
        deleteUserApi(userId)
            .then(response => {
                if (response.success) {
                    // Refresh users list
                    loadUsers();

                    // Show success message
                    alert('Xóa người dùng thành công!');
                } else {
                    alert('Xóa người dùng thất bại: ' + response.message);
                }
            })
            .catch(error => {
                console.error('Delete user error:', error);
                alert('Xóa người dùng thất bại. Vui lòng thử lại sau.');
            });
    }
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
            return 'status-pending';
        case 'confirmed':
            return 'status-confirmed';
        case 'cancelled':
            return 'status-cancelled';
        case 'completed':
            return 'status-active';
        default:
            return 'status-inactive';
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

// Helper function to get tour status class
function getTourStatusClass(status) {
    switch (status) {
        case 'active':
            return 'status-active';
        case 'inactive':
            return 'status-inactive';
        case 'coming':
            return 'status-coming';
        default:
            return 'status-inactive';
    }
}

// Helper function to get tour status text
function getTourStatusText(status) {
    switch (status) {
        case 'active':
            return 'Đang mở bán';
        case 'inactive':
            return 'Ngừng bán';
        case 'coming':
            return 'Sắp mở bán';
        default:
            return 'Không xác định';
    }
}

// Helper function to get rating stars
function getRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star text-warning"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        } else {
            stars += '<i class="far fa-star text-warning"></i>';
        }
    }
    return stars;
}
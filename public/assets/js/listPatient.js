document.addEventListener('DOMContentLoaded', () => {
    getAllUser();
});

function displayListUser(users) {
    const tableBody = document.querySelector('#user-list-table tbody');
    // Xóa toàn bộ nội dung trong tbody trước khi cập nhật
    tableBody.innerHTML = '';

    // Lặp qua mỗi người dùng từ dữ liệu nhận được
    users.forEach(user => {
        // Tạo một dòng mới
        const newRow = document.createElement('tr');

        // Tạo các ô dữ liệu
        const cells = [
            `<td class="text-center"><img class="rounded img-fluid avatar-40" src="${user.UrlImg}" alt="profile"></td>`,
            `<td>${user.name}</td>`,
            `<td>${user.gender}</td>`,
            `<td>${user.dayOfBirth}</td>`,
            `<td>${user.phoneNumber}</td>`,
            `<td>${user.email}</td>`,
            `<td><span class="badge ${user.status === 1 ? 'bg-primary' : 'bg-danger'}">${user.status === 1 ? 'Bình thường' : 'Nguy cơ'}</span></td>`,
            `<td>
                <div class="flex align-items-center list-user-action">
                    <a class="btn btn-sm bg-primary info-button" data-toggle="tooltip" data-placement="top" title="" data-original-title="Xem" href="../app/patient-profile.html?username=${user.username}"><i class="ri-menu-3-line mr-0"></i></a>
                    <a class="btn btn-sm bg-primary edit-button" data-toggle="tooltip" data-placement="top" title="" data-original-title="Sửa" href="../app/patient-edit.html?username=${user.username}"><i class="ri-pencil-line mr-0"></i></a>
                    <a class="btn btn-sm bg-danger" data-toggle="tooltip" data-placement="top" title="" data-original-title="Xóa" href="#" onclick="deleteUser('${user.username}');"><i class="ri-delete-bin-line mr-0"></i></a>
                </div>
            </td>`
        ];

        // Chèn ô dữ liệu vào dòng mới
        newRow.innerHTML = cells.join('');

        const editButton = newRow.querySelector('.edit-button');
        editButton.addEventListener('click', function() {
            // Chuyển đến trang chỉnh sửa và truyền thông tin của người dùng
            redirectToEditPage(user);
        });
        const infoButton = newRow.querySelector('.info-button');
        editButton.addEventListener('click', function() {
            // Chuyển đến trang chỉnh sửa và truyền thông tin của người dùng
            redirectToEditPage(user);
        });
        // Chèn dòng mới vào bảng
        tableBody.appendChild(newRow);
    });
}
function redirectToEditPage(user) {
    // Sử dụng window.location.href để chuyển hướng đến trang chỉnh sửa
    window.location.href = `patient-edit.html?username=${user.username}`;
}

const inputSearch = document.getElementById('exampleInputSearch');
// Lắng nghe sự kiện khi người dùng nhập vào ô tìm kiếm
inputSearch.addEventListener('input', searchUser);

function searchUser() {

    let allUsers;  // Lưu trữ toàn bộ dữ liệu người dùng

    // Gửi yêu cầu đến API và cập nhật bảng
    fetch('/api/v1/user/')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Lưu trữ toàn bộ dữ liệu người dùng
                allUsers = data.data;

                const searchTerm = inputSearch.value.toLowerCase();

                // Lọc người dùng dựa trên từ khóa tìm kiếm
                const filteredUsers = allUsers.filter(user =>
                    user.name.toLowerCase().includes(searchTerm) ||
                    user.phoneNumber.toLowerCase().includes(searchTerm) ||
                    user.email.toLowerCase().includes(searchTerm)
                );

                // Hiển thị danh sách người dùng đã lọc
                displayListUser(filteredUsers);
            } else {
                console.error('Lỗi khi nhận dữ liệu từ API:', data.message);
            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
        });
};

const getAllUser = async () => {
    fetch('/api/v1/user/')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Hiển thị tất cả người dùng khi trang web được tải
                displayListUser(data.data);
            } else {
                console.error('Lỗi khi nhận dữ liệu từ API:', data.message);
            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
        });
};

function deleteUser(username) {
    Swal.fire({
        title: "Bạn muốn xóa người dùng này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa",
        cancelButtonText: "Không xóa"
    })
        .then((result) => {
            if (result.isConfirmed) {
                fetch(`/api/v1/user/deleteuser/${username}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                        // Các header khác nếu cần
                    },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Xóa thành công, cập nhật lại bảng
                        Swal.fire({
                            title: "Xóa thánh công",
                            icon: "success"
                        });
                        getAllUser();
                    } else {
                        // Hiển thị thông báo lỗi nếu xóa không thành công
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Xóa không thành công"
                        });
                        console.error('Lỗi khi xóa người dùng:', data.message);
                    }
                })
                .catch(error => {
                    // Xử lý lỗi khi gọi API
                    console.error('Lỗi khi gọi API xóa người dùng:', error);
                });
            }
        });
}

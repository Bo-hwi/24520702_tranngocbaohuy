// SLICE 1: Drift-Free Countdown Engine sử dụng mốc thời gian chuẩn UTC ISO 8601
// Thiết lập mốc thời gian đích cố định (Ví dụ: cuối năm 2026)
const TARGET_UTC_TIME = new Date("2026-12-31T23:59:59Z").getTime();

function updateCountdown() {
  const display = document.getElementById("countdown-display");
  if (!display) return;

  const now = Date.now(); // Trả về thời gian thực timestamp độc lập với múi giờ hệ thống
  const timeDifference = TARGET_UTC_TIME - now;

  // Cơ chế phòng vệ đệm lỗi (Resilient Safeguard): Nếu thời gian chạm mốc hoặc âm
  if (timeDifference <= 0) {
    display.textContent = "Sự kiện đã bắt đầu!";
    clearInterval(countdownInterval);
    return;
  }

  // Thuật toán tách Ngày, Giờ, Phút, Giây từ khoảng cách mili-giây
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Ép định dạng hiển thị luôn có 2 chữ số (.padStart) để giao diện không bị dịch chuyển giật lag
  const formatHours = String(hours).padStart(2, '0');
  const formatMinutes = String(minutes).padStart(2, '0');
  const formatSeconds = String(seconds).padStart(2, '0');

  display.textContent = `${days} ngày ${formatHours}:${formatMinutes}:${formatSeconds}`;
}

// Chạy khởi tạo ngay lập tức để tránh hiện tượng màn hình bị trống chữ ở 1 giây đầu tiên
updateCountdown();

// Đăng ký vòng lặp chạy đều đặn sau mỗi 1000 mili-giây (1 giây)
const countdownInterval = setInterval(updateCountdown, 1000);
// ============================================================================
// SLICE 2 & 3: QUẢN LÝ TRẠNG THÁI FORM STATE-MACHINE & PHÒNG VỆ DOUBLE-SUBMIT / XSS
// ============================================================================

const formElement = document.getElementById('registration-form');
const submitBtn = document.getElementById('submit-btn');
const inputEmail = document.getElementById('user-email');

// Khai báo các thẻ thông báo trạng thái
const msgSubmitting = document.querySelector('.msg-submitting');
const msgSuccess = document.querySelector('.msg-success');
const msgError = document.querySelector('.msg-error');

/**
 * Hàm cập nhật trạng thái State-Machine của Form và điều khiển UI tương ứng
 * Trạng thái bắt buộc: 'idle' | 'submitting' | 'success' | 'error'
 */
function setFormState(state) {
  // Cập nhật thuộc tính trạng thái lên giao kèo HTML
  formElement.setAttribute('data-state', state);

  // Ẩn toàn bộ các dòng thông báo trước khi chuyển trạng thái mới
  msgSubmitting.style.display = 'none';
  msgSuccess.style.display = 'none';
  msgError.style.display = 'none';

  if (state === 'submitting') {
    msgSubmitting.style.display = 'block';
    submitBtn.disabled = true; // SLICE 3: Chống Double-Submit (vô hiệu hóa nút ngay lập tức)
  } else if (state === 'success') {
    msgSuccess.style.display = 'block';
    submitBtn.disabled = false;
    formElement.reset(); // Làm sạch trường nhập liệu sau khi đăng ký thành công
  } else if (state === 'error') {
    msgError.style.display = 'block';
    submitBtn.disabled = false;
  } else if (state === 'idle') {
    submitBtn.disabled = false;
  }
}

// Lắng nghe sự kiện người dùng nhấn Submit Form
formElement.addEventListener('submit', (event) => {
  event.preventDefault(); // Chặn hành vi tải lại trang mặc định của trình duyệt

  // SLICE 3: Bảo mật Input Sanitization - Khử độc dữ liệu đầu vào chặn đứng XSS
  // Sử dụng phương thức thay thế các ký tự đặc biệt nguy hiểm thành mã an toàn
  const cleanEmail = inputEmail.value.trim().replace(/[&<>"']/g, function(match) {
    return { 
      '&': '&amp;', 
      '<': '&lt;', 
      '>': '&gt;', 
      '"': '&quot;', 
      "'": '&#x27;' 
    }[match];
  });

  // Chuyển Form sang trạng thái đang xử lý dữ liệu
  setFormState('submitting');

  // Mô phỏng kết nối API gửi lên máy chủ với tỷ lệ lỗi ngẫu nhiên để chứng minh tính bền bỉ
  setTimeout(() => {
    // Tạo giả lập: 70% thành công, 30% gặp lỗi mạng kết nối mạng
    const isNetworkSuccess = Math.random() > 0.3;

    if (isNetworkSuccess) {
      setFormState('success');
    } else {
      setFormState('error');
    }
  }, 1500); // Trì hoãn xử lý trong 1.5 giây để nhìn thấy rõ trạng thái Loading
});

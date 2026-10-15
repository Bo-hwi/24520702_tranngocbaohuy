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

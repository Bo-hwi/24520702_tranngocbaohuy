// Khai báo mảng hàng đợi lưu lịch sử đánh trống ở phạm vi toàn cục (FIFO Queue)
const beatQueue = [];

// Hàm kích hoạt âm thanh dựa trên phần tử nút bấm trống được chọn
function playSound(key) {
  // Tìm nút bấm trống dựa trên giao kèo dữ liệu data-key đã định nghĩa ở HTML
  const pad = document.querySelector(`.drum-pad[data-key="${key.toLowerCase()}"]`);
  
  if (!pad) return;

  // STEP 2: Polyphonic Audio Playback Engine độc lập
  const audioInstance = new Audio(pad.dataset.sound);
  audioInstance.play();

  // Tạo hiệu ứng nhấn trực quan bằng Class Manipulation phục vụ A11y/UX
  pad.classList.add('active');
  setTimeout(() => pad.classList.remove('active'), 100);
}

// Lắng nghe sự kiện gõ phím trên phạm vi toàn bộ cửa sổ trình duyệt
window.addEventListener('keydown', (e) => {
  // STEP 3: Chặn hiện tượng dồn ứ âm thanh (Audio Flooding) khi người dùng đè giữ phím
  if (e.repeat) return; 

  const targetKey = e.key.toLowerCase();
  const pad = document.querySelector(`.drum-pad[data-key="${targetKey}"]`);

  if (pad) {
    // Kích hoạt phát âm thanh trống
    playSound(e.key);

    // STEP 4: Triển khai FIFO Beat Recorder với nhãn thời gian thực (Timestamp)
    beatQueue.push({
      key: targetKey,
      timestamp: Date.now() // Lưu mốc thời gian chính xác mili-giây
    });

    // In ra bảng Console để kiểm tra hàng đợi chạy mượt mà
    console.log("FIFO Recorded Queue:", beatQueue);
  }
});

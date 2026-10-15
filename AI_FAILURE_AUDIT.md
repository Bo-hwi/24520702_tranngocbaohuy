# AI Failure Mode Audit Report - HW1, HW2, HW3
**Student:** Trần Ngọc Bảo Huy
**Course:** Web Architecture & Production Engineering - MSc. Trần Vĩnh Khiêm

Dưới đây là tài liệu kiểm định chi tiết về 3 lỗi logic, kiến trúc nghiêm trọng do mô hình AI tạo ra (AI-induced defects) đã được phát hiện, phân tích và sửa chữa thủ công để bảo toàn tính bền bỉ (resilience) cho hệ thống.

---

## 🚨 defect 1: Vi phạm Luật Kiến trúc DOM Ngữ nghĩa (Zero Divs Penalty)
* **Mô tả mã lỗi do AI đề xuất:** Khi yêu cầu AI dựng khung giao diện nhanh cho khối Kỹ năng (`#skills`), phần Dự án (`#projects`) và khối Bộ trống (`#drum-kit`), AI đã liên tục tạo ra các thẻ phi ngữ nghĩa vô tội vạ như `<div class="skills-grid">` và `<div class="drum-container">`.
* **Hệ quả cấu trúc:** Vi phạm trực tiếp quy tắc nghiêm ngặt của môn học (Phạt 0 điểm toàn bộ phần kiến trúc nếu dính thẻ `div`). Gây mất cấu trúc cây Landmark Tree chuẩn tiếp cận thông tin (A11y).
* **Giải pháp khắc phục thủ công:** Tiến hành xóa bỏ và thay thế toàn bộ các thẻ `div` bừa bãi này bằng các thẻ danh sách ngữ nghĩa chuẩn như `<menu>`, `<article>`, và các thẻ phần tử con `<li>` tương ứng để đạt cấu trúc Clean DOM tuyệt đối.

---

## 🚨 defect 2: Trùng lặp thẻ Script Chân trang (Double Execution Engine)
* **Mô tả mã lỗi do AI đề xuất:** Trong quá trình hướng dẫn nhúng các file điều khiển logic `drum-kit.js` và `landing-page.js` vào HTML, do cơ chế chèn nối tiếp không tối ưu context, AI đã tạo ra đoạn mã lặp lại các thẻ script này hai lần (vừa nằm xen giữa các khối dự án, vừa nằm dưới đáy thẻ `<main>`).
* **Hệ quả cấu trúc:** Trình duyệt sẽ tải, biên dịch và đăng ký lắng nghe sự kiện (`addEventListener`) hai lần. Gây ra lỗi logic nghiêm trọng khi gõ một phím trống (HW2) sẽ kích hoạt 2 tiếng trống đè lên nhau, và khi submit form (HW3) sẽ làm nhân đôi lượng request mô phỏng gửi lên server.
* **Giải pháp khắc phục thủ công:** Cô lập khu vực chân trang, xóa bỏ hoàn toàn 2 dòng script thừa thãi ở dòng 122-123, chỉ giữ lại duy nhất 1 cặp thẻ script ở sát trên thẻ đóng `</main>` để đảm bảo vòng đời chạy script tuần tự chuẩn xác.

---

## 🚨 defect 3: Thiếu tính năng Đồng bộ Hàng đợi FIFO Beat Recorder trong Engine Âm thanh
* **Mô tả mã lỗi do AI đề xuất:** Ở phiên bản mã nguồn đầu tiên cho file `drum-kit.js`, AI chỉ tập trung viết bộ phát âm đa âm (Polyphonic) và bộ chặn đè phím giữ (`e.repeat`), nhưng bỏ sót hoàn toàn cơ chế ghi lịch sử sự kiện phím gõ theo thời gian thực.
* **Hệ quả cấu trúc:** Thiếu hụt 25% tính năng cốt lõi của HW2 (Step 4), hệ thống không có khả năng lưu trữ chuỗi sự kiện đánh trống phục vụ tính năng phát lại (playback) sau này.
* **Giải pháp khắc phục thủ công:** Khởi tạo một mảng hàng đợi toàn cục `const beatQueue = [];`, bổ sung logic ép mảng (push) các đối tượng chứa nhãn khóa `key` kèm mốc thời gian thực chuẩn xác mili-giây `Date.now()` ngay bên trong sự kiện lắng nghe bàn phím để phục vụ tính năng lưu lịch sử đúng giao kèo dữ liệu.

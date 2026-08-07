# Xử lý các trường hợp Unhappy Case trong CI/CD

Chào bạn, làm việc với CI/CD (Continuous Integration/Continuous Deployment) thì việc gặp "unhappy case" (các trường hợp lỗi, hỏng hóc) là điều diễn ra hằng ngày. Mục tiêu tối thượng của CI/CD không phải là đảm bảo code không bao giờ lỗi, mà là **phát hiện lỗi càng sớm càng tốt và chặn không cho lỗi lan ra môi trường thực tế (Production).**

Dưới đây là tổng quan các chiến lược xử lý unhappy case, sau đó là các luồng (flow) thực tế chi tiết, dễ tiếp cận.

## Tổng quan: Các cách xử lý Unhappy Case trong CI/CD

Khi một pipeline gặp sự cố, hệ thống CI/CD chuyên nghiệp thường sẽ áp dụng các cơ chế sau:

1. **Nguyên tắc "Fail Fast" (Dừng ngay lập tức):** 
   Nếu một bước (stage) thất bại, toàn bộ pipeline sẽ lập tức bị hủy. Ví dụ: Nếu bước *Unit Test* báo đỏ, bước *Build Docker Image* và *Deploy* phía sau sẽ không bao giờ được chạy. Điều này giúp tiết kiệm tài nguyên server và ngăn chặn mã lỗi bị đẩy đi xa hơn.
2. **Cảnh báo và Thông báo (Alerting & Notification):**
   Hệ thống sẽ ngay lập tức "réo tên" người vừa push đoạn code gây lỗi (thường qua Slack, Microsoft Teams, hoặc Email) kèm theo đường link dẫn thẳng đến chi tiết lỗi để họ xử lý.
3. **Lưu trữ Log chi tiết (Traceability):**
   Mọi console log, báo cáo test (test reports), hoặc file thực thi (artifacts) trước thời điểm crash đều được CI/CD server lưu lại để developer có thể vào đọc và biết chính xác dòng code nào, test case nào bị hỏng.
4. **Cơ chế Thử lại (Auto-Retry):**
   Áp dụng riêng cho các lỗi mang tính chập chờn (flaky) không do code, ví dụ: rớt mạng khi đang tải thư viện (NPM/Maven dependencies) hoặc timeout khi gọi API bên thứ ba. Pipeline có thể được cấu hình để tự động chạy lại bước đó 1-2 lần trước khi thực sự báo lỗi.
5. **Rollback tự động (Automated Revert):**
   Nếu rủi ro lọt qua được khâu Test và làm hỏng khâu Deploy (Triển khai lên server), hệ thống CD cần có kịch bản tự động lùi về (rollback) phiên bản code ổn định gần nhất trước đó.
6. **Chặn gộp code (Branch Protection):**
   Thiết lập quy tắc trên GitHub/GitLab: Nút "Merge" sẽ bị khóa xám nếu CI pipeline chưa chạy xong hoặc báo lỗi. Chỉ khi nào pipeline "xanh", code mới được phép đi vào nhánh chính (`main`/`master`).

---

## Tình huống 1: Khi Code "chạy ngon trên máy dev" nhưng tạch trên CI

Đây là unhappy case phổ biến nhất và cũng là bài học vỡ lòng cho bất kỳ ai làm quen với CI/CD: **Lỗi Unit Test do thiếu thư viện hoặc sai logic trên môi trường CI.**

**Bước 1: Kích hoạt (Trigger) - Developer Push Code**
Developer hoàn thành một tính năng, tự chạy thử trên máy cá nhân thấy ổn. Sau đó, họ commit code và tạo một Pull Request (PR) để gộp vào nhánh chính. Hành động này đánh thức CI Server.

**Bước 2: Giai đoạn Build (Thành công)**
CI Server tạo một môi trường trống, tải code mới nhất về và cài đặt các thư viện cần thiết. Quá trình thành công.

**Bước 3: Giai đoạn Test (Sự cố xảy ra!)**
CI Server chạy lệnh test. Một vài test case bị FAILED do hàm tính toán bị sai logic.

**Bước 4: Dừng khẩn cấp (Fail Fast) & Chặn Merge**
Ngay khi phát hiện lỗi, CI Server lập tức **hủy bỏ** các bước tiếp theo. Nút "Merge PR" bị vô hiệu hóa để bảo vệ nhánh chính.

**Bước 5: Cảnh báo & Gỡ lỗi (Debugging)**
CI Server gửi tin nhắn vào Slack. Developer nhấp vào link, kiểm tra **Console Logs** và tìm ra dòng code sai.

**Bước 6: Sửa lỗi & Phục hồi (Recovery)**
Developer sửa đoạn code bị sai, `push` lại. CI Server chạy lại pipeline. Nếu vượt qua, tick xanh xuất hiện, nút Merge mở khóa.

---

## Tình huống 2: Lỗi phát hiện SAU KHI đã Integrate (Đã gộp code)

**Vấn đề:** Code đã vượt qua CI, được gộp (merge) vào nhánh chính (`main`), nhưng sau đó QA (Tester) hoặc Developer xem lại và phát hiện logic nghiệp vụ bị sai. Cần lùi lại (Rollback) khẩn cấp để không ảnh hưởng đến người khác đang code trên nhánh chính.

**Cách xử lý (Nguyên lý chung): Không xóa lịch sử, hãy "Đảo ngược" (Git Revert)**

*   **Sai lầm của người mới:** Cố gắng dùng các lệnh xóa lịch sử (như `git reset`) để ép nhánh chính quay về quá khứ. Điều này làm hỏng cấu trúc Git của toàn bộ team.
*   **Cách làm đúng (Git Revert):** 
    1. Developer sử dụng lệnh `git revert <mã_commit_bị_lỗi>`. 
    2. Lệnh này không xóa bất cứ thứ gì, mà nó tạo ra một **Commit mới** có nội dung "chống lại" (undo) chính xác những gì commit lỗi kia vừa thêm vào.
    3. Developer đẩy (push) commit revert này lên.
    4. CI Server thấy code mới lại chạy quy trình Build & Test như bình thường. Nhánh chính được an toàn trở về trạng thái ổn định mà không ai trong team bị lỗi đồng bộ.

---

## Tình huống 3: Lỗi phát hiện SAU KHI đã Deploy (Sự cố Production)

**Vấn đề:** Code đã lên môi trường thực tế (Production). Khách hàng bắt đầu sử dụng và hệ thống báo lỗi liên tục (app crash, không thanh toán được,...). Ưu tiên lúc này không phải là tìm ra dòng code nào sai để sửa, mà là **dập lửa ngay lập tức** bằng cách đưa hệ thống về phiên bản cũ hoạt động tốt.

**Cách xử lý (Nguyên lý chung): Triển khai lại bản cũ, KHÔNG build lại từ đầu**

*   **Nguyên lý số 1: Re-deploy Artifact/Image cũ**
    *   Hệ thống CI/CD chuyên nghiệp (như Jenkins, ArgoCD, GitHub Actions) luôn đóng gói mã nguồn thành các "cục" (Artifacts hoặc Docker Images) và đánh số phiên bản (Ví dụ: `v1.0`, `v1.1`, `v1.2`).
    *   Khi bản `v1.2` (vừa lên) bị lỗi, người vận hành chỉ cần vào bảng điều khiển CD chọn: *"Deploy lại bản v1.1"*.
    *   Hệ thống sẽ lấy ngay "cục" `v1.1` đã được test kỹ trước đó đẩy lên server trong vài chục giây. Tuyệt đối không chạy lại quá trình compile/build code lúc dầu sôi lửa bỏng.
*   **Nguyên lý số 2: Đổi luồng giao thông (Blue/Green Deployment - Dành cho hệ thống xịn)**
    *   Hệ thống luôn chạy song song 2 phiên bản trên 2 cụm máy chủ khác nhau: Bản cũ (Blue) và Bản mới (Green).
    *   Khi mới deploy, người dùng được dẫn vào cụm Green. Nếu phát hiện Green bị lỗi, người quản trị chỉ cần "gạt công tắc" ở bộ định tuyến (Load Balancer) để toàn bộ người dùng ngay lập tức đi vào lại cụm Blue (bản cũ vẫn đang chạy sẵn). Thời gian rollback gần như bằng 0, khách hàng thậm chí không nhận ra lỗi.

> **Bài học rút ra:** Rollback trong CI/CD không phải là một sự thất bại đáng xấu hổ, mà là một "nút thoát hiểm" (panic button) được thiết kế có chủ đích. Việc chuẩn bị sẵn kịch bản Rollback minh bạch sẽ giúp team tự tin hơn rất nhiều mỗi lần ra mắt tính năng mới.

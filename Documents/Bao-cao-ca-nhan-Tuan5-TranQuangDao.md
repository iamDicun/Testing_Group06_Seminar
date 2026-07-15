# Báo cáo Khảo sát Công cụ Cá nhân — Tuần 5

**Họ và tên:** Trần Quang Đạo (Alvin)  
**MSSV:** 21127498  
**Nhóm:** 06  
**Chủ đề:** CI/CD & Test-Harness Engineering  
**Công cụ phân công:** CircleCI (CI/CD – Cloud SaaS) & SonarQube (Code Quality & Security)

---

## PHẦN 1: KHẢO SÁT CÔNG CỤ CIRCLECI (CI/CD – CLOUD SAAS)

### 1. Kịch bản test dự kiến thực hiện
* **Mô tả kịch bản:** Thiết lập một luồng CI cơ bản cho ứng dụng frontend React viết bằng Vite và Tailwind CSS. Cấu hình pipeline tự động cài đặt các thư viện phụ thuộc (dependencies) và kích hoạt bộ kiểm thử đơn vị (Unit Test) sử dụng framework Jest mỗi khi lập trình viên thực hiện push code lên nhánh chính (`main`).
* **Input và các bước thao tác:**
  1. Khởi tạo một dự án React/Vite cơ bản tại local, viết 2-3 hàm tiện ích kèm theo các unit test tương ứng bằng Jest.
  2. Tạo thư mục `.circleci` tại thư mục gốc của dự án và khởi tạo file cấu hình workflow đặt tên là `config.yml`.
  3. Đăng nhập vào bảng điều khiển (Dashboard) của CircleCI thông qua tài khoản VCS (GitHub), cấp quyền truy cập vào repository của dự án.
  4. Thực hiện thay đổi mã nguồn tại local và kích hoạt pipeline bằng lệnh `git push origin main`.
* **Kết quả mong đợi:** Kiểm tra trên giao diện web của CircleCI thấy job tương ứng được kích hoạt thành công. Các bước thực thi bao gồm *Spin up environment*, *Checkout code*, *Install Node.js packages*, và *Run tests* đều hiển thị trạng thái hoàn thành (Pass - tích xanh). Trong trường hợp cố tình sửa mã nguồn làm gãy test case rồi push lên, pipeline sẽ đổi sang trạng thái lỗi (Fail - dấu chữ thập đỏ) và gửi email cảnh báo về cho hệ thống.

### 2. Chức năng chính
CircleCI giải quyết bài toán tự động hóa hoàn toàn quy trình tích hợp liên tục (CI) và chuyển giao liên tục (CD) trên nền tảng đám mây, giúp loại bỏ các thao tác thủ công dễ sai sót của lập trình viên. Các tính năng cốt lõi bao gồm:
* **Tự động hóa luồng tích hợp:** Hỗ trợ tự động chạy build, kiểm thử mã nguồn, đóng gói sản phẩm đầu ra (artifact) ngay khi phát hiện thay đổi trên repository.
* **Cơ chế Caching mạnh mẽ:** Hỗ trợ lưu trữ lại bộ nhớ đệm cho các file phụ thuộc (như thư mục `node_modules`), giúp giảm thiểu tối đa thời gian cài đặt ở các lần build tiếp theo.
* **Chạy song song (Parallelism) và Sharding:** Cho phép chia tách các tập tin kiểm thử để chạy đồng thời trên nhiều container biệt lập, tối ưu hóa tốc độ phản hồi feedback.
* **Hệ sinh thái CircleCI Orbs:** Các gói cấu hình mã nguồn mở được đóng gói sẵn giúp người dùng tái sử dụng nhanh chóng (ví dụ: dùng Node orb để thiết lập môi trường chạy Node.js chỉ với một dòng lệnh).

### 3. Nguyên lý hoạt động
* **Cơ chế kích hoạt:** Hoạt động theo mô hình **pull-based** ở góc độ CI. Hệ thống lắng nghe các sự kiện (Push, Pull Request) từ kho chứa mã nguồn (GitHub/Bitbucket) thông qua kết nối Webhook được cấu hình tự động.
* **Ngôn ngữ cấu hình:** Toàn bộ kịch bản và luồng công việc được định nghĩa tập trung trong tập tin định dạng YAML (`.circleci/config.yml`).
* **Môi trường thực thi (Executor):** Khi workflow được kích hoạt, CircleCI sẽ cấp phát các môi trường ảo độc lập dựa trên cấu hình (có thể là Docker container, máy ảo Linux Machine, Windows, hoặc macOS).
* **Luồng dữ liệu di chuyển:** Lập trình viên Push code (Input) $ightarrow$ Webhook thông báo tới CircleCI $ightarrow$ Hệ thống điều phối cấp phát Executor $ightarrow$ Thực hiện kéo mã nguồn về và chạy chuỗi lệnh tự động (Xử lý nội bộ) $ightarrow$ Kết xuất báo cáo kiểm thử, lưu trữ Docker image hoặc file artifact (Output/Report).

### 4. Điểm mạnh
* **Tốc độ thực thi tối ưu:** Nhờ kiến trúc tối ưu hóa nâng cao cho lưu trữ cache và khả năng thực thi song song hiệu năng cao, CircleCI thường cho thời gian hoàn thành pipeline rất ngắn.
* **Khả năng debug trực quan:** Cung cấp tính năng "Rerun job với quyền SSH", cho phép lập trình viên truy cập trực tiếp vào container đang chạy lỗi để gỡ lỗi trong môi trường thực tế.
* **So sánh ngắn gọn:** Khác với GitHub Actions vốn được tích hợp mặc định sâu vào hệ sinh thái GitHub, CircleCI là nền tảng độc lập chuyên biệt cao, mang lại khả năng quản lý tài nguyên và tùy biến các pipelines phức tạp tốt hơn đối với các dự án quy mô doanh nghiệp lớn.

### 5. Điểm yếu / hạn chế
* **Chi phí tài nguyên tăng nhanh:** Mô hình tính phí dựa trên mức độ tiêu thụ tài nguyên thực tế (số phút build, dung lượng RAM/CPU cấp phát). Đối với các dự án lớn có tần suất commit dày đặc, chi phí có thể vượt kiểm soát nếu không tối ưu hóa file config.
* **Độ dốc đường cong học tập:** Hệ thống phân tách cấu hình thành nhiều khái niệm như Workflows, Jobs, Steps, và Executors, khiến người mới bắt đầu dễ bị bối rối so với cấu hình dạng tuyến tính đơn giản của một số công cụ khác.

### 6. Hỗ trợ ngôn ngữ lập trình
* **Mức độ hỗ trợ:** Hỗ trợ không giới hạn bất kỳ ngôn ngữ hay nền tảng nào, miễn là môi trường đó có thể đóng gói thành một Docker image hoặc chạy trên các hệ điều hành phổ biến.
* **Phù hợp với dự án nhóm:** Cực kỳ phù hợp cho cấu trúc mã nguồn web full-stack hiện đại của nhóm. CircleCI cung cấp sẵn các bộ Orb tối ưu cho Node.js/React (áp dụng tại `application/frontend-*`) và ExpressJS (áp dụng tại `application/backend`), giúp kiểm soát đồng bộ phiên bản thư viện giữa môi trường local và máy chủ build.

### 7. Hỗ trợ AI
Hệ thống tích hợp tính năng CircleCI Insights sử dụng dữ liệu thống kê lịch sử chạy pipeline để phân tích xu hướng, tự động phát hiện các flaky test (test không ổn định) hoặc cảnh báo tình trạng nghẽn cổ chai. Đối với việc kiểm tra an toàn hay đánh giá mã nguồn bằng AI, CircleCI cho phép tích hợp linh hoạt các plugin/actions của bên thứ ba như DeepCode AI hoặc SonarQube thông qua các bước quét tĩnh trong pipeline.

---

## PHẦN 2: KHẢO SÁT CÔNG CỤ SONARQUBE (CODE QUALITY & SECURITY)

### 1. Kịch bản test dự kiến thực hiện
* **Mô tả kịch bản:** Thực hiện phân tích chất lượng mã nguồn tĩnh và rà quét các lỗ hổng an toàn thông tin (Security Vulnerabilities) cho một dự án RESTful API phát triển trên nền tảng Node.js và ExpressJS.
* **Input và các bước thao tác:**
  1. Khởi chạy một máy chủ SonarQube cục bộ tại local thông qua môi trường Docker (`docker run -d -p 9000:9000 sonarqube`).
  2. Tạo file cấu hình `sonar-project.properties` tại thư mục gốc của backend để khai báo mã định danh dự án và đường dẫn thư mục nguồn.
  3. Cố tình chèn vào mã nguồn backend một số lỗi điển hình: một đoạn mã hardcoded chuỗi bí mật (API Key/Mật khẩu Database) và một hàm truy vấn SQL có nguy cơ dính lỗi SQL Injection.
  4. Chạy công cụ SonarScanner thông qua Terminal tại máy local để quét toàn bộ mã nguồn và đẩy dữ liệu lên máy chủ phân tích.
* **Kết quả mong đợi:** Truy cập vào giao diện Web UI tại địa chỉ `localhost:9000`, hệ thống hiển thị trạng thái dự án là **Failed** (Không vượt qua Quality Gate). Giao diện chỉ rõ vị trí dòng code chứa lỗ hổng bảo mật, phân loại mức độ nghiêm trọng (Critical/Major), đồng thời đưa ra cảnh báo về nợ kỹ thuật (Technical Debt) cùng tỷ lệ bao phủ kiểm thử (Coverage).

### 2. Chức năng chính
SonarQube đóng vai trò là chốt chặn kiểm soát chất lượng mã nguồn toàn diện, thực hiện phân tích mã tĩnh (Static Application Security Testing - SAST). Các tính năng cốt lõi gồm:
* **Phát hiện Bug và Code Smell:** Nhận diện các lỗi logic tiềm ẩn, mã dư thừa không sử dụng hoặc các đoạn code viết tồi làm giảm khả năng bảo trì của hệ thống.
* **Quét lỗ hổng bảo mật chuyên sâu:** Phát hiện các rủi ro an toàn thông tin dựa trên các tiêu chuẩn quốc tế như OWASP Top 10 và CWE (như XSS, SQL Injection, Hardcoded Secrets).
* **Thiết lập Chốt chặn chất lượng (Quality Gates):** Ràng buộc các tiêu chí bắt buộc để mã nguồn được phép merge hoặc deploy (ví dụ: độ phủ test case > 80%, không có bug nghiêm trọng).
* **Dashboard theo dõi xu hướng:** Trực quan hóa tiến độ cải thiện chất lượng mã nguồn và thống kê nợ kỹ thuật theo thời gian của dự án.

### 3. Nguyên lý hoạt động
* **Cơ chế phân tích:** Hoạt động theo nguyên lý Phân tích mã tĩnh (Static Analysis) mà không cần kích hoạt chạy thực tế ứng dụng, duyệt qua Cây cú pháp trừu tượng (Abstract Syntax Tree - AST) của mã nguồn để đối chiếu với tập quy tắc.
* **Kiến trúc Client - Server:**
  * *SonarScanner (Client):* Chạy cục bộ tại máy lập trình viên hoặc tích hợp như một step trong các runner của CI/CD pipeline để tiến hành quét mã nguồn thô và xuất ra file dữ liệu phân tích.
  * *SonarQube Server (Server):* Nhận file dữ liệu phân tích (theo cơ chế **push-based** từ client gửi lên), xử lý tính toán điểm số chất lượng, đối chiếu với bộ rule set, lưu trữ vào cơ sở dữ liệu (PostgreSQL) và hiển thị lên giao diện Web UI.

### 4. Điểm mạnh
* **Thúc đẩy chiến lược Shift-Left Security:** Giúp phát hiện các điểm yếu về mặt logic và bảo mật từ rất sớm trong chu kỳ phát triển phần mềm (SDLC), giúp giảm thiểu tối đa chi phí khắc phục lỗi so với việc phát hiện ở giai đoạn kiểm thử thủ công hay trên production.
* **Bộ quy tắc phong phú và chuẩn hóa:** Tích hợp sẵn hàng nghìn quy tắc phân tích được cập nhật liên tục theo các tiêu chuẩn bảo mật phần mềm hiện đại.
* **Quản lý nợ kỹ thuật tối ưu:** Dashboard trực quan giúp nhà quản lý theo dõi sát sao sức khỏe của dự án phần mềm theo dài hạn.

### 5. Điểm yếu / hạn chế
* **Gánh nặng về hạ tầng và bảo trì:** Việc tự vận hành và cấu hình hệ thống máy chủ SonarQube (Self-hosted) tương đối phức tạp, đòi hỏi tài nguyên phần cứng lớn (khuyến nghị tối thiểu 2GB RAM cho Java Heap).
* **Ràng buộc chi phí phiên bản:** Phiên bản miễn phí (Community) bị giới hạn nhiều tính năng nâng cao (ví dụ: không hỗ trợ phân tích riêng biệt theo từng nhánh - Branch Analysis hoặc kiểm tra Pull Request). Các phiên bản thương mại có mức giá bản quyền rất cao đối với các nhóm nhỏ.

### 6. Hỗ trợ ngôn ngữ lập trình
* **Mức độ hỗ trợ:** Hỗ trợ mạnh mẽ và chính thức hơn 30 ngôn ngữ lập trình phổ biến nhất hiện nay (bao gồm JavaScript, TypeScript, Python, Java, C#, C++, Go, v.v.).
* **Phù hợp với dự án nhóm:** Hoàn toàn tương thích và cần thiết cho dự án. Công cụ có khả năng quét chất lượng mã nguồn cho cả phần giao diện React (`application/frontend-*`) lẫn các kiến trúc định tuyến và xử lý dữ liệu của ExpressJS ở phía backend (`application/backend`).

### 7. Hỗ trợ AI
SonarQube đã tích hợp các tính năng AI-Assisted mã nguồn nâng cao. Khi phát hiện lỗi hoặc lỗ hổng bảo mật phức tạp, hệ thống sử dụng các mô hình ngôn ngữ lớn (LLMs) để đưa ra lời giải thích chi tiết về nguyên nhân gây lỗi, đồng thời tự động đề xuất đoạn mã sửa lỗi tối ưu (Fix Suggestions) trực tiếp trên giao diện, giúp lập trình viên rút ngắn thời gian sửa mã nguồn (remediation time).

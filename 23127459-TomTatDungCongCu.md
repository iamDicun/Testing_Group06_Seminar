# Tóm tắt báo cáo sử dụng công cụ (5 cái đầu)

## I. GitHub Actions

### 1. Chức năng
- **Bài toán giải quyết:** GitHub Actions là nền tảng tích hợp sẵn CI/CD giúp tự động hóa toàn bộ quy trình phát triển phần mềm (Software Workflow) ngay trên GitHub. Trong Test-Harness Engineering, nó đóng vai trò là một hệ thống kích hoạt (Trigger System) và điều phối (Orchestrator), tự động chuẩn bị môi trường độc lập để chạy các bộ công cụ kiểm thử tự động, quét lỗi mã nguồn và triển khai ứng dụng mà không cần sự can thiệp thủ công của con người.
- **Tính năng cốt lõi:**
  - **CI/CD:** Tự động hóa các quy trình xây dựng (Build), kiểm thử (Test) mã nguồn liên tục khi có sự kiện thay đổi code, và triển khai (Deploy) sản phẩm lên các môi trường lưu trữ/Cloud.
  - **Tự động hóa quy trình:** Hệ thống cho phép tự động hóa bất kỳ sự kiện nào trên GitHub (ví dụ: Tự động gắn tag khi tạo Issue mới, tự động đóng các Pull Request bị bỏ quên).
  - **Quét mã và bảo mật:** Tích hợp tính năng tự động quét mã nguồn để phát hiện sớm các lỗ hổng bảo mật hoặc lỗi logic trước khi code được gộp vào nhánh chính.
  - **Hệ thống Workflow Templates phong phú:** Cung cấp sẵn các cấu hình mẫu (Templates) tối ưu cho từng loại ngôn ngữ và framework, giúp khởi tạo quy trình làm việc (Workflow) ban đầu nhanh chóng mà không cần viết từ đầu.
  - **Quản lý trang (Pages/Artifacts Management):** Hỗ trợ tự động hóa việc đóng gói sản phẩm, lưu trữ báo cáo kiểm thử (Artifacts) và triển khai các trang web tĩnh qua GitHub Pages.

### 2. Giá
- **Kho chứa công khai (Public Repositories):** Hoàn toàn miễn phí, có thể chạy bao nhiêu phút tùy thích, không giới hạn tính năng và thời gian chạy pipeline cho tất cả các dự án mã nguồn mở hoặc bài tập để chế độ Public.
- **Kho chứa riêng tư (Private Repositories):** Tính phí dựa trên số phút chạy (Compute Minutes) và dung lượng lưu trữ kết quả (Storage) mỗi tháng:
  - **Gói Free (Cá nhân):** Miễn phí 2,000 phút chạy/tháng và 500MB lưu trữ.
  - **Gói GitHub Pro:** Tặng 3,000 phút chạy/tháng và 1GB lưu trữ.
  - **Gói GitHub Enterprise:** Lên đến 50,000 phút chạy/tháng và 50GB lưu trữ.
  - *Lưu ý về hệ số nhân hệ điều hành:* Máy ảo Linux tính 1 phút; Windows nhân hệ số 2; macOS nhân hệ số 10 (chạy 1 phút thực tế bị trừ 10 phút miễn phí).

### 3. Điểm mạnh
- **Hệ sinh thái GitHub Marketplace khổng lồ:** Có hàng ngàn "Actions" được viết sẵn từ cộng đồng (ví dụ: action setup Node.js, Docker, AWS...). Chỉ cần gọi tên ra xài, giúp tiết kiệm thời gian viết script cấu hình tối đa.
- **Tích hợp sâu, không cần cài đặt:** Nằm ngay trong kho chứa code của GitHub, phân quyền bảo mật (Secrets) cực kỳ an toàn và mượt mà với Pull Request mà không cần cấu hình Webhook bên ngoài.
- **Hỗ trợ đa nền tảng (Multi-platform OS):** Cho phép chạy thử nghiệm code trên cả 3 hệ điều hành lớn (Linux, Windows, macOS) cùng lúc trong cùng một workflow dễ dàng thông qua tính năng `matrix`.

### 4. Điểm yếu
- **Giới hạn phút chạy miễn phí trên Repo riêng tư:** Đối với các dự án đóng kín của doanh nghiệp lớn, số phút free bị cạn kiệt rất nhanh, dẫn đến phát sinh chi phí phát triển không mong muốn.
- **Khó khăn khi chạy thử nghiệm local (Debug offline):** GitHub Actions không hỗ trợ sẵn công cụ chạy thử workflow dưới máy cá nhân. Developer phải dùng công cụ bên thứ ba (như `act`) hoặc phải push code liên tục lên GitHub để test thử file YAML có chạy đúng hay không.
- **Cú pháp YAML dễ phình to:** Khi dự án lớn dần và phức tạp, file cấu hình workflow sẽ cực kỳ dài, gây khó khăn cho việc quản trị nếu không module hóa tốt.

### 5. Hỗ trợ ngôn ngữ
- **Danh sách hỗ trợ chính thức:** Hỗ trợ tất cả mọi ngôn ngữ và nền tảng thông qua hệ thống máy ảo có cài sẵn công cụ hoặc chạy bằng Docker container.
- **Mức độ phù hợp với dự án nhóm (Node.js/React):** Cực kỳ tối ưu. Cung cấp sẵn template chính thức mang tên `actions/setup-node`. Khi áp dụng vào dự án `eshop` (frontend/backend Node.js), workflow sẽ tự động cài đặt phiên bản Node.js mong muốn, cache lại thư mục `node_modules` giúp tăng tốc độ chạy lệnh `npm install` và thực thi các bài test cực kỳ nhanh chóng.

### 6. Hỗ trợ AI (đọc code)
- **Công cụ tích hợp:** Tích hợp tính năng **Copilot in GitHub Actions** (thuộc hệ sinh thái GitHub Copilot).
- **Chức năng chính của AI:**
  - **Tự động phân loại và giải thích lỗi:** Khi pipeline bị Fail, AI sẽ phân tích log Terminal và đưa ra gợi ý giải thích lý do tại sao test fail, đồng thời đề xuất cách sửa code bằng ngôn ngữ tự nhiên ngay tại tab Actions.
  - **Auto-suggest file cấu hình:** Hỗ trợ viết và hoàn thiện các file YAML cấu hình workflow thông qua chat trực tiếp hoặc gợi ý mã (Smart suggestions).

### 7. Tài liệu tham khảo
- GitHub Docs – Quickstart for GitHub Actions: `https://docs.github.com/en/actions/get-started/quickstart`
- GitHub Docs – About billing for GitHub Actions: `https://docs.github.com/en/billing/managing-billing-for-your-github-account/about-billing-for-github-actions`
- GitHub Docs – Building and testing Node.js: `https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs`
- GitHub Docs – Using GitHub Copilot in GitHub Actions: `https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-in-github-actions`

---

## II. Jest

### 1. Chức năng
- **Bài toán giải quyết:** Jest là một framework JavaScript Testing dùng để thực hiện các bài kiểm thử Đơn vị (Unit Test) và Kiểm thử Tích hợp (Integration Test). Trong Test-Harness Engineering, Jest cung cấp toàn bộ môi trường từ bộ công cụ chạy test (Test Runner), thư viện so sánh kết quả (Assertion Library) cho đến công cụ giả lập dữ liệu (Mocking Object) để cô lập mã nguồn cần kiểm tra.
- **Tính năng cốt lõi:**
  - **Zero Configuration:** Tự động nhận diện và chạy các file test trong dự án JavaScript/TypeScript mà không cần cấu hình phức tạp.
  - **Snapshot Testing:** Chụp lại cấu trúc giao diện (UI) hoặc dữ liệu tại một thời điểm để so sánh với các thay đổi trong tương lai, cực kỳ mạnh mẽ khi test component React.
  - **Built-in Mocking:** Giả lập dễ dàng các hàm (Functions), module, hoặc API gọi từ bên ngoài để kiểm tra độc lập phần logic cốt lõi.

### 2. Giá
- **Chính sách:** Hoàn toàn **Miễn phí (Free)** và là mã nguồn mở (Open Source) dưới giấy phép MIT License. Người dùng có thể sử dụng không giới hạn cho cả dự án cá nhân, thương mại hay giáo dục mà không tốn bất kỳ chi phí bản quyền nào.

### 3. Điểm mạnh
- **Tốc độ thực thi nhanh và song song:** Jest chạy các file bài test trong các tiến trình (worker processes) cô lập một cách song song, giúp tối ưu hóa hiệu năng tài nguyên máy tính.
- **Xem độ bao phủ mã nguồn (Code Coverage):** Tích hợp sẵn công cụ xuất báo cáo độ bao phủ mã nguồn (`--coverage`) mà không cần cài thêm thư viện bên ngoài như Istanbul.
- **Thông báo lỗi trực quan:** Trình bày log lỗi cực kỳ rõ ràng, chỉ ra chính xác dòng code bị lỗi và sự khác biệt (diff) giữa kết quả thực tế và mong đợi.

### 4. Điểm yếu
- **Tiêu tốn bộ nhớ (Memory Intensive):** Do cơ chế cô lập môi trường và chạy song song, Jest có thể ngốn rất nhiều RAM của hệ thống khi chạy những bộ kiểm thử lớn (Large test suites).
- **Môi trường DOM giả lập (jsdom):** Jest sử dụng `jsdom` để giả lập trình duyệt trong môi trường Node.js. Điều này giúp chạy test nhanh nhưng một số tính năng đặc thù của trình duyệt thật (như layout, hiệu ứng hình ảnh, định vị tọa độ chuột) sẽ không thể kiểm tra chính xác 100%.

### 5. Hỗ trợ ngôn ngữ
- **Danh sách hỗ trợ chính thức:** Hỗ trợ tối đa cho **JavaScript, TypeScript** và các framework đi kèm như **React, Vue, Angular, Node.js**.
- **Mức độ phù hợp với dự án nhóm (Node.js/React):** Hoàn toàn tuyệt đối (100% Matching). Vì dự án `eshop` sử dụng React ở frontend và Node.js ở backend, Jest chính là công cụ tiêu chuẩn hàng đầu để viết Unit Test cho logic giỏ hàng, áp dụng coupon ở `Checkout.jsx` hay các API xử lý đơn hàng ở backend.

### 6. Hỗ trợ AI (đọc code)
- **Công cụ bên thứ ba:** Sử dụng kết hợp với **GitHub Copilot, CodiumAI hoặc Tabnine**.
- **Chức năng chính của AI:** Tự động đọc và phân tích hàm logic có sẵn (ví dụ hàm tính giá tiền sau khi giảm giá của `eshop`) rồi tự sinh ra toàn bộ file bài test Jest tương ứng (Auto-generate test cases), bao gồm cả trường hợp kiểm thử biên (Boundary test) và dữ liệu lỗi.

### 7. Tài liệu tham khảo
- Jest Official Documentation: `https://jestjs.io/docs/getting-started`
- Jest Repository on GitHub: `https://github.com/jestjs/jest`

---

## III. ArgoCD

### 1. Chức năng
- **Bài toán giải quyết:** ArgoCD là một công cụ Triển khai liên tục (CD) khai báo theo triết lý **GitOps** dành riêng cho nền tảng Kubernetes (K8s). Nó giải quyết bài toán đồng bộ hóa trạng thái hệ thống: Giữ cho ứng dụng đang chạy thực tế trên cụm Kubernetes luôn khớp chính xác 100% với các file cấu hình được lưu trữ trong Git Repository.
- **Tính năng cốt lõi:**
  - **Automated Sync:** Tự động phát hiện sự thay đổi cấu hình hạ tầng trong Git và tiến hành cập nhật (Deploy) lên Kubernetes Cluster mà không cần gõ lệnh thủ công.
  - **Self-Healing (Tự chữa lành):** Nếu có ai đó vào sửa đổi trực tiếp ứng dụng trên hệ thống chạy thật (lệch cấu hình Git), ArgoCD sẽ tự động phát hiện tình trạng "Out of Sync" và ghi đè lại đúng cấu hình chuẩn trong Git.
  - **Dashboard trực quan:** Cung cấp giao diện web trực quan hiển thị sơ đồ cây các thành phần của ứng dụng trên Kubernetes (Pods, Services, Deployments).

### 2. Giá
- **Bản Open Source:** Hoàn toàn **Miễn phí**, mã nguồn mở do tổ chức CNCF (Cloud Native Computing Foundation) quản lý.
- **Bản Managed Service (Thương mại):** Nếu doanh nghiệp không muốn tự vận hành hạ tầng ArgoCD, họ có thể sử dụng các nền tảng quản lý như **Akuity Platform** với mức giá khởi điểm khoảng từ $495/tháng (bao gồm tích hợp sẵn AI và các dashboard nâng cao).

### 3. Điểm mạnh
- **Bảo mật tối đa (Pull-based CD):** Không giống như Jenkins hay GitLab CI cần nắm giữ Key/Token của server để nhảy vào deploy (Push-based), ArgoCD được cài bên trong Kubernetes và chủ động "kéo" code về (Pull-based). Kẻ địch chiếm được Git Repo cũng không lấy được thông tin đăng nhập của Kubernetes Cluster.
- **Quản lý phiên bản hạ tầng rõ ràng:** Mọi thay đổi về kiến trúc hệ thống đều được lưu lại lịch sử qua các lượt Commit Git, giúp dễ dàng Rollback (quay xe) về phiên bản cũ chỉ bằng một cú click.
- **Hỗ trợ nhiều công cụ định nghĩa K8s:** Tương thích tốt với Kustomize, Helm, Ksonnet, và các file YAML Kubernetes thuần túy.

### 4. Điểm yếu
- **Giới hạn nền tảng:** Chỉ chạy được và triển khai ứng dụng lên hệ sinh thái **Kubernetes**, hoàn toàn không phù hợp cho các dự án triển khai lên VPS truyền thống hoặc mô hình Serverless đơn giản.
- **Độ phức tạp cấu hình cao:** Đòi hỏi đội ngũ kỹ sư phải có kiến thức nền tảng rất vững chắc về Docker, Kubernetes, GitOps và quản trị mạng.

### 5. Hỗ trợ ngôn ngữ
- **Danh sách hỗ trợ chính thức:** **Không phụ thuộc ngôn ngữ lập trình (Language-agnostic)**. Vì ArgoCD làm việc ở tầng hạ tầng container (Kubernetes), nó chỉ quan tâm đến các file cấu hình YAML (`deployment.yaml`, `service.yaml`, `Chart.yaml`) chứ không quan tâm mã nguồn bên trong viết bằng gì.
- **Mức độ phù hợp với dự án nhóm (Node.js/React):** Phù hợp ở khâu Đóng gói. Nếu dự án `eshop` của nhóm ní được đóng gói thành các Docker Image (`eshop-frontend:latest` và `eshop-backend:latest`), ArgoCD sẽ đảm nhận việc quản lý và tự động cập nhật các image này lên cụm máy ảo test hoặc production cực kỳ mượt mà.

### 6. Hỗ trợ AI (đọc code)
- **Công cụ tích hợp:** Các nền tảng thương mại của ArgoCD như **Akuity Platform** có tích hợp sẵn các gói AI Tokens (khoảng 25 triệu tokens/tháng).
- **Chức năng chính của AI:** AI sẽ tự động đọc các file manifest YAML của Kubernetes để phân tích và phát hiện các điểm bất thường cấu hình (misconfigurations), cảnh báo rủi ro bảo mật hạ tầng hoặc tự động tóm tắt các thay đổi kiến trúc hệ thống khi đồng bộ.

### 7. Tài liệu tham khảo
- ArgoCD Core Documentation: `https://argo-cd.readthedocs.io/en/stable/`
- Akuity Pricing and AI Features: `https://akuity.io/pricing`

---

## IV. k6

### 1. Chức năng
- **Bài toán giải quyết:** k6 (do Grafana Labs phát triển) là một công cụ kiểm thử hiệu năng (Performance & Load Testing) mã nguồn mở hiện đại. Nó giải quyết bài toán kiểm tra sức chịu đựng của hệ thống bằng cách giả lập hàng ngàn, hàng vạn người dùng ảo (Virtual Users - VUs) cùng lúc truy cập vào ứng dụng nhằm phát hiện các điểm nghẽn (bottlenecks), hiện tượng sập server hoặc chậm phản hồi.
- **Tính năng cốt lõi:**
  - **Scripting in JavaScript:** Cho phép viết kịch bản giả lập hành vi user (nhập hàng, bấm thanh toán coupon trên `eshop`) bằng ngôn ngữ JavaScript quen thuộc.
  - **Metrics First:** Thu thập chi tiết các thông số kỹ thuật như thời gian phản hồi (Response Time), tỷ lệ lỗi (Error Rate), băng thông nhận được (Data Received).
  - **Thresholds (Định nghĩa hạn mức):** Thiết lập quy chuẩn cho bài test (ví dụ: Nếu thời gian phản hồi trung bình > 200ms thì bài test tự động bị đánh Fail để chặn không cho deploy code lỗi hiệu năng).

### 2. Giá
- **k6 OSS (Open Source):** Hoàn toàn **Miễn phí** khi chạy script kiểm thử local dưới máy tính cá nhân hoặc tự dựng hạ tầng chạy (không giới hạn số người dùng ảo VUs nếu máy đủ mạnh).
- **Grafana Cloud k6 (Bản Cloud thương mại):** Dành cho nhu cầu chạy test quy mô lớn phân tán từ nhiều khu vực địa lý trên thế giới, tính phí dựa trên mô hình thời gian sử dụng người dùng ảo (Virtual User hours - VUh) với mức giá khoảng từ $0.15 cho mỗi VUh (hoặc các gói Pro từ $19/tháng kèm lượng sử dụng thực tế).

### 3. Điểm mạnh
- **Tiết kiệm tài nguyên vượt trội:** Được viết bằng ngôn ngữ Go (Golang), k6 có hiệu năng cực cao, một máy đơn lẻ chạy k6 có thể tạo ra lượng người dùng ảo gấp nhiều lần so với các công cụ cũ chạy bằng Java như Apache JMeter.
- **Thân thiện với Automation & CI/CD:** Được thiết kế dưới dạng giao diện dòng lệnh (CLI), k6 cực kỳ dễ tích hợp vào các pipeline tự động của GitHub Actions hay GitLab CI/CD để tự động chạy kiểm thử tải mỗi khi cập nhật phiên bản mới.
- **Tích hợp hệ sinh thái Grafana:** Dễ dàng đẩy dữ liệu báo cáo theo thời gian thực lên Grafana Dashboard để vẽ các biểu đồ hiệu năng trực quan sinh động.

### 4. Điểm yếu
- **Không dựng sẵn giao diện đồ họa (No GUI Script Builder):** Không giống như JMeter có giao diện kéo thả, k6 bắt buộc người viết test phải tự code kịch bản hoàn toàn bằng tay, gây khó khăn cho những kiểm thử viên (Tester) không mạnh về kỹ năng lập trình.
- **Không hỗ trợ chạy NodeJS gốc bên trong:** Mặc dù script viết bằng JavaScript, nhưng k6 chạy trên môi trường JavaScript nội bộ (bằng Go), do đó không thể import trực tiếp các thư viện NPM nặng của Node.js trừ khi được chuyển đổi qua Webpack.

### 5. Hỗ trợ ngôn ngữ
- **Danh sách hỗ trợ chính thức:** Ngôn ngữ viết kịch bản (Scripting) là **JavaScript (ES6)**.
- **Mức độ phù hợp với dự án nhóm (Node.js/React):** Rất cao. Vì toàn bộ thành viên trong nhóm làm dự án `eshop` đều đã quen thuộc với JavaScript (do làm React/Node.js), việc học cú pháp và viết các script test tải bằng k6 cho tính năng Checkout sẽ diễn ra cực kỳ nhanh chóng mà không cần học một ngôn ngữ mới.

### 6. Hỗ trợ AI (đọc code)
- **Công cụ bên thứ ba:** Sử dụng **Grafana AI Assistant** hoặc các plugin AI trên VS Code.
- **Chức năng chính của AI:** AI có khả năng đọc cấu trúc API endpoint của hệ thống backend và tự động viết ra script k6 hoàn chỉnh để test tải (ví dụ: tự sinh kịch bản giả lập 500 người dùng liên tục bắn API mua hàng áp coupon). Ngoài ra, AI còn hỗ trợ đọc và phân tích các biểu đồ metric hiệu năng bị lỗi để tìm ra nguyên nhân server bị thắt nút cổ chai.

### 7. Tài liệu tham khảo
- k6 Documentation by Grafana Labs: `https://grafana.com/docs/k6/latest/`
- Grafana Cloud k6 Pricing: `https://grafana.com/pricing/`

---

## V. Jenkins

### 1. Chức năng
- **Bài toán giải quyết:** Jenkins là một máy chủ tự động hóa (Automation Server) mã nguồn mở lâu đời và phổ biến nhất thế giới. Nó đóng vai trò là "trái tim" của hệ thống CI/CD truyền thống, giải quyết bài toán kết nối tất cả các công cụ đơn lẻ (Git, Docker, SonarQube, Jest, Kubernetes) lại thành một chuỗi quy trình tự động hóa khép kín (Pipeline) từ khâu nhận code cho đến khi phân phối sản phẩm.
- **Tính năng cốt lõi:**
  - **Jenkins Pipeline (Groovy):** Định nghĩa toàn bộ quy trình CI/CD bằng mã lệnh (Pipeline as Code) qua file `Jenkinsfile` bằng ngôn ngữ Declarative hoặc Scripted Groovy.
  - **Plugin Ecosystem:** Kho tàng plugin khổng lồ (hơn 1800+ plugins) giúp kết nối với hầu như tất cả mọi phần mềm, công nghệ xuất hiện trong ngành CNTT.
  - **Distributed Builds:** Cơ chế phân phối công việc từ một Server chính (Controller) sang nhiều máy phụ trách chạy job độc lập (Agents/Nodes) để xử lý song song.

### 2. Giá
- **Chính sách:** Hoàn toàn **Miễn phí** về mặt bản quyền phần mềm (Mã nguồn mở dưới giấy phép MIT License).
- **Chi phí thực tế (Ẩn):** Mặc dù phần mềm free, nhưng chi phí vận hành (Total Cost of Ownership) của Jenkins rất lớn: bao gồm chi phí thuê máy chủ (AWS, Azure) để duy trì server chạy 24/7 và chi phí kỹ sư DevOps bảo trì, cập nhật plugin liên tục (Ước tính các hệ thống lớn tiêu tốn từ vài trăm đến hàng ngàn USD/tháng cho phần hạ tầng này).

### 3. Điểm mạnh
- **Khả năng tùy biến vô hạn:** Nhờ vào hệ thống plugin đồ sộ và ngôn ngữ Groovy mạnh mẽ, Jenkins có thể giải quyết được các quy trình CI/CD có độ dị biệt, phức tạp và lắt léo nhất mà các công cụ Cloud hiện đại như GitHub Actions hay GitLab CI phải bó tay.
- **Làm chủ hoàn toàn dữ liệu (Self-hosted):** Toàn bộ hệ thống nằm trên server riêng của doanh nghiệp, giúp đảm bảo các tiêu chí bảo mật nội bộ khắt khe của các ngân hàng, tập đoàn tài chính lớn.
- **Cộng đồng lâu đời:** Lượng tài liệu hướng dẫn, giải đáp lỗi trên StackOverflow cực kỳ nhiều, hầu như gặp lỗi gì cũng đều có cách xử lý có sẵn.

### 4. Điểm yếu
- **Gánh nặng bảo trì ("Plugin Hell"):** Các plugin của Jenkins thường xuyên xung đột lẫn nhau khi cập nhật phiên bản mới, đòi hỏi kỹ sư phải tốn rất nhiều thời gian "sửa chữa" hệ thống (Maintenance Overhead).
- **Giao diện lỗi thời và khó cấu hình ban đầu:** Giao diện UI/UX truyền thống của Jenkins khá cũ kỹ, cấu hình phân quyền người dùng phức tạp và không được tích hợp sẵn môi trường chạy mượt mà như các nền tảng SaaS hiện nay.

### 5. Hỗ trợ ngôn ngữ
- **Danh sách hỗ trợ chính thức:** **Không phụ thuộc ngôn ngữ (Language-agnostic)**. Thông qua việc cài đặt các công cụ tương ứng trên máy Agent (hoặc sử dụng Docker Container Agent), Jenkins có thể build và test mọi ngôn ngữ từ Java, C#, C++, Python cho đến NodeJS, Go.
- **Mức độ phù hợp với dự án nhóm (Node.js/React):** Phù hợp nếu tự dựng hạ tầng. Nhóm cần cài đặt thêm NodeJS Plugin trên Jenkins hoặc cấu hình cho Jenkins Pipeline chạy trực tiếp các câu lệnh `npm install` inside một Docker image chứa Node.js để thực thi test dự án `eshop`.

### 6. Hỗ trợ AI (đọc code)
- **Công cụ tích hợp & Plugin bên thứ ba:** Sử dụng các plugin kết nối AI thời gian gần đây như **Jenkins OpenAI Plugin** hoặc tích hợp các webhook gọi API đến ChatGPT/Claude.
- **Chức năng chính của AI:** AI hỗ trợ các kỹ sư DevOps đọc hiểu và chuyển đổi các file cấu hình Jenkins cũ viết bằng Scripted Groovy sang định dạng Declarative trực quan hơn. Đồng thời, AI có thể tự động quét log console đầu ra của Jenkins (vốn rất dài và rối) để chỉ thẳng ra dòng code nào khiến bản build bị thất bại.

### 7. Tài liệu tham khảo
- Jenkins User Documentation: `https://www.jenkins.io/doc/`
- Aqua Cloud – Understanding the True Jenkins Cost: `https://aqua-cloud.io/jenkins-review/`
- Siit.io – Jenkins Overview & Pricing Model: `https://www.siit.io/tools/trending/jenkins-overview`
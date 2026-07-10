# Prompt Log
Verbatim record of all AI sessions for academic audit purposes.

---
## Session | Agent: Gemini | Assignment: (unspecified) | 2026-07-04 14:16 (UTC+7)
---

### Turn 1

**[User]**
viết về chủ đề CI/CD & Test-Harness Engineering, và tool hỗ trợ cho 2 việc đó, càng nhiều càng tốt; lập outline đi

**[Assistant]**
Tôi đã lập đề cương chi tiết và viết nội dung hoàn chỉnh về chủ đề **CI/CD & Test-Harness Engineering cùng các công cụ hỗ trợ** trực tiếp vào tệptệp.

### Tóm tắt nội dung tài liệu đã xây dựng:
1. **Phần 1: Tổng quan về CI/CD**: Định nghĩa rõ ràng về CI, CD (Delivery) và CD (Deployment), lợi ích và cấu trúc một quy trình Pipeline tiêu chuẩn.
2. **Phần 2: Tổng quan về Test-Harness Engineering**: Khái niệm Test Harness và kỹ nghệ thiết kế nó, sự khác biệt so với Test Framework / Test Suite, cấu trúc một Test Harness hoàn chỉnh và vai trò của nó.
3. **Phần 3: Công cụ hỗ trợ CI/CD**: Phân loại chi tiết nhóm công cụ Self-Hosted (Jenkins, GitLab CI, Bamboo), Cloud-Managed (GitHub Actions, CircleCI, Cloud-native) và GitOps CD (ArgoCD, FluxCD). Kèm bảng so sánh trực quan.
4. **Phần 4: Công cụ hỗ trợ Test-Harness Engineering**: Danh sách các công cụ tương ứng với từng tầng kiểm thử:
   - *Unit Testing*: Vitest, Jest, PyTest, JUnit 5.
   - *API/Integration*: Postman/Newman, REST-Assured.
   - *End-to-End*: Playwright, Cypress, Selenium, Appium.
   - *Mocking & Virtualization*: WireMock, Mockoon, Sinon.js, Mockito.
   - *Performance/Load Testing*: k6, JMeter, Locust.
   - *Reporting/Analytics*: Allure Report, ReportPortal.
5. **Phần 5: Chiến lược tích hợp vào Pipeline**: Giải pháp cân bằng giữa tốc độ và độ tin cậy bao gồm Kim tự tháp kiểm thử (Test Pyramid - trực quan hóa bằng sơ đồ Mermaid), kỹ thuật chạy song song (Parallelization/Sharding), xử lý Flaky Tests, và mô hình Shift-Left / Shift-Right Testing.
6. **Phần 6: Xu hướng tương lai**: Giới thiệu về môi trường kiểm thử tạm thời (Ephemeral Environments), kiểm thử tự động bằng AI (Self-healing tests) và GitOps áp dụng cho hạ tầng kiểm thử (IaC).

# Phân công khảo sát công cụ — Tuần 5 (Nhóm 06)

> Dựa trên danh sách công cụ đã khảo sát sơ bộ ở Tuần 4 (xem file `Tong-hop-noi-dung-CICD-TestHarness.md`, mục 6), mỗi thành viên chọn/được phân công **2 công cụ** — cố gắng phủ đều các nhóm: CI/CD platform (self-hosted, cloud, GitOps) và Test-Harness tool (unit, E2E, API, performance, quality). Deadline nộp báo cáo cá nhân: theo lịch nhóm thống nhất trong buổi họp tuần.

## Bảng phân công

| Thành viên | Công cụ 1 | Công cụ 2 | Nhóm bao phủ |
|---|---|---|---|
| Nguyễn Ngọc Minh Châu (23127031) | **GitHub Actions** (CI/CD – Cloud) | **Jest** (Unit Testing Framework) | CI/CD Cloud + Unit test |
| Bùi Dương Duy Cường (23127033) | **ArgoCD** (GitOps/CD cho Kubernetes) | **k6** (Performance/Load Testing) | GitOps + Performance |
| Nguyễn Anh Khoa (23127391) | **Jenkins** (CI/CD – Self-hosted) | **Playwright** (E2E Testing) | CI/CD tích hợp + API test |
| Huỳnh Vương Thụy Quân (23127459) | **GitLab CI/CD** (CI/CD – All-in-one) | **Postman/Newman** (API Testing)  | CI/CD Self-hosted + E2E |
| Trần Quang Đạo (21127498) | **CircleCI** (CI/CD – Cloud SaaS) | **SonarQube** (Code Quality & Security) | CI/CD Cloud + Chất lượng/bảo mật |

---

## Yêu cầu nội dung cho mỗI công cụ

Mỗi thành viên viết báo cáo cho **từng công cụ** theo đúng 7 mục sau (không bỏ mục nào):

### 1. Kịch bản test dự kiến thực hiện
- Mô tả một kịch bản demo cụ thể sẽ dùng để thực hành/trình chiếu (VD: "Tạo project Node.js đơn giản, viết 3 unit test, cấu hình workflow chạy test khi push code, quan sát kết quả trên tab Actions").
- Nêu rõ input, các bước thao tác, kết quả mong đợi (pass/fail) và cách quan sát kết quả.

### 2. Chức năng chính
- Công cụ giải quyết bài toán gì trong CI/CD hay Test-Harness Engineering (build/test/deploy/mock/report/scan...).
- Các tính năng nổi bật nhất (liệt kê 3–5 tính năng cốt lõi).

### 3. Nguyên lý hoạt động
- Cơ chế xử lý bên trong: pull-based hay push-based, chạy trên runner/agent nào, cấu hình bằng ngôn ngữ/định dạng gì (YAML, Groovy, K8s manifest...).
- Luồng dữ liệu: input → xử lý → output/report.

### 4. Điểm mạnh
- Ít nhất 3 điểm mạnh, có so sánh ngắn với công cụ cùng nhóm nếu có thể (VD: Playwright vs Selenium).

### 5. Điểm yếu / hạn chế
- Ít nhất 2–3 hạn chế thực tế (chi phí, độ phức tạp cấu hình, giới hạn nền tảng, hiệu năng...).

### 6. Hỗ trợ ngôn ngữ lập trình
- Danh sách ngôn ngữ/nền tảng được hỗ trợ chính thức.
- Mức độ phù hợp với dự án của nhóm (Node.js/React ở `application/frontend-*`, backend ở `application/backend`) nếu áp dụng được.

### 7. Hỗ trợ AI
- Công cụ có tích hợp AI/ML gì không (self-healing test, auto-suggest, phân loại lỗi tự động, code review AI...).
- Nếu chưa có, có thể nêu công cụ/plugin AI bên thứ ba thường được dùng kèm.

---

## Gợi ý nguồn tham khảo ban đầu (đã có sẵn từ khảo sát Tuần 4)

- **GitHub Actions**: `docs.github.com/en/actions`; đã có ví dụ workflow mẫu (lint → unit test → integration test → coverage → build → security scan) trong file tổng hợp.
- **Jenkins**: `jenkins.io/doc`; đã có các bước cài đặt + cấu hình CI Job/CD Job qua Webhook trong file tổng hợp (Viblo).
- **GitLab CI/CD**: `docs.gitlab.com/ee/ci/`; cấu hình qua `.gitlab-ci.yml`, dùng GitLab Runner.
- **Postman/Newman**: postman.com/newman — công cụ test API dạng Collection, chạy CLI trong pipeline.
- **ArgoCD**: đã có mô tả cơ chế Pull-based (Repository Server → Application Controller → Sync → API Server) trong file tổng hợp (Viblo).
- **k6**: k6.io — viết script JS/TS, chạy bằng lõi Go, khuyến nghị dùng trong CI/CD vì nhẹ.
- **CircleCI**: circleci.com/docs — cấu hình `.circleci/config.yml`, mạnh về caching/parallelism.
- **SonarQube**: docs.sonarqube.org — quét style + logic + security + coverage, có dashboard trend.
- **Jest**: jestjs.io — unit test framework phổ biến nhất Node.js, có sẵn mock/coverage.
- **Playwright**: playwright.dev — E2E đa trình duyệt, auto-waiting, sharding tốt.

## Việc chung sau khi hoàn thành khảo sát cá nhân

1. Mỗi thành viên nộp báo cáo 2 công cụ (theo 7 mục ở trên) + AI audit log của quá trình tìm hiểu.
2. Cả nhóm họp để **tổng hợp lại thành báo cáo hoàn chỉnh** của chủ đề, chọn ra công cụ phù hợp nhất để **demo trực tiếp trong buổi seminar** (ưu tiên GitHub Actions + Jest/Playwright vì dễ setup và trình chiếu nhanh).
3. Chuẩn bị slide theo dàn ý đã thống nhất trong file tổng hợp nội dung (phần Best Practices + Kết luận nên đưa vào slide cuối).

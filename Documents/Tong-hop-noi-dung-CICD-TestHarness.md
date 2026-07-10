# CI/CD & Test-Harness Engineering — Tổng hợp nội dung Seminar

> **Nhóm 06 — Môn Kiểm thử phần mềm**
> Tài liệu này tổng hợp, chọn lọc, đối chiếu và loại bỏ trùng lặp từ 5 báo cáo cá nhân (Tuần 4) của: Nguyễn Ngọc Minh Châu (23127031), Bùi Dương Duy Cường (23127033), Nguyễn Anh Khoa (23127391), Huỳnh Vương Thụy Quân (23127459), Trần Quang Đạo (21127498). Nội dung mâu thuẫn/trùng lặp giữa các báo cáo đã được đối chiếu và hợp nhất thành một bản trình bày thống nhất.

## Mục lục

1. [Tổng quan về CI/CD](#1-tổng-quan-về-cicd)
2. [Cấu trúc một CI/CD Pipeline](#2-cấu-trúc-một-cicd-pipeline)
3. [Test-Harness Engineering](#3-test-harness-engineering)
4. [Các loại kiểm thử trong CI/CD (Test Pyramid)](#4-các-loại-kiểm-thử-trong-cicd-test-pyramid)
5. [Chiến lược tích hợp Test-Harness vào Pipeline](#5-chiến-lược-tích-hợp-test-harness-vào-pipeline)
6. [Khảo sát công cụ hỗ trợ](#6-khảo-sát-công-cụ-hỗ-trợ)
7. [Các vấn đề thực tế thường gặp](#7-các-vấn-đề-thực-tế-thường-gặp)
8. [Xu hướng tương lai](#8-xu-hướng-tương-lai)
9. [Best Practices](#9-best-practices)
10. [Kết luận](#10-kết-luận)
11. [Tài liệu tham khảo](#11-tài-liệu-tham-khảo)

---

## 1. Tổng quan về CI/CD

### 1.1 Vấn đề trước khi có CI/CD

Trước khi CI/CD phổ biến, các nhóm phát triển thường gặp **"integration hell"**: lập trình viên làm việc độc lập trong thời gian dài, tích hợp code muộn, chỉ gộp (merge) sau nhiều tuần/tháng. Hệ quả:

- Kiểm thử thủ công tốn thời gian, dễ bỏ sót trường hợp, khó lặp lại chính xác, không phát hiện được regression.
- Khi tích hợp muộn, xung đột code và lỗi giao tiếp giữa các module rất khó fix, chi phí sửa chữa cao.
- Feedback chậm, thời gian release kéo dài, sản phẩm chứa nhiều lỗi khi đến tay người dùng.

### 1.2 Khái niệm

| Khái niệm | Định nghĩa | Đặc điểm |
|---|---|---|
| **CI — Continuous Integration** (Tích hợp liên tục) | Lập trình viên tích hợp code vào nhánh chung thường xuyên (nhiều lần/ngày); mỗi lần tích hợp được build và test tự động | Không tự động deploy; mục tiêu là phát hiện xung đột/lỗi compile sớm |
| **CD — Continuous Delivery** (Chuyển giao liên tục) | Nối tiếp CI: code luôn ở trạng thái sẵn sàng deploy tới bất kỳ môi trường nào | Deploy lên staging tự động, nhưng lên production cần **phê duyệt thủ công** |
| **CD — Continuous Deployment** (Triển khai liên tục) | Mọi thay đổi vượt qua toàn bộ pipeline test sẽ **tự động** lên production | Không cần approval; đòi hỏi test suite cực kỳ đáng tin cậy |

So sánh nhanh:

| Khía cạnh | CI | Continuous Delivery | Continuous Deployment |
|---|---|---|---|
| Deploy production | Không | Cần manual approval | Tự động |
| Tần suất release | Vài lần/ngày | Hàng ngày/tuần | Hàng giờ/ngày |
| Rủi ro | Thấp | Trung bình | Cao (đòi hỏi test rất chặt) |
| Phù hợp | Mọi dự án | Dự án ổn định | Startup, SaaS, web |

### 1.3 Ưu điểm và nhược điểm

**Ưu điểm:**
- Phát hiện lỗi compile/môi trường sớm, tránh lỗi không đáng có.
- Đảm bảo tính năng mới không phá vỡ tính năng cũ nhờ automation test (regression detection).
- Developer tập trung viết code thay vì build/deploy thủ công; feedback trong vài phút thay vì chờ đến hôm sau.
- Nâng cao chất lượng code qua các ràng buộc quy trình (giới hạn PR, yêu cầu pipeline pass trước khi merge).
- Cho phép release nhanh, nhiều lần một ngày mà vẫn kiểm soát chất lượng.

**Nhược điểm:**
- Nhiều PR cùng lúc → chờ merge, xử lý conflict, chạy lại test từ đầu → gián đoạn tiến độ.
- Phụ thuộc dịch vụ CI/CD bên thứ ba: nếu dịch vụ down, cả quy trình phát triển bị ảnh hưởng.
- Cần đầu tư ban đầu về hạ tầng, kỹ năng vận hành; nếu đội ngũ chưa đủ chuyên môn, sự cố pipeline có thể gây gián đoạn nhiều hơn lợi ích mang lại.

### 1.4 Khi nào nên/không nên áp dụng

- **Nên áp dụng càng sớm càng tốt**, kể cả dự án cá nhân — nhiều nền tảng có gói miễn phí đủ dùng cho dự án nhỏ.
- **Cân nhắc chưa áp dụng (hoặc áp dụng ở mức đơn giản)** khi: tổ chức chưa có người đủ khả năng vận hành CI/CD, developer chưa nắm rõ công cụ, hoặc nhóm chưa biết cách đảm bảo pipeline hoạt động ổn định — vì sự cố không đủ chuyên môn xử lý sẽ tốn thời gian hơn lợi ích mang lại.
- Nên **thử nghiệm tool theo từng team nhỏ** (chia theo ngôn ngữ/nền tảng) trước khi áp dụng đại trà.

### 1.5 Yếu tố lựa chọn nền tảng CI/CD

Khi chọn công cụ CI/CD, cần cân nhắc:

1. **Cloud-based vs Self-hosted** — cloud không cần tự bảo trì hạ tầng; self-hosted cho phép kiểm soát bảo mật, tài nguyên tốt hơn.
2. **Tính dễ dùng** — giao diện, tài liệu, tốc độ onboard.
3. **Khả năng tích hợp** — với ngôn ngữ, VCS, issue-tracker, cloud platform đang dùng.
4. **Khả năng cấu hình** — trigger, xử lý khi fail, biến môi trường/secret, qua script/YAML/UI.
5. **Chi phí** phù hợp ngân sách (số phút build, số user, lưu trữ artifact).
6. **Mức độ quen thuộc của đội ngũ** và độ phổ biến của tool (dễ tìm người hỗ trợ).
7. **Khả năng mở rộng/hiệu năng** cho workload lớn, và **khả năng tùy biến** qua hệ sinh thái plugin.

---

## 2. Cấu trúc một CI/CD Pipeline

### 2.1 Sơ đồ tổng quát

```
Developer → Commit/Push → Source Repository (Git) 
    → CI: Build → Static Analysis/Lint → Unit Test → Integration Test → API Test 
    → Coverage Check → Security Scan → Package Artifact
    → CD: Deploy Staging → Smoke/E2E Test → Manual Approval → Deploy Production
    → Monitoring & Alerting
```

Ví dụ thực tế: developer push code lên GitHub → GitHub Actions build ứng dụng, chạy unit test + integration test → nếu pass, deploy staging → một thành viên review & phê duyệt → deploy production.

### 2.2 Các giai đoạn (stage) và vai trò

| Giai đoạn | Mục đích | Loại lỗi phát hiện | Ví dụ công cụ |
|---|---|---|---|
| **Trigger** | Sự kiện khởi động pipeline: push, pull request, schedule (cron), manual, release tag | — | GitHub Actions `on:`, GitLab `rules:` |
| **Install dependencies** | Cài đặt thư viện, khóa version, đảm bảo môi trường nhất quán | Thiếu dependency, version mismatch | npm/yarn, pip, Maven/Gradle, go mod |
| **Static Analysis / Lint / Format** | Kiểm tra style, phát hiện lỗi tiềm ẩn mà không chạy code | Style violation, biến/import không dùng, lỗ hổng bảo mật cơ bản | ESLint, Prettier, Pylint/Ruff, golangci-lint, Checkstyle/PMD, SonarQube |
| **Build** | Biên dịch/đóng gói source code thành artifact chạy được | Lỗi compile, dependency conflict | Maven/Gradle, `go build`, webpack/esbuild, Docker build |
| **Unit Test** | Kiểm thử từng hàm/method riêng lẻ, cô lập dependency | Logic error, edge case, exception không xử lý | Jest, Vitest, pytest, JUnit, Go testing, NUnit/xUnit |
| **Integration Test** | Kiểm thử tương tác giữa các module/service/database | Interface mismatch, lỗi truy vấn DB, race condition | Testcontainers, WireMock, Spring Test |
| **API Test** | Kiểm thử endpoint REST end-to-end (request → response) | Sai status code, sai schema response, lỗi business logic | Postman/Newman, REST Assured, Supertest |
| **Coverage Report** | Đo % code được test cover, phát hiện dead code | Vùng code chưa test, complexity cao mà coverage thấp | JaCoCo, Istanbul/nyc, coverage.py, Codecov |
| **Security Scan** | Quét lỗ hổng dependency, mã nguồn, container image | CVE, hardcoded secret, image lỗi thời | Snyk, OWASP Dependency-Check, Trivy, Semgrep, Dependabot |
| **Package Artifact** | Đóng gói output thành binary/image, lưu vào registry có version | Artifact thiếu/sai version | Docker Registry, JFrog Artifactory, GitHub Packages |
| **Deploy Staging** | Triển khai lên môi trường giống production để kiểm thử tiếp | Lỗi cấu hình deploy, thiếu dependency môi trường | Kubernetes/Helm, Docker Compose, Terraform |
| **Smoke Test / E2E Test** | Kiểm tra nhanh hệ thống sống (smoke) hoặc luồng người dùng đầy đủ (E2E) | Deployment fail, lỗi UI, lỗi tích hợp frontend-backend | Playwright, Cypress, Selenium |
| **Manual Approval / Production Deploy** | Con người review lần cuối trước khi lên production (Continuous Delivery); hoặc tự động (Continuous Deployment) | Rủi ro nghiệp vụ, breaking change chưa thông báo | Blue-green, Canary deployment |
| **Monitoring & Alerting** | Giám sát hệ thống sau khi triển khai | Lỗi phát sinh trên production thực tế | Prometheus/Grafana, healthcheck endpoint |

**Nguyên tắc "fail fast":** các bước rẻ và nhanh (lint, unit test) nên chạy trước; nếu fail thì dừng ngay, không lãng phí tài nguyên chạy các bước tốn kém hơn (E2E, security scan sâu).

---

## 3. Test-Harness Engineering

### 3.1 Định nghĩa

**Test Harness** là tập hợp các công cụ, thư viện, dữ liệu kiểm thử và cấu hình được xây dựng để **tự động hóa việc thực thi test, thu thập kết quả và báo cáo** một cách nhất quán, lặp lại được. Có thể hình dung Test Harness giống *giàn giáo (scaffolding)* khi xây nhà: hỗ trợ việc kiểm thử diễn ra, nhưng bản thân nó không phải là sản phẩm chính.

Về mặt kỹ thuật, Test Harness gồm hai phần lõi:
- **Test execution engine**: bộ máy thực thi test.
- **Test script repository**: kho lưu trữ test case/script.

Nó cung cấp "bản sao" của tài nguyên/cấu hình chưa có sẵn (driver, stub) để có thể kiểm thử ngay cả khi một phần hệ thống chưa hoàn thiện — vì vậy phục vụ tốt cho cả **automation testing** lẫn **integration testing**.

### 3.2 Phân biệt các khái niệm dễ nhầm lẫn

| Thuật ngữ | Định nghĩa | Phạm vi | Ví dụ |
|---|---|---|---|
| **Test Suite** | Tập hợp các test case cụ thể xác minh một chức năng | Nội dung test | Bộ test cho tính năng thanh toán |
| **Test Framework** | Thư viện/API giúp viết test có cấu trúc (assert, mock, runner) | Công cụ (library) | Jest, JUnit, pytest, Cypress |
| **Test Harness** | Toàn bộ hạ tầng thực thi: framework + dữ liệu + mock + môi trường + reporter | Hệ thống (system) | Docker Compose + Jest + Fixtures + WireMock |
| **CI/CD Pipeline** | Quy trình tự động: build → test → deploy, kích hoạt từ sự kiện Git | Quy trình orchestration | GitHub Actions workflow chạy lint → test → deploy |

Quan hệ phân tầng: **Test Automation** (quy trình) → **Test Framework** (công cụ) → **Test Harness** (hạ tầng) → **CI/CD Pipeline** (điều phối tự động hóa toàn bộ).

### 3.3 Các thành phần cốt lõi

| Thành phần | Vai trò |
|---|---|
| **Test Runner** | Thực thi test script, tổng hợp kết quả pass/fail, sinh báo cáo (Jest, pytest, JUnit, Go testing) |
| **Test Script** | Code chứa test case, tuân theo mẫu Arrange–Act–Assert |
| **Test Data** | Input/expected-output: hardcode, fixture file (JSON/YAML), factory method, hoặc builder pattern |
| **Fixture** | Setup/teardown trước và sau test (kết nối DB, seed dữ liệu, dọn dẹp) |
| **Mock** | Giả lập object/service, kiểm soát giá trị trả về **và theo dõi lời gọi** (có thể assert đã được gọi đúng cách) |
| **Stub** | Tương tự mock nhưng chỉ trả giá trị giả cố định, **không** theo dõi lời gọi |
| **Driver** | Code điều khiển hệ thống đang được test (SUT), trừu tượng hóa thao tác (VD: điều khiển trình duyệt) |
| **Assertion** | So sánh kết quả thực tế với kỳ vọng |
| **Test Environment** | Database, service mock, container (Docker Compose), biến môi trường/secret |
| **Reporter** | Xuất kết quả (console, JUnit XML, HTML, JSON) để CI/CD và con người đọc được |
| **Log/Artifact** | Log, screenshot, video, trace, database dump khi test fail — phục vụ debug |

### 3.4 Quy trình xây dựng Test Harness

1. Cài đặt và cấu hình test harness (công cụ automation, dữ liệu test, môi trường test).
2. Viết script kiểm thử cho từng chức năng/tình huống, bắt đầu từ dữ liệu hợp lệ, dữ liệu biên, dữ liệu nhạy cảm.
3. Kích hoạt chạy toàn bộ test bằng một lệnh/thao tác tự động, thu thập kết quả thực thi.
4. So sánh kết quả kỳ vọng với thực tế, ghi nhận sai lệch/lỗi.
5. Tạo báo cáo, chia sẻ với các bên liên quan; cập nhật lại script khi phần mềm hoặc yêu cầu kiểm thử thay đổi.

### 3.5 Ưu điểm và nhược điểm

**Ưu điểm:** cải thiện năng suất tester/developer, hỗ trợ test automation lặp lại và ít phụ thuộc thao tác thủ công, hỗ trợ debug (log/screenshot), phát hiện lỗi sớm trong SDLC, đo lường code coverage, bao phủ được các use case phức tạp/khó tái hiện thủ công.

**Nhược điểm:** không hỗ trợ record & playback như một số công cụ UI chuyên biệt, đòi hỏi kỹ năng kỹ thuật để thiết kế/duy trì, tốn chi phí và thời gian xây dựng ban đầu (đặc biệt với hệ thống phức tạp).

### 3.6 Vai trò của Test Harness trong CI/CD

Không có Test Harness vững chắc, CI/CD pipeline chỉ là "vỏ bọc rỗng". Test Harness mang lại:

- **Consistency**: mỗi lần chạy setup giống nhau → kết quả reproducible, giảm flaky test.
- **Speed & Scalability**: chạy hàng nghìn test tự động mà không cần thao tác thủ công.
- **Isolation**: mock external service giúp test không phụ thuộc hệ thống bên ngoài không ổn định.
- **Reliability & Debugging**: log/screenshot/trace giúp dễ điều tra khi test fail.
- Đảm bảo test chạy **nhất quán giữa máy local và CI agent** — nền tảng để pipeline có thể tin cậy chặn các thay đổi lỗi trước khi lên production.

---

## 4. Các loại kiểm thử trong CI/CD (Test Pyramid)

```
        ▲
       /E2E\        Ít nhất, chậm nhất, đắt nhất
      /------\
     / API    \      Tốc độ trung bình
    /----------\
   / Unit Test  \    Nhiều nhất, nhanh nhất, rẻ nhất
  /--------------\
```

| Loại test | Mục tiêu | Vị trí pipeline | Tốc độ | Công cụ tiêu biểu |
|---|---|---|---|---|
| **Unit Test** | Test 1 hàm/method riêng lẻ, mock hết dependency | Sớm nhất, sau build | Rất nhanh (10–100ms/test) | Jest, Vitest, pytest, JUnit, Go testing |
| **Integration Test** | Test tương tác module–database–service | Sau unit test | Trung bình (100ms–1s/test) | Testcontainers, WireMock, Spring Test |
| **API Test** | Test REST endpoint end-to-end | Sau integration test | Trung bình (100–500ms/request) | Postman/Newman, REST Assured, Supertest |
| **E2E Test** | Test toàn bộ luồng người dùng qua UI thật | Trên staging, release/nightly pipeline | Chậm (1–5s/test) | Playwright, Cypress, Selenium, Appium |
| **Smoke Test** | Kiểm tra nhanh sau deploy: app có sống không | Ngay sau deploy | Rất nhanh (10–30s tổng) | HTTP healthcheck, curl |
| **Regression Test** | Đảm bảo code mới không phá tính năng cũ | Sau unit/integration/API | Tùy loại test dùng lại | Duy trì bộ test hiện có, chạy định kỳ |
| **Performance/Load Test** | Đo response time, throughput dưới tải cao | Nightly/release pipeline | Chậm (5–30 phút) | k6, JMeter, Gatling, Locust |
| **Security Test** | Phát hiện lỗ hổng: SQLi, XSS, dependency CVE | Dependency scan sớm, code scan mỗi PR | Nhanh–chậm tùy độ sâu | Snyk, OWASP DC, Trivy, Semgrep |

---

## 5. Chiến lược tích hợp Test-Harness vào Pipeline

### 5.1 Áp dụng Test Pyramid trong pipeline

- **PR pipeline** (feedback nhanh, <10 phút): lint + unit test + integration test cơ bản.
- **Nightly pipeline** (toàn diện, 30–60 phút): toàn bộ test + E2E + performance + security scan sâu.
- **Release pipeline** (nghiêm ngặt): toàn bộ test + security scan comprehensive + manual approval trước khi deploy production.

### 5.2 Chạy kiểm thử song song (Parallelization)

Khi số lượng test tăng, chạy tuần tự làm nghẽn pipeline. Giải pháp: chia file test chạy song song trên nhiều worker/thread (VD: `--maxWorkers` của Jest) hoặc phân phối sang nhiều máy (**sharding**, VD `npx playwright test --shard=1/3`).

### 5.3 Xử lý Flaky Test

Flaky test là test lúc pass lúc fail dù code không đổi — nguyên nhân thường do timing/race condition, dữ liệu random, phụ thuộc service bên ngoài không ổn định, hoặc test phụ thuộc thứ tự chạy. Chiến lược xử lý:

1. **Auto-retry**: chạy lại tối đa 2–3 lần trước khi coi là fail hẳn.
2. **Quarantine**: gắn nhãn `@flaky`/`@quarantine`, tách khỏi luồng chặn pipeline chính để QA xử lý riêng.
3. Dùng **explicit wait** thay vì fixed timeout, dùng **dữ liệu cố định** thay vì random, **mock external service**, đảm bảo mỗi test độc lập (dọn dữ liệu trước/sau mỗi test).

### 5.4 Shift-Left & Shift-Right Testing

- **Shift-Left**: đưa kiểm thử lên sớm nhất có thể (lint/scan tĩnh ngay trên máy dev qua Git Hooks — VD `husky` + `lint-staged` — trước khi push).
- **Shift-Right**: kiểm thử ngay trên production bằng kỹ thuật nâng cao: **Canary Deployment** (triển khai cho % nhỏ người dùng rồi giám sát), **Synthetic Monitoring** (chạy kịch bản test tự động định kỳ trên production).

---

## 6. Khảo sát công cụ hỗ trợ

> Danh sách dưới đây là kết quả khảo sát sơ bộ của cả nhóm ở Tuần 4, làm nền tảng để phân công tìm hiểu sâu ở Tuần 5 (xem file phân công riêng).

### 6.1 CI/CD Platforms — Self-hosted & Enterprise

| Công cụ | Mô tả ngắn |
|---|---|
| **Jenkins** | Mã nguồn mở, nền tảng Java, hệ sinh thái plugin đồ sộ (~1800+), cấu hình bằng Jenkinsfile (Groovy). Linh hoạt tối đa nhưng chi phí vận hành/bảo trì cao, phù hợp tổ chức muốn tự chủ hạ tầng vì lý do bảo mật/pháp lý. |
| **GitLab CI/CD** | Tích hợp sẵn trong GitLab, cấu hình qua `.gitlab-ci.yml`, dùng GitLab Runner. Tích hợp chặt với Git repo/Merge Request/Container Registry, mạnh cho Kubernetes. |
| **Bamboo (Atlassian)** | Thương mại, tích hợp hoàn hảo với Jira/Bitbucket/Confluence; phí bản quyền cao. |

### 6.2 CI/CD Platforms — Cloud-managed (SaaS)

| Công cụ | Mô tả ngắn |
|---|---|
| **GitHub Actions** | Tích hợp trực tiếp vào GitHub, workflow định nghĩa bằng YAML trong `.github/workflows/`, kho Actions Marketplace phong phú. Miễn phí hào phóng cho repo public; dễ tiếp cận nhất cho người mới. |
| **CircleCI** | SaaS tối ưu tốc độ & caching, cấu hình `.circleci/config.yml`. Chi phí tăng nhanh theo tài nguyên sử dụng. |
| **Azure DevOps Pipelines** | Bộ công cụ đầy đủ (Pipelines, Agile Board, Test Plans, Artifacts), mạnh cho hệ sinh thái Microsoft/Azure. |
| **Travis CI** | Tự động build/test/deploy/notify qua các build stage, phù hợp pipeline đơn giản. |
| **AWS CodePipeline** | Dịch vụ continuous delivery được AWS quản lý hoàn toàn, tích hợp sâu CodeBuild/CodeDeploy/S3. |
| **Bitbucket Pipelines** | Tích hợp sẵn Bitbucket, kết nối tốt Jira/Trello/hệ sinh thái Atlassian. |

### 6.3 GitOps / Cloud-native CD (chuyên biệt cho Kubernetes)

Với Kubernetes, mô hình **GitOps** tách CD ra khỏi CI: sau khi CI build xong, Git repository cấu hình hạ tầng được cập nhật; công cụ GitOps theo dõi và tự đồng bộ cluster theo trạng thái mong muốn trong Git (mô hình **pull-based**, khác với các CI/CD truyền thống push-based).

| Công cụ | Mô tả ngắn |
|---|---|
| **ArgoCD** | GitOps CD declarative cho Kubernetes; liên tục so sánh trạng thái Git (desired) với cluster thực tế (actual), tự động `Sync` khi phát hiện `OutOfSync`. Có Web UI trực quan, hỗ trợ rollback. Chỉ dùng được cho ứng dụng chạy trên Kubernetes. |
| **FluxCD** | GitOps mã nguồn mở thuộc CNCF, nhẹ, modular, tích hợp tốt với Kubernetes API gốc nhưng không có UI quản lý mạnh như ArgoCD (chủ yếu CLI). |

### 6.4 Unit Testing Frameworks

| Công cụ | Ngôn ngữ | Ghi chú |
|---|---|---|
| **Jest** | JavaScript/TypeScript | Đầy đủ tính năng (mock, snapshot, coverage tích hợp), phổ biến nhất hệ sinh thái Node.js |
| **Vitest** | JavaScript/TypeScript | Nhanh hơn nhờ nền tảng Vite, tương thích API Jest, hợp với dự án hiện đại (React/Vue/Svelte) |
| **pytest** | Python | Cú pháp ngắn gọn (assert thuần), fixture linh hoạt, hệ sinh thái plugin lớn |
| **JUnit 5** | Java | Chuẩn de-facto cho Java, hỗ trợ parameterized test, extension model hiện đại |
| **Go testing** | Go | Built-in, không cần cài thêm, hỗ trợ benchmark |
| **NUnit / xUnit.NET** | C#/.NET | Chuẩn cho hệ sinh thái .NET, hỗ trợ async test |

### 6.5 Integration & API Testing

| Công cụ | Ghi chú |
|---|---|
| **Postman/Newman** | Postman = UI thiết kế & gọi API; Newman = CLI để chạy Collection ngay trong CI/CD pipeline. Thân thiện với người không chuyên code. |
| **REST Assured** | Thư viện Java, cú pháp BDD-style (Given-When-Then) để test RESTful API. |
| **Supertest** | Thư viện Node.js để assert trực tiếp trên HTTP request/response. |
| **Testcontainers** | Khởi tạo container (DB, message queue...) tạm thời cho integration test, tự dọn dẹp sau khi xong. |

### 6.6 End-to-End (E2E) Testing Frameworks

| Công cụ | Ghi chú |
|---|---|
| **Playwright** (Microsoft) | Công cụ hàng đầu hiện nay: đa trình duyệt (Chromium/WebKit/Firefox) qua 1 API, auto-waiting, tự chụp screenshot/video khi lỗi, chạy song song rất tốt (sharding có sẵn). |
| **Cypress** | Chạy trực tiếp trong trình duyệt nên debug dễ (dùng DevTools), nhưng hạn chế với đa tab/đa domain. |
| **Selenium WebDriver** | "Lão làng", hỗ trợ mọi ngôn ngữ, nhưng chậm hơn và dễ flaky do thiếu cơ chế auto-wait thông minh. |
| **Appium** | Mở rộng từ Selenium, chuyên cho kiểm thử ứng dụng di động (Native/Hybrid/Mobile Web) trên iOS & Android. |

### 6.7 Mocking, Stubbing & Service Virtualization

| Công cụ | Ghi chú |
|---|---|
| **WireMock** | Giả lập HTTP API mạnh mẽ, định nghĩa response theo URL/Header/Body, chạy độc lập dạng Docker container. |
| **Mockoon** | Ứng dụng desktop trực quan để dựng nhanh mock server local. |
| **Sinon.js / Mockito** | Thư viện tạo spy/stub/mock cho hàm/class nội bộ (JavaScript / Java). |
| **LocalStack** | Giả lập các dịch vụ AWS (S3, SQS, DynamoDB...) offline để phát triển/test. |

### 6.8 Performance & Load Testing

| Công cụ | Ghi chú |
|---|---|
| **k6** (Grafana Labs) | Viết kịch bản bằng JS/TS, thực thi bằng lõi Go hiệu năng cao, tiêu tốn ít tài nguyên — khuyến nghị cho CI/CD. |
| **Apache JMeter** | Công cụ tải truyền thống, giao diện đồ họa mạnh nhưng khó tích hợp dạng code (IaC) vào CI/CD. |
| **Gatling** | DSL bằng Scala, throughput cao, report đẹp. |
| **Locust** | Viết bằng Python, dễ mở rộng chạy phân tán (distributed load testing). |

### 6.9 Code Quality, Security & Coverage

| Nhóm | Công cụ tiêu biểu |
|---|---|
| **Linter/Formatter** | ESLint, Prettier (JS/TS); Pylint/Ruff (Python); golangci-lint (Go); Checkstyle/PMD (Java) |
| **Security Scan** | Snyk (dependency/code/container, có auto-remediation); OWASP Dependency-Check (miễn phí, CVE database); Trivy (nhanh, offline, scan container); Semgrep (pattern-based, custom rule); GitHub Dependabot (tự tạo PR cập nhật dependency) |
| **Chất lượng toàn diện** | SonarQube/SonarCloud — quét style + logic + security + coverage, có dashboard trend, nhưng setup phức tạp và có chi phí |
| **Coverage** | JaCoCo (Java), Istanbul/nyc (JS), coverage.py (Python), Go coverage (built-in), Codecov (SaaS track lịch sử coverage) |

### 6.10 Test Reporting & Analytics

| Công cụ | Ghi chú |
|---|---|
| **Allure Report** | Sinh báo cáo HTML đa ngôn ngữ trực quan, đính kèm ảnh chụp lỗi/log, tích hợp tốt với Jenkins/GitLab CI. |
| **ReportPortal** | Nền tảng quản lý kết quả test dùng AI/ML để tự phân loại lỗi (Product Bug / Automation Bug / Environment issue), giảm thời gian phân tích thủ công. |

---

## 7. Các vấn đề thực tế thường gặp

| Vấn đề | Nguyên nhân chính | Hướng khắc phục |
|---|---|---|
| **Flaky test** | Race condition, dữ liệu random, phụ thuộc service ngoài, thứ tự test | Explicit wait, fixed test data, mock external service, retry có giới hạn, cô lập test |
| **Pipeline chạy chậm** | Quá nhiều test, chạy tuần tự, build/artifact nặng | Parallelize, cache dependency/build, tách PR pipeline (nhanh) vs nightly (đầy đủ) |
| **Môi trường test khác production** | Khác OS/version thư viện/DB/config | Container hoá (Docker), Infrastructure as Code, test trên staging trước production |
| **Test data không ổn định** | Seed thủ công, không cleanup, chia sẻ database giữa test | Factory/builder pattern, transaction rollback, database/test instance cô lập |
| **Secret/config bị lộ hoặc sai** | Hardcode key, commit `.env` | Biến môi trường, secret manager (GitHub Secrets...), `.env.test` riêng, pre-commit scan |
| **Report khó đọc** | Assertion chung chung, không log/screenshot khi fail | Assertion message rõ ràng, chụp ảnh khi fail, structured log, report HTML |
| **Coverage cao nhưng chất lượng test kém** | Test không assert thực chất, mock quá nhiều, thiếu edge case | Đo cả branch coverage, viết test theo hành vi (behavior), mutation testing |
| **Dependency bên thứ 3 làm test fail** | Gọi service thật (payment, email...) không ổn định | Mock ở unit/integration, dùng sandbox/staging ở E2E, circuit breaker + retry + timeout |

---

## 8. Xu hướng tương lai

- **Môi trường kiểm thử tạm thời (Ephemeral Environments)**: mỗi Pull Request tự động khởi tạo môi trường biệt lập riêng (Kubernetes Namespace/Docker Compose), tự xoá khi PR đóng — tránh xung đột dữ liệu test giữa các lập trình viên.
- **AI-Driven Testing**: self-healing test (AI tự nhận diện phần tử UI thay thế khi DOM đổi mà không làm gãy test), tự động sinh test case dựa trên phân tích code/lịch sử lỗi.
- **GitOps & Infrastructure as Code (IaC) cho hạ tầng kiểm thử**: toàn bộ cấu hình test harness (DB giả lập, mạng, biến môi trường) được định nghĩa bằng Terraform/Ansible/Docker Compose — đảm bảo tái tạo được ở bất kỳ đâu.

---

## 9. Best Practices

1. **Fast feedback** — PR pipeline nên chạy dưới 10 phút (lint + unit test song song, cache dependency).
2. **Fail early** — lint/static analysis trước, unit test trước integration, smoke test ngay sau deploy.
3. **Test isolation** — mỗi test tự setup/cleanup, không chia sẻ state, mock external service.
4. **Repeatability** — dùng dữ liệu cố định, mock thời gian, tránh flaky.
5. **Environment as Code** — Docker Compose/Terraform, không setup thủ công.
6. **Quality Gate** — yêu cầu test pass + coverage đạt ngưỡng + lint pass mới cho merge (branch protection).
7. **Parallelization** — chạy job/test song song để giảm thời gian pipeline.
8. **Cache hợp lý** — cache dependency & build output, không cache dữ liệu test.
9. **Không chạy mọi loại test ở mọi thời điểm** — PR nhanh (unit+lint), nightly sâu (toàn bộ+E2E+performance), release nghiêm ngặt (toàn bộ+security+manual approval).
10. **Report/log/artifact dễ đọc** — tên test rõ nghĩa, assertion message chi tiết, screenshot/video khi fail, liên kết tới code/commit/PR.

---

## 10. Kết luận

CI/CD và Test-Harness Engineering **không thay thế tester**, mà giúp tester:

- Tự động hóa các tác vụ lặp lại, tập trung vào công việc giá trị cao hơn (exploratory test, security audit, usability).
- Phát hiện lỗi sớm ngay ở giai đoạn PR, giảm chi phí sửa lỗi so với phát hiện ở giai đoạn QA/production.
- Cho phép release nhanh và an toàn hơn nhờ pipeline đã kiểm chứng chất lượng.

**Test Harness là nền tảng (foundation)** giúp CI/CD pipeline đáng tin cậy: không có test harness tốt, pipeline chỉ tự động hóa việc chạy các bài test kém chất lượng. Mục tiêu cuối cùng là xây dựng một quy trình kiểm thử tự động, nhất quán, đáng tin cậy — giúp phần mềm chất lượng cao, release nhanh và an toàn.

---

## 11. Tài liệu tham khảo

- TechWorld with Milan — *What is CI/CD Pipeline*: https://newsletter.techworld-with-milan.com/p/what-is-cicd-pipeline
- ITviec Blog — *CI/CD là gì?*: https://itviec.com/blog/ci-cd-la-gi/
- Tutorialspoint — *Software Testing: Test Harness*: https://www.tutorialspoint.com/software_testing_dictionary/harness.htm
- FMIT — *Test Harness là gì*: https://fmit.vn/tu-dien-quan-ly/test-harness-la-gi
- FIT NEU — *CI/CD với GitHub Actions*: https://fit.neu.edu.vn/post/ci-cd-voi-github-actions-tu-dong-hoa-kiem-thu-va-trien-khai-phan-mem
- Viblo — *Tìm hiểu về Jenkins và CI/CD*: https://viblo.asia/p/tim-hieu-ve-jenkins-va-cicd-eW65GbDxlDO
- Viblo — *Argo CD hiểu biết cơ bản*: https://viblo.asia/p/argo-cd-hieu-biet-co-ban-GAWVpOQaL05
- Viblo — *CI/CD Pipeline là gì?*: https://viblo.asia/p/cicd-pipeline-la-gi-mot-cicd-pipeline-hoan-thien-trong-nhu-the-nao-3RL1BKl7Vao
- Dev.to — *50 Best CI/CD Tools for 2025*: https://dev.to/dev_tips/50-best-cicd-tools-for-2025-the-ultimate-guide-to-automating-your-devops-pipeline-eh1
- Martin Fowler — *Continuous Integration*: https://martinfowler.com/articles/continuousIntegration.html
- Martin Fowler — *Test Pyramid*: https://martinfowler.com/bliki/TestPyramid.html
- Tài liệu chính thức: GitHub Actions, GitLab CI/CD, Jenkins, SonarQube, Docker, Testcontainers, Jest, pytest, JUnit, Playwright, Cypress.

*Tài liệu tổng hợp phục vụ seminar "CI/CD & Test-Harness Engineering" — Nhóm 06. Nguồn dữ liệu: 5 báo cáo cá nhân Tuần 4.*

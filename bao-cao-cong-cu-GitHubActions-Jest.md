# Báo cáo công cụ: GitHub Actions & Jest (+ Supertest)

> Áp dụng thực nghiệm trên backend EShop (`application_demo_1/backend`) — 2 kịch bản test tương ứng 2 chức năng đã được đặc tả trong `README.md` (System Requirements Specification).

---

## 1. Kịch bản test 2 chức năng/màn hình

> Bản cập nhật: ngoài 2 hành vi bug gốc, test đã được mở rộng để bao phủ **toàn bộ các chức năng mà 2 luồng nghiệp vụ đi qua** (đăng ký, đăng nhập, giỏ hàng, checkout, admin cập nhật trạng thái, hủy đơn, xem chi tiết đơn) — chia rõ **Unit test** (hàm nghiệp vụ thuần, không đụng DB) và **Integration test** (gọi API thật qua Supertest + SQLite).

### 1.1 Chức năng 1 — Hủy đơn hàng theo trạng thái (FR-10: Order State Machine)

**Đặc tả đúng:** Khi đơn hàng đã ở trạng thái `shipping` (đang giao), User không được phép tự hủy đơn nữa — chỉ các trạng thái `pending`/`confirmed` mới được phép hủy. `delivered` và `canceled` là trạng thái kết thúc, không được chuyển tiếp sang bất kỳ trạng thái nào khác.

**2 bug phát hiện trong code:**
- `PUT /api/orders/:id/cancel` chỉ chặn hủy khi trạng thái là `delivered` hoặc `canceled`, quên mất trường hợp `shipping`.
- `PUT /api/admin/orders/:id/status` cho phép chuyển `canceled → delivered`, vi phạm nguyên tắc "trạng thái kết thúc không được chuyển tiếp".

**Các endpoint xuất hiện trong luồng (được test đầy đủ, không chỉ mỗi endpoint có bug):**
`POST /api/register` → `POST /api/login` (user + admin) → `POST /api/checkout` → `PUT /api/admin/orders/:id/status` (nhiều lần, cả case hợp lệ lẫn không hợp lệ) → `PUT /api/orders/:id/cancel` (cả case pending hủy được lẫn shipping không hủy được).

**Unit test** (`tests/unit/business-logic.test.js`): gọi trực tiếp 2 hàm thuần `canCancelOrder(status)` và `isValidOrderStatusTransition(from, to)` với đầy đủ tổ hợp trạng thái (`test.each`), không cần khởi động server hay DB.

**Integration test** (`tests/integration/order-status.test.js`, `order-cancel.test.js`): dựng luồng thật qua Supertest — checkout tạo đơn, admin chuyển trạng thái, user gọi hủy — kiểm tra đúng mã HTTP trả về ở từng bước.

### 1.2 Chức năng 2 — Thanh toán, tự tính lại tổng tiền (FR-08: Checkout)

**Đặc tả đúng:** "Backend phải tự tính lại tổng tiền; không chấp nhận giá trị `total_amount` do client gửi lên."

**Bug phát hiện trong code:** `POST /api/checkout` lấy thẳng `total_amount` từ `req.body` và lưu vào đơn hàng, không hề đối chiếu với giỏ hàng thực tế phía server.

**Các endpoint xuất hiện trong luồng:**
`POST /api/register` → `POST /api/login` → `POST /api/cart` (thêm sản phẩm) → `GET /api/cart` (xác nhận giỏ hàng đúng) → `POST /api/checkout` (gửi `total_amount` giả) → `GET /api/orders/:id` (xác nhận DB lưu đúng tổng tiền thật).

**Unit test** (`tests/unit/business-logic.test.js`): gọi trực tiếp hàm thuần `calculateCartTotal(cartItems)` với nhiều bộ dữ liệu giỏ hàng (nhiều sản phẩm, giỏ rỗng), không cần DB.

**Integration test** (`tests/integration/cart.test.js`, `checkout.test.js`, `order-detail.test.js`): test toàn bộ luồng thật qua Supertest, bao gồm cả trường hợp chưa đăng nhập (401), giỏ hàng rỗng, đơn hàng không tồn tại (404).

### 1.3 Danh sách file test cuối cùng

| File | Loại | Nội dung |
|---|---|---|
| `tests/unit/business-logic.test.js` | Unit | `calculateCartTotal`, `canCancelOrder`, `isValidOrderStatusTransition` |
| `tests/integration/auth.test.js` | Integration | Đăng ký, đăng nhập đúng/sai |
| `tests/integration/cart.test.js` | Integration | Giỏ hàng rỗng, thêm sản phẩm, chưa đăng nhập |
| `tests/integration/checkout.test.js` | Integration | Tính lại tổng tiền, chưa đăng nhập |
| `tests/integration/order-status.test.js` | Integration | Toàn bộ chuyển trạng thái hợp lệ/không hợp lệ |
| `tests/integration/order-cancel.test.js` | Integration | Hủy khi pending (thành công), hủy khi shipping (bị chặn) |
| `tests/integration/order-detail.test.js` | Integration | Xem đơn hàng đúng, đơn không tồn tại |

**Kết quả sau khi sửa code:** 7 test suite / 37 test — toàn bộ PASS.

---

## 2. Chức năng của tool

### 2.1 GitHub Actions

GitHub Actions là nền tảng CI/CD tích hợp sẵn trong GitHub, dùng để **tự động hóa việc build, test và deploy** mỗi khi có sự kiện xảy ra trên repository (push, pull request, tạo tag...). Trong bài demo, GitHub Actions đảm nhiệm 2 vai trò:

- **CI (Continuous Integration):** tự động chạy bộ test Jest mỗi khi có push hoặc Pull Request, báo cáo kết quả pass/fail ngay trên giao diện PR.
- **Quality Gate:** kết hợp với Branch Protection Rule của GitHub, biến kết quả test thành điều kiện bắt buộc — PR không thể merge vào `main` nếu test chưa pass.
- **CD (Continuous Deployment) trigger:** sau khi merge thành công vào `main`, tự động gọi Render Deploy Hook để kích hoạt deploy bản mới lên production.

### 2.2 Jest (+ Supertest)

**Jest** là một test framework/test runner cho JavaScript, đảm nhiệm việc **phát hiện file test, thực thi test, so sánh kết quả (assertion) và xuất báo cáo** (pass/fail, số lượng test, thời gian chạy).

**Supertest** là thư viện bổ trợ, chuyên dùng để **gửi HTTP request giả lập tới một Express app** mà không cần thật sự mở cổng mạng/chạy server độc lập — cho phép viết test ở tầng API (integration/API test) một cách nhanh gọn.

Kết hợp lại: Jest đóng vai trò *test runner + assertion engine*, Supertest đóng vai trò *HTTP client giả lập* để gọi vào các endpoint của `server.js`.

---

## 3. Nguyên lý hoạt động

### 3.1 GitHub Actions — cơ chế hoạt động

GitHub Actions vận hành dựa trên file cấu hình YAML đặt trong `.github/workflows/`. Mỗi file định nghĩa 1 **workflow**, gồm 3 tầng: **Trigger (on) → Job → Step**.

```yaml
name: CI Demo 1 - Backend Tests

on:
  push:
    branches: [main, demo_1]
    paths:
      - "application_demo_1/**"
  pull_request:
    branches: [main]
    paths:
      - "application_demo_1/**"

jobs:
  test:
    name: Run Jest tests (backend)
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: application_demo_1/backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: application_demo_1/backend/package-lock.json
      - run: npm ci
      - run: npm test

  deploy:
    name: Trigger Render deploy
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - run: curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}"
```

Giải thích cơ chế từng phần:

- **`on:`** — GitHub liên tục lắng nghe sự kiện trên repo. Ở đây workflow chỉ kích hoạt khi có `push`/`pull_request` **và** thay đổi nằm trong đường dẫn `application_demo_1/**` (tránh chạy dư thừa khi sửa các folder demo khác).
- **`jobs.test.runs-on: ubuntu-latest`** — GitHub cấp phát 1 máy ảo Linux tạm thời (runner) để chạy job này, hoàn toàn cô lập, hủy sau khi job xong.
- **`defaults.run.working-directory`** — vì backend không nằm ở root repo, mọi lệnh `run:` trong job này sẽ tự `cd` vào `application_demo_1/backend` trước khi chạy.
- **`actions/checkout@v4`** — clone code repo vào máy ảo runner (nếu không có bước này, runner sẽ trống, không có gì để test).
- **`actions/setup-node@v4`** — cài đặt đúng Node.js 20 vào runner, đồng thời cache lại `node_modules` dựa trên checksum của `package-lock.json` để lần chạy sau nhanh hơn (không phải tải lại dependency từ đầu).
- **`npm ci`** — cài dependency đúng y hệt phiên bản ghi trong `package-lock.json` (khác `npm install` ở chỗ không tự ý cập nhật lockfile, đảm bảo môi trường CI luôn nhất quán).
- **`npm test`** — chạy `jest --runInBand`; **exit code** của lệnh này chính là thứ GitHub Actions dùng để quyết định job pass hay fail (exit code 0 = pass, khác 0 = fail). Đây là cơ chế cốt lõi giúp Actions "biết" test có pass hay không — không phải đọc hiểu nội dung test, mà chỉ dựa vào mã thoát của tiến trình.
- **`needs: test`** ở job `deploy` — tạo phụ thuộc: job `deploy` chỉ chạy nếu job `test` thành công trước đó. Đây chính là cơ chế "Quality Gate" ở tầng workflow.
- **`if: github.ref == 'refs/heads/main' && github.event_name == 'push'`** — đảm bảo việc gọi deploy hook **chỉ** xảy ra khi có push thật sự vào `main` (tức là sau khi PR đã được merge), không chạy khi mới chỉ là Pull Request đang mở.
- **`secrets.RENDER_DEPLOY_HOOK`** — GitHub inject giá trị bí mật đã lưu ở Settings → Secrets vào biến môi trường tại thời điểm chạy, không bao giờ lộ ra trong log hay trong code.

Kết hợp với **Branch Protection Rule** (cấu hình ở GitHub, không nằm trong file YAML) yêu cầu check `"Run Jest tests (backend)"` phải pass, GitHub sẽ tự khóa nút Merge trên PR cho tới khi job `test` trả về exit code 0.

### 3.2 Jest + Supertest — cơ chế hoạt động

**Bước 0 — Vì sao tách được Unit test và Integration test:**
Ban đầu, logic nghiệp vụ (kiểm tra trạng thái đơn hàng, tính tiền giỏ hàng) nằm lẫn trực tiếp trong route handler của Express (đọc/ghi DB và xử lý logic cùng một chỗ) — khiến muốn test logic thì bắt buộc phải đi qua HTTP + DB thật, không thể tách riêng. Để unit test được, phần logic thuần (không phụ thuộc DB/HTTP) được tách ra file riêng `businessLogic.js`:

```js
function calculateCartTotal(cartItems) {
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

Route handler trong `server.js` giờ chỉ còn gọi lại hàm này:

```js
const cartItems = userCarts[userId] || [];
const total_amount = calculateCartTotal(cartItems);
```

Nhờ vậy, **Unit test** gọi thẳng `calculateCartTotal([{price: 100000, quantity: 2}])` và `expect(...).toBe(200000)` — chạy trong vài mili-giây, không cần Supertest, không cần DB, không cần Express. Còn **Integration test** vẫn giữ nguyên việc gọi qua Supertest như bên dưới, để xác nhận toàn bộ chuỗi (HTTP → middleware xác thực → route → DB) hoạt động đúng với nhau, không chỉ riêng logic bên trong.

**Bước 1 — Jest phát hiện và thực thi test:**
Jest tự động quét các file khớp pattern `*.test.js` (mặc định), nạp từng file như 1 module Node.js riêng biệt (mỗi file test có 1 module registry/require-cache độc lập). Bên trong mỗi file, `describe()` nhóm các test lại, `test()`/`it()` định nghĩa từng ca kiểm thử cụ thể.

**Bước 2 — Supertest giả lập HTTP mà không cần mở cổng mạng thật:**

```js
const request = require("supertest");
const app = require("../server");

const res = await request(app)
  .put(`/api/orders/${orderId}/cancel`)
  .set("Authorization", `Bearer ${userToken}`);

expect(res.status).toBe(400);
```

Cơ chế: `require("../server")` trả về **object `app` của Express** — bản thân `app` chỉ là 1 hàm xử lý request (request handler), chưa hề mở cổng mạng nào. Để `app` export ra được (thay vì tự chạy `app.listen()` ngay khi require), `server.js` được chỉnh:

```js
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
```

`require.main === module` chỉ đúng khi file được chạy trực tiếp bằng `node server.js` — còn khi Jest `require()` file này để test, điều kiện sai, nên `app.listen()` **không** chạy, tránh việc mỗi lần test lại tự mở thêm 1 server thật trên port 3000 (gây xung đột/lãng phí).

Khi gọi `request(app).put(...)`, Supertest tự tạo **1 HTTP server tạm thời trên cổng ngẫu nhiên (ephemeral port)**, gắn `app` vào làm handler, gửi request thật qua network loopback tới server tạm đó, nhận response, rồi tắt server đi ngay sau khi xong — toàn bộ diễn ra trong nội bộ tiến trình Jest, không cần bạn tự chạy `node server.js` trước.

**Bước 3 — Assertion (`expect`):**
Jest cung cấp hàm toàn cục `expect()` cùng các *matcher* (`.toBe()`, `.toEqual()`...). Khi matcher không thỏa mãn, Jest ném ra 1 lỗi có cấu trúc (kèm giá trị *Expected* vs *Received*), Jest bắt lỗi này, đánh dấu test là **failed**, in ra report, nhưng vẫn tiếp tục chạy các test khác (không dừng cả tiến trình).

**Bước 4 — Vì sao chạy `--runInBand`:**
`database.js` (SQLite) tự `DROP TABLE` + tạo lại + seed dữ liệu mỗi khi được `require()`. Nếu để Jest chạy nhiều file test song song (mặc định), nhiều tiến trình worker có thể cùng lúc DROP/CREATE trên **cùng 1 file SQLite**, gây xung đột dữ liệu. Cờ `--runInBand` buộc Jest chạy tuần tự từng file test trong 1 tiến trình duy nhất, đảm bảo file test sau chỉ bắt đầu seed lại DB sau khi file trước đã chạy xong hoàn toàn.

---

## Tóm tắt cơ chế phối hợp toàn bộ pipeline

```
Developer push code
   → GitHub Actions trigger (on.push / on.pull_request)
   → Runner cài Node 20, npm ci
   → npm test (Jest nạp server.js làm app, Supertest gọi API giả lập, expect() so sánh kết quả)
   → Exit code quyết định job "test" pass/fail
   → Branch Protection dùng kết quả đó để khóa/mở nút Merge
   → Sau khi merge vào main, job "deploy" (needs: test) gọi Render Deploy Hook
   → Render build & deploy bản mới
```

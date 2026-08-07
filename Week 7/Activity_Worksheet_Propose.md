# Activity Worksheet — CI/CD & Test Harnessing
**Nhóm 06 — 23KTPM3 Kiểm thử phần mềm — Seminar**

> Không upload trước buổi seminar (giữ bất ngờ).
> Hoạt động 1 dùng hệ thống EShop thật (`https://github.com/ttbhanh/eshop-sut`).
> Hoạt động 2 dùng 1 repo mini độc lập để trải nghiệm pipeline CI/CD thật.

**Nguyên tắc:** cá nhân, làm trên laptop của mình, chỉ cần **trình duyệt web**
(+ tài khoản GitHub cho HĐ2). Không cài Git/Node.js cục bộ. Nộp bài cá nhân
cuối buổi.

**Thời lượng:** ~10 phút HĐ1 + ~12 phút HĐ2 + 3 phút chữa nhanh.

---

## Hoạt động 1 — "Soi Đặc Tả, Test Hệ Thống Thật"
**Vị trí:** sau phần lý thuyết Test Harness / Kim tự tháp kiểm thử

**Mục tiêu:** tự thiết kế 1 test case từ đặc tả (FR), thao tác trực tiếp trên
EShop thật để xác nhận **PASS/FAIL**, tập tư duy Assertion (kỳ vọng vs thực tế).

### Chuẩn bị (facilitator)
Đảm bảo cả lớp truy cập được **Frontend Web EShop** (URL local
`http://localhost:5173` nếu mỗi máy tự chạy theo README, hoặc 1 link chung
do nhóm/GV cung cấp).

### Các bước
1. Facilitator gán ngẫu nhiên (bốc thăm số 1–6) mỗi sinh viên **1 FR** trong
   bảng dưới.
2. Đăng nhập bằng `test@eshop.com` / `Test1234!` (hoặc tự đăng ký nếu FR liên
   quan đến đăng ký/đăng nhập).
3. Thao tác trực tiếp trên hệ thống đúng theo FR được gán, quan sát kết quả.
4. Điền vào **Template 1**.

### Danh sách FR để bốc thăm
| # | FR | Nội dung cần kiểm thử |
|---|---|---|
| 1 | FR-02 | Đăng nhập sai **3 lần liên tiếp** → tài khoản có bị khóa 30 giây không? |
| 2 | FR-04 | Sửa **Số điện thoại** trong hồ sơ thành giá trị sai định dạng (vd: `abc`) → có bị chặn không? |
| 3 | FR-07 | Thêm **cùng 1 sản phẩm** vào giỏ hàng 2 lần → tăng số lượng hay tạo dòng mới? |
| 4 | FR-08 | Ở trang Thanh toán, thử chỉnh sửa trực tiếp **Tổng tiền** → có sửa được không? |
| 5 | FR-09 | Nhập mã giảm giá `EXPIRED` khi checkout → có được áp dụng không? |
| 6 | FR-10 | Đặt đơn, nhờ admin chuyển sang `shipping`, rồi thử **Hủy đơn** bằng tài khoản user → có hủy được không? |

### Template 1
```
=== HOẠT ĐỘNG 1 — Test hệ thống thật ===
Họ tên: ____________  MSSV: ____________
FR được gán: ______   Mô tả ngắn: ____________________

Bước thực hiện: ____________________________________
Kết quả MONG ĐỢI (theo đặc tả FR): ____________________
Kết quả THỰC TẾ (quan sát trên hệ thống): ______________
Kết luận: [ ] PASS   [ ] FAIL
Nếu FAIL — mô tả bug 1 câu: __________________________
```

### Đáp án tham khảo (chỉ facilitator)
| FR | Kết quả đúng theo đặc tả |
|---|---|
| FR-02 | Khóa tài khoản 30s sau 3 lần sai liên tiếp |
| FR-04 | SĐT sai định dạng phải bị từ chối, báo lỗi |
| FR-07 | Tăng số lượng dòng đã có, không tạo dòng mới |
| FR-08 | Không sửa được tổng tiền trên UI; backend tự tính lại |
| FR-09 | Mã `EXPIRED` hết hạn từ 2020 → phải bị từ chối |
| FR-10 | User không được tự hủy khi đơn đã ở trạng thái `shipping` |

---

## Hoạt động 2 — "Bấm Nút, Thấy Pipeline Chạy Thật"
**Vị trí:** ngay trước hoặc sau phần demo GitHub Actions của nhóm

**Mục tiêu:** trực tiếp trải nghiệm 1 pipeline CI/CD thật chạy trên GitHub —
tự tay làm code "gãy" → thấy pipeline **FAIL (đỏ)** và đọc log lỗi → sửa lại
→ thấy pipeline **PASS (xanh)**. Không cần cài gì, toàn bộ thao tác trên
trình duyệt tại github.com.

### Chuẩn bị trước buổi seminar (facilitator làm 1 lần, ~10 phút)
Tạo 1 **repo GitHub công khai (Public)**, đánh dấu là **Template repository**
(Settings → tick "Template repository"), gồm 4 file sau:

**`calculator.js`**
```js
function applyDiscount(total, percent) {
  return total - (total * percent) / 100;
}
module.exports = { applyDiscount };
```

**`calculator.test.js`**
```js
const { applyDiscount } = require("./calculator");

test("giảm 10% trên 100.000đ phải còn 90.000đ", () => {
  expect(applyDiscount(100000, 10)).toBe(90000);
});

test("giảm 0% thì giữ nguyên tổng tiền", () => {
  expect(applyDiscount(100000, 0)).toBe(100000);
});
```

**`package.json`**
```json
{
  "name": "mini-cicd-lab",
  "version": "1.0.0",
  "scripts": { "test": "jest" },
  "devDependencies": { "jest": "^29.0.0" }
}
```

**`.github/workflows/ci.yml`**
```yaml
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm test
```

Chuẩn bị sẵn link repo mẫu để dán lên slide đầu giờ hoạt động, và bốc thăm
gán mỗi sinh viên 1 trong 2 **Bug Card** bên dưới.

### Bug Card (bốc thăm A hoặc B)
| Card | Sửa dòng nào trong `calculator.js` | Kết quả kỳ vọng |
|---|---|---|
| **A** | Đổi `total - (total * percent) / 100` thành `total + (total * percent) / 100` | Test "giảm 10%" FAIL vì cộng thay vì trừ |
| **B** | Đổi `(total * percent) / 100` thành `total * percent` (bỏ phép chia) | Test "giảm 10%" FAIL vì kết quả sai lệch lớn |

### Các bước sinh viên thực hiện
1. Mở link repo mẫu → bấm nút xanh **"Use this template" → "Create a new
   repository"** → đặt tên tuỳ ý, để **Public** → **Create repository**
   (chỉ mất vài giây, đây là bản repo **của riêng bạn**).
2. Vào tab **Actions** của repo vừa tạo → đợi pipeline đầu tiên chạy xong
   (thường < 1 phút) → phải thấy dấu **✔ xanh (PASS)** vì code gốc đúng.
3. Mở file `calculator.js` → bấm icon **bút chì (Edit)** → sửa đúng theo
   **Bug Card** được gán → cuộn xuống, chọn **"Commit directly to the main
   branch"** → **Commit changes**.
4. Quay lại tab **Actions** → xem pipeline mới chạy → quan sát: **PASS hay
   FAIL?** Bấm vào lần chạy đó để mở log, tìm đúng dòng test bị lỗi.
5. Sửa `calculator.js` về lại đúng như ban đầu → Commit lần nữa → xem
   pipeline chuyển về **xanh**.
6. Điền **Template 2**.

### Template 2
```
=== HOẠT ĐỘNG 2 — Trải nghiệm pipeline CI/CD thật ===
Họ tên: ____________  MSSV: ____________
Link repo cá nhân: ____________________________
Bug Card được gán: [ A / B ]

Lần chạy 1 (code gốc):        [ ] PASS  [ ] FAIL
Lần chạy 2 (sau khi cấy lỗi): [ ] PASS  [ ] FAIL
  → Test nào FAIL? Log báo lỗi gì (ghi 1 dòng)? ________________
Lần chạy 3 (sau khi sửa lại): [ ] PASS  [ ] FAIL

1) Điều gì đã TỰ ĐỘNG kích hoạt (trigger) cả 3 lần chạy pipeline trên?
   ________________________________________________
2) Trong dự án thật có nhiều người cùng code, pipeline FAIL ở lần 2 nên
   ngăn điều gì xảy ra tiếp theo (liên hệ Merge/Deploy)?
   ________________________________________________
```

---

## Nộp bài
Gộp Template 1 + Template 2 vào **1 file**, đặt tên
`MSSV_HoTen_ActivityWorksheet`, nộp qua kênh do nhóm/GV chỉ định trong vòng
5 phút sau khi seminar kết thúc. Giữ repo ở Hoạt động 2 ở chế độ **Public**
để nhóm có thể kiểm tra lại lịch sử commit/pipeline nếu cần.

## Ghi chú điều phối
- HĐ2 cần tài khoản GitHub (miễn phí) — đa số sinh viên trong lớp đã có sẵn
  từ các bài tập GitHub Actions trước đó; nếu ai chưa có, cho phép ghép cặp
  quan sát chung với bạn ngồi cạnh thay vì tạo repo riêng.
- Repo Public trên GitHub chạy Actions miễn phí, không giới hạn phút chạy —
  không phát sinh chi phí.
- Nếu máy sinh viên ở HĐ1 không truy cập được hệ thống EShop, cho phép làm
  dựa trên mô tả FR + ảnh chụp màn hình do facilitator chiếu.
- Dành 2–3 phút cuối gọi ngẫu nhiên 1–2 bạn chia sẻ màn hình pipeline FAIL→PASS
  của mình — tạo hiệu ứng trực quan mạnh cho cả lớp trước khi thu bài.

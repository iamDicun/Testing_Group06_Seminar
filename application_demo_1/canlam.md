# Hướng dẫn cơ bản từng bước

## Bước 1 — Deploy backend lên Render

1. Vào render.com, đăng nhập bằng tài khoản GitHub.
2. Dashboard → New → Web Service.
3. Chọn connect tới repo Testing_Group06_Seminar (cho phép Render truy cập nếu được hỏi).
4. Điền cấu hình:
   - Root Directory: application_demo_1/backend
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node server.js
   - Branch: main
   - Instance Type: Free
5. Bấm Create Web Service, đợi build xong, ghi lại link dạng https://ten-gi-do.onrender.com.

## Bước 2 — Tắt Auto-Deploy

1. Vào service vừa tạo → tab Settings.
2. Kéo xuống mục Auto-Deploy → chuyển sang No.
3. Bấm Save Changes.

## Bước 3 — Lấy Deploy Hook + tạo GitHub Secret

1. Vẫn trong Settings của service, kéo xuống mục Deploy Hook → copy URL.
2. Qua GitHub, vào repo → tab Settings (của repo, không phải tài khoản) → sidebar trái Secrets and variables → Actions.
3. Bấm New repository secret.
4. Name: RENDER_DEPLOY_HOOK, Value: dán URL vừa copy → Add secret.

## Bước 4 — Push nhánh demo_1 lên GitHub

```
git add .
git commit -m "add jest tests + ci workflow"
git push origin demo_1
```

Vào tab Actions trên GitHub, kiểm tra thấy workflow đã chạy (dù fail cũng được, miễn là nó chạy).

## Bước 5 — Bật Branch Protection cho main

1. Repo → Settings → Branches.
2. Bấm Add branch protection rule (hoặc Add rule).
3. Branch name pattern: main.
4. Tick Require status checks to pass before merging.
5. Tìm và chọn check tên "Run Jest tests (backend)" (chỉ hiện ra sau khi Bước 4 đã chạy ít nhất 1 lần).
6. Bấm Create / Save changes.

## Bước 6 — Mở Pull Request

1. Repo → tab Pull requests → New pull request.
2. base: main ← compare: demo_1.
3. Bấm Create pull request, đặt tiêu đề, bấm Create.

## Bước 7 — Chuẩn bị 4 cửa sổ để quay

- VS Code mở sẵn project (thấy được server.js).
- Terminal ở đúng thư mục application_demo_1/backend.
- Trình duyệt tab 1: PR vừa tạo trên GitHub (để xem Actions/Merge).
- Trình duyệt tab 2 (hoặc Postman): Render Dashboard + sẵn sàng gọi thử API sau khi deploy.

---

Làm xong 7 bước này là quay được theo đúng kịch bản đã có.

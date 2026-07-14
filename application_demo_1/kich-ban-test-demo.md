# Kịch bản Test Demo — CI/CD & Test-Harness (application_demo_1)

## Phần A — Chuẩn bị hạ tầng CI/CD (làm một lần, dùng chung cho cả 2 kịch bản)

1. Deploy repo backend lên Render, bật kết nối GitHub
2. Tạo Render service, lấy Deploy Hook URL, tắt Auto-Deploy mặc định
3. Lưu Deploy Hook URL vào GitHub Secrets
4. Tạo file workflow GitHub Actions (`.github/workflows/ci.yml`) chạy `npm test` khi có push/pull_request
5. Thêm step gọi Render Deploy Hook trong workflow khi push vào `main`
6. Bật Branch Protection Rule trên `main`, yêu cầu check GitHub Actions phải pass mới cho merge

---

## Kịch bản 1 (mức vừa): Hủy đơn hàng khi trạng thái `shipping`

7. Tạo nhánh mới từ `main`
8. Xác định bug: hủy đơn khi trạng thái `shipping` vẫn được chấp nhận (đáng lẽ phải bị chặn)
9. Viết Jest + Supertest test: đăng ký → login → checkout → admin cập nhật trạng thái đơn sang `shipping` → gọi hủy đơn → kỳ vọng lỗi 400
10. Chạy test ở local, xác nhận test FAIL (bug tồn tại)
11. Push nhánh lên GitHub, tạo Pull Request vào `main`
12. Quan sát GitHub Actions tự động chạy, kiểm tra kết quả FAIL trên PR
13. Xác nhận nút Merge bị khóa do check chưa pass
14. Sửa code trong `server.js` (bổ sung điều kiện chặn hủy đơn khi `shipping`)
15. Commit và push tiếp vào cùng nhánh
16. Quan sát GitHub Actions chạy lại, kiểm tra kết quả PASS trên PR
17. Xác nhận nút Merge được mở khóa, merge Pull Request vào `main`
18. Quan sát Render nhận request deploy, build và triển khai bản mới
19. Kiểm tra API trên môi trường Render: gọi thử hủy đơn với trạng thái `shipping`, xác nhận trả lỗi 400
20. Ghi nhận kết quả, chụp ảnh màn hình từng bước để đưa vào báo cáo/slide demo

---

## Kịch bản 2 (mức dễ): Kiểu dữ liệu `price` bị sai khi `id` sản phẩm là số chẵn

21. Tạo nhánh mới từ `main`
22. Xác định bug: `GET /api/products/:id` trả về `price` dạng string khi `id` chẵn, thay vì number
23. Viết Jest + Supertest test: gọi `GET /api/products/2` → kỳ vọng `typeof response.body.price === "number"`
24. Chạy test ở local, xác nhận test FAIL (bug tồn tại)
25. Push nhánh lên GitHub, tạo Pull Request vào `main`
26. Quan sát GitHub Actions tự động chạy, kiểm tra kết quả FAIL trên PR
27. Xác nhận nút Merge bị khóa do check chưa pass
28. Sửa code trong `server.js` (bỏ đoạn ép kiểu `row.price.toString()` khi `id` chẵn)
29. Commit và push tiếp vào cùng nhánh
30. Quan sát GitHub Actions chạy lại, kiểm tra kết quả PASS trên PR
31. Xác nhận nút Merge được mở khóa, merge Pull Request vào `main`
32. Quan sát Render nhận request deploy, build và triển khai bản mới
33. Kiểm tra API trên môi trường Render: gọi `GET /api/products/2`, xác nhận `price` trả về đúng kiểu number
34. Ghi nhận kết quả, chụp ảnh màn hình từng bước để đưa vào báo cáo/slide demo



Kịch bản quay demo — CI/CD & Test-Harness (backend EShop)

▎ Chuẩn bị sẵn 4 cửa sổ/tab trước khi quay: VS Code (code), Terminal, GitHub (repo + PR + Actions), Render Dashboard + Postman/curl.

---
Cảnh 1 — Giới thiệu bug (quay màn hình VS Code)

- Mở server.js, chỉ vào 2 đoạn code có bug:
  - PUT /api/orders/:id/cancel — chỉ chặn hủy khi delivered/canceled, quên chặn shipping
  - GET /api/products/:id — ép price thành string khi id chẵn
- Nói ngắn gọn: đây là 2 bug thật, mình sẽ viết test để bắt chúng.

Cảnh 2 — Chạy test local, thấy FAIL (quay Terminal)

cd application_demo_1/backend
npm test
- Zoom vào phần Expected: 400 / Received: 200 và Expected: "number" / Received: "string" — chứng minh bug có thật, test viết đúng.

Cảnh 3 — Push code + tạo Pull Request (quay Terminal → GitHub)

- git add . && git commit -m "..." && git push nhánh demo_1
- Trên GitHub: mở Pull Request từ demo_1 → main.

Cảnh 4 — GitHub Actions chạy, thấy FAIL (quay tab GitHub → Actions/Checks trên PR)

- Đợi workflow chạy xong, quay rõ dấu ❌ đỏ trên PR.
- Click vào check để mở log, cho thấy 2 test fail y hệt như lúc chạy local.

Cảnh 5 — Nút Merge bị khóa (quay PR)

- Zoom vào dòng "Merge blocked" / nút Merge bị mờ, kèm dòng chữ yêu cầu status check phải pass.

Cảnh 6 — Sửa bug (quay VS Code)

- Báo mình fix (hoặc tự sửa theo bản submission/test-pass/backend/server.js đã chuẩn bị sẵn), cho thấy diff trước/sau 2 đoạn code.

Cảnh 7 — Chạy lại test local, thấy PASS (quay Terminal — nên có, để chắc trước khi push)

npm test
- Zoom vào dòng Tests: 2 passed, 2 total.

Cảnh 8 — Push fix, GitHub Actions chạy lại PASS (quay Terminal → GitHub Actions)

- git add . && git commit && git push (cùng nhánh demo_1).
- Quay dấu ✅ xanh xuất hiện trên PR.

Cảnh 9 — Merge được mở khóa, bấm Merge (quay PR)

- Cho thấy nút Merge giờ bấm được, click Merge pull request.

Cảnh 10 — Render tự động deploy (quay Render Dashboard)

- Vào Render, cho thấy deploy mới được kích hoạt tự động (do job deploy trong Actions gọi Deploy Hook) ngay sau khi merge vào main.
- Đợi tới khi status chuyển "Live".

Cảnh 11 — Verify API thật trên production (quay Postman/curl)

curl https://<ten-service>.onrender.com/api/products/2
- Cho thấy price giờ trả về đúng kiểu number tr

curl https://<ten-service>.onrender.com/api/products/2
- Cho thấy price giờ trả về đúng kiểu number trên môi trường thật (không phải chỉ local nữa) — đây là khoảnh khắc chốt: chứng minh cả vòng CI → CD đã hoạt động đúng, từ lúc bắt bug tới lúc code fix thực sự chạy trên production.

# Slide Demo — CI/CD & Test-Harness Engineering (EShop Backend)

> Mỗi chỗ `[ẢNH: ten-file.png — mô tả]` là chỗ cần chụp màn hình, đặt đúng tên file rồi chèn vào slide.

---

## Slide 1 — Setup

- **Render**: Web Service, Root Directory `application_demo_1/backend`, Build `npm install --build-from-source`, Start `node server.js`, tắt Auto-Deploy
- **GitHub Actions**: workflow `.github/workflows/ci-demo1.yml` chạy `npm test` khi có push/PR
- **Biến/Secret**: GitHub Secret `RENDER_DEPLOY_HOOK` (URL deploy hook từ Render), biến `baseUrl` trong Postman
- **Postman**: import collection `eshop-demo.postman_collection.json` để gọi thử API

---

## Slide 2 — 2 bug được demo

- **FR-10 (Đơn hàng)**: Hủy đơn khi trạng thái `shipping` vẫn được chấp nhận (đáng lẽ phải bị chặn)
- **FR-08 (Thanh toán)**: `total_amount` lấy thẳng từ client, không tính lại từ giỏ hàng

`[ẢNH: bug-1-order-cancel.png — Postman: request hủy đơn khi shipping trả về 200 (sai)]`
`[ẢNH: bug-2-checkout-total.png — Postman: order lưu total_amount sai theo giá trị client gửi]`

---

## Slide 3 — Sau khi sửa code, GitHub Actions pass

- Viết Jest test cho 2 bug → push lên PR → Actions chạy FAIL, chặn merge
- Sửa code (chặn hủy đơn sai trạng thái + tính lại total_amount từ giỏ hàng) → push lại → Actions chạy PASS, merge được

`[ẢNH: actions-before-fail.png — GitHub Actions trước khi sửa: check đỏ ❌, merge bị khóa]`
`[ẢNH: actions-after-pass.png — GitHub Actions sau khi sửa: check xanh ✅, merge được]`

---

## Slide 4 — Merge xong, Render tự động deploy

```yaml
deploy:
  name: Trigger Render deploy
  needs: test
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  runs-on: ubuntu-latest
  steps:
    - name: Call Render Deploy Hook
      run: curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}"
```

`[ẢNH: render-deploy-success.png — Render Dashboard: deploy mới chạy thành công, trạng thái "Live"]`

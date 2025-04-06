# طراحی API

## API محصولات
### GET /api/products
- توضیحات: لیست محصولات رو برمی‌گردونه.
- پارامترها: `page`, `limit` (برای صفحه‌بندی)

### POST /api/products
- توضیحات: یک محصول جدید اضافه می‌کنه.
- پارامترها: `name`, `description`, `price`, `image`

## API سبد خرید
### GET /api/cart
- توضیحات: سبد خرید کاربر رو برمی‌گردونه.

### POST /api/cart/add
- توضیحات: محصولی رو به سبد خرید اضافه می‌کنه.
- پارامترها: `productId`, `quantity`

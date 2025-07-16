# Base image
FROM node:18-alpine

WORKDIR /app

# فقط کپی کردن فایل های آماده شده (شامل node_modules و کد کامپایل شده)
COPY . .

# ست کردن پورت (مثلا 4000)
EXPOSE 4000

# اجرای برنامه
CMD ["node", "dist/main.js"]

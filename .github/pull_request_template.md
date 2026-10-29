## 📋 Pluggy Engineering — Pull Request Checklist

> **⚠️ IMPORTANT:** Direct pushes to `main` are prohibited. All changes require explicit review and approval from **@Lakhankashyap999** (Founder / Code Owner).

### 1. What does this PR change?
- **Portal Affected:** [ ] Customer Storefront (`/`)  |  [ ] Engineer Portal (`/engineer`)  |  [ ] Admin Control Tower (`/admin`)  |  [ ] SQL Database (`src/lib/sqlDatabase.js`)
- **Summary of Changes:**
  - 

### 2. Mandatory Pre-Merge Verification
- [ ] `npm run build` passes with **zero** errors or broken imports.
- [ ] Tested on **Mobile View (`375px - 430px`)** and **Desktop View (`1280px+`)**.
- [ ] Strictly uses the Pluggy Brand Palette (`#1A2A49` Navy, `#F37021` Orange, `#F4F6F9` Slate) — no unauthorized colors.
- [ ] Customer Auth Guard (`requireCustomerLogin`) remains intact before cart/booking/payment.
- [ ] Role isolation between Customer, Engineer (`/engineer`), and Admin (`/admin`) portals is preserved.
- [ ] Escrow 4-digit OTP lock and 85% / 15% commission split logic is untouched or verified.

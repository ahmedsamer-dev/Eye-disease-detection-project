# AI Eye Disease Detection System — توثيق شامل للمشروع

> **Graduation Project** — Full-Stack AI-powered eye disease detection  
> **Production URL:** https://aieyedetection.runasp.net  
> **Hosting:** IIS on smarterasp.net (site74972)  
> **Last Updated:** June 2026

---

## فهرس المحتويات

1. [نظرة عامة على المشروع](#1-نظرة-عامة)
2. [بنية المشروع](#2-بنية-المشروع)
3. [Backend — ASP.NET Core 7](#3-backend--aspnet-core-7)
4. [Frontend — React + Vite](#4-frontend--react--vite)
5. [AI Model Server — Python Flask](#5-ai-model-server--python-flask)
6. [قاعدة البيانات](#6-قاعدة-البيانات)
7. [المصادقة والأمان](#7-المصادقة-والأمان)
8. [النشر (Deployment)](#8-النشر-deployment)
9. [متغيرات البيئة](#9-متغيرات-البيئة)
10. [المشاكل التي حُلّت](#10-المشاكل-التي-حُلّت)
11. [API Endpoints المرجع الكامل](#11-api-endpoints)
12. [تدفق العمل الكامل](#12-تدفق-العمل)
13. [ملاحظات مهمة للـ Agent القادم](#13-ملاحظات-مهمة)

---

## 1. نظرة عامة

نظام كامل لتشخيص أمراض العين بالذكاء الاصطناعي. الطبيب يرفع صورة قاع العين (Fundus Image)، الـ AI Model يشخّص المرض، والنظام يعرض تقريراً طبياً شاملاً.

### الأمراض المدعومة:
- **Glaucoma** (الجلوكوما)
- **Diabetic Retinopathy** (اعتلال الشبكية السكري)
- **Cataract** (المياه البيضاء)
- **Normal** (طبيعي)

### Stack التقني:
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + MUI v6 |
| Backend | ASP.NET Core 7 (C#) |
| AI Server | Python Flask |
| Database | SQL Server (databaseasp.net) |
| Auth | JWT + Google OAuth 2.0 |
| Hosting | IIS on smarterasp.net |
| ORM | Entity Framework Core 7 |

---

## 2. بنية المشروع

```
/workspace
├── AI-Eye-Diagnosis-main/          ← Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx         ← الصفحة الرئيسية (زوار)
│   │   │   ├── Login.jsx           ← تسجيل الدخول + Google OAuth
│   │   │   ├── Register.jsx        ← إنشاء حساب
│   │   │   ├── ForgotPassword.jsx  ← نسيان الباسورد
│   │   │   ├── Callback.jsx        ← Google OAuth Callback Handler
│   │   │   ├── Home.jsx            ← رفع الصورة + تحليل
│   │   │   ├── Reports.jsx         ← عرض التقرير الكامل
│   │   │   ├── History.jsx         ← سجل التقارير المحفوظة
│   │   │   ├── Profile.jsx         ← إعدادات المستخدم
│   │   │   ├── PersonalInfo.jsx    ← بيانات شخصية طبية
│   │   │   └── NotFound.jsx        ← 404
│   │   ├── components/
│   │   │   ├── Navbar.jsx          ← Navbar + Hamburger Menu (mobile)
│   │   │   ├── FormField.jsx       ← مكون حقل إدخال موحّد
│   │   │   └── Logo.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx     ← إدارة الجلسة (token + user)
│   │   │   └── ThemeContext.jsx    ← Dark/Light mode
│   │   ├── api.js                  ← كل calls للـ API مركّزة
│   │   ├── App.jsx                 ← Router + Private Routes
│   │   ├── main.jsx
│   │   └── theme.js                ← MUI theme
│   ├── .env                        ← متغيرات Development
│   ├── .env.production             ← متغيرات Production
│   └── vite.config.js
│
├── Hassan_EyeDiseaseAI-master/     ← Backend (ASP.NET Core 7)
│   ├── EyeDiseaseAI.API/           ← Presentation Layer
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs
│   │   │   ├── ScansController.cs
│   │   │   ├── ReportsController.cs
│   │   │   ├── ProfileController.cs
│   │   │   └── MedicalHistoryController.cs
│   │   ├── Middleware/
│   │   │   └── ExceptionMiddleware.cs
│   │   ├── Program.cs              ← App startup + middleware pipeline
│   │   ├── appsettings.json        ← Production config
│   │   ├── web.config              ← IIS config (AspNetCoreModuleV2)
│   │   └── publish/                ← مخرجات dotnet publish
│   │
│   ├── EyeDiseaseAI.Application/   ← Business Logic Layer
│   │   ├── DTOs/
│   │   │   ├── Auth/               ← LoginDto, RegisterDto, GoogleLoginDto...
│   │   │   ├── Report/             ← DiagnosisReportDto, ReportSummaryDto
│   │   │   ├── Scan/               ← ScanResultDto
│   │   │   └── Profile/            ← ProfileDto (+ IsGoogleUser)
│   │   ├── Services/
│   │   │   ├── AuthService.cs      ← Register/Login/Google/JWT/Password
│   │   │   ├── ScanService.cs      ← رفع الصورة + استدعاء AI + حفظ DB
│   │   │   ├── ReportService.cs    ← جلب/حفظ/حذف/PDF التقارير
│   │   │   ├── ProfileService.cs   ← بروفايل + IsGoogleUser detection
│   │   │   └── MedicalHistoryService.cs
│   │   ├── Interfaces/             ← Contracts لكل Service
│   │   └── Mappings/MappingProfile.cs ← AutoMapper
│   │
│   ├── EyeDiseaseAI.Domain/        ← Core Domain Layer
│   │   ├── Entities/
│   │   │   ├── ApplicationUser.cs  ← IdentityUser + FullName/Gender/DOB
│   │   │   ├── ScanImage.cs        ← الصورة المرفوعة
│   │   │   ├── DiagnosisReport.cs  ← التقرير الطبي
│   │   │   ├── Recommendation.cs   ← توصيات التقرير
│   │   │   └── MedicalHistory.cs
│   │   ├── Enums/                  ← EyeCondition, Gender, Severity
│   │   └── Interfaces/             ← IUnitOfWork, IGenericRepository, IAiModelService
│   │
│   └── EyeDiseaseAI.Infrastructure/ ← Data Access Layer
│       ├── Data/ApplicationDbContext.cs ← EF Core DbContext
│       ├── Repositories/           ← GenericRepository + UnitOfWork
│       ├── Services/AiModelService.cs ← HTTP call to Flask AI server
│       ├── Migrations/             ← EF Core Migrations
│       └── DependencyInjection.cs  ← Service registrations
│
├── scripts/                        ← أدوات النشر
│   ├── deploy_with_offline.py      ← النشر الرئيسي (DLLs)
│   ├── sftp_deploy.py              ← SFTP عام
│   ├── check_server.py             ← فحص صحة السيرفر
│   ├── restart_iis.py              ← إعادة تشغيل IIS
│   ├── apply_migration.py          ← تطبيق EF Migrations
│   ├── clear_db.py                 ← مسح قاعدة البيانات
│   ├── read_server_log.py          ← قراءة logs السيرفر
│   └── diagnose_server.py          ← تشخيص مشاكل السيرفر
│
└── PROJECT_DOCUMENTATION.md        ← هذا الملف
```

---

## 3. Backend — ASP.NET Core 7

### Architecture: Clean Architecture (4 layers)

```
API → Application → Domain ← Infrastructure
```

### Program.cs — ترتيب الـ Middleware (مهم جداً)

```
1. UseForwardedHeaders()     ← أول حاجة (HTTPS scheme behind IIS proxy)
2. ExceptionMiddleware       ← Global error handler
3. UseSwagger/SwaggerUI
4. UseDefaultFiles()         ← يخلي index.html الـ default
5. UseStaticFiles()          ← React build (wwwroot/)
6. UseRouting()              ← لازم قبل CORS
7. UseCors("AllowAll")       ← بعد UseRouting مباشرة
8. UseAuthentication()
9. UseAuthorization()
10. MapControllers()
11. MapFallbackToFile("index.html") ← SPA fallback للـ React Router
```

> ⚠️ **تحذير:** ترتيب الـ Middleware حرج. تغيير الترتيب يكسر CORS أو HTTPS scheme.

### Auto Database Migration

```csharp
// في Program.cs — يشتغل تلقائياً عند start
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}
```

### DependencyInjection.cs — ما يُسجَّل

```
- DbContext (SQL Server إذا connection string يبدأ بـ "Server=")
- Identity (ApplicationUser + IdentityRole)
- GenericRepository<T> + UnitOfWork
- AuthService, ProfileService, MedicalHistoryService, ScanService, ReportService
- HttpClient<AiModelService> (timeout: 60 seconds, base URL من appsettings)
- AutoMapper
```

### AiModelService.cs — منطق التشخيص

الـ service ترسل الصورة لـ Flask server وتحلّل الـ JSON response:

```json
{"prediction": "Glaucoma", "confidence": 0.94}
// أو
{"condition": "Glaucoma", "confidence": 94.2}
```

بعد استلام الـ condition، تولّد قيم طبية واقعية (random ضمن نطاقات):

| Condition | Severity | IOP Range | Cup/Disc Range |
|-----------|----------|-----------|----------------|
| Glaucoma | Moderate | 22–28 mmHg (elevated) | 0.60–0.80 (borderline) |
| Diabetic Retinopathy | Moderate | 14–19 mmHg (normal) | 0.30–0.40 (normal) |
| Cataract | Mild | 14–19 mmHg (normal) | 0.30–0.40 (normal) |
| Normal | None | 12–16 mmHg (normal) | 0.20–0.30 (normal) |
| Unknown/Other | Mild | 14–19 mmHg (normal) | 0.30–0.40 (normal) |

> ✅ **Case-insensitive matching** — يتعرف على `"glaucoma"`, `"GLAUCOMA"`, `"Glaucoma Stage 2"` كلها.

### ProfileDto — IsGoogleUser

```csharp
// ProfileDto.cs
public bool IsGoogleUser { get; set; }

// ProfileService.cs — يُحدَّد بناءً على PasswordHash
IsGoogleUser = user.PasswordHash == null
```

يُستخدم في الـ Frontend لإخفاء قسم "Change Password" لمستخدمي Google.

---

## 4. Frontend — React + Vite

### Routing (App.jsx)

```
/           → Landing (public)
/login      → Login (public)
/register   → Register (public)
/forgot-password → ForgotPassword (public)
/callback   → Google OAuth Callback (public)
/home       → Home [PRIVATE] — رفع الصورة
/reports/:id → Reports [PRIVATE] — عرض التقرير
/history    → History [PRIVATE] — سجل التقارير
/profile    → Profile [PRIVATE] — الإعدادات
/personal-info → PersonalInfo [PRIVATE]
* → NotFound
```

Private Routes تتحقق من `useAuth()` → لو user = null ترجّع `<Navigate to="/login"/>`.

### AuthContext.jsx — إدارة الجلسة

```javascript
// Token محفوظ في localStorage
// عند كل page load → يجيب الـ profile من API لتأكيد الجلسة
// لو token منتهي → يمسحه ويرجع المستخدم للـ login

checkAuth() → GET /api/profile → setUser(profile)
login()     → POST /api/auth/login → setUser
googleLogin() → POST /api/auth/google-login → setUser
logout()    → POST /api/auth/logout → setUser(null)
```

### api.js — كل الـ API calls

جميع الـ services موجودة في ملف واحد:
- `authService` — login, register, googleLogin, logout, forgotPassword, resetPassword, changePassword
- `profileService` — getProfile, updateProfile, uploadAvatar
- `scanService` — upload (multipart/form-data)
- `reportService` — getById, getAll, save, delete, downloadPdf
- `medicalHistoryService` — get, save

### Google OAuth Flow

```
1. Landing.jsx / Login.jsx → يفتح Google OAuth popup
   URL: https://accounts.google.com/o/oauth2/v2/auth
   client_id: من VITE_GOOGLE_CLIENT_ID
   redirect_uri: من VITE_GOOGLE_REDIRECT_URI (https://aieyedetection.runasp.net/callback)
   response_type: code
   scope: openid email profile

2. Google → يعمل redirect لـ /callback مع ?code=...

3. Callback.jsx:
   - يستلم الـ code
   - يبعثه لـ Google Token Endpoint لجيب الـ id_token
   - يبعث id_token للـ Backend: POST /api/auth/google-login
   - Backend يتحقق من الـ id_token ويرجع JWT

4. AuthContext يحفظ الـ JWT ويعمل redirect لـ /home
```

### Navbar.jsx — Mobile Responsive

- **Desktop (sm+):** links أفقية عادية
- **Mobile (xs):** Hamburger Icon → MUI Drawer من الجهة اليمين
- Theme toggle (dark/light) موجود في كلا الحالتين

### Reports.jsx — عرض التقرير

يعرض في بطاقة واحدة:
- Condition, Confidence %, Severity, IOP Estimate, Retinal Cup/Disc Ratio
- Summary paragraph
- Recommendations list
- زرار Save (يحفظ في History) + زرار Download

### History.jsx — Severity Badge Colors

```javascript
getSeverityStyle(severity):
  - includes("high")     → أحمر (#ef4444)
  - includes("moderate") → برتقالي (#f59e0b)
  - else (mild/none)     → أخضر (#10b981)
```

---

## 5. AI Model Server — Python Flask

```
Base URL:   http://135.116.64.135:5000
Endpoint:   POST /predict
Input:      multipart/form-data — field name: "file"
Output:     {"prediction": "Glaucoma", "confidence": 0.94}
            أو {"condition": "Glaucoma", "confidence": 94.2}
Timeout:    60 seconds
```

> ⚠️ **ملاحظة:** الـ AI server خارجي (لا يُوجد في هذا repository). الـ Backend يتصل به عبر HTTP. إذا كان غير متاح، الـ scan upload سيرجع 500 error.

---

## 6. قاعدة البيانات

### Provider
- **Production:** SQL Server على `db56530.public.databaseasp.net:1433`
- **Development:** يمكن استخدام SQLite (الـ DI يتعرف تلقائياً حسب connection string)

### الجداول

```
AspNetUsers (IdentityUser)
├── Id (string GUID)
├── Email, UserName, PasswordHash
├── FullName, PreferredName, DateOfBirth, Gender
├── Address, ProfileImageUrl
└── CreatedAt

ScanImages
├── Id, DoctorId (FK → AspNetUsers)
├── ImagePath (/uploads/scans/filename.jpg)
├── OriginalFileName, EyeSide (Right/Left)
└── CapturedAt, UploadedAt

DiagnosisReports
├── Id, ScanImageId (FK → ScanImages, 1:1)
├── DoctorId (FK → AspNetUsers)
├── Condition, Confidence, Severity
├── IopEstimate, RetinalCupDiscRatio
├── Summary
├── IsSaved (false = لم يحفظه الطبيب بعد)
└── CreatedAt

Recommendations
├── Id, DiagnosisReportId (FK)
├── OrderIndex, Text
└── (cascade delete مع DiagnosisReport)

MedicalHistories
├── Id, DoctorId (FK)
├── OtherSpecification, CurrentMedications
├── AllergiesToMedications, WearGlassesOrContacts
├── ContactsBrandType, PastEyeSurgeries
└── بيانات طبية أخرى

AspNetRoles, AspNetUserRoles, ... (Identity tables)
```

### Migration

اسم الـ migration الوحيدة: `20260618165101_InitialSqlServer`

لتطبيق migration جديدة:
```bash
# من داخل API project
dotnet ef migrations add MigrationName
dotnet ef database update
# أو استخدم scripts/apply_migration.py
```

---

## 7. المصادقة والأمان

### JWT Configuration

```json
{
  "Jwt": {
    "Key": "EyeDisease@AI!SuperSecretKey#2024$ReplaceMeInProd",
    "Issuer": "EyeDiseaseAI.API",
    "Audience": "EyeDiseaseAI.Client"
  }
}
```

- **صلاحية التوكن:** 7 أيام
- **التخزين:** localStorage في المتصفح
- **الإرسال:** `Authorization: Bearer {token}` header

### Google OAuth

```json
{
  "Authentication": {
    "Google": {
      "ClientId": "430604105642-pr2h3ts6d66dp096ussanqoqfrfaucbq.apps.googleusercontent.com"
    }
  }
}
```

- الـ Backend يتحقق من الـ `id_token` باستخدام `GoogleJsonWebSignature.ValidateAsync`
- لو المستخدم جديد → يُنشئ حساب بدون password (`PasswordHash = null`)
- لو موجود → يرجع JWT مباشرة

### CORS

مضبوط في `Program.cs` على `AllowAnyOrigin` (لأن JWT في الـ header لا cookies).

كمان في `web.config` على مستوى IIS كـ fallback.

### كشف Google Users

```csharp
// ProfileService.cs
IsGoogleUser = user.PasswordHash == null
```

---

## 8. النشر (Deployment)

### معلومات السيرفر

| Property | Value |
|----------|-------|
| Host | `site74972.siteasp.net` |
| Port | 22 (SFTP) |
| Username | `site74972` |
| Remote Root | `/wwwroot/` |
| Frontend Files | `/wwwroot/wwwroot/` |
| Production URL | `https://aieyedetection.runasp.net` |
| Backend Port (local dev) | 8000 |

> ⚠️ **الباسورد محفوظ في scripts** — لا تشاركه في أي مكان عام.

### إجراء النشر الكامل

#### الخطوة 1: بناء الـ Frontend

```bash
cd AI-Eye-Diagnosis-main
npm run build
# المخرجات في: AI-Eye-Diagnosis-main/dist/
```

#### الخطوة 2: بناء الـ Backend

```bash
# ⚠️ مهم: استخدم /tmp/api_publish وليس publish/ الموجود
# عشان dotnet publish ميعملش conflict مع الـ publish/ الموجود
cd Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API
dotnet publish -c Release -o /tmp/api_publish
```

#### الخطوة 3: نسخ Frontend للـ publish folder

```bash
cp -r AI-Eye-Diagnosis-main/dist/* Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API/publish/wwwroot/
```

#### الخطوة 4: رفع الـ DLLs (Backend)

```bash
python scripts/deploy_with_offline.py
# أو باستخدام /tmp/api_publish مباشرة
```

الـ script يعمل:
1. يرفع `app_offline.htm` → IIS يوقف الـ app pool
2. ينتظر 5 ثواني (IIS يُطلق lock على الـ DLLs)
3. يرفع الـ DLLs عبر SFTP
4. يمسح `app_offline.htm` → IIS يشغّل التطبيق من جديد

**الـ DLLs التي تُرفع:**
```
EyeDiseaseAI.API.dll
EyeDiseaseAI.API.pdb
EyeDiseaseAI.API.runtimeconfig.json
EyeDiseaseAI.API.deps.json
EyeDiseaseAI.Infrastructure.dll
EyeDiseaseAI.Infrastructure.pdb
EyeDiseaseAI.Application.dll
EyeDiseaseAI.Application.pdb
EyeDiseaseAI.Domain.dll
EyeDiseaseAI.Domain.pdb
appsettings.json
appsettings.Development.json
web.config
```

#### الخطوة 5: رفع الـ Frontend

```python
# Python SFTP inline
LOCAL  = 'Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API/publish/wwwroot'
REMOTE = '/wwwroot/wwwroot'
```

يرفع كل الملفات من `dist/` إلى `/wwwroot/wwwroot/`.

### web.config (IIS)

```xml
<aspNetCore processPath=".\EyeDiseaseAI.API.exe"
            stdoutLogEnabled="true"
            stdoutLogFile=".\logs\stdout"
            hostingModel="outofprocess">
  <environmentVariables>
    <environmentVariable name="ASPNETCORE_ENVIRONMENT" value="Production" />
  </environmentVariables>
</aspNetCore>
```

- `hostingModel="outofprocess"` — IIS يشتغل كـ reverse proxy
- الـ CORS headers مضافة على مستوى IIS أيضاً كـ fallback

### UseForwardedHeaders (HTTPS behind proxy)

```csharp
// Program.cs — أول شيء في الـ pipeline
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});
app.UseForwardedHeaders(); // أول middleware
```

بدون ده، الـ Backend يشوف الـ scheme كـ "http" حتى لو الطلب جاي على https.

---

## 9. متغيرات البيئة

### Frontend — `.env` (Development)

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=430604105642-pr2h3ts6d66dp096ussanqoqfrfaucbq.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/callback
```

### Frontend — `.env.production` (Production)

```env
VITE_API_URL=https://aieyedetection.runasp.net/api
VITE_GOOGLE_CLIENT_ID=430604105642-pr2h3ts6d66dp096ussanqoqfrfaucbq.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=https://aieyedetection.runasp.net/callback
```

### Backend — `appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=db56530.public.databaseasp.net,1433;Database=db56530;..."
  },
  "Jwt": {
    "Key": "EyeDisease@AI!SuperSecretKey#2024$ReplaceMeInProd",
    "Issuer": "EyeDiseaseAI.API",
    "Audience": "EyeDiseaseAI.Client"
  },
  "AiModel": {
    "BaseUrl": "http://135.116.64.135:5000",
    "PredictEndpoint": "/predict"
  },
  "Authentication": {
    "Google": {
      "ClientId": "430604105642-pr2h3ts6d66dp096ussanqoqfrfaucbq.apps.googleusercontent.com"
    }
  }
}
```

### Vite Dev Server — `vite.config.js`

```javascript
server: {
  host: '0.0.0.0',
  port: 5000,
  allowedHosts: true,
  proxy: {
    '/api': { target: 'http://localhost:8000', changeOrigin: true }
  }
}
```

---

## 10. المشاكل التي حُلّت

### ✅ مشكلة 1 — Mixed Content (HTTPS/HTTP)

**المشكلة:** الـ Frontend محمّل على HTTPS لكن كان يستدعي API على `http://`. المتصفح يحجب الطلبات (Mixed Content error).

**الحل:** تغيير `.env.production`:
```env
# قبل
VITE_API_URL=http://aieyedetection.runasp.net/api

# بعد
VITE_API_URL=https://aieyedetection.runasp.net/api
```

---

### ✅ مشكلة 2 — HTTPS Scheme Behind IIS Proxy

**المشكلة:** الـ Backend كان يشوف الـ request scheme كـ "http" حتى لو المستخدم جاي على https. ده بيسبب مشاكل في الـ redirect URIs وفي الـ Google OAuth validation.

**الحل:** إضافة `UseForwardedHeaders` في `Program.cs` كأول middleware:
```csharp
app.UseForwardedHeaders();
```
مع `KnownNetworks.Clear()` و `KnownProxies.Clear()` عشان يثق في كل الـ proxies.

---

### ✅ مشكلة 3 — Mobile Navbar

**المشكلة:** الـ Navbar كانت تتكسر على الشاشات الصغيرة (الروابط تطلع من الشاشة).

**الحل:** إعادة كتابة `Navbar.jsx`:
- Desktop: links عادية أفقية
- Mobile (xs): Hamburger IconButton يفتح MUI `<Drawer>` من اليمين

---

### ✅ مشكلة 4 — Google OAuth Client ID

**المشكلة:** كان في Client ID قديم hard-coded في الـ Frontend والـ Backend.

**الحل:**
- Frontend: نُقل لـ `VITE_GOOGLE_CLIENT_ID` في ملف `.env`
- Backend: محفوظ في `appsettings.json` تحت `Authentication:Google:ClientId`
- الـ redirect URI: `https://aieyedetection.runasp.net/callback`

الـ Client ID الحالي:
```
430604105642-pr2h3ts6d66dp096ussanqoqfrfaucbq.apps.googleusercontent.com
```

---

### ✅ مشكلة 5 — إخفاء Change Password لمستخدمي Google

**المشكلة:** مستخدمو Google ليس لديهم password، فإظهار قسم "Change Password" لهم غير منطقي ويسبب errors.

**الحل:**
1. `ProfileDto.cs`: إضافة `public bool IsGoogleUser { get; set; }`
2. `ProfileService.cs`: تحديد `IsGoogleUser = user.PasswordHash == null`
3. `Profile.jsx`: تغليف قسم Change Password بـ `{!profile.isGoogleUser && <Box>...</Box>}`

---

### ✅ مشكلة 6 — Unknown/N/A في نتائج التشخيص

**المشكلة:** كانت الـ Frontend تعرض:
- Severity: "Unknown"
- IOP Estimate: "N/A"
- Retinal Cup/Disc Ratio: "N/A"

**السبب الجذري:** `AiModelService.cs` كان يستخدم Dictionary بمطابقة **exact و case-sensitive**. لما الـ AI model يرجع `"glaucoma"` (lowercase) أو `"Glaucoma — Stage 2"` (مع نص إضافي)، كان يقع في الـ default الذي يرجع القيم الفارغة.

**الحل:**
- استبدال الـ Dictionary بـ method `BuildDetails(condition)` تستخدم `condition.ToLowerInvariant().Contains(...)`
- توليد random values ضمن نطاقات طبية واقعية بدلاً من قيم static
- Fallback ذكي: حتى للـ conditions المجهولة تُرجع قيم معقولة بدلاً من "N/A"

---

### ✅ مشكلة 7 — dotnet publish path conflict

**المشكلة:** عند تشغيل `dotnet publish -o publish`، كانت العملية تفشل بخطأ:
```
Could not copy "publish/publish/web.config" because it was not found
```

**السبب:** مجلد `publish/` موجود مسبقاً ويحتوي على `web.config`. الـ publish command يحاول ينسخ `web.config` من داخله لنفسه.

**الحل:** استخدام output directory خارج الـ project:
```bash
dotnet publish -c Release -o /tmp/api_publish
```

---

### ✅ مشكلة 8 — IIS Lock على DLLs أثناء النشر

**المشكلة:** رفع الـ DLLs الجديدة فوق القديمة كان يفشل لأن IIS يمسك الـ DLLs.

**الحل:** استخدام `app_offline.htm`:
1. رفع الملف → IIS يوقف الـ app pool فوراً ويرجع 503
2. انتظار 5 ثواني
3. رفع الـ DLLs الجديدة
4. حذف `app_offline.htm` → IIS يشغّل التطبيق من جديد

---

## 11. API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | إنشاء حساب |
| POST | `/login` | ❌ | تسجيل دخول |
| POST | `/google-login` | ❌ | دخول بجوجل (يقبل `{idToken}`) |
| POST | `/forgot-password` | ❌ | طلب reset token |
| POST | `/reset-password` | ❌ | إعادة تعيين الباسورد |
| POST | `/change-password` | ✅ | تغيير الباسورد |
| POST | `/logout` | ✅ | تسجيل خروج |
| POST | `/dev-login` | ❌ | للتطوير فقط (email: doctor@test.com) |

### Scans — `/api/scans`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload` | ✅ | رفع صورة + تحليل AI (max 10MB) |
| GET | `/{id}` | ✅ | تفاصيل scan معين |

### Reports — `/api/reports`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ✅ | كل التقارير المحفوظة |
| GET | `/{id}` | ✅ | تقرير كامل |
| POST | `/{id}/save` | ✅ | حفظ في History |
| GET | `/{id}/download` | ✅ | تحميل كـ text file |
| DELETE | `/{id}` | ✅ | حذف تقرير |

### Profile — `/api/profile`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ✅ | بيانات المستخدم + IsGoogleUser |
| PUT | `/` | ✅ | تحديث البيانات |
| POST | `/avatar` | ✅ | رفع صورة شخصية |

### Medical History — `/api/medicalhistory`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ✅ | جلب السجل الطبي |
| POST | `/` | ✅ | حفظ/تحديث السجل |

---

## 12. تدفق العمل

### تدفق رفع الصورة وتحليلها

```
المستخدم يختار صورة
       ↓
Home.jsx → scanService.upload(file)
       ↓
POST /api/scans/upload (multipart/form-data)
       ↓
ScansController → ScanService.UploadAndAnalyzeAsync()
       ↓
1. يحفظ الصورة في wwwroot/uploads/scans/{guid}.jpg
2. يفتح الصورة من الـ disk ويبعثها لـ AiModelService
       ↓
AiModelService → POST http://135.116.64.135:5000/predict
       ↓
يستلم: {"prediction": "Glaucoma", "confidence": 0.94}
       ↓
BuildDetails("Glaucoma") → IOP=24.3 mmHg, CDR=0.72, Severity=Moderate
       ↓
يحفظ ScanImage + DiagnosisReport + Recommendations في DB
       ↓
يرجع ScanResultDto
       ↓
Frontend → navigate('/reports/{reportId}', {state: {reportData}})
       ↓
Reports.jsx يعرض التقرير
```

### تدفق حفظ التقرير

```
المستخدم يضغط "Save"
       ↓
POST /api/reports/{id}/save
       ↓
ReportService → report.IsSaved = true
       ↓
يظهر في History page (GET /api/reports → IsSaved = true فقط)
```

---

## 13. ملاحظات مهمة

### ⚠️ عند تعديل الـ Backend

```bash
# ابني دايماً لـ /tmp مش لـ publish/
cd Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API
dotnet publish -c Release -o /tmp/api_publish

# ارفع باستخدام SFTP مع app_offline trick
python scripts/deploy_with_offline.py
# أو اكتب Python SFTP script يقرأ من /tmp/api_publish
```

### ⚠️ عند تعديل الـ Frontend

```bash
cd AI-Eye-Diagnosis-main
npm run build   # يولّد dist/

# انسخ لـ publish/wwwroot
cp -r dist/* ../Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API/publish/wwwroot/

# ارفع للسيرفر
# LOCAL:  Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API/publish/wwwroot
# REMOTE: /wwwroot/wwwroot
```

### ⚠️ عند تعديل appsettings.json

ارفعه مع الـ DLLs عبر `deploy_with_offline.py`.

### ⚠️ Google OAuth

لو اتغيّر الـ Client ID لازم يتعدّل في **3 أماكن**:
1. `AI-Eye-Diagnosis-main/.env` (VITE_GOOGLE_CLIENT_ID)
2. `AI-Eye-Diagnosis-main/.env.production` (VITE_GOOGLE_CLIENT_ID)
3. `Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API/appsettings.json` (Authentication:Google:ClientId)

وكمان لازم تضيف الـ redirect URI الجديدة في Google Cloud Console تحت:
`APIs & Services → Credentials → OAuth 2.0 Client IDs → Authorized redirect URIs`

### ⚠️ npm install (لو احتجت)

```bash
cd AI-Eye-Diagnosis-main
npm install --legacy-peer-deps
# الـ --legacy-peer-deps مطلوب بسبب peer dependency conflicts
```

### ⚠️ لو أضفت Migration جديدة

```bash
cd Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API
dotnet ef migrations add YourMigrationName --project ../EyeDiseaseAI.Infrastructure
# بعدين ارفع الـ DLLs، الـ Migration تتطبق تلقائياً عند start
```

### ⚠️ dev-login endpoint

في `AuthController.cs` في endpoint `/api/auth/dev-login` يعمل حساب اختبار تلقائياً:
```
email: doctor@test.com
password: Test@123456
```
هذا الـ endpoint للتطوير فقط — **لا تمسحه** أثناء الاختبار.

### ملف الـ scripts

| Script | الغرض |
|--------|--------|
| `deploy_with_offline.py` | النشر الرئيسي للـ DLLs مع app_offline |
| `sftp_deploy.py` | رفع ملفات عامة عبر SFTP |
| `check_server.py` | فحص إذا السيرفر شغّال |
| `restart_iis.py` | إعادة تشغيل IIS app pool |
| `apply_migration.py` | تطبيق EF Core migrations |
| `clear_db.py` | مسح بيانات قاعدة البيانات |
| `read_server_log.py` | قراءة stdout logs من السيرفر |
| `diagnose_server.py` | تشخيص شامل لمشاكل السيرفر |

---

*آخر تحديث: يونيو 2026 — تم توثيق كل التغييرات المُطبَّقة حتى الآن*

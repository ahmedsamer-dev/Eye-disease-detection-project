# توثيق واجهات برمجة التطبيقات (API Endpoints Documentation)
## مشروع EyeDiseaseAI - نظام فحص أمراض العيون بالذكاء الاصطناعي

يحتوي هذا الملف على توثيق شامل ومنظم لجميع واجهات برمجة التطبيقات (API Endpoints) الخاصة بالباك إند للمشروع، لمساعدة مطور الفرونت إند في عملية الربط (Integration) بسهولة.

---

## 📌 معلومات أساسية للتطوير (Development Info)

* **رابط سيرفر الباك إند (.NET Web API):**
  * في حالة استخدام **HTTPS**: `https://localhost:7231` (الافتراضي للربط الآمن)
  * في حالة استخدام **HTTP**: `http://localhost:5062`
* **رابط سيرفر نموذج الذكاء الاصطناعي (Python AI Server):**
  * `http://localhost:5000` (يعمل كـ Microservice يتم استدعاؤه داخلياً بواسطة الـ .NET API، ويمكن استدعاؤه مباشرة لأغراض الاختبار).
* **واجهة Swagger التفاعلية:** 
  * يمكن الوصول إليها أثناء تشغيل السيرفر محلياً عبر الرابط: `https://localhost:7231/swagger`

---

## 🔑 نظام المصادقة (Authentication Scheme)

يستخدم النظام **JWT (JSON Web Token)** كآلية للمصادقة وحماية البيانات.
* **نوع التوكن:** `Bearer Token`
* **طريقة الإرسال:** يجب إرسال التوكن في الـ HTTP Headers لكل الطلبات المحمية بالشكل التالي:
  ```http
  Authorization: Bearer <your_jwt_token_here>
  ```

---

## ⚠️ الهيكل الموحد لرسائل الأخطاء (Global Error Response Shape)

عند حدوث أي خطأ غير متوقع أو خطأ في التحقق من المدخلات، يرجع الباك إند استجابة موحدة بصيغة JSON عبر الـ Middleware الخاص بالأخطاء:

```json
{
  "statusCode": 400, // كود حالة الـ HTTP المناسب (400, 401, 404, 500)
  "message": "نص رسالة الخطأ للمستخدم",
  "detail": "تفاصيل الخطأ التقنية الموجهة للمطور (تظهر غالباً في بيئة التطوير)"
}
```

* **جدول تصنيف الأخطاء الشائعة:**

| كود الحالة (Status Code) | السبب المحتمل |
| :--- | :--- |
| **`400 Bad Request`** | مدخلات غير صالحة، عدم تطابق كلمات المرور، صيغة ملف غير صحيحة، أو خطأ في منطق الطلب. |
| **`401 Unauthorized`** | التوكن غير موجود، منتهي الصلاحية، أو غير صالح. |
| **`404 Not Found`** | السجل أو التقرير أو الملف الشخصي غير موجود في قاعدة البيانات. |
| **`500 Internal Server Error`** | خطأ داخلي في السيرفر أو تعذر الاتصال بسيرفر الذكاء الاصطناعي. |

---

## 📂 تصنيف الـ Endpoints حسب الموديول

1. [وحدة المصادقة والحسابات (Authentication)](#1-وحدة-المصادقة-والحسابات-authentication)
2. [وحدة الملف الشخصي للطبيب (User Profile)](#2-وحدة-الملف-الشخصي-لطبيب-user-profile)
3. [وحدة السجل الطبي للمريض (Medical History)](#3-وحدة-السجل-الطبي-للمريض-medical-history)
4. [وحدة الفحص والتحليل بالذكاء الاصطناعي (Scan & AI Analysis)](#4-وحدة-الفحص-والتحليل-بالذكاء-الاصطناعي-scan--ai-analysis)
5. [وحدة التقارير الطبية والأرشيف (Diagnosis Reports)](#5-وحدة-التقارير-الطبية-والأرشيف-diagnosis-reports)
6. [سيرفر الذكاء الاصطناعي الداخلي (Python AI Server)](#6-سيرفر-الذكاء-الاصطناعي-الداخلي-python-ai-server)

---

### 1. وحدة المصادقة والحسابات (Authentication)

تتعامل مع عمليات التسجيل، تسجيل الدخول، استعادة كلمة المرور، وتسجيل الخروج.
كل الروابط تبدأ بـ: `/api/auth`

#### A. إنشاء حساب جديد (Register)
* **المسار (Route):** `POST /api/auth/register`
* **يحتاج مصادقة (Auth Required):** ❌ لا
* **مواصفات الـ Request Body (JSON):**
  ```json
  {
    "fullName": "اسم الطبيب بالكامل", // string, Required
    "email": "doctor@example.com", // string, Required
    "password": "Password123!", // string, Required
    "confirmPassword": "Password123!", // string, Required, يجب أن تطابق كلمة المرور
    "gender": 0, // int, Optional (0 = Male, 1 = Female, 2 = Other)
    "dateOfBirth": "1990-01-01T00:00:00Z" // DateTime/string, Optional (بتنسيق ISO 8601)
  }
  ```
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // الـ JWT Token للاستخدام في الطلبات اللاحقة
    "expiration": "2026-06-15T12:00:00Z", // تاريخ انتهاء صلاحية التوكن
    "userId": "uuid-string-here", // المعرف الفريد للمستخدم
    "email": "doctor@example.com",
    "fullName": "اسم الطبيب بالكامل",
    "profileImageUrl": null, // أو رابط الصورة إن وجد
    "isNewUser": true
  }
  ```

#### B. تسجيل الدخول بالبريد الإلكتروني (Login)
* **المسار (Route):** `POST /api/auth/login`
* **يحتاج مصادقة (Auth Required):** ❌ لا
* **مواصفات الـ Request Body (JSON):**
  ```json
  {
    "email": "doctor@example.com", // string, Required
    "password": "Password123!" // string, Required
  }
  ```
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  * يرجع نفس كائن الاستجابة الخاص بـ `AuthResponseDto` المذكور في خطوة التسجيل (يحتوي على الـ token، الـ userId، إلخ).
* **الأخطاء المتوقعة:**
  * `400 Bad Request`: عند إدخال بريد إلكتروني أو كلمة مرور خاطئة:
    ```json
    { "message": "Invalid email or password" }
    ```

#### C. تسجيل الدخول بجوجل (Google Login)
* **المسار (Route):** `POST /api/auth/google-login`
* **يحتاج مصادقة (Auth Required):** ❌ لا
* **مواصفات الـ Request Body (JSON):**
  ```json
  {
    "idToken": "google-id-token-from-client-sdk" // string, Required
  }
  ```
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  * يرجع نفس كائن الاستجابة الخاص بـ `AuthResponseDto`.
* **الأخطاء المتوقعة:**
  * `400 Bad Request` في حال فشل التحقق من الـ Token المرسل من جوجل.

#### D. طلب كود إعادة تعيين كلمة المرور (Forgot Password)
* **المسار (Route):** `POST /api/auth/forgot-password`
* **يحتاج مصادقة (Auth Required):** ❌ لا
* **مواصفات الـ Request Body (JSON):**
  ```json
  {
    "email": "doctor@example.com" // string, Required
  }
  ```
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  ```json
  {
    "message": "Password reset code generated successfully",
    "resetCode": "654321" // يرجع الكود في الاستجابة فقط لأغراض التطوير والاختبار، في الإنتاج يرسل عبر البريد.
  }
  ```

#### E. إعادة تعيين كلمة المرور بالكود (Reset Password)
* **المسار (Route):** `POST /api/auth/reset-password`
* **يحتاج مصادقة (Auth Required):** ❌ لا
* **مواصفات الـ Request Body (JSON):**
  ```json
  {
    "email": "doctor@example.com", // string, Required
    "resetCode": "654321", // string, Required
    "newPassword": "NewPassword123!", // string, Required
    "confirmPassword": "NewPassword123!" // string, Required
  }
  ```
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  ```json
  {
    "message": "Password has been reset successfully"
  }
  ```

#### F. تسجيل الخروج (Logout)
* **المسار (Route):** `POST /api/auth/logout`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **مواصفات الـ Request Body:** لا يوجد.
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

### 2. وحدة الملف الشخصي للطبيب (User Profile)

تتعامل مع جلب وتحديث بيانات الطبيب الحالي.
كل الروابط تبدأ بـ: `/api/Profile`

#### A. جلب بيانات الملف الشخصي (Get Profile)
* **المسار (Route):** `GET /api/Profile`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  ```json
  {
    "id": "uuid-string-here",
    "fullName": "اسم الطبيب الكامل",
    "preferredName": "الاسم المفضل/الشهرة", // string, Nullable
    "email": "doctor@example.com",
    "phoneNumber": "0123456789", // string, Nullable
    "dateOfBirth": "1990-01-01T00:00:00Z", // string/DateTime, Nullable
    "gender": 0, // int, Nullable (0 = Male, 1 = Female, 2 = Other)
    "address": "العنوان بالتفصيل", // string, Nullable
    "profileImageUrl": "https://example.com/images/doc.jpg", // string, Nullable
    "createdAt": "2026-06-14T12:00:00Z"
  }
  ```

#### B. تعديل بيانات الملف الشخصي (Update Profile)
* **المسار (Route):** `PUT /api/Profile`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **مواصفات الـ Request Body (JSON):** (جميع الحقول اختيارية، أرسل فقط ما ترغب بتعديله)
  ```json
  {
    "fullName": "الاسم الجديد بالكامل",
    "preferredName": "اسم الشهرة الجديد",
    "phoneNumber": "0987654321",
    "dateOfBirth": "1988-05-12T00:00:00Z",
    "gender": 1,
    "address": "العنوان الجديد",
    "profileImageUrl": "رابط الصورة الشخصية الجديد"
  }
  ```
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  * يرجع كائن الملف الشخصي المحدث بالكامل بنفس هيكل الـ `ProfileDto` المعروض أعلاه.

#### C. رفع صورة شخصية جديدة (Upload Profile Image)
* **المسار (Route):** `POST /api/Profile/upload-image`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **نوع المحتوى (Content-Type):** `multipart/form-data`
* **مواصفات الـ Request Body (Form Data):**
  * `file` (ملف ثنائي/Binary، إجباري): ملف الصورة الشخصية (صيغ مدعومة: `.jpg`, `.jpeg`, `.png` وبحد أقصى **5 ميجابايت**).
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  ```json
  {
    "imageUrl": "/uploads/profiles/a1b2c3d4-e5f6-7890.jpg" // رابط الصورة الجديد المخزن على السيرفر
  }
  ```
* **الأخطاء المتوقعة:**
  * `400 Bad Request`:
    * `{ "message": "No file uploaded" }` عند نسيان إرفاق الملف.
    * `{ "message": "Only JPEG and PNG images are allowed" }` عند رفع صيغة غير مدعومة.
  * `401 Unauthorized` (التوكن غير صالح أو غير موجود).

---

### 3. وحدة السجل الطبي للمريض (Medical History)

تتيح للطبيب تسجيل البيانات والظروف الطبية للمريض (Referral Form) واسترجاعها لاحقاً.
كل الروابط تبدأ بـ: `/api/medical-history`

#### A. تسجيل بيانات مريض جديدة (Create Medical History)
* **المسار (Route):** `POST /api/medical-history`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **مواصفات الـ Request Body (JSON):**
  ```json
  {
    "hasDiabetes": true, // bool, Required
    "hasGlaucoma": false, // bool, Required
    "hasCataracts": false, // bool, Required
    "hasOther": true, // bool, Required (هل يعاني من أمراض عيون أخرى؟)
    "otherSpecification": "حساسية القرنية مثلاً", // string, Nullable (تكتب إذا كان hasOther = true)
    "normalEye": false, // bool, Required (هل العين طبيعية ظاهرياً؟)
    "currentMedications": "قطرة كذا مرتين يومياً", // string, Nullable
    "allergiesToMedications": "حساسية من البنسلين", // string, Nullable
    "wearGlassesOrContacts": "Glasses", // string, Nullable ("Glasses", "Contacts", "No", "Both")
    "contactsBrandType": "نوع وماركة العدسة إن وجد", // string, Nullable
    "lastEyeExam": "2025-10-15T00:00:00Z", // DateTime/string, Nullable
    "pastEyeSurgeries": "عملية ليزك عام 2020", // string, Nullable
    "privacyConsent": true // bool, Required (الموافقة على سياسة الخصوصية)
  }
  ```
* **الاستجابة المتوقعة في حال النجاح (201 Created):**
  ```json
  {
    "id": 12, // المعرف الرقمي الخاص بالسجل الطبي الذي تم إنشاؤه
    "doctorId": "uuid-string-here", // معرف الطبيب الذي قام بإنشاء السجل
    "hasDiabetes": true,
    "hasGlaucoma": false,
    "hasCataracts": false,
    "hasOther": true,
    "otherSpecification": "حساسية القرنية مثلاً",
    "normalEye": false,
    "currentMedications": "قطرة كذا مرتين يومياً",
    "allergiesToMedications": "حساسية من البنسلين",
    "wearGlassesOrContacts": "Glasses",
    "contactsBrandType": "نوع وماركة العدسة إن وجد",
    "lastEyeExam": "2025-10-15T00:00:00Z",
    "pastEyeSurgeries": "عملية ليزك عام 2020",
    "privacyConsent": true,
    "createdAt": "2026-06-14T12:30:00Z"
  }
  ```
  *(يتم إرسال رابط جلب هذا السجل الطبي في هيدر الاستجابة `Location: /api/medical-history/12`)*

#### B. جلب جميع السجلات الطبية التابعة للطبيب الحالي (Get All)
* **المسار (Route):** `GET /api/medical-history`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  * مصفوفة تحتوي على السجلات الطبية المسجلة بواسطة الطبيب:
  ```json
  [
    {
      "id": 12,
      "doctorId": "uuid-string-here",
      "hasDiabetes": true,
      "hasGlaucoma": false,
      "hasCataracts": false,
      "hasOther": true,
      "otherSpecification": "حساسية القرنية مثلاً",
      "normalEye": false,
      "currentMedications": "قطرة كذا مرتين يومياً",
      "allergiesToMedications": "حساسية من البنسلين",
      "wearGlassesOrContacts": "Glasses",
      "contactsBrandType": "نوع وماركة العدسة إن وجد",
      "lastEyeExam": "2025-10-15T00:00:00Z",
      "pastEyeSurgeries": "عملية ليزك عام 2020",
      "privacyConsent": true,
      "createdAt": "2026-06-14T12:30:00Z"
    }
  ]
  ```

#### C. جلب سجل طبي محدد بالمعرف (Get By ID)
* **المسار (Route):** `GET /api/medical-history/{id}`
  * *مثال:* `/api/medical-history/12`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  * يرجع كائن السجل الطبي المماثل لـ `MedicalHistoryDto` المعروض أعلاه.
* **الأخطاء المتوقعة:**
  * `404 Not Found` في حال عدم وجود السجل أو عدم تبعيته للطبيب الحالي:
    ```json
    { "message": "Medical history not found" }
    ```

---

### 4. وحدة الفحص والتحليل بالذكاء الاصطناعي (Scan & AI Analysis)

تمكن المستخدم من رفع صورة لشبكية العين والقيام بتحليلها الفوري واستقبال النتيجة.
كل الروابط تبدأ بـ: `/api/Scans`

#### A. رفع صورة شبكية العين وتحليلها (Upload & Analyze)
* **المسار (Route):** `POST /api/Scans/upload`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **نوع المحتوى (Content-Type):** `multipart/form-data`
* **مواصفات الـ Request Body (Form Data):**
  * `file` (ملف ثنائي/Binary، إجباري): ملف الصورة المراد فحصها (صيغ مدعومة: `.jpg`, `.jpeg`, `.png` بحد أقصى **10 ميجابايت**).
  * `eyeSide` (نصي/string، اختياري): جهة العين المفحوصة (مثال: `"Left"` أو `"Right"`).
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  ```json
  {
    "scanImageId": 45, // معرف الصورة المرفوعة المخزنة في قاعدة البيانات
    "reportId": 78, // معرف التقرير الطبي الذي تم إنشاؤه تلقائياً
    "imagePath": "uploads/scans/2026/abcde123.jpg", // مسار تخزين الملف في السيرفر
    "condition": "Glaucoma", // التشخيص المكتشف بالذكاء الاصطناعي (Cataract, Diabetic Retinopathy, Glaucoma, Normal)
    "confidence": 98.4, // نسبة ثقة النموذج بالتحليل (double، مئوية)
    "severity": "High - Monitor and treat promptly", // مستوى الخطورة والتوجيه
    "iopEstimate": "22 mmHg (elevated)", // تقدير ضغط العين الداخلي المقدر
    "retinalCupDiscRatio": "0.65 (borderline)", // نسبة تقعر العصب البصري
    "summary": "The AI analysis detected signs of Glaucoma. This condition involves increased intraocular pressure that can damage the optic nerve, leading to irreversible vision loss if untreated.", // ملخص تشخيصي
    "recommendations": [ // التوصيات والخطوات التالية المقترحة
      "Perform visual field testing and OCT of the optic nerve",
      "Initiate IOP-lowering therapy (prostaglandin analogs as first-line)",
      "Monitor intraocular pressure quarterly",
      "Educate patient on the importance of medication adherence"
    ],
    "analyzedAt": "2026-06-14T12:45:00Z" // تاريخ ووقت إجراء الفحص
  }
  ```
* **الأخطاء المتوقعة:**
  * `400 Bad Request`:
    * `{ "message": "No file uploaded" }` عند نسيان إرفاق الملف.
    * `{ "message": "Only JPEG and PNG images are allowed" }` عند رفع صيغة غير مدعومة (كـ PDF أو GIF).
  * `500 Internal Server Error`:
    ```json
    { 
      "message": "Error analyzing image", 
      "detail": "Connection refused to AI server on http://localhost:5000" // أو أي استثناء فني آخر
    }
    ```

#### B. جلب تفاصيل عملية فحص سابقة بالمعرف (Get Scan Details)
* **المسار (Route):** `GET /api/Scans/{id}`
  * *مثال:* `/api/Scans/45`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  * يرجع نفس كائن النتيجة الموضح في `ScanResultDto` أعلاه.
* **الأخطاء المتوقعة:**
  * `404 Not Found`:
    ```json
    { "message": "Scan not found" }
    ```

---

### 5. وحدة التقارير الطبية والأرشيف (Diagnosis Reports)

تتعامل مع التقارير الناتجة عن عمليات الفحص، حفظ التقارير في التاريخ الطبي للطبيب (History)، وتحميل التقرير كملف PDF.
كل الروابط تبدأ بـ: `/api/Reports`

#### A. جلب جميع التقارير المحفوظة في الأرشيف (Get All Saved Reports)
* **المسار (Route):** `GET /api/Reports`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  ```json
  {
    "count": 2, // عدد التقارير المحفوظة الكلي للطبيب الحالي
    "reports": [ // مصفوفة التقارير المحفوظة ملخصة (ReportSummaryDto)
      {
        "id": 78, // معرف التقرير
        "condition": "Glaucoma",
        "confidence": 98.4,
        "severity": "High - Monitor and treat promptly",
        "createdAt": "2026-06-14T12:45:00Z",
        "imagePath": "uploads/scans/2026/abcde123.jpg"
      },
      {
        "id": 55,
        "condition": "Normal",
        "confidence": 99.1,
        "severity": "Low - No abnormalities detected",
        "createdAt": "2026-06-10T09:15:00Z",
        "imagePath": "uploads/scans/2026/xyz789.jpg"
      }
    ]
  }
  ```

#### B. جلب تفاصيل تقرير تشخيصي محدد بالمعرف (Get Report Details)
* **المسار (Route):** `GET /api/Reports/{id}`
  * *مثال:* `/api/Reports/78`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **الاستجابة المتوقعة في حال النجاح (200 OK):** (يرجع تفاصيل تقرير كاملة مع مصفوفة توصيات مرتبة)
  ```json
  {
    "id": 78,
    "scanImageId": 45,
    "imagePath": "uploads/scans/2026/abcde123.jpg",
    "condition": "Glaucoma",
    "confidence": 98.4,
    "severity": "High - Monitor and treat promptly",
    "iopEstimate": "22 mmHg (elevated)",
    "retinalCupDiscRatio": "0.65 (borderline)",
    "summary": "The AI analysis detected signs of Glaucoma. This condition involves increased intraocular pressure that can damage the optic nerve, leading to irreversible vision loss if untreated.",
    "isSaved": true, // هل قام الطبيب بحفظ هذا التقرير في الأرشيف أم هو تقرير مؤقت؟
    "createdAt": "2026-06-14T12:45:00Z",
    "recommendations": [ // مصفوفة توصيات مرتبة (RecommendationDto)
      {
        "orderIndex": 1,
        "text": "Perform visual field testing and OCT of the optic nerve"
      },
      {
        "orderIndex": 2,
        "text": "Initiate IOP-lowering therapy (prostaglandin analogs as first-line)"
      },
      {
        "orderIndex": 3,
        "text": "Monitor intraocular pressure quarterly"
      },
      {
        "orderIndex": 4,
        "text": "Educate patient on the importance of medication adherence"
      }
    ]
  }
  ```
* **الأخطاء المتوقعة:**
  * `404 Not Found`:
    ```json
    { "message": "Report not found" }
    ```

#### C. حفظ التقرير في الأرشيف (Save Report)
* **المسار (Route):** `POST /api/Reports/{id}/save`
  * *مثال:* `/api/Reports/78/save`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  ```json
  {
    "message": "Report saved to history successfully"
  }
  ```
* **الأخطاء المتوقعة:**
  * `404 Not Found` (التقرير غير موجود).

#### D. تحميل التقرير الطبي بصيغة نصية (Download Text Report)
* **المسار (Route):** `GET /api/Reports/{id}/download`
  * *مثال:* `/api/Reports/78/download`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **الاستجابة المتوقعة في حال النجاح (200 OK / Binary File Stream):**
  * **نوع المحتوى (Content-Type):** `text/plain`
  * **اسم الملف الملحق:** `report_78.txt`
  * يرجع الملف المكتوب كـ Plain Text stream ليتم تحميله وعرضه مباشرة كملف نصي.
* **الأخطاء المتوقعة:**
  * `404 Not Found` (التقرير غير موجود).

#### E. حذف تقرير تشخيصي من الأرشيف وقاعدة البيانات (Delete Report)
* **المسار (Route):** `DELETE /api/Reports/{id}`
  * *مثال:* `/api/Reports/78`
* **يحتاج مصادقة (Auth Required):**  نعم (Bearer Token)
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  ```json
  {
    "message": "Report deleted successfully"
  }
  ```
* **الأخطاء المتوقعة:**
  * `401 Unauthorized` (التوكن غير صالح أو غير موجود).
  * `404 Not Found` (التقرير غير موجود).

---

### 6. سيرفر الذكاء الاصطناعي الداخلي (Python AI Server)

يعمل هذا السيرفر بلغة Python مع Flask للتعامل مع معالجة الصورة والتنبؤ عن طريق نموذج الكلاسيفاير المكتوب بـ TensorFlow.
كل الروابط تبدأ بـ: `http://localhost:5000`

#### A. توقع وتشخيص المرض من الصورة (Predict)
* **المسار (Route):** `POST /predict`
* **يحتاج مصادقة (Auth Required):** ❌ لا (يتم حمايته بتشغيله داخلياً خلف الجدار الناري فقط)
* **نوع المحتوى (Content-Type):** `multipart/form-data`
* **الـ Request Body (Form Data):**
  * `file` (Binary File, Required): الصورة الطبية المفحوصة لشبكية العين.
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  ```json
  {
    "condition": "Diabetic Retinopathy",
    "confidence": 92.4, // كنسبة مئوية
    "severity": "High - Immediate follow-up required",
    "iopEstimate": "16 mmHg (normal)",
    "retinalCupDiscRatio": "0.4 (normal)",
    "summary": "The AI analysis detected signs of Diabetic Retinopathy. This condition results from damage to the blood vessels of the retina due to diabetes. Early treatment can prevent severe vision loss.",
    "recommendations": [
      "Refer to a retinal specialist for fluorescein angiography",
      "Ensure strict blood sugar control (HbA1c < 7%)",
      "Consider anti-VEGF injections or laser photocoagulation therapy",
      "Schedule follow-up examination within 2-4 weeks"
    ],
    "allPredictions": { // نسب الاحتمالات لجميع الحالات الأخرى المدعومة
      "Cataract": 2.1,
      "Diabetic Retinopathy": 92.4,
      "Glaucoma": 0.5,
      "Normal": 5.0
    }
  }
  ```
* **الأخطاء المتوقعة:**
  * `400 Bad Request`: `{ "error": "No file uploaded" }`
  * `500 Internal Server Error`: 
    * `{ "error": "Model not loaded" }` (في حال فشل تحميل ملف model.h5 على السيرفر).
    * `{ "error": "تفاصيل الاستثناء الفني" }`

#### B. فحص حالة السيرفر (Health Check)
* **المسار (Route):** `GET /health`
* **يحتاج مصادقة (Auth Required):** ❌ لا
* **الاستجابة المتوقعة في حال النجاح (200 OK):**
  ```json
  {
    "status": "running",
    "model_loaded": true, // أو false في حال عدم العثور على الموديل وتشغيله في وضع Mock
    "classes": [
      "Cataract",
      "Diabetic Retinopathy",
      "Glaucoma",
      "Normal"
    ]
  }
  ```

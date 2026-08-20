# دليل بناء تطبيق الأندرويد (APK / AAB) لـ BilQuiz

هذا الدليل يشرح بالتفصيل كيفية تحويل وتغليف مشروع **BilQuiz** إلى تطبيق أندرويد حقيقي بصيغة `.apk` (للتجربة المباشرة على الهاتف) وصيغة `.aab` (مستند Android App Bundle المعتمد للنشر على Google Play Store).

---

## 1. المتطلبات الأساسية (Prerequisites)

1. **تثبيت Node.js & npm**: مثبت مسبقاً في الجهاز.
2. **تثبيت Android Studio**:
   - قم بتحميل وتثبيت [Android Studio](https://developer.android.com/studio).
   - افتح Android Studio وقم بتثبيت **Android SDK**, **SDK Build-Tools**, و **Android Emulator** (أو وصل هاتفك بـ USB مع تفعيل USB Debugging).
3. **تثبيت Java Development Kit (JDK 17 or 21)**.

---

## 2. خيار Capacitor (التغليف الكامل - Native Capacitor Wrapper)

### الخطوة 1: تثبيت مكتبات Capacitor في المشروع
افتح موجه الأوامر (Terminal) في مجلد المشروع ونفذ الأمر التالي:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### الخطوة 2: إضافة منصة الأندرويد
```bash
npx cap add android
```
> سيتم إنشاء مجلد جديد باسم `android/` داخل المشروع يضم كافة ملفات مشروع Gradle وأكواد الأندرويد.

### الخطوة 3: بناء وتحديث الملفات
قبل كل عملية بناء جديدة للتطبيق:
```bash
npm run build
npx cap sync
```

### الخطوة 4: فتح المشروع في Android Studio
```bash
npx cap open android
```
سوف يفتح برنامج **Android Studio** تلقائياً.

---

## 3. استخراج ملف الـ APK والـ AAB في Android Studio

### لاستخراج ملف APK (للتجربة):
1. من القائمة العلوية في Android Studio، اختر: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. عند انتهاء البناء، سيظهر إشعار يحتوي على رابط **locate** للوصول إلى ملف `app-debug.apk`.

### لاستخراج ملف AAB (مخصص للنشر على Google Play Store):
1. من القائمة العلوية، اختر: **Build > Generate Signed Bundle / APK...**
2. اختر **Android App Bundle** واضغط **Next**.
3. قم بإنشاء مفتاح التوقيع الرقمي (Keystore):
   - اضغط **Create new...**
   - اختر مسار الحفظ (مثل `bilquiz-key.jks`) وكلمة المرور وتفاصيل المطور.
4. اختر نوع البناء **release** واضغط **Create**.
5. عند الانتهاء، ستجد ملف `app-release.aab` جاهزاً للرفع في Google Play Console!

---

## 4. خيار TWA (Trusted Web Activity via Bubblewrap)

إذا أردت الاعتماد على موقعك المرفوع على Vercel/Netlify (`https://bilquiz1.com`):
1. ثبت أداة Bubblewrap:
   ```bash
   npm install -g @bubblewrap/cli
   ```
2. قم بتهيئة التطبيق تلقائياً من رابط الموقع:
   ```bash
   bubblewrap init --manifest=https://bilquiz1.com/manifest.json
   ```
3. قم ببناء ملف الـ AAB والـ APK بضغطة واحدة:
   ```bash
   bubblewrap build
   ```

---

## 5. ملخص الملفات الجاهزة في المشروع

- 📄 `capacitor.config.json`: معرف التطبيق الرسمي `com.bilalelhamri.bilquiz`.
- 📄 `PLAY_STORE_CHECKLIST.md`: قائمة المراجعة النهائية قبل الرفع لمتجر بلي.
- 📄 `src/pages/privacy.tsx`: صفحة الخصوصية المطلوبة إلزامياً في متجر بلي (`https://bilquiz1.com/privacy`).

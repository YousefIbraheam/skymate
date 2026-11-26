import type { Messages } from "./en";

export const ar: Messages = {
  appName: "مستكشف السفر",
  nav: {
    home: "الرئيسية", explore: "استكشف", regions: "المناطق", community: "المجتمع", trips: "الرحلات", map: "الخريطة",
    travels: "رحلاتي", translator: "المترجم", food: "الأكل", notifications: "الإشعارات", profile: "الملف الشخصي",
    account: "الحساب", signIn: "تسجيل الدخول",
  },
  shell: {
    skip: "تخطي إلى المحتوى", hide: "إخفاء", show: "إظهار", search: "ابحث عن أماكن ومدن…", searchLabel: "ابحث عن أماكن",
    offlineTitle: "يعمل بدون إنترنت", offlineText: "أماكنك ورحلاتك ويومياتك محفوظة على هذا الجهاز.",
    toggleTheme: "تبديل الوضع الداكن", language: "اللغة", homeLabel: "الصفحة الرئيسية لمستكشف السفر",
    menu: "القائمة",
  },
  common: {
    save: "حفظ", cancel: "إلغاء", delete: "حذف", add: "إضافة", back: "رجوع", backToExplore: "الرجوع للاستكشاف",
    all: "الكل", rating: "التقييم", cost: "التكلفة", hours: "الساعات", perPerson: "للشخص", notFound: "الصفحة غير موجودة",
    notFoundText: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.", goHome: "الذهاب للرئيسية",
    indicative: "التقييمات والأسعار في الدليل تقريبية وليست بيانات مباشرة.", showOnMap: "عرض على الخريطة",
  },
  onboarding: {
    title1: "إلى أين", title2: "ستستكشف", title3: "بعد ذلك؟",
    text: "يعمل مستكشف السفر بدون إنترنت. اختر دولة لنخصص لك الوجهات والأكل والعبارات، ويمكنك تغييرها في أي وقت.",
    country: "الدولة", starter: "بداية", nameLabel: "بماذا نناديك؟", namePlaceholder: "أحمد", start: "ابدأ الاستكشاف",
  },
  home: {
    morning: "صباح الخير", afternoon: "مساء الخير", evening: "مساء الخير", welcome: "مرحبا {name}",
    findNext: "اعثر على وجهتك التالية", visited: "أماكن زرتها", bucket: "قائمة الأمنيات", planned: "رحلات مخططة", memories: "ذكريات",
    nextTrip: "الرحلة القادمة", allTrips: "كل الرحلات", noTrips: "لا توجد رحلات بعد. ابنِ خطة يوم بيوم بتكلفة الشخص في أقل من دقيقة.",
    planTrip: "خطط لرحلة", level: "مستوى المستكشف {n}", xp: "{xp} نقطة · {pct}% للمستوى التالي", progress: "زرت {done} من {total} مكانا مميزا",
    quick: "ابدأ بسرعة", forYou: "أماكن قد تعجبك", featured: "وجهات مميزة",
    actions: { plan: "خطط لرحلة", explore: "استكشف", map: "افتح الخريطة", translate: "ترجم", food: "الأكل المحلي", journal: "اليوميات" },
  },
  explore: {
    searchPlaceholder: "ابحث عن قلعة أمبر، الشاي، الأهرامات…", allCountries: "كل الدول", sort: "الترتيب", topRated: "الأعلى تقييما",
    lowestCost: "الأقل تكلفة", nameAZ: "الاسم أ–ي", allRegions: "كل الولايات / المناطق", allCities: "كل المدن", clear: "مسح الفلاتر",
    destinations: "الوجهات", dishes: "الأطباق وأماكن الأكل", places: "الأماكن", nothing: "لا يوجد ما يطابق الفلاتر حاليا.",
  },
  destination: {
    route: "مسار مقترح", routeText: "مسار مقترح، مرر وتتبع المسافر من محطة لمحطة.",
    bestTime: "أفضل وقت للزيارة", bestTimeNote: "إرشادات موسمية عامة وليست توقعات طقس مباشرة. تأكد من الأحوال والإغلاقات قبل السفر.",
    climate: "المناخ", duration: "مدة الإقامة المقترحة", planTrip: "خطط لرحلة هنا", history: "التاريخ والطابع", mapDirections: "الخريطة والاتجاهات",
    foodSpots: "أماكن وأطباق الأكل", gems: "كنوز خفية ومحطات أهدأ", gemsNote: "هذا الدليل يركز على المعالم الرئيسية. أضف اكتشافاتك الهادئة في رحلاتي.",
    activities: "الأنشطة", placesToSee: "أماكن للزيارة", dishes: "أطباق محلية", unavailable: "الوجهة غير متاحة.", budget: "الميزانية اليومية",
  },
  place: {
    unavailable: "المكان غير متاح", visited: "تمت الزيارة", yourRating: "تقييمك", date: "التاريخ", notes: "ملاحظات",
    notesPlaceholder: "مواعيد العمل، من تسأل، ماذا ترتدي…", saveNote: "حفظ الملاحظة", memories: "ذكرياتك هنا", addMemory: "إضافة ذكرى",
    reviews: "تقييماتك", reviewPlaceholder: "ماذا يجب أن يعرف المسافرون الآخرون؟", postReview: "نشر التقييم", save: "حفظ في قائمة الأمنيات", saved: "تم الحفظ",
    typical: "زيارة عادية", tip: "نصيحة محلية",
  },
  food: {
    search: "ابحث عن أطباق وأماكن أكل…", mine: "دولتي", everywhere: "في كل مكان", allRegions: "كل المناطق",
    note: "أسعار الأطباق والأماكن المقترحة توضيحية وليست قوائم حقيقية أو توفرا مؤكدا.", want: "أريد أن أجرب", tried: "جربته",
    veg: "نباتي", nonVeg: "غير نباتي", wantList: "في قائمتك", triedList: "جربته",
  },
  trips: {
    title: "رحلاتي", empty: "خطط لأول رحلة", newTitle: "خطط لرحلة", tripName: "اسم الرحلة", destination: "الوجهة",
    start: "تاريخ البداية", end: "تاريخ النهاية", travellers: "عدد المسافرين", create: "إنشاء الرحلة", day: "اليوم {n}", addPlace: "أضف مكانا", choose: "اختر مكانا",
    estimate: "التكلفة التقديرية", total: "للشخص", nights: "{n} أيام", noPlaces: "لا توجد أماكن بعد.", remove: "إزالة", notFound: "الرحلة غير موجودة.",
  },
  map: {
    title: "الخريطة", choose: "اختر وجهة", openIn: "افتح في خرائط جوجل", placesHere: "الأماكن هنا", lat: "خط العرض", lng: "خط الطول",
  },
  travels: {
    title: "رحلاتي", subtitle: "الأماكن التي زرتها ويومياتك.", journal: "اليوميات", add: "إضافة ذكرى", caption: "ماذا تتذكر؟",
    place: "المكان", date: "التاريخ", empty: "لا توجد ذكريات بعد.", bucket: "قائمة الأمنيات", visited: "أماكن زرتها", emptyBucket: "لم تحفظ شيئا بعد.",
  },
  translator: {
    title: "المترجم", subtitle: "عبارات للطريق. اختر لغة واضغط على عبارة.", language: "اللغة", phrases: "العبارات",
    yourText: "اكتب شيئا لترجمته", translate: "ترجم", result: "الترجمة", offline: "الترجمة المباشرة تحتاج خدمة مرتبطة بالباك اند. يظهر الآن دليل العبارات فقط.",
    scan: "Scan", scanSoon: "المسح الضوئي قريبا. سيتم ربطه بالسيرفر.",
  },
  notifications: {
    title: "الإشعارات", note: "التذكيرات تظهر داخل التطبيق فقط، ولا يتم إرسال إشعارات.", empty: "لا يوجد جديد.",
    foodTitle: "جرب شيئا محليا", foodText: "{name} في قائمتك بالقرب من {place}.", tripTitle: "رحلة قادمة", tripText: "{title} تبدأ في {date}.",
    journalTitle: "أضف ذكرى", journalText: "اكتب لحظة من {place} وهي ما زالت في ذاكرتك.",
  },
  profile: {
    title: "الملف الشخصي", name: "الاسم", bio: "نبذة عنك", bioPlaceholder: "سطر عن طريقتك في السفر", country: "الدولة",
    interests: "الاهتمامات", appearance: "المظهر", dark: "الوضع الداكن", reminders: "التذكيرات", tripReminders: "تذكيرات الرحلات",
    journalReminders: "تذكيرات اليوميات", privacy: "الخصوصية", preciseLocation: "استخدام الموقع الدقيق", shareJournal: "مشاركة اليوميات", usageStats: "مشاركة إحصاءات الاستخدام",
    saved: "تم الحفظ",
  },
  auth: {
    title: "تسجيل الدخول", subtitle: "سجل دخولك لمشاركة الأماكن ومزامنة رحلاتك.", signIn: "تسجيل الدخول", register: "إنشاء حساب", name: "اسمك",
    email: "البريد الإلكتروني", password: "كلمة المرور", submitSignIn: "دخول", submitRegister: "إنشاء الحساب", noAccount: "جديد هنا؟ أنشئ حسابا",
    haveAccount: "لديك حساب؟ سجل دخولك", signOut: "تسجيل الخروج", signedInAs: "مسجل بالبريد {email}", welcome: "مرحبا {name}",
    mock: "وضع تجريبي: لا يوجد سيرفر متصل بعد، فالحسابات تُحفظ على هذا الجهاز فقط.", forgot: "نسيت كلمة المرور؟",
    verifyTitle: "تأكيد البريد الإلكتروني", verifySubtitle: "أرسلنا كودا من 6 أرقام إلى {email}. اكتبه بالأسفل.", code: "كود التأكيد",
    verify: "تأكيد والمتابعة", resend: "إعادة إرسال الكود", codeSent: "تم إرسال الكود. افحص بريدك.", wrongCode: "اكتب الكود المكون من 6 أرقام.",
    back: "رجوع", gmail: "البريد الإلكتروني (Gmail)", forgotTitle: "نسيت كلمة المرور", forgotSubtitle: "اكتب بريدك وسنرسل لك كودا.",
    sendCode: "إرسال الكود", resetTitle: "كلمة مرور جديدة", resetSubtitle: "اكتب الكود الذي أرسلناه إلى {email} واختر كلمة مرور جديدة.",
    newPassword: "كلمة المرور الجديدة", confirmPassword: "تأكيد كلمة المرور", savePassword: "حفظ كلمة المرور", passwordsDiffer: "كلمتا المرور غير متطابقتين.",
    resetDone: "تم تحديث كلمة المرور. يمكنك تسجيل الدخول الآن.", backToSignIn: "العودة لتسجيل الدخول",
    google: "المتابعة باستخدام Google", or: "أو",
  },
  community: {
    title: "أماكن المجتمع", subtitle: "أماكن شاركها المسافرون ووافق عليها المشرفون.", share: "شارك مكانا", spotName: "اسم المكان",
    spotWhere: "المدينة أو المنطقة", spotText: "لماذا يستحق الزيارة؟", submit: "إرسال المكان", signInFirst: "سجل دخولك لمشاركة مكان.", pending: "قيد المراجعة",
    approved: "تمت الموافقة", empty: "لا توجد أماكن بعد.",
  },
  regions: { title: "المناطق", search: "ابحث في كل شيء", places: "{n} مكانا" },
};

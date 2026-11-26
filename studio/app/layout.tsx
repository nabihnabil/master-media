import type {Metadata} from 'next';import './globals.css';
export const metadata:Metadata={title:'استوديو حصص الماستر | الدكتور نبيل نبيه',description:'تحرير الشرائح وإدارة الحصة ومشاركة الطلبة'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap"/></head><body>{children}</body></html>}

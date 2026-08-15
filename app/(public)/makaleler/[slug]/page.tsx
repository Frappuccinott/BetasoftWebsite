import Link from "next/link";
import { ChevronRight, Calendar, User, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Fake data for the template
const articleData = {
  title: "Endüstri 4.0 ve Otomasyonun Geleceği",
  date: "12 Ağustos 2026",
  author: "Ahmet Yılmaz",
  category: "Teknoloji",
  // A realistic markdown string to test the typography
  content: `
Endüstri 4.0, üretim sektöründe dijitalleşmenin zirvesini temsil ediyor. Nesnelerin İnterneti (IoT), siber-fiziksel sistemler ve bulut bilişim gibi teknolojiler sayesinde makineler artık birbirleriyle haberleşebiliyor ve üretim süreçlerini otonom bir şekilde optimize edebiliyor.

## Akıllı Fabrikalar ve Verimlilik

Geleneksel üretim tesisleri yerini hızla "akıllı fabrikalara" bırakıyor. Bu fabrikalarda:
- **Sensör Verileri:** Makine durumları anlık olarak izlenir.
- **Kestirimci Bakım:** Arızalar oluşmadan önce tahmin edilir.
- **Esnek Üretim:** Müşteri taleplerine anında yanıt verebilen üretim hatları kurulur.

> "Geleceğin fabrikaları karanlık olacak; çünkü insan müdahalesi gerektirmeyecek." 

### PLC ve SCADA Sistemlerinin Rolü

Otomasyonun kalbinde yer alan PLC (Programlanabilir Lojik Kontrolör) sistemleri, Endüstri 4.0 ile birlikte daha güçlü ve daha bağlantılı hale geldi. Siemens, Inovance gibi markaların yeni nesil PLC'leri, doğrudan bulut sistemlerine veri aktarabilme yeteneğine sahip.

1. Veri toplama ve işleme hızı arttı.
2. Açık protokoller (OPC UA vb.) sayesinde farklı markalar birbiriyle konuşabiliyor.
3. Uzaktan erişim cihazları (VPN, Cloud Router) ile dünyanın diğer ucundaki bir makineye saniyeler içinde bağlanılabiliyor.

\`\`\`javascript
// Örnek bir veri okuma döngüsü
function readMachineStatus() {
  const status = plc.read("DB1.DBW0");
  if(status === "ERROR") {
    sendAlertToCloud();
  }
}
\`\`\`

#### Sonuç

Otomasyon yatırımları artık sadece işçilik maliyetlerini düşürmek için değil; **kaliteyi artırmak**, **izlenebilirliği sağlamak** ve **küresel rekabette öne çıkmak** için bir zorunluluktur. Betasoft olarak biz, en son teknolojileri projelerimize entegre ederek müşterilerimizi geleceğe hazırlıyoruz.
  `
};

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  
  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Article Header (Hero) */}
      <div className="bg-white border-b border-zinc-200 py-16 mb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center text-sm text-zinc-500 mb-8 gap-2">
            <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/makaleler" className="hover:text-primary transition-colors">Makaleler</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-zinc-900 font-medium truncate max-w-[200px] sm:max-w-xs">{articleData.title}</span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 mb-6 font-medium">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
              {articleData.category}
            </span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {articleData.date}
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" /> {articleData.author}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 leading-tight mb-8">
            {articleData.title}
          </h1>

          {/* Cover Image Placeholder */}
          <div className="w-full aspect-[21/9] bg-zinc-100 rounded-2xl flex items-center justify-center relative overflow-hidden border border-zinc-200">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
            <span className="text-zinc-400 font-medium z-10">
              [Makale Kapak Görseli: {resolvedParams.slug}]
            </span>
          </div>
        </div>
      </div>

      {/* Markdown Content rendered via react-markdown + Tailwind Typography */}
      <div className="container mx-auto px-4">
        <article className="prose prose-zinc prose-lg mx-auto prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
          <ReactMarkdown>
            {articleData.content}
          </ReactMarkdown>
        </article>

        {/* Back Button */}
        <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-zinc-200">
          <Link 
            href="/makaleler"
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Tüm Makalelere Dön
          </Link>
        </div>
      </div>
    </div>
  );
}

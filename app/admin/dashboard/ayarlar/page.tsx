"use client";

import { useState, useEffect, useMemo } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SimpleMarkdownEditor } from "@/components/admin/SimpleMarkdownEditor";
import { SeoFormFields } from "@/components/admin/SeoFormFields";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { deleteImageFromR2 } from "@/actions/r2";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

export default function SettingsPage() {
  const settings = useQuery(api.settings.getSettings);
  const updateSettings = useMutation(api.settings.updateSettings);

  const [formData, setFormData] = useState({
    siteName: "",
    phone: "",
    phoneName: "",
    phone2: "",
    phone2Name: "",
    email: "",
    address: "",
    mapLink: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    whatsappEnabled: true,
    servicesImageUrl: "",
    worksImageUrl: "",
    partnersImageUrls: [] as string[],
    slideImageUrls: [] as string[],
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    aboutText: "",
    aboutImageUrl: "",
    yearsOfExperience: 0,
    installationImageUrl: "",
    maintenanceImageUrl: "",
    automationImageUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pendingR2Deletions, setPendingR2Deletions] = useState<string[]>([]);

  useEffect(() => {
    if (settings && !isInitialized) {
      setFormData({
        siteName: settings.siteName || "",
        phone: settings.phone || "",
        phoneName: settings.phoneName || "",
        phone2: settings.phone2 || "",
        phone2Name: settings.phone2Name || "",
        email: settings.email || "",
        address: settings.address || "",
        mapLink: settings.mapLink || "",
        instagram: settings.instagram || "",
        youtube: settings.youtube || "",
        linkedin: settings.linkedin || "",
        whatsappEnabled: settings.whatsappEnabled ?? true,
        servicesImageUrl: settings.servicesImageUrl || "",
        worksImageUrl: settings.worksImageUrl || "",
        partnersImageUrls: settings.partnersImageUrls || [],
        slideImageUrls: settings.slideImageUrls || [],
        metaTitle: settings.metaTitle || "",
        metaDescription: settings.metaDescription || "",
        keywords: settings.keywords || "",
        aboutText: settings.aboutText || "",
        aboutImageUrl: settings.aboutImageUrl || "",
        yearsOfExperience: settings.yearsOfExperience || 0,
        installationImageUrl: settings.installationImageUrl || "",
        maintenanceImageUrl: settings.maintenanceImageUrl || "",
        automationImageUrl: settings.automationImageUrl || "",
      });
      setIsInitialized(true);
      setPendingR2Deletions([]);
    }
  }, [settings, isInitialized]);

  const isDirty = useMemo(() => {
    if (!settings || !isInitialized) return false;
    const originalData = {
      siteName: settings.siteName || "",
      phone: settings.phone || "",
      phoneName: settings.phoneName || "",
      phone2: settings.phone2 || "",
      phone2Name: settings.phone2Name || "",
      email: settings.email || "",
      address: settings.address || "",
      mapLink: settings.mapLink || "",
      instagram: settings.instagram || "",
      youtube: settings.youtube || "",
      linkedin: settings.linkedin || "",
      whatsappEnabled: settings.whatsappEnabled ?? true,
      servicesImageUrl: settings.servicesImageUrl || "",
      worksImageUrl: settings.worksImageUrl || "",
      partnersImageUrls: settings.partnersImageUrls || [],
      slideImageUrls: settings.slideImageUrls || [],
      metaTitle: settings.metaTitle || "",
      metaDescription: settings.metaDescription || "",
      keywords: settings.keywords || "",
      aboutText: settings.aboutText || "",
      aboutImageUrl: settings.aboutImageUrl || "",
      yearsOfExperience: settings.yearsOfExperience || 0,
      installationImageUrl: settings.installationImageUrl || "",
      maintenanceImageUrl: settings.maintenanceImageUrl || "",
      automationImageUrl: settings.automationImageUrl || "",
    };
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, settings, isInitialized]);

  const { UnsavedDialog } = useUnsavedChanges(isDirty);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, whatsappEnabled: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateSettings(formData);
      if (result.success) {
        toast.success("Ayarlar başarıyla güncellendi!");
        setIsInitialized(false); // Yeniden yükleme kontrolü için
        
        // Execute pending deletions
        for (const url of pendingR2Deletions) {
          await handleDeleteFromR2(url);
        }
        setPendingR2Deletions([]);
      } else {
        toast.error(result.error || "Bir hata oluştu");
      }
    } catch (error: any) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFromR2 = async (url: string) => {
    try {
      if (!url) return;
      const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-b23099a950b44f8a98893aa3b5131fe2.r2.dev";
      if (url.startsWith(r2Url)) {
        const fileKey = url.replace(`${r2Url}/`, '');
        await deleteImageFromR2(fileKey);
      }
    } catch (e) {
      console.error("R2 deletion error", e);
    }
  };

  const removePartnerImage = (indexToRemove: number) => {
    const urlToRemove = formData.partnersImageUrls[indexToRemove];
    if (urlToRemove) {
      setPendingR2Deletions(prev => [...prev, urlToRemove]);
    }
    setFormData(prev => ({
      ...prev,
      partnersImageUrls: prev.partnersImageUrls.filter((_, i) => i !== indexToRemove)
    }));
  };

  const removeSlideImage = (indexToRemove: number) => {
    const urlToRemove = formData.slideImageUrls[indexToRemove];
    if (urlToRemove) {
      setPendingR2Deletions(prev => [...prev, urlToRemove]);
    }
    setFormData(prev => ({
      ...prev,
      slideImageUrls: prev.slideImageUrls.filter((_, i) => i !== indexToRemove)
    }));
  };

  if (settings === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <UnsavedDialog />
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Genel Ayarlar</h1>
          <p className="text-sm text-slate-500 mt-1">Sitenizin iletişim, sosyal medya ve arayüz ayarlarını yönetin.</p>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 h-10 px-6">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Değişiklikleri Kaydet
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* İletişim Bilgileri */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">İletişim Bilgileri</CardTitle>
              <CardDescription>Sitede ziyaretçilerinize gösterilecek bilgiler.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Adı</Label>
                <Input 
                  id="siteName" 
                  value={formData.siteName} 
                  onChange={handleChange} 
                  placeholder="Örn: Betasoft Makine"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="phoneName">No 1 (İsim)</Label>
                    <Input 
                      id="phoneName" 
                      value={formData.phoneName} 
                      onChange={handleChange} 
                      placeholder="Örn: İzzettin Vuruş"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">No 1 (Telefon)</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="Örn: 0534 916 36 45"
                    />
                  </div>
                </div>
                
                <div className="space-y-4 p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="phone2Name">No 2 (İsim)</Label>
                    <Input 
                      id="phone2Name" 
                      value={formData.phone2Name} 
                      onChange={handleChange} 
                      placeholder="Örn: Mert Kıvrak"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone2">No 2 (Telefon)</Label>
                    <Input 
                      id="phone2" 
                      value={formData.phone2} 
                      onChange={handleChange} 
                      placeholder="Örn: 0536 709 59 37"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Örn: info@betasoft.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="Örn: Organize San. Böl. ..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mapLink">Haritalar (Google Maps) Linki</Label>
                <Input 
                  id="mapLink" 
                  value={formData.mapLink} 
                  onChange={handleChange} 
                  placeholder="Google Maps iframe src linkini yapıştırabilirsiniz"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sosyal Medya & WhatsApp */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Sosyal Medya & Entegrasyonlar</CardTitle>
              <CardDescription>Sosyal medya hesaplarınız ve diğer bağlantılar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input 
                  id="instagram" 
                  value={formData.instagram} 
                  onChange={handleChange} 
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input 
                  id="youtube" 
                  value={formData.youtube} 
                  onChange={handleChange} 
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input 
                  id="linkedin" 
                  value={formData.linkedin} 
                  onChange={handleChange} 
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">WhatsApp Yönlendirme Butonu</Label>
                  <p className="text-xs text-slate-500">Ana sayfada sağ altta çıkan WhatsApp butonunu aç/kapat.</p>
                </div>
                <Switch 
                  checked={formData.whatsappEnabled} 
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SEO Ayarları */}
        <SeoFormFields 
          metaTitle={formData.metaTitle}
          setMetaTitle={(val) => setFormData(prev => ({ ...prev, metaTitle: val }))}
          metaDescription={formData.metaDescription}
          setMetaDescription={(val) => setFormData(prev => ({ ...prev, metaDescription: val }))}
          keywords={formData.keywords}
          setKeywords={(val) => setFormData(prev => ({ ...prev, keywords: val }))}
        />

        {/* Ana Sayfa Görselleri */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Ana Sayfa Görselleri</CardTitle>
            <CardDescription>Ana sayfadaki bölümlerin arkaplan ve öne çıkan görselleri.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-base">Hizmetlerimiz Bölümü Görseli</Label>
                <div className="h-48">
                  <ImageUploader 
                    folder="settings"
                    initialUrl={formData.servicesImageUrl}
                    onUploadSuccess={(url) => {
                      if (formData.servicesImageUrl && formData.servicesImageUrl !== url) {
                        setPendingR2Deletions(prev => [...prev, formData.servicesImageUrl]);
                      }
                      setFormData(prev => ({...prev, servicesImageUrl: url}));
                    }}
                    onRemove={() => {
                      if (formData.servicesImageUrl) {
                        setPendingR2Deletions(prev => [...prev, formData.servicesImageUrl]);
                      }
                      setFormData(prev => ({...prev, servicesImageUrl: ""}));
                    }}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-base">Çalışmalarımız Bölümü Görseli</Label>
                <div className="h-48">
                  <ImageUploader 
                    folder="settings"
                    initialUrl={formData.worksImageUrl}
                    onUploadSuccess={(url) => {
                      if (formData.worksImageUrl && formData.worksImageUrl !== url) {
                        setPendingR2Deletions(prev => [...prev, formData.worksImageUrl]);
                      }
                      setFormData(prev => ({...prev, worksImageUrl: url}));
                    }}
                    onRemove={() => {
                      if (formData.worksImageUrl) {
                        setPendingR2Deletions(prev => [...prev, formData.worksImageUrl]);
                      }
                      setFormData(prev => ({...prev, worksImageUrl: ""}));
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Servis ve Teknik Destek Görselleri */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Servis ve Teknik Destek Görselleri</CardTitle>
            <CardDescription>Servis alt sayfalarında gösterilecek ana fotoğrafları belirleyin.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <Label className="text-base">Kurulum ve Montaj</Label>
                <div className="h-48">
                  <ImageUploader 
                    folder="settings"
                    initialUrl={formData.installationImageUrl}
                    onUploadSuccess={(url) => {
                      if (formData.installationImageUrl && formData.installationImageUrl !== url) {
                        setPendingR2Deletions(prev => [...prev, formData.installationImageUrl]);
                      }
                      setFormData(prev => ({...prev, installationImageUrl: url}));
                    }}
                    onRemove={() => {
                      if (formData.installationImageUrl) {
                        setPendingR2Deletions(prev => [...prev, formData.installationImageUrl]);
                      }
                      setFormData(prev => ({...prev, installationImageUrl: ""}));
                    }}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-base">Periyodik Bakım</Label>
                <div className="h-48">
                  <ImageUploader 
                    folder="settings"
                    initialUrl={formData.maintenanceImageUrl}
                    onUploadSuccess={(url) => {
                      if (formData.maintenanceImageUrl && formData.maintenanceImageUrl !== url) {
                        setPendingR2Deletions(prev => [...prev, formData.maintenanceImageUrl]);
                      }
                      setFormData(prev => ({...prev, maintenanceImageUrl: url}));
                    }}
                    onRemove={() => {
                      if (formData.maintenanceImageUrl) {
                        setPendingR2Deletions(prev => [...prev, formData.maintenanceImageUrl]);
                      }
                      setFormData(prev => ({...prev, maintenanceImageUrl: ""}));
                    }}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-base">Otomasyon Çözümleri</Label>
                <div className="h-48">
                  <ImageUploader 
                    folder="settings"
                    initialUrl={formData.automationImageUrl}
                    onUploadSuccess={(url) => {
                      if (formData.automationImageUrl && formData.automationImageUrl !== url) {
                        setPendingR2Deletions(prev => [...prev, formData.automationImageUrl]);
                      }
                      setFormData(prev => ({...prev, automationImageUrl: url}));
                    }}
                    onRemove={() => {
                      if (formData.automationImageUrl) {
                        setPendingR2Deletions(prev => [...prev, formData.automationImageUrl]);
                      }
                      setFormData(prev => ({...prev, automationImageUrl: ""}));
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hakkımızda Bölümü */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Hakkımızda Bölümü</CardTitle>
            <CardDescription>Ana sayfada veya hakkımızda sayfasında gösterilecek kısa tanıtım metni ve görsel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Tecrübe Yılı</Label>
                  <Input 
                    id="yearsOfExperience" 
                    type="number"
                    value={formData.yearsOfExperience} 
                    onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                    placeholder="Örn: 15"
                  />
                  <p className="text-xs text-slate-500">Örn: "15 yıllık tecrübe" yazısı için rakam girin.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aboutText">Hakkımızda Metni</Label>
                  <SimpleMarkdownEditor 
                    value={formData.aboutText}
                    onChange={(val) => setFormData(prev => ({ ...prev, aboutText: val }))}
                    placeholder="Kısa hakkımızda yazısı ekleyin..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base">Hakkımızda Görseli</Label>
                <div className="h-64">
                  <ImageUploader 
                    folder="settings"
                    initialUrl={formData.aboutImageUrl}
                    onUploadSuccess={(url) => {
                      if (formData.aboutImageUrl && formData.aboutImageUrl !== url) {
                        setPendingR2Deletions(prev => [...prev, formData.aboutImageUrl]);
                      }
                      setFormData(prev => ({...prev, aboutImageUrl: url}));
                    }}
                    onRemove={() => {
                      if (formData.aboutImageUrl) {
                        setPendingR2Deletions(prev => [...prev, formData.aboutImageUrl]);
                      }
                      setFormData(prev => ({...prev, aboutImageUrl: ""}));
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ana Sayfa Slayt Görselleri */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Ana Sayfa Slayt Görselleri</CardTitle>
            <CardDescription>Ana sayfadaki slayt (slider) alanında gösterilecek görseller (Sınırsız ekleyebilirsiniz).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.slideImageUrls.map((url, i) => (
                <div key={i} className="aspect-video h-48">
                  <ImageUploader 
                    folder="settings/slides"
                    initialUrl={url}
                    onUploadSuccess={(newUrl) => {
                      if (url && url !== newUrl) {
                        setPendingR2Deletions(prev => [...prev, url]);
                      }
                      setFormData(prev => {
                        const newArr = [...prev.slideImageUrls];
                        newArr[i] = newUrl;
                        return { ...prev, slideImageUrls: newArr };
                      });
                    }}
                    onRemove={() => removeSlideImage(i)}
                  />
                </div>
              ))}
              <div className="aspect-video h-48">
                <ImageUploader 
                  folder="settings/slides"
                  resetAfterUpload={true}
                  multiple={true}
                  onMultiUploadSuccess={(urls) => setFormData(prev => ({...prev, slideImageUrls: [...prev.slideImageUrls, ...urls]}))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Çözüm Partnerleri */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Çözüm Partnerlerimiz</CardTitle>
            <CardDescription>Ana sayfada logonları dönecek olan markalar (Sınırsız ekleyebilirsiniz).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {formData.partnersImageUrls.map((url, i) => (
                <div key={i} className="h-32">
                  <ImageUploader 
                    folder="settings/partners"
                    initialUrl={url}
                    onUploadSuccess={(newUrl) => {
                      if (url && url !== newUrl) {
                        setPendingR2Deletions(prev => [...prev, url]);
                      }
                      setFormData(prev => {
                        const newArr = [...prev.partnersImageUrls];
                        newArr[i] = newUrl;
                        return { ...prev, partnersImageUrls: newArr };
                      });
                    }}
                    onRemove={() => removePartnerImage(i)}
                  />
                </div>
              ))}
              
              <div className="h-32">
                <ImageUploader 
                  folder="settings/partners"
                  resetAfterUpload={true}
                  multiple={true}
                  onMultiUploadSuccess={(urls) => setFormData(prev => ({...prev, partnersImageUrls: [...prev.partnersImageUrls, ...urls]}))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

      </form>
    </div>
  );
}

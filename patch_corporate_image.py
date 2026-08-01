import sys
import re

with open('src/components/CorporatePage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add useRef to import
if "useRef" not in text:
    text = text.replace("import React, { useState, useEffect }", "import React, { useState, useEffect, useRef }")

# Add state variables
target_state = """  const [activeFaq, setActiveFaq] = useState<number | null>(null);"""
replacement_state = """  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);"""

if target_state in text:
    text = text.replace(target_state, replacement_state)
    print("State patched")

# Add functions
target_functions = """  const handleAmenityToggle = (amenity: string) => {"""
replacement_functions = """  const processAndStandardizeImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir görsel dosyası (PNG, JPG, WEBP) seçiniz.');
      return;
    }

    setIsProcessingImage(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const TARGET_WIDTH = 1200;
        const TARGET_HEIGHT = 675; // 16:9 aspect ratio

        const canvas = document.createElement('canvas');
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const scale = Math.max(TARGET_WIDTH / img.width, TARGET_HEIGHT / img.height);
          const x = (TARGET_WIDTH - img.width * scale) / 2;
          const y = (TARGET_HEIGHT - img.height * scale) / 2;

          ctx.fillStyle = '#0f172a'; // Background color for gaps if any
          ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

          const standardizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setFormData({ ...formData, imageUrl: standardizedDataUrl });
        }
        setIsProcessingImage(false);
      };
      img.onerror = () => {
        alert('Görsel yüklenirken bir hata oluştu.');
        setIsProcessingImage(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      alert('Dosya okunamadı.');
      setIsProcessingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAndStandardizeImage(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndStandardizeImage(e.dataTransfer.files[0]);
    }
  };

  const handleAmenityToggle = (amenity: string) => {"""

if target_functions in text:
    text = text.replace(target_functions, replacement_functions)
    print("Functions patched")


target_ui = """                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tesis Kapak Görsel Bağlantısı (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    İç veya dış alan görselinizin doğrudan URL bağlantısı. (Başvuru onaylandıktan sonra yüksek çözünürlüklü fotoğraflarınızı galerinize ekleyebilirsiniz)
                  </p>
                </div>"""

replacement_ui = """                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Tesis Kapak Görseli (16:9 Standart)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-3 transition cursor-pointer text-center overflow-hidden flex flex-col items-center justify-center min-h-[150px] ${
                      isDraggingImage
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/80'
                        : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    {isProcessingImage ? (
                      <div className="flex flex-col items-center justify-center text-blue-600">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <span className="font-bold text-xs">Görsel İşleniyor...</span>
                      </div>
                    ) : formData.imageUrl && !formData.imageUrl.startsWith('https://images.unsplash.com') ? (
                      <div className="w-full space-y-2">
                        <div className="relative w-full aspect-[16/9] max-h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 group shadow-sm">
                          <img
                            src={formData.imageUrl}
                            alt="Önizleme"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <span className="bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5 text-blue-600" />
                              Görseli Değiştir
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-500 dark:text-slate-400 p-4">
                        <Upload className="w-8 h-8 mb-2 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors" />
                        <span className="font-bold text-sm mb-1 text-slate-700 dark:text-slate-300">Görsel seçmek için tıklayın veya sürükleyin</span>
                        <span className="text-[11px]">PNG, JPG (Önerilen boyut: 1200x675px)</span>
                      </div>
                    )}
                  </div>
                </div>"""

if target_ui in text:
    text = text.replace(target_ui, replacement_ui)
    print("UI patched")


with open('src/components/CorporatePage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)


const fs = require('fs');

let content = fs.readFileSync('src/components/EditEventModal.tsx', 'utf8');

// Add import
if (!content.includes("import { DEFAULT_COVERS, getCoverImage }")) {
  content = content.replace("import { CategoryFilter } from './CategoryFilter';", "import { CategoryFilter } from './CategoryFilter';\nimport { DEFAULT_COVERS, getCoverImage } from '../lib/coverUtils';");
}

// Add state for showing predefined covers
if (!content.includes("const [showCoverSelector, setShowCoverSelector] = useState(false);")) {
  content = content.replace("const [isCustomUploaded, setIsCustomUploaded] = useState(false);", "const [isCustomUploaded, setIsCustomUploaded] = useState(false);\n  const [showCoverSelector, setShowCoverSelector] = useState(false);");
}

// Add UI for cover selector
const dropzoneHtml = `<div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={\`relative border-2 border-dashed rounded-2xl p-4 transition cursor-pointer text-center overflow-hidden flex flex-col items-center justify-center min-h-[160px] \${
                    isDragging
                      ? 'border-blue-600 bg-blue-50/80'
                      : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-slate-100/80'
                  }\`}
                >`;

const replacementHtml = `<div className="flex flex-col gap-2">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={\`relative border-2 border-dashed rounded-2xl p-4 transition cursor-pointer text-center overflow-hidden flex flex-col items-center justify-center min-h-[160px] \${
                    isDragging
                      ? 'border-blue-600 bg-blue-50/80'
                      : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-slate-100/80'
                  }\`}
                >`;

content = content.replace(dropzoneHtml, replacementHtml);

const existingFooter = `<div className="flex items-center justify-between px-1 text-[11px]">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          Yeni görsel sürükleyin veya tıkla değiştirın
                        </span>
                        {isCustomUploaded && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResetImage();
                            }}
                            className="text-red-500 hover:text-red-600 font-bold"
                          >
                            Orijinale Dön
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>`;

const newFooter = `<div className="flex items-center justify-between px-1 text-[11px]">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          Yeni görsel sürükleyin veya tıklayıp değiştirin
                        </span>
                        {isCustomUploaded && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResetImage();
                            }}
                            className="text-red-500 hover:text-red-600 font-bold"
                          >
                            Orijinale Dön
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Standard Covers Toggle */}
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => setShowCoverSelector(!showCoverSelector)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {showCoverSelector ? 'Standart Kapakları Gizle' : 'Standart Kapak Seç'}
                  </button>
                </div>
                
                {/* Standard Covers List */}
                {showCoverSelector && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2">
                    {DEFAULT_COVERS.map(cover => (
                      <button
                        key={cover.id}
                        type="button"
                        onClick={() => {
                          setImage(getCoverImage(cover.id));
                          setIsCustomUploaded(true);
                          setShowCoverSelector(false);
                        }}
                        className="relative group aspect-[16/9] rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 focus:border-blue-500 transition-all focus:outline-none"
                      >
                        <div className="absolute inset-0 w-full h-full" style={{ background: cover.gradient }}></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                          <span className="text-[10px] font-bold text-white px-2 py-1 bg-black/50 rounded-full">{cover.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>`;

content = content.replace(existingFooter, newFooter);

fs.writeFileSync('src/components/EditEventModal.tsx', content);
console.log('Patched EditEventModal.tsx');

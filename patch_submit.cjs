const fs = require('fs');

let content = fs.readFileSync('src/components/SubmitEventModal.tsx', 'utf8');

// Add import
if (!content.includes("import { DEFAULT_COVERS, getCoverImage }")) {
  content = content.replace("import { CategoryFilter } from './CategoryFilter';", "import { CategoryFilter } from './CategoryFilter';\nimport { DEFAULT_COVERS, getCoverImage } from '../lib/coverUtils';");
}

if (!content.includes("const [showCoverSelector, setShowCoverSelector] = useState(false);")) {
  content = content.replace("const [isProcessingImage, setIsProcessingImage] = useState(false);", "const [isProcessingImage, setIsProcessingImage] = useState(false);\n  const [showCoverSelector, setShowCoverSelector] = useState(false);");
}

const dropzoneHtml = `<div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={\`relative border-2 border-dashed rounded-xl p-3 transition cursor-pointer text-center overflow-hidden flex flex-col items-center justify-center min-h-[140px] \${
                      isDragging
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 bg-slate-50 dark:bg-slate-800/50'
                    }\`}
                  >`;

const replacementHtml = `<div className="flex flex-col gap-2">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={\`relative border-2 border-dashed rounded-xl p-3 transition cursor-pointer text-center overflow-hidden flex flex-col items-center justify-center min-h-[140px] \${
                      isDragging
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 bg-slate-50 dark:bg-slate-800/50'
                    }\`}
                  >`;

content = content.replace(dropzoneHtml, replacementHtml);

const existingFooter = `</div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">`;

const newFooter = `</div>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 mt-2">
                      {DEFAULT_COVERS.map(cover => (
                        <button
                          key={cover.id}
                          type="button"
                          onClick={() => {
                            setImage(getCoverImage(cover.id));
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
                </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">`;

content = content.replace(existingFooter, newFooter);

fs.writeFileSync('src/components/SubmitEventModal.tsx', content);
console.log('Patched SubmitEventModal.tsx');

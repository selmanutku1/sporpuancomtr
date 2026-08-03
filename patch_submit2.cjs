const fs = require('fs');

let content = fs.readFileSync('src/components/SubmitEventModal.tsx', 'utf8');

const target1 = `                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={\`relative border-2 border-dashed rounded-2xl p-3 transition cursor-pointer text-center overflow-hidden flex flex-col items-center justify-center min-h-[150px] \${
                      isDragging
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/80'
                        : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800'
                    }\`}
                  >`;

const replace1 = `<div className="flex flex-col gap-2">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={\`relative border-2 border-dashed rounded-2xl p-3 transition cursor-pointer text-center overflow-hidden flex flex-col items-center justify-center min-h-[150px] \${
                      isDragging
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/80'
                        : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800'
                    }\`}
                  >`;
                  
content = content.replace(target1, replace1);

const target2 = `                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">Detaylı Tesis / Etkinlik Açıklaması</label>`;

const replace2 = `                    )}
                  </div>
                  
                  {/* Standard Covers Toggle */}
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => setShowCoverSelector(!showCoverSelector)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {showCoverSelector ? 'Standart Kapakları Gizle' : 'Standart Kapak Seç'}
                    </button>
                  </div>
                  
                  {/* Standard Covers List */}
                  {showCoverSelector && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 mt-2">
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
                            <span className="text-[9px] font-bold text-white px-2 py-1 bg-black/50 rounded-full">{cover.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">Detaylı Tesis / Etkinlik Açıklaması</label>`;

if (content.includes(target2)) {
  content = content.replace(target2, replace2);
  fs.writeFileSync('src/components/SubmitEventModal.tsx', content);
  console.log('Fixed SubmitEventModal.tsx');
} else {
  console.log('Target not found in SubmitEventModal.tsx');
}

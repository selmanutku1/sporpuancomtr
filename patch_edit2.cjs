const fs = require('fs');

let content = fs.readFileSync('src/components/EditEventModal.tsx', 'utf8');

const target = `                    </div>
                  )}
                </div>
              </div>

              {/* Description */}`;

const replace = `                    </div>
                  )}
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
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 mt-2">
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
                          <span className="text-[9px] font-bold text-white px-2 py-1 bg-black/50 rounded-full">{cover.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              </div>

              {/* Description */}`;

if (content.includes(target)) {
  content = content.replace(target, replace);
  fs.writeFileSync('src/components/EditEventModal.tsx', content);
  console.log('Fixed EditEventModal.tsx');
} else {
  console.log('Target not found in EditEventModal.tsx');
}


with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("import { ReviewPage } from './components/ReviewPage';", "import { ReviewPage } from './components/ReviewPage';\nimport { SporpuanlilarNeDemis } from './components/SporpuanlilarNeDemis';")

target = """                    </div>
                  )}
                </section>
              )}
            </>"""

replacement = """                    </div>
                  )}
                </section>
              )}
              
              {/* Sporpuanlılar Ne Demiş Section */}
              <SporpuanlilarNeDemis events={events} />
            </>"""

text = text.replace(target, replacement)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)


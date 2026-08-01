import re

with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# For events tab closing
text = text.replace('''                  <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}''', '''                  <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
      )}''')

# For reviews tab closing
text = text.replace('''                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Değerlendirme bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}''', '''                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Değerlendirme bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
      )}''')


with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

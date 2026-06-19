import os
import re

codex_path = r"c:\Users\shaks\Downloads\dsa_odyssey_v4_folder\frontend\src\app\(game)\codex\page.tsx"
with open(codex_path, 'r', encoding='utf-8') as f:
    codex_content = f.read()

codex_content = codex_content.replace(
    "const res = await authFetch('http://localhost:5000/api/codex');",
    "const res = await fetch('http://localhost:5000/api/codex', { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } });"
)
codex_content = codex_content.replace(
    "await authFetch(`http://localhost:5000/api/codex?id=${id}`, { method: 'DELETE' });",
    "await fetch(`http://localhost:5000/api/codex?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } });"
)
codex_content = codex_content.replace(
    "await authFetch('http://localhost:5000/api/codex', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: `manual-${Date.now()}`, title: newTitle, content: newContent, realmId: 'manual', realmName: 'Custom', pattern: 'Custom Note', difficulty: 'N/A' }) });",
    "await fetch('http://localhost:5000/api/codex', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` }, body: JSON.stringify({ qid: `manual-${Date.now()}`, title: newTitle, content: newContent, realmId: 'manual', realmName: 'Custom', pattern: 'Custom Note', difficulty: 'N/A' }) });"
)
codex_content = codex_content.replace(
    "await authFetch('http://localhost:5000/api/codex', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: e.qid, title: e.title, content: editContent, realmId: e.realm_id, realmName: e.realm_name, pattern: e.pattern, difficulty: e.difficulty }) });",
    "await fetch('http://localhost:5000/api/codex', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` }, body: JSON.stringify({ qid: e.qid, title: e.title, content: editContent, realmId: e.realm_id, realmName: e.realm_name, pattern: e.pattern, difficulty: e.difficulty }) });"
)
codex_content = re.sub(r"import\s+\{\s*useGame[^}]*\}\s*from\s*['\"]@/lib/gameStore['\"];?", 
                     "import { useGame } from '@/store/GameContext';", codex_content)

with open(codex_path, 'w', encoding='utf-8') as f:
    f.write(codex_content)


forecast_path = r"c:\Users\shaks\Downloads\dsa_odyssey_v4_folder\frontend\src\app\(game)\forecast\page.tsx"
with open(forecast_path, 'r', encoding='utf-8') as f:
    forecast_content = f.read()
    
forecast_content = forecast_content.replace(
    "import { useGame } from '@/store/GameContext';",
    "import { useGame } from '@/store/GameContext';\nimport { getLevelInfo } from '@/utils/xpCalculator';\nimport { LEVELS } from '@/constants/tiers';"
)

with open(forecast_path, 'w', encoding='utf-8') as f:
    f.write(forecast_content)

kingdom_path = r"c:\Users\shaks\Downloads\dsa_odyssey_v4_folder\frontend\src\app\(game)\kingdom\page.tsx"
with open(kingdom_path, 'r', encoding='utf-8') as f:
    kingdom_content = f.read()
    
kingdom_content = kingdom_content.replace(
    "import { useGame } from '@/store/GameContext';",
    "import { useGame } from '@/store/GameContext';\nimport { getLevelInfo } from '@/utils/xpCalculator';\nimport { LEVELS } from '@/constants/tiers';"
)

with open(kingdom_path, 'w', encoding='utf-8') as f:
    f.write(kingdom_content)

print("Fixed stragglers")

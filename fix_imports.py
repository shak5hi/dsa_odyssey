import os
import re

search_dir = r"c:\Users\shaks\Downloads\dsa_odyssey_v4_folder\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replaces for useGame, GameState, authFetch, etc
    content = re.sub(r"import\s+\{\s*useGame[^}]*\}\s*from\s*['\"]@/lib/gameStore['\"];?", 
                     "import { useGame } from '@/store/GameContext';", content)
    
    # In some places they might import multiple things like `import { useGame, getLevelInfo, LEVELS } from '@/lib/gameStore';`
    content = re.sub(r"import\s+\{([^}]+)\}\s*from\s*['\"]@/lib/gameStore['\"];?",
                     lambda m: handle_game_store_import(m.group(1)), content)

    content = re.sub(r"import\s+\{([^}]+)\}\s*from\s*['\"]@/lib/data['\"];?",
                     lambda m: handle_data_import(m.group(1)), content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def handle_game_store_import(imports_str):
    imports = [i.strip() for i in imports_str.split(',')]
    res = []
    if 'useGame' in imports:
        res.append("import { useGame } from '@/store/GameContext';")
    if 'authFetch' in imports:
        res.append("import { authFetch } from '@/services/api/apiClient';")
    if 'getLevelInfo' in imports:
        res.append("import { getLevelInfo } from '@/utils/xpCalculator';")
    if 'LEVELS' in imports:
        res.append("import { LEVELS } from '@/constants/tiers';")
    return "\n".join(res)

def handle_data_import(imports_str):
    imports = [i.strip() for i in imports_str.split(',')]
    res = []
    realms_imports = [i for i in imports if i in ['REALMS', 'REALM_PROGRESSION']]
    if realms_imports:
        res.append(f"import {{ {', '.join(realms_imports)} }} from '@/constants/realms';")
    
    utils_imports = [i for i in imports if i in ['getLevelInfo', 'getActiveRealm', 'getMasteryRank']]
    if utils_imports:
        res.append(f"import {{ {', '.join(utils_imports)} }} from '@/utils/xpCalculator';")
        
    if 'ACHIEVEMENTS' in imports:
        res.append("import { ACHIEVEMENTS } from '@/constants/achievements';")
        
    if 'LEVELS' in imports:
        res.append("import { LEVELS } from '@/constants/tiers';")
        
    if 'LORE_DB' in imports:
        res.append("import { LORE_DB } from '@/constants/lore';")
        
    return "\n".join(res)

for root, _, files in os.walk(search_dir):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            process_file(os.path.join(root, file))

print("Imports updated")

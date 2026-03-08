import os
import re

def migrate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The negative lookbehind ensures we only match instances NOT already preceded by "dark:"
    replacements = {
        r'(?<!dark:)bg-slate-950(?!\/)': 'bg-slate-50 dark:bg-slate-950',
        r'(?<!dark:)bg-slate-900(?!\/)': 'bg-white dark:bg-slate-900', # Wait, slate-100? Actually white is cleaner for cards replacing 900
        r'(?<!dark:)bg-slate-800(?!\/)': 'bg-slate-50 dark:bg-slate-800',
        r'(?<!dark:)bg-slate-700(?!\/)': 'bg-slate-100 dark:bg-slate-700',
        r'(?<!dark:)bg-slate-950/30': 'bg-slate-50/50 dark:bg-slate-950/30',
        r'(?<!dark:)bg-slate-900/50': 'bg-slate-100/70 dark:bg-slate-900/50',
        
        r'(?<!dark:)border-slate-800': 'border-slate-200 dark:border-slate-800',
        r'(?<!dark:)border-slate-700': 'border-slate-300 dark:border-slate-700',
        
        r'(?<!dark:)text-slate-100': 'text-slate-900 dark:text-slate-100',
        r'(?<!dark:)text-slate-200': 'text-slate-800 dark:text-slate-200',
        r'(?<!dark:)text-slate-300': 'text-slate-700 dark:text-slate-300',
        r'(?<!dark:)text-slate-400': 'text-slate-600 dark:text-slate-400',
        r'(?<!dark:)text-white': 'text-slate-900 dark:text-white',

        r'(?<!dark:)hover:bg-slate-800': 'hover:bg-slate-100 dark:hover:bg-slate-800',
        r'(?<!dark:)hover:bg-slate-700': 'hover:bg-slate-200 dark:hover:bg-slate-700',
    }

    new_content = content
    for pattern, replacement in replacements.items():
        new_content = re.sub(pattern, replacement, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    src_dir = r"c:\Users\RISHITH\Downloads\Final Edutrack\client\src"
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.jsx', '.js')):
                # Ensure we don't mess up index.css etc, just JS files.
                migrate_file(os.path.join(root, file))

if __name__ == '__main__':
    main()

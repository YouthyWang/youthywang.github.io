#!/usr/bin/env python3
"""Check local article links and file inventory, no third-party packages needed."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
errors=[]
for collection in ('_posts','_coursework'):
    for path in sorted((root/collection).glob('*.md')):
        text=path.read_text(encoding='utf-8')
        if not text.startswith('---\n') or '\n---\n' not in text[4:]:
            errors.append(f'{path.relative_to(root)}: missing YAML front matter')
        for pdf in re.findall(r'\]\((/files/[^)]+\.pdf)\)',text,re.IGNORECASE):
            target=root/pdf.lstrip('/')
            if not target.is_file(): errors.append(f'{path.relative_to(root)}: missing {pdf}')
for required in ('images/yw_fig1.jpg','images/yw_avatar_illustration.png','_pages/cv.md',
                 '_pages/blog.html','_pages/archive.html','_pages/vibe-coding.html'):
    if not (root/required).is_file():errors.append('Missing required file: '+required)
# New Vibe Coding content uses the same Markdown/front-matter contract as posts.
for path in sorted((root/'_vibe_projects').glob('*.md')):
    text=path.read_text(encoding='utf-8')
    if not text.startswith('---\n') or '\n---\n' not in text[4:]:
        errors.append(f'{path.relative_to(root)}: missing YAML front matter')
    for image in re.findall(r'(?m)^image:\s*[\"\']?(/images/[^\s\"\']+)',text):
        if not (root/image.lstrip('/')).is_file():
            errors.append(f'{path.relative_to(root)}: missing project image {image}')
layout=(root/'_layouts/studio.html').read_text()
if layout.count('googletagmanager.com/gtag/js') != 1 or layout.count("gtag('config',") != 1:
    errors.append('Google tag must appear exactly once in shared studio layout')
if not (root/'_layouts/studio-project.html').is_file():
    errors.append('Missing project detail layout')
print('Vibe Coding projects:',len(list((root/'_vibe_projects').glob('*.md'))))
print('Blog posts:',len(list((root/'_posts').glob('*.md'))))
print('Coursework sections:',len(list((root/'_coursework').glob('*.md'))))
print('PDF documents:',len(list((root/'files').glob('*.pdf'))))
if errors:
    print('ISSUES:\n'+'\n'.join('- '+x for x in errors))
    raise SystemExit(1)
print('All local PDF links and required files exist.')

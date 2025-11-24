#!/usr/bin/env python3
"""
Add YAML frontmatter to MicroSims that are missing it.
Includes title, description, quality_score, and image references.
"""

import os
import re
import json

def has_frontmatter(content):
    """Check if content already has YAML frontmatter"""
    return content.strip().startswith('---')

def extract_title(content):
    """Extract title from first # heading"""
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return None

def extract_description(content, title):
    """Extract or generate description from content"""
    # Try to find description section
    desc_match = re.search(r'##\s+(?:Description|About|Overview).*?\n\n(.+?)(?:\n\n|##|\Z)', content, re.DOTALL | re.IGNORECASE)
    if desc_match:
        desc = desc_match.group(1).strip()
        # Clean up and truncate
        desc = re.sub(r'\s+', ' ', desc)
        if len(desc) > 200:
            desc = desc[:197] + '...'
        return desc

    # Fallback: use title to generate description
    if title:
        return f"An interactive MicroSim demonstrating {title.lower()}."
    return "Interactive educational simulation."

def get_quality_score(sim_path, sim_name):
    """Get quality score from previous calculation or calculate it"""
    # Try to read from metadata.json if it has a quality_score field
    metadata_path = os.path.join(sim_path, 'metadata.json')

    # For now, calculate a basic score
    score = 0
    index_path = os.path.join(sim_path, 'index.md')

    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Basic scoring
    if re.search(r'^#\s+.+', content, re.MULTILINE):
        score += 2
    if os.path.exists(os.path.join(sim_path, 'main.html')):
        score += 10
    if '<iframe' in content and 'main.html' in content:
        score += 10
    if re.search(r'\[.*Fullscreen.*\].*\.md-button', content, re.IGNORECASE):
        score += 5
    if '```html' in content and '<iframe' in content:
        score += 5
    image_files = [f for f in os.listdir(sim_path) if f.endswith(('.png', '.jpg', '.jpeg'))]
    if image_files:
        score += 5
    if os.path.exists(metadata_path):
        score += 30  # 10 for exists, 20 for assumed valid
    if re.search(r'##\s+(Description|Overview|About)', content, re.IGNORECASE):
        score += 5
    if re.search(r'##\s+Lesson\s+Plan', content, re.IGNORECASE):
        lesson_section = re.search(r'##\s+Lesson\s+Plan.*?(?=##|\Z)', content, re.DOTALL | re.IGNORECASE)
        if lesson_section and len(lesson_section.group(0)) > 500:
            score += 10
        else:
            score += 5
    if re.search(r'##\s+(References|Bibliography|Additional Resources)', content, re.IGNORECASE):
        score += 5
    if 'editor.p5js.org' in content:
        score += 5

    return min(score, 100)

def find_image_file(sim_path, sim_name):
    """Find image file in the MicroSim directory"""
    # Look for image files matching sim name
    for ext in ['.png', '.jpg', '.jpeg']:
        img_path = os.path.join(sim_path, f'{sim_name}{ext}')
        if os.path.exists(img_path):
            return f'/sims/{sim_name}/{sim_name}{ext}'

    # Look for any image file
    for file in os.listdir(sim_path):
        if file.endswith(('.png', '.jpg', '.jpeg')):
            return f'/sims/{sim_name}/{file}'

    return None

def add_frontmatter(sim_name, sims_dir='docs/sims'):
    """Add YAML frontmatter to a MicroSim's index.md"""
    sim_path = os.path.join(sims_dir, sim_name)
    index_path = os.path.join(sim_path, 'index.md')

    if not os.path.exists(index_path):
        return {'success': False, 'error': 'index.md not found'}

    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already has frontmatter
    if has_frontmatter(content):
        return {'success': False, 'error': 'Already has frontmatter'}

    # Extract info
    title = extract_title(content)
    if not title:
        return {'success': False, 'error': 'Could not extract title'}

    description = extract_description(content, title)
    quality_score = get_quality_score(sim_path, sim_name)
    image_path = find_image_file(sim_path, sim_name)

    # Build frontmatter
    frontmatter_lines = ['---']
    frontmatter_lines.append(f'title: {title}')
    frontmatter_lines.append(f'description: {description}')
    frontmatter_lines.append(f'quality_score: {quality_score}')

    if image_path:
        frontmatter_lines.append(f'image: {image_path}')
        frontmatter_lines.append(f'og:image: {image_path}')
        frontmatter_lines.append(f'twitter:image: {image_path}')

    frontmatter_lines.append('social:')
    frontmatter_lines.append('   cards: false')
    frontmatter_lines.append('---')
    frontmatter_lines.append('')  # blank line after frontmatter

    # Combine with existing content
    new_content = '\n'.join(frontmatter_lines) + content

    # Write back
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return {
        'success': True,
        'sim_name': sim_name,
        'title': title,
        'quality_score': quality_score
    }

if __name__ == '__main__':
    import sys

    sims_dir = 'docs/sims'

    # Get all MicroSim directories
    all_sims = sorted([d for d in os.listdir(sims_dir)
                      if os.path.isdir(os.path.join(sims_dir, d)) and d != 'thumbnails'])

    # Process all MicroSims
    results = []
    added_count = 0

    for sim_name in all_sims:
        result = add_frontmatter(sim_name)

        if result['success']:
            added_count += 1
            print(f"✅ {sim_name}: {result['quality_score']}/100")
        elif result['error'] == 'Already has frontmatter':
            print(f"⏭️  {sim_name}: Already has frontmatter")
        else:
            print(f"❌ {sim_name}: {result['error']}")

        results.append(result)

    # Summary
    print(f"\n📊 Added frontmatter to {added_count} MicroSims")

    # Calculate average score for newly added
    new_scores = [r['quality_score'] for r in results if r['success']]
    if new_scores:
        avg_score = sum(new_scores) / len(new_scores)
        print(f"📈 Average quality score: {avg_score:.1f}/100")

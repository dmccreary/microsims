#!/usr/bin/env python3
"""
Batch standardization script for MicroSims.
Automates metadata.json creation and quality score calculation.
"""

import os
import json
import re
from datetime import datetime

def read_index_md(sim_path):
    """Read and parse index.md file"""
    index_path = os.path.join(sim_path, 'index.md')
    if not os.path.exists(index_path):
        return None

    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse YAML frontmatter
    frontmatter = {}
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            yaml_content = parts[1]
            for line in yaml_content.strip().split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    frontmatter[key.strip()] = value.strip().strip('"').strip("'")

    return {
        'content': content,
        'frontmatter': frontmatter
    }

def calculate_quality_score(sim_path, sim_name):
    """Calculate quality score based on checklist"""
    score = 0

    # Check files exist
    index_md = os.path.join(sim_path, 'index.md')
    main_html = os.path.join(sim_path, 'main.html')
    metadata_json = os.path.join(sim_path, 'metadata.json')

    index_data = read_index_md(sim_path)
    if not index_data:
        return 0

    content = index_data['content']
    frontmatter = index_data['frontmatter']

    # Title in markdown (2 pts)
    if re.search(r'^#\s+.+', content, re.MULTILINE):
        score += 2

    # main.html present (10 pts)
    if os.path.exists(main_html):
        score += 10

    # Metadata 1: title and description in yml (3 pts)
    if 'title' in frontmatter and 'description' in frontmatter:
        score += 3

    # Metadata 2: image references (5 pts)
    if 'image' in frontmatter:
        score += 5

    # metadata.json present (10 pts)
    if os.path.exists(metadata_json):
        score += 10

    # metadata.json valid (20 pts) - simplified check
    if os.path.exists(metadata_json):
        try:
            with open(metadata_json, 'r') as f:
                json.load(f)
            score += 20
        except:
            pass

    # iframe present (10 pts)
    if '<iframe' in content and 'main.html' in content:
        score += 10

    # Fullscreen button (5 pts)
    if re.search(r'\[.*Fullscreen.*\].*\.md-button', content, re.IGNORECASE):
        score += 5

    # iframe example in code block (5 pts)
    if '```html' in content and '<iframe' in content:
        score += 5

    # Image file exists (5 pts)
    image_files = [f for f in os.listdir(sim_path) if f.endswith(('.png', '.jpg', '.jpeg'))]
    if image_files:
        score += 5

    # Overview documentation (5 pts)
    if re.search(r'##\s+(Description|Overview|About)', content, re.IGNORECASE):
        score += 5

    # Lesson plan (10 pts - 5 for minimal, 10 for comprehensive)
    if re.search(r'##\s+Lesson\s+Plan', content, re.IGNORECASE):
        # Check if comprehensive (has learning objectives, activities, etc.)
        lesson_section = re.search(r'##\s+Lesson\s+Plan.*?(?=##|\Z)', content, re.DOTALL | re.IGNORECASE)
        if lesson_section and len(lesson_section.group(0)) > 500:
            score += 10
        else:
            score += 5

    # References (5 pts)
    if re.search(r'##\s+(References|Bibliography|Additional Resources)', content, re.IGNORECASE):
        score += 5

    # P5.js editor link (5 pts)
    if 'p5.js' in content.lower() and 'editor.p5js.org' in content:
        score += 5

    return min(score, 100)

def create_metadata_json(sim_path, sim_name, index_data):
    """Generate metadata.json for a MicroSim"""
    frontmatter = index_data['frontmatter']

    # Extract title and description
    title = frontmatter.get('title', sim_name.replace('-', ' ').title())
    description = frontmatter.get('description', f'Interactive simulation for {title}')

    # Determine library by checking main.html
    library = 'p5.js'  # default
    main_html_path = os.path.join(sim_path, 'main.html')
    if os.path.exists(main_html_path):
        with open(main_html_path, 'r') as f:
            html_content = f.read()
            if 'vis-network' in html_content:
                library = 'vis-network'
            elif 'chart.js' in html_content.lower():
                library = 'Chart.js'
            elif 'plotly' in html_content.lower():
                library = 'Plotly.js'

    metadata = {
        "title": title,
        "description": description,
        "creator": "Dan McCreary",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "subject": [title.split()[0] if title else "Education"],
        "type": "Interactive Simulation",
        "format": "text/html",
        "language": "en-US",
        "rights": "CC BY 4.0",
        "contributor": ["Claude Code"],
        "identifier": f"https://dmccreary.github.io/microsims/sims/{sim_name}/",
        "publisher": "MicroSims Educational Platform",
        "educationalLevel": "High School, College",
        "learningResourceType": "simulation",
        "audience": "Students, Educators",
        "version": "1.0.0",
        "bloomLevel": ["Understand", "Apply"],
        "concepts": [title],
        "prerequisites": ["Basic understanding of the subject"],
        "library": library
    }

    return metadata

def update_quality_score(sim_path, score):
    """Add quality_score to YAML frontmatter"""
    index_path = os.path.join(sim_path, 'index.md')

    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if not content.startswith('---'):
        return False

    parts = content.split('---', 2)
    if len(parts) < 3:
        return False

    yaml_content = parts[1]

    # Check if quality_score already exists
    if 'quality_score:' in yaml_content:
        # Update existing score
        yaml_content = re.sub(r'quality_score:\s*\d+', f'quality_score: {score}', yaml_content)
    else:
        # Add after description if it exists, otherwise after title
        if 'description:' in yaml_content:
            yaml_content = re.sub(
                r'(description:.*?\n)',
                f'\\1quality_score: {score}\n',
                yaml_content
            )
        else:
            yaml_content = re.sub(
                r'(title:.*?\n)',
                f'\\1quality_score: {score}\n',
                yaml_content
            )

    new_content = '---' + yaml_content + '---' + parts[2]

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True

def standardize_microsim(sim_name, sims_dir='docs/sims'):
    """Standardize a single MicroSim"""
    sim_path = os.path.join(sims_dir, sim_name)

    if not os.path.isdir(sim_path):
        return {'success': False, 'error': 'Directory not found'}

    # Read index.md
    index_data = read_index_md(sim_path)
    if not index_data:
        return {'success': False, 'error': 'index.md not found'}

    # Create metadata.json if it doesn't exist
    metadata_path = os.path.join(sim_path, 'metadata.json')
    if not os.path.exists(metadata_path):
        metadata = create_metadata_json(sim_path, sim_name, index_data)
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2)

    # Calculate quality score
    score = calculate_quality_score(sim_path, sim_name)

    # Update quality_score in index.md
    update_quality_score(sim_path, score)

    return {
        'success': True,
        'score': score,
        'sim_name': sim_name
    }

if __name__ == '__main__':
    import sys

    if len(sys.argv) < 2:
        print("Usage: python standardize-batch.py <sim-name1> <sim-name2> ...")
        sys.exit(1)

    sims = sys.argv[1:]
    results = []

    for sim_name in sims:
        result = standardize_microsim(sim_name)
        results.append(result)

        if result['success']:
            print(f"✅ {sim_name}: {result['score']}/100")
        else:
            print(f"❌ {sim_name}: {result.get('error', 'Unknown error')}")

    # Summary
    successful = [r for r in results if r['success']]
    if successful:
        avg_score = sum(r['score'] for r in successful) / len(successful)
        print(f"\n📊 Standardized {len(successful)}/{len(sims)} MicroSims")
        print(f"📈 Average quality score: {avg_score:.1f}/100")

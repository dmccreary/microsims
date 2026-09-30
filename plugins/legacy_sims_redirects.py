"""Keep the original MicroSims' old URLs working after they moved from docs/sims/ to docs/microsims-old/.

After every build, write a small redirect page at each old URL (site/sims/<name>/...) for every
HTML file the build produced under site/microsims-old/<name>/. External iframes that load
.../sims/<name>/main.html and bookmarks to .../sims/<name>/ keep working, including any query string
or #fragment. Only the built site gets these files; docs/sims/ stays clean. A name that a current
sim in docs/sims/ also uses is skipped, so a redirect can never replace a real page.
"""
import json
import logging
import os

log = logging.getLogger("mkdocs.hooks.legacy_sims_redirects")

OLD_DIR = "sims"
NEW_DIR = "microsims-old"

PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>This MicroSim has moved</title>
<link rel="canonical" href="{target}">
<meta http-equiv="refresh" content="0; url={target}">
<script>location.replace({target_js} + location.search + location.hash);</script>
</head>
<body><p>This MicroSim has moved to <a href="{target}">{target}</a>.</p></body>
</html>
"""


def on_post_build(config, **kwargs):
    site = config["site_dir"]
    new_root = os.path.join(site, NEW_DIR)
    if not os.path.isdir(new_root):
        return
    written = 0
    for name in sorted(os.listdir(new_root)):
        src_dir = os.path.join(new_root, name)
        if not os.path.isdir(src_dir):
            continue
        if os.path.exists(os.path.join(site, OLD_DIR, name)):
            continue  # a current sim owns this URL
        for root, _dirs, files in os.walk(src_dir):
            for fname in files:
                if not fname.endswith(".html"):
                    continue
                rel = os.path.relpath(os.path.join(root, fname), new_root)
                old_path = os.path.join(site, OLD_DIR, rel)
                target = os.path.relpath(os.path.join(new_root, rel), os.path.dirname(old_path))
                target = target.replace(os.sep, "/")
                if target.endswith("/index.html"):
                    target = target[: -len("index.html")]
                os.makedirs(os.path.dirname(old_path), exist_ok=True)
                with open(old_path, "w", encoding="utf-8") as f:
                    f.write(PAGE.format(target=target, target_js=json.dumps(target)))
                written += 1
    log.info("legacy_sims_redirects: wrote %d redirect pages under /%s/", written, OLD_DIR)

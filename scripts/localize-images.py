#!/usr/bin/env python3
"""
Download every external photo used by the site into public/images/photos/
and rewrite the source references to the local copies, so no image can go
missing when a CDN is slow, blocked or changes its URLs.

Run from the repo root:  python3 scripts/localize-images.py
Then review `git diff` and commit.
"""
import hashlib
import os
import re
import sys
import urllib.request
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCAN_DIRS = ['src', 'public']
SCAN_EXT = ('.js', '.jsx', '.ts', '.tsx', '.css', '.html')
OUT_DIR = os.path.join(ROOT, 'public', 'images', 'photos')
URL_RE = re.compile(r"https://[^\s\"'`)<>]+?\.(?:jpe?g|png|webp|gif|svg)(?:\?[^\s\"'`)<>]*)?", re.I)
PHOTO_HOSTS_RE = re.compile(r"https://(images\.unsplash\.com|content\.fortune\.com|wallpapers\.com)/[^\s\"'`)<>]+", re.I)


def find_urls(text):
    found = set(URL_RE.findall(text)) | set(m.group(0) for m in PHOTO_HOSTS_RE.finditer(text))
    return found


def ext_for(url):
    path = urlparse(url).path.lower()
    for e in ('.jpeg', '.jpg', '.png', '.webp', '.gif', '.svg'):
        if path.endswith(e):
            return e
    return '.jpg'


def download(url, dest):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Ayinde site image sync)'})
    with urllib.request.urlopen(req, timeout=30) as r, open(dest, 'wb') as f:
        f.write(r.read())


def main():
    files = []
    for d in SCAN_DIRS:
        for dp, _, fns in os.walk(os.path.join(ROOT, d)):
            if 'node_modules' in dp or os.sep + 'build' in dp:
                continue
            for fn in fns:
                if fn.endswith(SCAN_EXT):
                    files.append(os.path.join(dp, fn))

    contents = {}
    urls = set()
    for path in files:
        with open(path, encoding='utf-8', errors='ignore') as f:
            text = f.read()
        contents[path] = text
        urls |= find_urls(text)

    if not urls:
        print('No external photo URLs found. Nothing to do.')
        return 0

    os.makedirs(OUT_DIR, exist_ok=True)
    mapping, failed = {}, []
    for url in sorted(urls):
        name = hashlib.sha1(url.encode()).hexdigest()[:12] + ext_for(url)
        dest = os.path.join(OUT_DIR, name)
        local = '/images/photos/' + name
        if not os.path.exists(dest):
            try:
                download(url, dest)
                print('downloaded', name, url[:70])
            except Exception as e:  # keep going; report at the end
                failed.append((url, str(e)))
                continue
        mapping[url] = local

    changed = 0
    for path, text in contents.items():
        new = text
        for url, local in mapping.items():
            new = new.replace(url, local)
        if new != text:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new)
            changed += 1

    print(f'\nLocalised {len(mapping)} photos; updated {changed} files.')
    if failed:
        print('\nCould not download (left as external links):')
        for url, err in failed:
            print(' -', url, '->', err)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())

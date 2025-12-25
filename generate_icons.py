#!/usr/bin/env python3
"""Generate PNG icons from SVG for the Chrome extension"""

import cairosvg
from pathlib import Path

# Icon sizes required by Chrome extensions
SIZES = [16, 48, 128]

# Read the SVG file
svg_path = Path(__file__).parent / 'icons' / 'icon.svg'
with open(svg_path, 'r') as f:
    svg_content = f.read()

# Generate PNG files for each size
icons_dir = Path(__file__).parent / 'icons'
for size in SIZES:
    output_path = icons_dir / f'icon{size}.png'
    cairosvg.svg2png(
        bytestring=svg_content.encode('utf-8'),
        write_to=str(output_path),
        output_width=size,
        output_height=size
    )
    print(f'Generated {output_path}')

print('All icons generated successfully!')

#!/usr/bin/env python3
"""
LSB-Steganografie — unsichtbares Wasserzeichen in PNG-Bilder einbetten / auslesen

Verwendung:
  python3 scripts/stego.py embed  <input.png> <output.png> [nachricht]
  python3 scripts/stego.py verify <image.png>
  python3 scripts/stego.py embed-all          (alle PNG in docs/ + landing/)

Das Wasserzeichen wird im LSB des Blaukanals (B) jedes Pixels versteckt.
Die Änderung pro Pixel beträgt maximal 1 Bit = visuell absolut unsichtbar.
"""

import sys
import struct
from pathlib import Path
from PIL import Image

MAGIC    = b'\xDE\xAD\xBE\xEF'
WATERMARK_DEFAULT = (
    "ISMS-BUILDER \u00a9 Claude Hecker | isms-builder.de | AGPL-3.0 | "
    "Unauthorized commercial use prohibited without written permission."
)

# Alle PNG-Bilder die ein Wasserzeichen erhalten sollen
TARGET_IMAGES = [
    "landing/isms-builder-banner-clean.png",
    "docs/isms-builder-banner.png",
    "isms-builder-banner.png",
    "ui/isms-builder-banner.png",
]
SCREENSHOT_DIR = Path("docs/screenshots")


def _to_bits(data: bytes) -> list:
    bits = []
    for byte in data:
        for i in range(7, -1, -1):
            bits.append((byte >> i) & 1)
    return bits


def _from_bits(bits: list) -> bytes:
    out = bytearray()
    for i in range(0, len(bits) - 7, 8):
        out.append(int(''.join(str(b) for b in bits[i:i+8]), 2))
    return bytes(out)


def _img_to_pixels(img: Image.Image):
    """Gibt Pixeldaten als Liste von (r,g,b)-Tupeln zurück."""
    w, h = img.size
    px = img.load()
    return [(px[x, y][0], px[x, y][1], px[x, y][2]) for y in range(h) for x in range(w)]


def _pixels_to_img(pixels: list, size: tuple) -> Image.Image:
    out = Image.new('RGB', size)
    out.putdata(pixels)
    return out


def embed(input_path: str, output_path: str, message: str = WATERMARK_DEFAULT) -> None:
    payload = MAGIC + struct.pack('>I', len(message)) + message.encode('utf-8')
    bits    = _to_bits(payload)

    img     = Image.open(input_path).convert('RGB')
    pixels  = _img_to_pixels(img)

    if len(bits) > len(pixels):
        raise ValueError(f"Nachricht zu lang: {len(bits)} Bits, Kapazität: {len(pixels)} Bits")

    new_pixels = []
    for i, (r, g, b) in enumerate(pixels):
        if i < len(bits):
            b = (b & 0xFE) | bits[i]
        new_pixels.append((r, g, b))

    _pixels_to_img(new_pixels, img.size).save(output_path, 'PNG', optimize=False)
    print(f"  \u2713 {output_path}  ({len(bits)} / {len(pixels)} Bits genutzt, {100*len(bits)//len(pixels)}%)")


def verify(image_path: str) -> bool:
    img    = Image.open(image_path).convert('RGB')
    pixels = _img_to_pixels(img)
    bits   = [(b & 1) for _, _, b in pixels]

    header = _from_bits(bits[:32])
    if header != MAGIC:
        print(f"  \u2717 {image_path}  — kein Wasserzeichen")
        return False

    length = struct.unpack('>I', _from_bits(bits[32:64]))[0]
    if length <= 0 or length > 100_000:
        print(f"  \u2717 {image_path}  — Wasserzeichen beschädigt")
        return False

    message = _from_bits(bits[64:64 + length * 8]).decode('utf-8', errors='replace')
    print(f"  \u2713 {image_path}")
    print(f"    \u2192 {message}")
    return True


def embed_all(base: Path = Path('.')) -> None:
    targets = [base / p for p in TARGET_IMAGES]
    targets += sorted((base / SCREENSHOT_DIR).glob('*.png'))

    print(f"\nEinbetten in {len(targets)} Bilder:\n")
    ok = 0
    for p in targets:
        if not p.exists():
            print(f"  \u25cb {p}  (nicht gefunden, übersprungen)")
            continue
        if p.name.endswith('-original.png'):
            print(f"  \u25cb {p}  (Original, übersprungen)")
            continue
        try:
            embed(str(p), str(p))
            ok += 1
        except Exception as e:
            print(f"  \u2717 {p}  — Fehler: {e}")

    print(f"\n{ok}/{len(targets)} Bilder markiert.")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == 'embed':
        if len(sys.argv) < 4:
            print("Verwendung: stego.py embed <input.png> <output.png> [nachricht]")
            sys.exit(1)
        msg = sys.argv[4] if len(sys.argv) > 4 else WATERMARK_DEFAULT
        embed(sys.argv[2], sys.argv[3], msg)

    elif cmd == 'verify':
        if len(sys.argv) < 3:
            print("Verwendung: stego.py verify <image.png>")
            sys.exit(1)
        verify(sys.argv[2])

    elif cmd == 'embed-all':
        embed_all()

    else:
        print(f"Unbekannter Befehl: {cmd}")
        sys.exit(1)

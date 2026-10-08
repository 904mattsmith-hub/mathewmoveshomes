#!/usr/bin/env python3
"""Lay a flyer image out on a letter sheet for printing and cutting.

Same style as the Duval Threads print sheet: copies butted together at a
dashed cut line, with crop marks at every trim corner.

  python3 flyers/make_print_sheet.py flyers/fall-2026/carved-out-time.webp

Writes <name>-print.pdf next to the image with two pages:
  page 1  2-up  (two half-sheet flyers, one horizontal cut)
  page 2  4-up  (four quarter-sheet cards, one horizontal + one vertical cut)

Print at 100% / "Actual size" on 8.5x11 paper.
"""
import sys
from pathlib import Path

from PIL import Image
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

PAGE_W, PAGE_H = letter
MARK_LEN = 0.35 * inch   # crop mark length
MARK_GAP = 0.08 * inch   # space between trim edge and crop mark


def crop_marks(c, x0, y0, x1, y1):
    """Corner crop marks just outside the trim box (x0,y0)-(x1,y1)."""
    c.setStrokeGray(0.25)
    c.setLineWidth(0.6)
    c.setDash()
    for x, dx in ((x0, -1), (x1, 1)):
        for y, dy in ((y0, -1), (y1, 1)):
            # horizontal mark, beside the corner
            c.line(x + dx * MARK_GAP, y, x + dx * (MARK_GAP + MARK_LEN), y)
            # vertical mark, above/below the corner
            c.line(x, y + dy * MARK_GAP, x, y + dy * (MARK_GAP + MARK_LEN))


def cut_line(c, x0, y0, x1, y1):
    c.setStrokeGray(0.45)
    c.setLineWidth(1.4)
    c.setDash(6, 4)
    c.line(x0, y0, x1, y1)
    c.setDash()
    c.setFillGray(0.55)
    c.setFont("Helvetica", 5)
    c.drawString(x1 - 18 if x0 != x1 else x0 + 3, y1 - 8 if x0 != x1 else y1 - 10, "CUT")


def sheet(c, img, cols, rows, cell_h):
    """Tile `cols` x `rows` copies, butted together, centered on the page."""
    iw, ih = img.getSize()
    cell_w = cell_h * iw / ih
    block_w, block_h = cols * cell_w, rows * cell_h
    left = (PAGE_W - block_w) / 2
    bottom = (PAGE_H - block_h) / 2

    for r in range(rows):
        for col in range(cols):
            c.drawImage(img, left + col * cell_w, bottom + r * cell_h,
                        cell_w, cell_h)

    crop_marks(c, left, bottom, left + block_w, bottom + block_h)
    for r in range(1, rows):
        y = bottom + r * cell_h
        cut_line(c, 0, y, PAGE_W, y)
    for col in range(1, cols):
        x = left + col * cell_w
        cut_line(c, x, 0, x, PAGE_H)
    c.showPage()
    return cell_w, cell_h


def main(src):
    src = Path(src)
    out = src.with_name(src.stem + "-print.pdf")
    # Flatten to a high-quality JPEG so the PDF stays small and printer-friendly.
    tmp = src.with_suffix(".print.jpg")
    Image.open(src).convert("RGB").save(tmp, quality=95)
    img = ImageReader(str(tmp))

    c = canvas.Canvas(str(out), pagesize=letter)
    c.setTitle(src.stem.replace("-", " ").title() + " - print sheet")
    # 2-up: leave ~0.5" top/bottom for crop marks, same as the Duval sheet.
    w2, h2 = sheet(c, img, cols=1, rows=2, cell_h=(PAGE_H - 1.0 * inch) / 2)
    # 4-up: as large as fits with ~0.5" side margins.
    iw, ih = img.getSize()
    h4 = min((PAGE_H - 1.0 * inch) / 2, (PAGE_W - 1.0 * inch) / 2 * ih / iw)
    w4, h4 = sheet(c, img, cols=2, rows=2, cell_h=h4)
    c.save()
    tmp.unlink()

    print(f"wrote {out}")
    print(f"  2-up: {w2 / inch:.2f} x {h2 / inch:.2f} in each")
    print(f"  4-up: {w4 / inch:.2f} x {h4 / inch:.2f} in each")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])

#!/usr/bin/env python3
"""Print and static-web editions of the 24-scene GM director.

Always start from the ORIGINAL illustrated base supplied by the author's
canonical repo, so re-running never appends the director twice.
"""
import argparse
import html
import re
import zipfile
from pathlib import Path

from PIL import Image as PillowImage
from pypdf import PdfReader, PdfWriter
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Image, Spacer, PageBreak
import markdown

ROOT = Path(__file__).resolve().parents[1]
FIELD = ROOT / 'source/gm-field-guide.md'
LOGO = ROOT / 'app/assets/savage-worlds-fan.png'
PDF_DIR = ROOT / 'pdf'

def inline(text):
    safe=html.escape(text.strip())
    safe=re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', safe)
    safe=re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<i>\1</i>', safe)
    return safe

def render_handbook(md):
    styles=getSampleStyleSheet()
    styles.add(ParagraphStyle(name='SceneTitle',parent=styles['Title'],fontSize=23,leading=29,spaceAfter=15))
    styles.add(ParagraphStyle(name='SceneSection',parent=styles['Heading1'],fontSize=15,leading=19,spaceBefore=14,spaceAfter=7,keepWithNext=True))
    styles.add(ParagraphStyle(name='SceneSub',parent=styles['Heading2'],fontSize=12,leading=16,spaceBefore=11,spaceAfter=5,keepWithNext=True))
    styles.add(ParagraphStyle(name='SceneBody',parent=styles['BodyText'],fontSize=10,leading=14.5,spaceAfter=7))
    styles.add(ParagraphStyle(name='SceneList',parent=styles['SceneBody'],leftIndent=16,firstLineIndent=-10))
    styles.add(ParagraphStyle(name='SceneSmall',parent=styles['SceneBody'],fontSize=8.5,leading=12))
    def footer(canvas,doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor('#93a3b4'))
        canvas.line(0.68*inch,0.64*inch,7.82*inch,0.64*inch)
        canvas.setFont('Helvetica',8)
        canvas.drawString(0.70*inch,0.43*inch,'Message in a Bottle | Scene Director | GM ONLY')
        canvas.drawRightString(7.82*inch,0.43*inch,str(doc.page))
        canvas.restoreState()
    destination=PDF_DIR/'message-in-a-bottle-scene-director.pdf'
    doc=SimpleDocTemplate(str(destination),pagesize=letter,leftMargin=0.72*inch,rightMargin=0.72*inch,topMargin=0.72*inch,bottomMargin=0.91*inch,
        title="Message in a Bottle: Scene Director's Handbook",author='Austen Tucker-Crowder')
    story=[Paragraph('Message in a Bottle',styles['SceneTitle']),
      Paragraph("Scene Director's Handbook",styles['SceneSection']),
      Paragraph('24 scenes · step-by-step GM procedures · full spoilers · unplaytested fan edition',styles['SceneBody'])]
    with PillowImage.open(LOGO) as img:
        w,h=img.size
    width=2.35*inch
    story.append(Image(str(LOGO),width=width,height=width*h/w))
    story += [Spacer(1,0.18*inch),Paragraph('Campaign by Austen Tucker-Crowder. Requires the separately available Savage Worlds Adventure Edition core rules. Not official Pinnacle material.',styles['SceneBody']),
      Paragraph('This game references the Savage Worlds game system, available from Pinnacle Entertainment Group at www.peginc.com. Savage Worlds and all associated logos and trademarks are copyrights of Pinnacle Entertainment Group. Used with permission. Pinnacle makes no representation or warranty as to the quality, viability, or suitability for purpose of this product.',styles['SceneSmall']),PageBreak()]
    # Markdown headings and numbered instructions each receive distinct, readable paragraphs.
    for line in md.splitlines():
        line=line.strip()
        if not line: continue
        if line.startswith('# '): continue
        if line.startswith('### '): story.append(Paragraph(inline(line[4:]),styles['SceneSub']))
        elif line.startswith('## '): story.append(Paragraph(inline(line[3:]),styles['SceneSection']))
        elif re.match(r'^\d+\. ',line): story.append(Paragraph(inline(line),styles['SceneList']))
        elif line.startswith('- '): story.append(Paragraph('&#8226; '+inline(line[2:]),styles['SceneList']))
        else: story.append(Paragraph(inline(line),styles['SceneBody']))
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
    return destination

def render_html(md):
    body=markdown.markdown(md,extensions=['extra','sane_lists'])
    doc=f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Scene Director's Handbook | Message in a Bottle</title>
<style>body{{font:1.07rem/1.65 system-ui,sans-serif;color:#142338;background:#fff;margin:0}}
main{{max-width:76ch;margin:auto;padding:1.5rem 1.5rem 4rem}}
nav{{background:#142338;padding:1rem;text-align:center}}nav a{{color:#fff;margin:0 1rem;font-weight:bold}}
h1{{font-size:2.2rem}}h2{{font-size:1.65rem;border-top:2px solid #bac7d5;padding-top:1.2rem;margin-top:2.2rem}}
h3{{font-size:1.25rem;margin-top:1.6rem}}p,li{{max-width:76ch}}
a{{color:#16499b}}a:focus-visible{{outline:3px solid #f59e0b;outline-offset:3px}}
@media print{{nav{{display:none}}body{{font-size:10.5pt}} h2,h3{{break-after:avoid}}}}
</style></head><body><a href="#content">Skip to handbook</a>
<nav aria-label="GM resources"><a href="./">GM runner</a><a href="./module.html">Full module</a><a href="../pdf/message-in-a-bottle-module.pdf">Printable book</a></nav>
<main id="content"><p><strong>GM ONLY: full spoilers.</strong> This unplaytested guide supplements the core SWADE rules. No player handouts should be shared from this page.</p>{body}</main></body></html>"""
    destination=ROOT/'app/scene-director.html'
    destination.write_text(doc,encoding='utf8')
    return destination

def combine(original,appendix):
    if not original.is_file(): raise FileNotFoundError(original)
    reader=PdfReader(str(original))
    other=PdfReader(str(appendix))
    if len(reader.pages)<1 or len(other.pages)<10: raise ValueError('Missing original adventure or scene guide')
    out=PdfWriter()
    out.append(reader)
    out.append(other)
    destination=PDF_DIR/'message-in-a-bottle-module.pdf'
    with destination.open('wb') as f:out.write(f)
    return len(reader.pages),len(other.pages)

def package():
    destination=ROOT/'downloads/message-in-a-bottle-free-module.zip'
    destination.parent.mkdir(exist_ok=True)
    with zipfile.ZipFile(destination,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as zipfile_out:
        for folder in ('app','pdf','source'):
            for file in (ROOT/folder).rglob('*'):
                if file.is_file():
                    zipfile_out.write(file,arcname='message-in-a-bottle/'+str(file.relative_to(ROOT)))
        zipfile_out.write(ROOT/'README.md',arcname='message-in-a-bottle/README.md')
    return destination

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--base',required=True,type=Path,help='Canonical, unmodified original illustrated module PDF')
    args=parser.parse_args()
    md=FIELD.read_text(encoding='utf8')
    if len(re.findall(r'^### [0-7][ABC]\. ',md,re.MULTILINE))!=24:
        raise ValueError('Director must contain exactly 24 scene headings')
    PDF_DIR.mkdir(exist_ok=True)
    if not LOGO.is_file(): raise FileNotFoundError('Required unaltered fan logo missing')
    handbook=render_handbook(md)
    render_html(md)
    before,added=combine(args.base,handbook)
    output=package()
    print(f'Illustrated book: {before} original + {added} GM scene pages. Bundled {output.name}.')

if __name__=='__main__':main()

"""Reads Breton text pieces aloud with breton-tts and writes one MP3.

Usage: python speak.py input.json out.mp3
input.json: {"parts": ["...", "..."], "speaker": 0}   (0 = Aziliz, 1 = Paol)
"""
import json
import subprocess
import sys
import unicodedata

import numpy as np
import sherpa_onnx
import soundfile as sf

src, dst = sys.argv[1], sys.argv[2]
data = json.load(open(src, encoding="utf-8"))
parts, speaker = data["parts"], int(data.get("speaker", 0))

symbols = {line.split(" ")[0] for line in open("model/tokens.txt", encoding="utf-8") if line.strip()}
if " " not in symbols:
    symbols.add(" ")


def clean(text: str) -> str:
    """Keep only characters the voice knows (it reads lower-case text)."""
    text = unicodedata.normalize("NFC", text.replace("’", "'").replace("–", ", ").replace("—", ", "))
    if not any(c.isupper() for c in symbols):
        text = text.lower()
    return "".join(c if c in symbols else " " for c in text)


tts = sherpa_onnx.OfflineTts(
    sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            vits=sherpa_onnx.OfflineTtsVitsModelConfig(model="model/model.onnx", tokens="model/tokens.txt"),
            num_threads=4,
        ),
    )
)

pieces, rate = [], None
missing = set()
for part in parts:
    missing |= {c for c in part.lower() if c not in symbols and c not in " .,;:!?'\"()«»“”–—-"}
    audio = tts.generate(clean(part), sid=speaker, speed=1.0)
    rate = audio.sample_rate
    pieces.append(np.array(audio.samples, dtype=np.float32))
    pieces.append(np.zeros(int(rate * 0.6), dtype=np.float32))

print(f"{len(parts)} pieces, sample rate {rate}, characters not in the voice: {''.join(sorted(missing)) or 'none'}")
sf.write("out.wav", np.concatenate(pieces), rate)
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", "out.wav", "-ac", "1", "-b:a", "64k", dst], check=True)
print("seconds:", round(sum(len(p) for p in pieces) / rate, 1))

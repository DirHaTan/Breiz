"""Reads Breton text aloud with breton-tts and writes one MP3.

Usage: python speak.py input.json out.mp3
input.json: {"parts": ["paragraph", ...], "speaker": 0}   (0 = Aziliz, 1 = Paol)
Each paragraph is read sentence by sentence, with short pauses.
"""
import json
import re
import sys
import unicodedata

import lameenc
import numpy as np
import sherpa_onnx

UNITS = ["", "unan", "daou", "tri", "pevar", "pemp", "c'hwec'h", "seiz", "eiz", "nav", "dek",
         "unnek", "daouzek", "trizek", "pevarzek", "pemzek", "c'hwezek", "seitek", "triwec'h", "naontek"]
HUNDREDS = ["", "kant", "daou c'hant", "tri c'hant", "pevar c'hant", "pemp kant",
            "c'hwec'h kant", "seiz kant", "eiz kant", "nav c'hant"]


def below_100(n: int) -> str:
    if n < 20:
        return UNITS[n]
    if n < 30:
        return "ugent" if n == 20 else f"{UNITS[n - 20]} warn-ugent"
    if n < 40:
        return "tregont" if n == 30 else f"{UNITS[n - 30]} ha tregont"
    if n < 50:
        return "daou-ugent" if n == 40 else f"{UNITS[n - 40]} ha daou-ugent"
    if n < 60:
        return "hanter-kant" if n == 50 else f"{UNITS[n - 50]} ha hanter-kant"
    if n < 80:
        return "tri-ugent" if n == 60 else f"{UNITS[n - 60]} ha tri-ugent"
    return "pevar-ugent" if n == 80 else f"{UNITS[n - 80]} ha pevar-ugent"


def number(n: int) -> str:
    """Breton words for 0-2999 (years and counts)."""
    if n == 0:
        return "mann"
    words = []
    thousands, rest = divmod(n, 1000)
    if thousands == 1:
        words.append("mil")
    elif thousands == 2:
        words.append("daou vil")
    hundreds, rest = divmod(rest, 100)
    if hundreds:
        words.append(HUNDREDS[hundreds])
    if rest:
        words.append(below_100(rest))
    return " ".join(words)


def spell_numbers(text: str) -> str:
    text = re.sub(r"(\d+)\s*[–-]\s*(\d+)", r"\1 betek \2", text)
    return re.sub(r"\d+", lambda m: number(int(m.group())) if int(m.group()) < 3000 else m.group(), text)


src, dst = sys.argv[1], sys.argv[2]
data = json.load(open(src, encoding="utf-8"))
parts, speaker = data["parts"], int(data.get("speaker", 0))
symbols = {line.split(" ")[0] for line in open("model/tokens.txt", encoding="utf-8") if line.strip()} | {" "}


def clean(text: str) -> str:
    """Lower case, digits as words, and only characters the voice knows."""
    text = unicodedata.normalize("NFC", text).replace("’", "'")
    text = spell_numbers(text).lower()
    text = re.sub(r"[:;()«»“”\"–—]", ",", text)
    text = "".join(c if c in symbols else " " for c in text)
    text = re.sub(r"\s*,\s*(,\s*)*", ", ", text)
    return re.sub(r"\s+", " ", text).strip(" ,")


tts = sherpa_onnx.OfflineTts(
    sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            vits=sherpa_onnx.OfflineTtsVitsModelConfig(model="model/model.onnx", tokens="model/tokens.txt"),
            num_threads=4,
        ),
    )
)

pieces, rate = [], 22050
for part in parts:
    for sentence in re.split(r"(?<=[.!?])\s+", part.strip()):
        text = clean(sentence)
        if not text:
            continue
        audio = tts.generate(text, sid=speaker, speed=1.0)
        rate = audio.sample_rate
        pieces.append(np.array(audio.samples, dtype=np.float32))
        pieces.append(np.zeros(int(rate * 0.35), dtype=np.float32))
    pieces.append(np.zeros(int(rate * 0.4), dtype=np.float32))

samples = np.concatenate(pieces)
pcm = (np.clip(samples, -1, 1) * 32767).astype(np.int16)
encoder = lameenc.Encoder()
encoder.set_bit_rate(64)
encoder.set_in_sample_rate(rate)
encoder.set_channels(1)
encoder.set_quality(2)
with open(dst, "wb") as f:
    f.write(encoder.encode(pcm.tobytes()) + encoder.flush())
print(f"{len(parts)} paragraphs, {round(len(samples) / rate)} seconds")

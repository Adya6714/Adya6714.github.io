"""Remove baked-in UI from the reference painting.
Usage: python tools/clean_plate.py assets/source/reference_with_ui.png assets/source/ui_mask.png out.png
For a better result, open the image in Photoshop/Photopea, load ui_mask.png as a selection, and use
Generative Fill with: "same painted landscape, river water, moss and rocks, no objects".
"""
import sys, cv2, numpy as np
src = cv2.imread(sys.argv[1])[:, :, :3]
m = (cv2.imread(sys.argv[2], 0) > 0).astype(np.uint8)
srcf = src.astype(np.float32)
dark = cv2.cvtColor(src, cv2.COLOR_BGR2HSV)[..., 2] < 70
w = ((1 - m) * (~dark)).astype(np.float32)
fill = None
for sig in (8, 18, 40, 90):
    num = cv2.GaussianBlur(srcf * w[..., None], (0, 0), sig); den = cv2.GaussianBlur(w, (0, 0), sig)[..., None]
    f = num / np.maximum(den, 1e-6); a = np.clip(den / 0.3, 0, 1)
    if fill is None: fill, have = f * a, a
    else: fill, have = fill + f * a * (1 - have), have + a * (1 - have)
fill = fill / np.maximum(have, 1e-6)
H, W = m.shape
nz = cv2.GaussianBlur(cv2.resize(np.random.default_rng(3).standard_normal((H // 2, W // 4)).astype(np.float32), (W, H)), (0, 0), 1.0)
res = fill + nz[..., None] * np.clip(fill.mean(2, keepdims=True) / 255, .2, 1) * 14
n, lab, st, _ = cv2.connectedComponentsWithStats(m)
small = np.zeros_like(m)
for i in range(1, n):
    if st[i][4] < 4000: small[lab == i] = 1
tel = cv2.inpaint(src, small * 255, 4, cv2.INPAINT_TELEA).astype(np.float32) + nz[..., None] * 6
res = np.where(small[..., None] > 0, tel, res)
mm = np.clip(cv2.GaussianBlur(m.astype(np.float32), (0, 0), 2) * 1.6, 0, 1)[..., None]
cv2.imwrite(sys.argv[3], np.clip(srcf * (1 - mm) + res * mm, 0, 255).astype(np.uint8))
print("wrote", sys.argv[3])

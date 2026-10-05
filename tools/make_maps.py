"""Rebuild plate.webp, flow.png and foam.png from a clean 848x1264 plate.
Usage: python tools/make_maps.py assets/source/clean_plate_848.png [upscaled_4x.png]
Upscale first with Upscayl or realesrgan-ncnn-vulkan (model realesr-animevideov3-x4) for a sharp plate.
If you change the painting's layout, edit CORRIDOR and FLOW below to match the new river.
"""
import sys, cv2, numpy as np
from PIL import Image
src = cv2.imread(sys.argv[1])[:, :, :3]; H, W = src.shape[:2]
hsv = cv2.cvtColor(src, cv2.COLOR_BGR2HSV).astype(int); h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
b, r = src[..., 0].astype(int), src[..., 2].astype(int)
water = (((h >= 80) & (h <= 102) & (s > 35) & (v > 85) & (s < 175)) | ((v > 175) & (s < 90) & (b > r + 10))).astype(np.uint8)
CORRIDOR = [(300,20),(520,20),(560,150),(610,240),(600,300),(640,350),(650,420),(610,470),(560,490),(640,560),(700,650),(720,760),(740,880),(740,1000),(848,1050),(848,1264),(0,1264),(0,1030),(120,990),(250,975),(330,940),(420,960),(560,900),(560,830),(470,790),(330,760),(210,720),(150,690),(170,640),(280,620),(300,560),(260,520),(220,470),(200,420),(210,350),(260,300),(240,260),(290,220)]
cor = np.zeros((H, W), np.uint8); cv2.fillPoly(cor, [np.array(CORRIDOR, np.int32)], 1)
wm = cv2.morphologyEx(water & cor, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8)).astype(np.float32)
pool = (((h >= 78) & (h <= 105) & (s > 25) & (v > 45)) & (np.mgrid[0:H, 0:W][0] > 990)).astype(np.float32)
wm = np.maximum(wm, pool); wm[v < 55] = 0; wm = cv2.GaussianBlur(wm, (0, 0), 1.5)
foam = cv2.GaussianBlur(((v > 175) & (s < 95)).astype(np.float32) * wm, (0, 0), 2.5)
# flow control points: x, y, dx, dy, speed (map pixels)
FLOW = [(330,60,0,1,1),(400,60,0,1,1),(470,60,0,1,1),(350,150,0,1,1),(440,150,0,1,1),(500,160,.05,1,1),(420,240,0,1,.55),(330,250,-.1,1,.45),(500,250,.1,1,.45),
 (300,320,.15,1,.22),(420,320,0,1,.22),(540,320,-.15,1,.22),(280,400,.25,1,.25),(420,420,0,1,.25),(560,410,-.3,1,.25),(330,480,.2,1,.45),(450,480,.15,1,.45),(560,480,-.2,1,.45),
 (330,560,.35,1,.75),(450,560,.3,1,.8),(560,560,.2,1,.75),(230,600,.6,.5,.5),(180,660,.8,.4,.45),(380,640,.45,1,.85),(500,650,.45,1,.85),(620,640,.2,1,.8),(300,700,.7,.7,.6),
 (450,720,.6,1,.85),(600,730,.25,1,.9),(520,780,.5,1,.8),(620,800,.15,1,1),(680,860,.05,1,1),(640,900,-.05,1,1),(660,950,-.1,1,.8),(600,1000,-.3,1,.2),(420,1020,-.1,1,.1),
 (250,1060,0,1,.06),(600,1100,0,1,.06),(420,1120,0,1,.05),(100,1080,.1,1,.05),(760,1100,-.1,1,.05)]
yy, xx = np.mgrid[0:H:4, 0:W:4].astype(np.float32)
acc = np.zeros(xx.shape + (2,), np.float32); ws = np.zeros(xx.shape, np.float32)
for cx, cy, dx, dy, sp in FLOW:
    n = np.hypot(dx, dy); g = np.exp(-((xx - cx) ** 2 + (yy - cy) ** 2) / 7200) + 1e-6
    acc[..., 0] += g * dx / n * sp; acc[..., 1] += g * dy / n * sp; ws += g
fl = acc / ws[..., None]; sm = cv2.resize(wm, (fl.shape[1], fl.shape[0]), interpolation=cv2.INTER_AREA); fl *= sm[..., None]
rgb = np.dstack([0.5 + 0.5 * fl[..., 0], 0.5 + 0.5 * fl[..., 1], sm])
Image.fromarray(np.clip(rgb * 255, 0, 255).astype(np.uint8)).save("assets/scene/flow.png")
Image.fromarray(np.clip(cv2.resize(foam, (fl.shape[1], fl.shape[0]), interpolation=cv2.INTER_AREA) * 357, 0, 255).astype(np.uint8)).save("assets/scene/foam.png")
big = Image.open(sys.argv[2] if len(sys.argv) > 2 else sys.argv[1]).convert("RGB").resize((2544, 3792), Image.LANCZOS)
big.save("assets/scene/plate.webp", quality=82, method=6)
print("wrote assets/scene/plate.webp, flow.png, foam.png")

# HOW TO RUN — I-RAH TOURISM WEBSITE
## Your folder: Tourism-  (all files in one place ✅)

---

## ✅ FILES IN YOUR FOLDER (Tourism-)

| File | Page |
|------|------|
| index.html | 🏠 Home Page |
| places.html | 🌍 Places / Packages |
| form.html | 📋 Booking Form + Validation |
| about.html | ℹ️ About Us (Video + Audio) |
| details.html | 📄 Terms & Details |
| discount.html | 🎁 Discount Game |
| menu.html | 🍽️ Food Menu (DOM events) |
| App.jsx | ⚛️ React Todo (separate setup) |

---

## 🚀 HOW TO RUN (3 Methods)

### Method 1 — Direct Open (Easiest, no install needed)
1. Open your **Tourism-** folder in File Explorer
2. Double-click **index.html**
3. It opens in your browser
4. Use the nav bar to go to other pages — all links work!

---

### Method 2 — VS Code Live Server (Best for development)
1. Open the **Tourism-** folder in VS Code
2. Install the **Live Server** extension (if not installed):
   - Click Extensions icon (left sidebar)
   - Search: `Live Server`
   - Click Install (by Ritwick Dey)
3. Right-click `index.html` → click **"Open with Live Server"**
4. Browser opens at: `http://127.0.0.1:5500/index.html`
5. All pages work perfectly ✅

---

### Method 3 — Python (if you have Python installed)
Open terminal in your Tourism- folder and run:
```bash
# Python 3
python -m http.server 8000

# Then open browser at:
# http://localhost:8000/index.html
```

---

## 📁 MEDIA FILES (optional)
If you want audio/video to work in about.html and details.html:
- Copy `indian-279735.mp3` → rename to `indian.mp3` → put in **Tourism-** folder
- Copy `videoplayback.mp4` → put in **Tourism-** folder

They are already referenced as:
```html
<source src="indian.mp3">       ← about.html
<source src="videoplayback.mp4"> ← details.html
```

---

## ⚛️ React App (App.jsx — Ex 09)
This needs a separate React project setup:
```bash
# Step 1: Create React project (run once)
npm create vite@latest tourism-react -- --template react
cd tourism-react

# Step 2: Replace src/App.jsx with your App.jsx file

# Step 3: Run
npm install
npm run dev

# Opens at: http://localhost:5173
```

---

## 🔗 Page Navigation Map
```
index.html (Home)
   ├── places.html      → BOOK TICKET → form.html
   ├── discount.html
   ├── menu.html
   ├── details.html
   └── about.html
```

All nav links connect every page to every other page ✅

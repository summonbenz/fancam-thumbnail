# Fancam Thumbnail Creator

A modern web app for creating custom fancam thumbnails! Upload your image, crop it, add a title, description, and location with flexible font and position options, preview your design live, and download a ready-to-use thumbnail.

## Features

- **Image Upload & Crop:** Upload any image and crop it to 1280x720 with a simple interface.
- **Text Overlays:**
  - Add a Title (custom font, size, and position)
  - Add a Description (custom font, size, and position)
  - Add a Location (custom font, size, and position, with 5px padding)
- **Font Selection:** Choose from popular Google Fonts.
- **Text Positioning:** Place each text at top-left, top-center, top-right, middle-left, middle-center, middle-right, bottom-left, bottom-center, or bottom-right.
- **Live Preview:** Instantly see your thumbnail as you edit.
- **Download:** Export your design as a PNG image, ready for upload or sharing.
- **Responsive UI:** Editor and preview are side-by-side on desktop, stacked on mobile.

## Getting Started

### Prerequisites
- Node.js (v16 or newer recommended)
- npm

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/summonbenz/fancam-thumbnail.git
   cd fancam-thumbnail
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
1. **Upload Image:** Click "Upload Image" and select your photo.
2. **Crop:** Adjust the crop area to your liking (aspect ratio is locked to 1280x720).
3. **Edit Texts:**
   - Enter your Title, Description, and Location.
   - Choose fonts and positions for each text.
4. **Preview:** See your design update live on the right.
5. **Download:** Click "Generate Thumbnail" to download your finished image.

## Customization
- Change font, size, and position for each text overlay.
- Location text uses a fixed 5px padding from the edge for a clean look.
- All text has a drop shadow for visibility.

## License
MIT

---

**Fancam Thumbnail Creator** — Make your fancam stand out!

# Images Directory

This directory contains images used in the main README.md file.

## Image Guidelines

### Supported Formats
- PNG (recommended for screenshots and logos)
- JPG/JPEG (for photos)
- SVG (for diagrams and icons)
- GIF (for animations)

### Image Naming Convention
Use descriptive, lowercase names with hyphens:
- `logo.png`
- `dashboard-screenshot.png`
- `annotated-sample.png`
- `team-arun.jpg`

### Image Sizes
- **Logos**: 200-400px width
- **Screenshots**: 800-1200px width
- **Team photos**: 150-300px width
- **Diagrams**: 600-1000px width

### How to Add Images to README

1. **Basic Image Syntax:**
   ```markdown
   ![Alt text](./images/image-name.png)
   ```

2. **Image with Link:**
   ```markdown
   [![Alt text](./images/image-name.png)](https://link-url.com)
   ```

3. **Centered Image:**
   ```markdown
   <div align="center">
     <img src="./images/image-name.png" alt="Description" width="600"/>
     <p><em>Caption text</em></p>
   </div>
   ```

4. **Image with Custom Size:**
   ```markdown
   <img src="./images/image-name.png" alt="Description" width="400" height="300"/>
   ```

5. **Image in Table:**
   ```markdown
   | Image | Description |
   |-------|-------------|
   | ![Alt](./images/img1.png) | Description 1 |
   | ![Alt](./images/img2.png) | Description 2 |
   ```

## Required Images

Based on the README structure, consider adding:

- `logo.png` - Project logo
- `dashboard.png` - Main dashboard screenshot
- `annotated-sample.png` - Example of annotated rock sample
- `segmented-regions.png` - Mineral segmentation example
- `analysis-charts.png` - Charts and visualizations
- `ui-screenshot.png` - UI overview
- `homepage.png` - Homepage screenshot
- `upload-page.png` - Upload interface
- `pdf-report.png` - PDF report example
- `architecture.png` - System architecture diagram
- `awards.png` - Hackathon awards/trophies
- `arun.jpg` - Team member photo
- `shaurya.jpg` - Team member photo
- `karan.jpg` - Team member photo

## Tips

- Optimize images before adding (use tools like TinyPNG or ImageOptim)
- Keep file sizes reasonable (< 1MB for most images)
- Use descriptive alt text for accessibility
- Consider using relative paths for portability

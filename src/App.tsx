import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Container, TextField, Button, Typography, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Google Fonts options
const FONT_OPTIONS = [
  { name: 'Chonburi', value: 'Chonburi' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Lato', value: 'Lato' },
];

const POSITION_OPTIONS = [
  { label: 'Top Left', value: 'top-left' },
  { label: 'Top Center', value: 'top-center' },
  { label: 'Top Right', value: 'top-right' },
  { label: 'Middle Left', value: 'middle-left' },
  { label: 'Middle Center', value: 'middle-center' },
  { label: 'Middle Right', value: 'middle-right' },
  { label: 'Bottom Left', value: 'bottom-left' },
  { label: 'Bottom Center', value: 'bottom-center' },
  { label: 'Bottom Right', value: 'bottom-right' },
];

// Helper to get a centered crop with the correct aspect ratio
function getCenteredAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90, // Start with 90% of the image width
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFont, setSelectedFont] = useState('Chonburi');
  const [textPosition, setTextPosition] = useState('bottom-left');
  const [locationPosition, setLocationPosition] = useState('top-center');
  const [locationFont, setLocationFont] = useState('Poppins');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Set crop to centered aspect crop when image loads
  const onImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const aspect = 1280 / 720;
    const crop = getCenteredAspectCrop(img.naturalWidth, img.naturalHeight, aspect);
    setCrop(crop);
  };

  const updatePreview = useCallback(() => {
    if (imageRef.current && previewCanvasRef.current && crop.width && crop.height) {
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      
      // Set canvas size to match the preview container while maintaining aspect ratio
      const containerWidth = canvas.parentElement?.clientWidth || 800;
      const aspectRatio = 1280 / 720;
      canvas.width = containerWidth;
      canvas.height = containerWidth / aspectRatio;

      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image
        ctx.drawImage(
          imageRef.current,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        // Add text
        ctx.fillStyle = 'white';
        const titleFontSize = canvas.width * 0.0625;
        const descFontSize = canvas.width * 0.031;
        ctx.font = `bold ${titleFontSize}px ${selectedFont}`;
        let align: CanvasTextAlign = 'left';
        if (textPosition.endsWith('center')) align = 'center';
        if (textPosition.endsWith('right')) align = 'right';
        ctx.textAlign = align;
        const { x, yTitle, yDesc } = getTextCoords(textPosition, canvas, titleFontSize, descFontSize);
        ctx.fillText(title, x, yTitle);
        ctx.font = `${descFontSize}px ${selectedFont}`;
        ctx.fillText(description, x, yDesc);
        // Draw location if present
        if (location) {
          let align3: CanvasTextAlign = 'left';
          if (locationPosition.endsWith('center')) align3 = 'center';
          if (locationPosition.endsWith('right')) align3 = 'right';
          ctx.textAlign = align3;
          ctx.font = `${descFontSize}px ${locationFont}`;
          const { x: x3, yTitle: y3 } = getTextCoords(locationPosition, canvas, titleFontSize, descFontSize, true);
          ctx.fillText(location, x3, y3);
        }
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    }
  }, [crop, title, description, selectedFont, textPosition, location, locationPosition, locationFont]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const handleCropComplete = (crop: Crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(
          imageRef.current,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          1280,
          720
        );

        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        // Add text
        ctx.fillStyle = 'white';
        const titleFontSize = 80;
        const descFontSize = 40;
        ctx.font = 'bold 80px ' + selectedFont;
        let align: CanvasTextAlign = 'left';
        if (textPosition.endsWith('center')) align = 'center';
        if (textPosition.endsWith('right')) align = 'right';
        ctx.textAlign = align;
        const { x, yTitle, yDesc } = getTextCoords(textPosition, canvas, titleFontSize, descFontSize);
        ctx.fillText(title, x, yTitle);
        ctx.font = '40px ' + selectedFont;
        ctx.fillText(description, x, yDesc);
        // Draw location if present
        if (location) {
          let align3: CanvasTextAlign = 'left';
          if (locationPosition.endsWith('center')) align3 = 'center';
          if (locationPosition.endsWith('right')) align3 = 'right';
          ctx.textAlign = align3;
          ctx.font = '40px ' + locationFont;
          const { x: x3, yTitle: y3 } = getTextCoords(locationPosition, canvas, titleFontSize, descFontSize, true);
          ctx.fillText(location, x3, y3);
        }
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'thumbnail.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      }
    }
  };

  // Helper to get text coordinates based on position
  function getTextCoords(position: string, canvas: HTMLCanvasElement, titleFontSize: number, descFontSize: number, isLocation = false) {
    const paddingX = isLocation ? 0 : canvas.width * 0.05;
    const paddingY = isLocation ? 0 : canvas.height * 0.05;
    let x, yTitle, yDesc;
    switch (position) {
      case 'top-left':
        x = paddingX;
        yTitle = paddingY + titleFontSize;
        yDesc = yTitle + descFontSize + 10;
        break;
      case 'top-center':
        x = canvas.width / 2;
        yTitle = paddingY + titleFontSize;
        yDesc = yTitle + descFontSize + 10;
        break;
      case 'top-right':
        x = canvas.width - paddingX;
        yTitle = paddingY + titleFontSize;
        yDesc = yTitle + descFontSize + 10;
        break;
      case 'middle-left':
        x = paddingX;
        yTitle = canvas.height / 2 - descFontSize / 2;
        yDesc = yTitle + descFontSize + 10;
        break;
      case 'middle-center':
        x = canvas.width / 2;
        yTitle = canvas.height / 2 - descFontSize / 2;
        yDesc = yTitle + descFontSize + 10;
        break;
      case 'middle-right':
        x = canvas.width - paddingX;
        yTitle = canvas.height / 2 - descFontSize / 2;
        yDesc = yTitle + descFontSize + 10;
        break;
      case 'bottom-left':
        x = paddingX;
        yDesc = canvas.height - paddingY;
        yTitle = yDesc - descFontSize - 10;
        break;
      case 'bottom-center':
        x = canvas.width / 2;
        yDesc = canvas.height - paddingY;
        yTitle = yDesc - descFontSize - 10;
        break;
      case 'bottom-right':
        x = canvas.width - paddingX;
        yDesc = canvas.height - paddingY;
        yTitle = yDesc - descFontSize - 10;
        break;
      default:
        x = paddingX;
        yDesc = canvas.height - paddingY;
        yTitle = yDesc - descFontSize - 10;
    }
    return { x, yTitle, yDesc };
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Fancam Thumbnail Creator
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Editor Box */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button variant="contained" component="span" fullWidth>
                  Upload Image
                </Button>
              </label>
            </Paper>

            {image && (
              <>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    aspect={1280/720}
                  >
                    <img
                      ref={imageRef}
                      src={image}
                      alt="Upload"
                      style={{ maxWidth: '100%' }}
                      onLoad={onImageLoaded}
                    />
                  </ReactCrop>
                </Paper>

                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Font Family</InputLabel>
                    <Select
                      value={selectedFont}
                      label="Font Family"
                      onChange={(e) => setSelectedFont(e.target.value)}
                    >
                      {FONT_OPTIONS.map((font) => (
                        <MenuItem key={font.value} value={font.value}>
                          {font.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Text Position</InputLabel>
                    <Select
                      value={textPosition}
                      label="Text Position"
                      onChange={(e) => setTextPosition(e.target.value)}
                    >
                      {POSITION_OPTIONS.map((pos) => (
                        <MenuItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    margin="normal"
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Location Position</InputLabel>
                    <Select
                      value={locationPosition}
                      label="Location Position"
                      onChange={(e) => setLocationPosition(e.target.value)}
                    >
                      {POSITION_OPTIONS.map((pos) => (
                        <MenuItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Location Font</InputLabel>
                    <Select
                      value={locationFont}
                      label="Location Font"
                      onChange={(e) => setLocationFont(e.target.value)}
                    >
                      {FONT_OPTIONS.map((font) => (
                        <MenuItem key={font.value} value={font.value}>
                          {font.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleCropComplete(crop)}
                >
                  Generate Thumbnail
                </Button>
              </>
            )}
          </Box>

          {/* Preview Box */}
          {image && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Paper elevation={3} sx={{ p: 3, mb: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Preview
                </Typography>
                <Box sx={{ width: '100%', overflow: 'hidden' }}>
                  <canvas
                    ref={previewCanvasRef}
                    style={{
                      width: '100%',
                      height: 'auto',
                      backgroundColor: '#000',
                      display: 'block',
                    }}
                  />
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default App;

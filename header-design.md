# Wind Surf Prompt: Style BugSentinel Header

## Context
My project is called **BugSentinel**, with a futuristic dark theme inspired by Marvel’s Sentinel.  
I already defined a theme color palette with deep purples, steel gray, dark indigo, red for errors, amber for warnings, and green for success.

## Task
Style my application **header** so it matches the BugSentinel theme.

## Requirements

1. **Header Layout**
   - On the left: App title **"BugSentinel"** (styled in deep purple accent).
   - In the center: **Tile-style navigation links** (e.g. Home, Snippets, Dashboard).
   - On the right: **Dark/Light mode toggle switch**.

2. **Design Style**
   - **Background:** Dark indigo (`rgb(25, 20, 45)`) in dark mode, light steel gray (`rgb(240, 240, 245)`) in light mode.
   - **Navigation Tiles:**
     - Use **medium purple (`rgb(75, 40, 110)`)** for inactive state.
     - On hover: subtle glow using **soft violet (`rgb(160, 120, 200)`)**.
     - Active link: **accent purple (`rgb(120, 70, 160)`)** with a glowing underline.
   - **Toggle Switch:**
     - Styled as a futuristic slider or button.
     - Purple glow when active (dark mode), neutral gray when inactive (light mode).

3. **Behavior**
   - Navigation should not reload the page (SPA links).
   - Dark/Light toggle updates the theme dynamically across the app.
   - Header should be responsive and adapt to smaller screens.

## Deliverables
- Complete **React component code** for the styled Header.
- Include **CSS (or CSS-in-JS) theme styles** using the BugSentinel color palette.
- Ensure theme toggle switches all relevant colors (dark ↔ light).

---
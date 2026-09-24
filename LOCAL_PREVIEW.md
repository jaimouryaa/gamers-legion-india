# Preview the updated activation page locally

This project contains the new **Level Up: How Your Game Gets Activated** section on the Proof page. It replaces the platform accordion shown in your screenshot. The attached logo is used as the browser favicon and as a soft watermark behind the homepage hero text. The site follows your device's light or dark setting automatically, with black and neutral charcoal surfaces in dark mode while keeping its colored gradients and animations.

The homepage hero now has arcade-style grid, logo, gradient-text, and button motion. The activation cards reveal in order as you scroll to them, and their borders glow on hover. The activation wording is unchanged. Motion is reduced automatically when your device requests reduced animation.


Homepage feature tiles, games, bundles, deals, recent additions, proof, promotion, and closing sections also animate into view, with hover effects on cards and buttons.

The navbar uses the supplied Gamers Legion India wordmark, with its black image background made transparent to match either system theme, and simple action buttons for Search, Wishlist, Cart, Account, and Menu. The action buttons have clear hover, focus, and press states; the active link has a quiet background highlight.

## Windows (PowerShell)

1. Extract the ZIP to a folder on your computer.
2. Open PowerShell in the extracted `gamers-legion-india` folder (the folder containing `package.json`).
3. Run:

   ```powershell
   npm install
   npm run dev
   ```

4. Open **http://localhost:3000/** to see the faded logo behind the homepage text and the icon in your browser tab. Open **http://localhost:3000/proof** and scroll past “Recent deliveries” to see the activation section.

You need Node.js and npm installed. You do **not** need Supabase credentials just to preview the public page; without them, the site uses its demo data. Stop the server with **Ctrl+C**.

If port 3000 is already in use, Next.js may choose 3001. Use the localhost URL printed in PowerShell and add `/proof`.

If the browser still shows an older favicon, refresh without cache (Ctrl+Shift+R) or open the site in a private window.

The ZIP excludes dependencies and build files, so `npm install` is necessary after extraction. It contains no environment secrets.

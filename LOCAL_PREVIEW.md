# Preview the updated activation page locally

This project contains the new **Level Up: How Your Game Gets Activated** section on the Proof page. It replaces the platform accordion shown in your screenshot.

## Windows (PowerShell)

1. Extract the ZIP to a folder on your computer.
2. Open PowerShell in the extracted `gamers-legion-india` folder (the folder containing `package.json`).
3. Run:

   ```powershell
   npm install
   npm run dev
   ```

4. Open **http://localhost:3000/proof** in your browser. Scroll past “Recent deliveries” to see the new section.

You need Node.js and npm installed. You do **not** need Supabase credentials just to preview the public page; without them, the site uses its demo data. Stop the server with **Ctrl+C**.

If port 3000 is already in use, Next.js may choose 3001. Use the localhost URL printed in PowerShell and add `/proof`.

The ZIP excludes dependencies and build files, so `npm install` is necessary after extraction. It contains no environment secrets.

# Portable portfolio pack

The Berea portfolio screenshots are available to other workspaces at:

https://beriabooks.vercel.app/downloads/Berea-Portfolio-Pack.zip

The archive is also tracked at `public/downloads/Berea-Portfolio-Pack.zip`, so a checkout of this repository includes it.

To download and verify it from another workspace:

```sh
curl -fL https://beriabooks.vercel.app/downloads/Berea-Portfolio-Pack.zip -o Berea-Portfolio-Pack.zip
curl -fL https://beriabooks.vercel.app/downloads/Berea-Portfolio-Pack.sha256 -o Berea-Portfolio-Pack.sha256
sha256sum -c Berea-Portfolio-Pack.sha256
unzip Berea-Portfolio-Pack.zip
```

The pack contains 21 application screenshots at 2× resolution, four 3200 × 2000 presentation boards, a four-page PDF, editable HTML layouts, and case-study copy. Member and circulation records are fictional. Its README and case-study document explain the capture source and limits.

Vite copies `public/downloads` into the production build. Vercel excludes downloads from the application rewrite and serves the ZIP with an attachment filename and ZIP content type.

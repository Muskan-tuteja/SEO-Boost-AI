import { chromium } from "playwright";

export async function scrapeUrl(url) {
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
    });

    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(30000);

    const startTime = Date.now();

    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    const loadTime = Date.now() - startTime;

    await page.waitForTimeout(2000);

    const scrapedData = await page.evaluate(() => {
      const getMeta = (name) => {
        const el =
          document.querySelector(`meta[name="${name}"]`) ||
          document.querySelector(`meta[property="${name}"]`);

        return el ? el.getAttribute("content") || "" : "";
      };

      const title = document.title || "";
      const description = getMeta("description");
      const canonical =
        document.querySelector('link[rel="canonical"]')?.href || "";

      const robots = getMeta("robots");
      const ogTitle = getMeta("og:title");
      const ogDescription = getMeta("og:description");
      const ogImage = getMeta("og:image");
      const twitterCard = getMeta("twitter:card");
      const viewport = getMeta("viewport");
      const charset =
        document.querySelector("meta[charset]")?.getAttribute("charset") || "";

      const h1Texts = [...document.querySelectorAll("h1")].map((e) =>
        e.textContent?.trim() || ""
      );

      const headings = {
        h1: document.querySelectorAll("h1").length,
        h2: document.querySelectorAll("h2").length,
        h3: document.querySelectorAll("h3").length,
        h4: document.querySelectorAll("h4").length,
        h5: document.querySelectorAll("h5").length,
        h6: document.querySelectorAll("h6").length,
        h1Texts,
      };

      const allLinks = [...document.querySelectorAll("a[href]")];
      const host = window.location.hostname;

      let internal = 0;
      let external = 0;

      allLinks.forEach((link) => {
        try {
          if (
            link.href.startsWith("mailto:") ||
            link.href.startsWith("tel:")
          )
            return;

          const u = new URL(link.href);

          if (u.hostname === host) internal++;
          else external++;
        } catch {}
      });

      const allImages = [...document.querySelectorAll("img")];

      const missingAlt = allImages.filter(
        (img) => !img.alt || img.alt.trim() === ""
      ).length;

      const bodyText =
        document.body?.innerText ||
        document.body?.textContent ||
        "";

      const cleanText = bodyText.replace(/\s+/g, " ").trim();

      const wordCount = cleanText
        ? cleanText.split(" ").length
        : 0;

      const pageSize = document.documentElement.outerHTML.length;

      return {
        metaData: {
          title,
          description,
          canonical,
          robots,
          ogTitle,
          ogDescription,
          ogImage,
          twitterCard,
          viewport,
          charset,
        },

        headings,

        links: {
          internal,
          external,
          total: allLinks.length,
        },

        images: {
          total: allImages.length,
          missingAlt,
          withAlt: allImages.length - missingAlt,
        },

        wordCount,

        pageSize,

        bodyText: cleanText.substring(0, 3000),
      };
    });

    await browser.close();

    return {
      success: true,
      data: {
        ...scrapedData,
        loadTime,
        statusCode: response?.status() || 0,
        url,
      },
    };
  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }

    return {
      success: false,
      error: error.message,
    };
  }
}
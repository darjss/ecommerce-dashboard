"use server";

import { load } from "cheerio";
import { AmazonProductImages, AmazonScrapeProduct } from "@/utils/types";

const fetchWithRetry = async (
  url: string,
  headers: Record<string, string>,
  maxRetries: number = 3,
  timeoutMs: number = 30000,
): Promise<string> => {
  // Helper function to wrap fetch with a timeout
  const fetchWithTimeout = (
    url: string,
    options: RequestInit,
    timeoutMs: number,
  ): Promise<Response> => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(
        () => reject(new Error("Request timed out")),
        timeoutMs,
      );

      fetch(url, options)
        .then((response) => {
          clearTimeout(timeoutId); // Clear timeout when request is done
          resolve(response);
        })
        .catch((error) => {
          clearTimeout(timeoutId); // Clear timeout when error occurs
          reject(error);
        });
    });
  };

  // Retry mechanism
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetchWithTimeout(url, { headers }, timeoutMs);

      // Ensure the response is returned as text for HTML parsing
      const responseText = await response.text();
      return responseText;
    } catch (error: unknown) {
      console.warn(
        `Attempt ${i + 1} failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      if (i === maxRetries - 1) {
        throw error; // Rethrow error if max retries reached
      }
      // Random wait before retrying (between 2 to 5 seconds)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * (5000 - 2000) + 2000),
      );
    }
  }

  throw new Error("Max retries reached");
};

export const getTopSearchResults = async (
  searchTerm: string,
  numResults: number = 5,
): Promise<AmazonScrapeProduct[]> => {
  if (!searchTerm) {
    throw new Error("Search term is required");
  }

  try {
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}`;
    console.log(`Fetching search results from: ${searchUrl}`);

    const headers = {
      Host: "www.amazon.com",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,image/png,image/svg+xml,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      Referer: "https://www.amazon.com/",
      DNT: "1",
      "Sec-GPC": "1",
      Connection: "keep-alive",
      Cookie:
        "csm-sid=509-9498768-9147133; x-amz-captcha-1=1729076970555727; x-amz-captcha-2=N8WYSdKBdPAwJ3rShy5LNg==; session-id=138-4136226-8581051; session-id-time=2082787201l; i18n-prefs=USD; skin=noskin; ubid-main=134-4294147-9195068; JSESSIONID=319CB9E0F747B8AF767A3336CB117A63; session-token=PTJfwA4HDVrHYfrekwR/ohtivMZoPhB4r8DPM4KQJiypwLi6n99OpXpoNGWdJyvNxE7zywOTog4h+7GxPt8K1ID7CCI1Qy2JoLsw0rSKnUrgs+5Lf2uh7vamJmbFkchKu2KcgUhtH0hRf/N2qnQ9PseEAOQP58SXlosJzvdCWcr9sKcWCowwXclKePvxJ+xWy30Nrzgg9KTpJABLf+Q9Jj8gygwmWRj54IsDF/ZcNdXo4M6qJjHWw+S+p95WerwwpyypQATCzvmE9OHvRdmM6LmE3A75RHEujNpFcFF2g5vhAvvSDhwSGA2jkDyXty8+zlYoh29LATUytUxG0YUQMqaPjPN88/79; csm-hit=tb:s-M7GRQT9KK24S7P64K0JY|1729070405647&t:1729070405968&adb:adblk_no",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      Priority: "u=0, i",
    };

    const searchResponse = await fetchWithRetry(searchUrl, headers);
    const $search = load(searchResponse);

    const results: AmazonScrapeProduct[] = [];

    $search(".s-main-slot .s-result-item").each((index, element) => {
      if (index >= numResults) return false;

      const $element = $search(element);
      const link = $element.find(".a-link-normal.s-no-outline").attr("href");
      const name = $element.find("h2 .a-text-normal").text().trim();
      const thumbnailUrl = $element.find("img.s-image").attr("src");

      if (link && name && thumbnailUrl) {
        results.push({
          productUrl: `https://www.amazon.com${link}`,
          productName: name,
          thumbnailUrl: thumbnailUrl.replace(/\._AC_US\d+_\./, "._AC_SL1500_."), // Request a higher quality image
        });
      }
    });

    console.log(`Found ${results.length} search results`);
    return results;
  } catch (error: unknown) {
    console.error(
      `Error while fetching search results: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    throw error;
  }
};

export const scrapeProductImages = async (
  productUrl: string,
): Promise<AmazonProductImages> => {
  try {
    console.log(`Scraping product images from: ${productUrl}`);

    const headers = {
      Host: "www.amazon.com",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,image/png,image/svg+xml,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      Referer: "https://www.amazon.com/",
      DNT: "1",
      "Sec-GPC": "1",
      Connection: "keep-alive",
      Cookie:
        "csm-sid=440-9292188-2387355; x-amz-captcha-1=1728214838349556; x-amz-captcha-2=9ceyYdWytbxgUr1lHvQVww==; session-id=134-3864391-8956557; session-id-time=2082787201l; i18n-prefs=USD; skin=noskin; ubid-main=132-1039015-3369116; session-token=Af6m+pHU6rZ1vI0IRwyCF6BVFsjyOACtM+hd6L1zc+3nQYV9sjsfWAOgZP5LnMahTUswFUQKcNnW84rIb92jVvfIqPwTE4rCvoRxW1ap/TYhDdJdo2KEFw7b+UUlJljBSJlhnRQlglJCxzGmQcNMthIUV+1fXFSuMIYj/sP1bulSV5nLvaAYzAATcLvBi4B/fhr0hSC7TNKi1lCBFbTzLOVIIUP8TnO51l1Rc9x47o4KkCq7GUW5pmN9ACHlj8zdiYjm2LioWb4jZ8kwjGP2U5/p9/2GTHd8SVkcjSts9B/ub5+TJaM7LEuWK2d9muNBlhbZcYs8cqs5AE8TBwwrge/VKhtj09nE; csm-hit=tb:SCMSNQSWE1WY2H43WQVH+s-VHZ4PTX9CPFRY5X9ZA60|1728207672472&t:1728207672472&adb:adblk_no",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      Priority: "u=0, i",
    };

    const productResponse = await fetchWithRetry(productUrl, headers);
    const $product = load(productResponse);

    const allImages: string[] = [];

    // Function to upgrade image quality
    const upgradeImageUrl = (url: string): string => {
      return url
        .replace(/\._AC_.*?\./, "._AC_SL1500_.") // Replace size specifier with high quality
        .replace(/\/I\/.*?-/, "/I/") // Remove any additional size indicators
        .replace(/\._SL\d+_/, "._SL1500_") // Replace SL size with 1500
        .replace(/\._SR\d+,\d+_/, ""); // Remove SR size completely
    };

    // Get high-quality images from the product page
    $product('script[type="application/json"]').each((_, element) => {
      const scriptContent = $product(element).html();
      if (scriptContent && scriptContent.includes('"colorImages"')) {
        try {
          const jsonData = JSON.parse(scriptContent);
          const colorImages = jsonData.colorImages?.initial || [];
          colorImages.forEach(
            (img: { hiRes?: string; large?: string; variant?: string }) => {
              if (img.hiRes) {
                allImages.push(upgradeImageUrl(img.hiRes));
              } else if (img.large) {
                allImages.push(upgradeImageUrl(img.large));
              } else if (img.variant) {
                allImages.push(upgradeImageUrl(img.variant));
              }
            },
          );
        } catch (e) {
          console.error("Error parsing JSON data:", e);
        }
      }
    });

    // Fallback to traditional image scraping if no images found
    if (allImages.length === 0) {
      $product("#altImages img, #imageBlock img").each((_, element) => {
        const src = $product(element).attr("src");
        if (src) {
          allImages.push(upgradeImageUrl(src));
        }
      });
    }

    // Additional fallback for 'data-old-hires' attribute
    if (allImages.length === 0) {
      $product("img[data-old-hires]").each((_, element) => {
        const src = $product(element).attr("data-old-hires");
        if (src) {
          allImages.push(upgradeImageUrl(src));
        }
      });
    }

    // Remove duplicates and filter out any remaining small images
    const uniqueImages = [...new Set(allImages)].filter(
      (url) => !url.includes("._SR38,50_"),
    );

    if (uniqueImages.length === 0) {
      throw new Error("No high-quality images found");
    }

    console.log(
      `Found ${uniqueImages.length} unique high-quality images for the product`,
    );

    return {
      mainImageUrl: uniqueImages[0] as string,
      additionalImages: uniqueImages.slice(1),
    };
  } catch (error: unknown) {
    console.error(
      `Error while scraping product images: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    throw error;
  }
};

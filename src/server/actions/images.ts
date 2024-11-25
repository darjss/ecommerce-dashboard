"use server";

import { load } from "cheerio";
import { AmazonProductDetails, AmazonScrapeProduct } from "@/utils/types";
import { headers } from "@/utils/constants";

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
          clearTimeout(timeoutId);
          resolve(response);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  };

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetchWithTimeout(url, { headers }, timeoutMs);
      const responseText = await response.text();
      return responseText;
    } catch (error: unknown) {
      console.warn(
        `Attempt ${i + 1} failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      if (i === maxRetries - 1) {
        throw error;
      }
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * (5000 - 2000) + 2000),
      );
    }
  }

  throw new Error("Max retries reached");
};

// New function to process and upgrade image URLs
const processImageUrl = (url: string): string | null => {
  console.log("Processing image URL:", url)
  if (!url) return null;

  // Remove any existing size constraints and quality modifiers
  let processedUrl = url
    .replace(/\._[^.]*(\.[^.]+)$/, '$1') // Remove all modifiers after the last dot before extension
    .replace(/\._.*?_\./, '.') // Remove any remaining modifiers
    .replace(/\._(SR|SX|SY|CR|AC_US)\d+.*?\./, '.') // Remove size constraints
    .replace(/,\d+,\d+/, '') // Remove dimensions in URLs
    .replace(/._\d+_$/, ''); // Remove trailing size indicators

  // Extract the base URL up to the image ID
  const baseUrlMatch = processedUrl.match(/(.*\/images\/I\/[A-Za-z0-9]+)/);
  if (!baseUrlMatch) return null;

  // Add high quality modifier
  return `${baseUrlMatch[1]}._AC_SL1500_.jpg`;
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
        const processedThumbnail = processImageUrl(thumbnailUrl);
        if (processedThumbnail) {
          results.push({
            productUrl: `https://www.amazon.com${link}`,
            productName: name,
            thumbnailUrl: processedThumbnail,
          });
        }
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

export const scrapeProductDetails = async (
  productUrl: string,
): Promise<AmazonProductDetails> => {
  try {
    console.log(`Scraping product details from: ${productUrl}`);

    const productResponse = await fetchWithRetry(productUrl, headers);
    const $product = load(productResponse);

    const productName = $product('#productTitle').text().trim();

    let price = $product('.a-price .a-offscreen').first().text().trim() ||
                $product('#priceblock_ourprice').text().trim() ||
                $product('#priceblock_dealprice').text().trim() ||
                $product('.a-price-whole').first().text().trim() ||
                'Price not available';

    const descriptionBullets: string[] = [];
    $product('#feature-bullets .a-list-item').each((_, element) => {
      const bulletText = $product(element).text().trim();
      if (bulletText) {
        descriptionBullets.push(bulletText);
      }
    });

    const allImages = new Set<string>();

    // Try to get images from the color variations script
    $product('script[type="application/json"]').each((_, element) => {
      const scriptContent = $product(element).html();
      if (scriptContent && scriptContent.includes('"colorImages"')) {
        try {
          const jsonData = JSON.parse(scriptContent);
          const colorImages = jsonData.colorImages?.initial || [];
          colorImages.forEach(
            (img: { hiRes?: string; large?: string; variant?: string }) => {
              const processedUrl = processImageUrl(img.hiRes || img.large || img.variant || "");
              if (processedUrl) {
                allImages.add(processedUrl);
              }
            },
          );
        } catch (e) {
          console.error("Error parsing JSON data:", e);
        }
      }
    });

    // Fallback: Get images from the main product images section
    if (allImages.size === 0) {
      // Check for the landing image first
      const landingImage = $product('#landingImage').attr('data-old-hires') || 
                          $product('#landingImage').attr('src');
      if (landingImage) {
        const processedUrl = processImageUrl(landingImage);
        if (processedUrl) allImages.add(processedUrl);
      }

      // Then check alternate images
      $product('#altImages img').each((_, element) => {
        const src = $product(element).attr('src') ||
                   $product(element).attr('data-old-hires') ||
                   $product(element).attr('data-a-dynamic-image');
        
        if (src) {
          const processedUrl = processImageUrl(src);
          if (processedUrl) allImages.add(processedUrl);
        }
      });
    }

    // Final fallback: Check for any other product images
    if (allImages.size === 0) {
      $product('img[data-old-hires], img[data-a-dynamic-image]').each((_, element) => {
        const src = $product(element).attr('data-old-hires') ||
                   $product(element).attr('data-a-dynamic-image') ||
                   $product(element).attr('src');
        
        if (src) {
          const processedUrl = processImageUrl(src);
          if (processedUrl) allImages.add(processedUrl);
        }
      });
    }

    const uniqueImages = [...allImages];

    if (uniqueImages.length === 0) {
      throw new Error("No high-quality images found");
    }

    console.log(
      `Found ${uniqueImages.length} unique high-quality images for the product`,
    );
    console.log(descriptionBullets)
    console.log(uniqueImages);
    return {
      productName,
      price,
      description: descriptionBullets,
      mainImageUrl: uniqueImages[0],
      additionalImages: uniqueImages.slice(1),
    };
  } catch (error: unknown) {
    console.error(
      `Error while scraping product details: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    throw error;
  }
};
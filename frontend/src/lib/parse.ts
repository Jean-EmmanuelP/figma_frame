export function extractSizeFromCode(html: string): { width: number; height: number } | null {
  // Cherche style="...width:NNNpx;height:MMMpx;"
  const widthHeightMatch = html.match(/style="[^"]*width:\s*([0-9.]+)px;[^"]*height:\s*([0-9.]+)px;?/);
  if (widthHeightMatch) {
    return { 
      width: parseFloat(widthHeightMatch[1]), 
      height: parseFloat(widthHeightMatch[2]) 
    };
  }

  // Essaye de chercher séparément width et height
  const widthMatch = html.match(/width:\s*([0-9.]+)px/);
  const heightMatch = html.match(/height:\s*([0-9.]+)px/);
  
  if (widthMatch && heightMatch) {
    return {
      width: parseFloat(widthMatch[1]),
      height: parseFloat(heightMatch[1])
    };
  }

  // Fallback: cherche dans les attributs width/height
  const widthAttrMatch = html.match(/width="([0-9.]+)"/);
  const heightAttrMatch = html.match(/height="([0-9.]+)"/);
  
  if (widthAttrMatch && heightAttrMatch) {
    return {
      width: parseFloat(widthAttrMatch[1]),
      height: parseFloat(heightAttrMatch[1])
    };
  }

  return null;
}
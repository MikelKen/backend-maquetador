import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GeminiResponse } from './dto/gemini-response.dto';

@Injectable()
export class GeminiService {
  private readonly apiKey = process.env.GEMINI_API_KEY;
  private readonly geminiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

  constructor(private readonly httpService: HttpService) {}

  async generateHTMLFromImage(imageBase64: string): Promise<string> {
    const prompt = `You are a senior frontend developer. I will provide you with a screenshot of a user interface (like an invoice or billing system). Your task is to generate a clean and professional HTML layout with inline CSS that **visually replicates the screenshot EXACTLY** as shown, optimized for use in GrapesJS.

 MUST MATCH THE DESIGN STRUCTURE from the screenshot:

- 3 main sections aligned horizontally:
  - **Client Information and Product list**
  - **Invoice detail table with red buttons**
  - **Invoice summary table with yellow button**

 STRICT REQUIREMENTS:

1. Wrap everything inside a single <div> (this is the GrapesJS root).
2. Do NOT include <html>, <head>, or <body> tags.
3. Use **only inline CSS styles** (no Tailwind, Bootstrap, or external CSS).
4. Use **display: flex** to align sections side by side horizontally, exactly like the layout in the image.
5. Use <label> and <input> pairs for form fields (No°, NIT, Name).
6. Use <table> for all tabular data with proper borders, column headers, spacing, and row alignment.
7. Use consistent **padding, margins, and font size** to create a clean, readable UI.
8. Use subtle background color for headers or sections to separate them visually.
9. Use button styles to match the colors and size exactly as shown:
   - Red for "Quitar detalle" and "Limpiar detalles"
   - Green for "Agregar producto" and "Generar factura"
   - Yellow for "Mostrar detalle"
10. Wrap **all visible text** inside <span> or <div> so it’s editable in GrapesJS.
11. **Use flexbox or table layouts only**, no JavaScript or dynamic behavior.
12. Use clear visual alignment between labels and inputs.
13. Use **clean spacing** between sections (min. 10–20px).
14. The final layout must be visually and structurally identical to the screenshot provided.

 Focus especially on:
- Table header alignment.
- Consistent column widths.
- Uniform button sizes.
- Form inputs and labels aligned neatly in a column.

Final output:
\`\`\`html
<!-- Just the HTML inside a <div>, ready to be inserted into GrapesJS -->


    `;
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
            {
              inlineData: {
                mimeType: 'image/png',
                data: imageBase64.split(',')[1],
              },
            },
          ],
        },
      ],
    };

    const response = await firstValueFrom(
      this.httpService.post<GeminiResponse>(this.geminiEndpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }
}

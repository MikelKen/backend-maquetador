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
    const prompt = `You are a senior frontend developer and I will provide you with a screenshot of a user interface. Your task is to generate a professional, clean HTML layout with inline CSS, optimized for use in GrapesJS.

    Important styling and structure guidelines:

    1. Wrap everything inside a single <div> element (this will be the root).
    2. Do NOT include <html>, <head>, or <body> tags.
    3. Use only plain HTML and inline CSS (no external stylesheets or frameworks).
    4. Style the layout to look visually appealing, modern, and readable:
       - Use consistent padding and margin.
       - Use flexbox for layout positioning (e.g., headers, sidebars, forms).
       - Align labels and inputs neatly in forms.
       - Use subtle borders, spacing, and background colors for clarity.
       - Apply basic hover and button styling (with inline CSS).
    5. Use semantic HTML elements wherever appropriate:
       - <form>, <input>, <button>, <textarea>, <table>, <label>, <section>, etc.
    6. All content must be easily editable in GrapesJS:
       - Avoid hardcoded values inside <td>, <th>, or <div>.
       - Wrap all visible text inside <div> or <span> tags to make them editable.
    7. Keep the HTML structure simple, clear, and readable.
    8. Avoid JavaScript or dynamic behavior of any kind.
    9. Use modern font styling and layout alignment (e.g., font-size, color, line-height).
    10. Add sectioning and spacing for better visual grouping.

    Your output must be:
    \`\`\`html
    <!-- Only the HTML inside a <div>, ready to be inserted directly into GrapesJS -->
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

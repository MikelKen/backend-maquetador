import {
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeminiService } from './gemini.service';
import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';
import { UploadedImageFile } from './dto/uploadImageFile';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async generateHTMLFromImage(@UploadedFile() file: UploadedImageFile) {
    if (!file || !file.buffer || !file.mimetype) {
      throw new Error('Invalid or missing file');
    }

    const imageBase64 = file.buffer.toString('base64');
    const result = await this.geminiService.generateHTMLFromImage(
      `data:${file.mimetype};base64,${imageBase64}`,
    );
    return result;
  }
}

import { Controller, Get } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import * as path from 'path';

@Controller('scanner')
export class ScannerController {
  constructor(
    private readonly scannerService: ScannerService,
  ) {}

  @Get()
scan() {
  const repository = path.join(
    process.cwd(),
    'workspace',
    'Critiq-ai',
  );

  const files = this.scannerService
    .scanDirectory(repository)
    .slice(0, 5);

  return this.scannerService.readFiles(files);
}
}
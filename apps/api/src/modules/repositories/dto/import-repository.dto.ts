export class ImportRepositoryDto {
  name!: string;

  description?: string;

  githubUrl!: string;

  defaultBranch!: string;

  language?: string;

  visibility!: 'PUBLIC' | 'PRIVATE';
}
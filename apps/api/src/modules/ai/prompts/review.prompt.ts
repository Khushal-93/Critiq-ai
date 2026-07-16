export function buildReviewPrompt(
  code: string,
  language: string,
) {
  return `
You are an expert senior software engineer.

Review the following ${language} code.

Find:
- Bugs
- Security issues
- Performance issues
- Code smells
- Best practice violations

Return ONLY valid JSON.

{
  "summary": "",
  "issues": [
    {
      "severity": "LOW | MEDIUM | HIGH | CRITICAL",
      "category": "",
      "title": "",
      "description": "",
      "suggestion": ""
    }
  ]
}

Code:

${code}
`;
}
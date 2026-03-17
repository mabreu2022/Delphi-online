import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

async function callGemini(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Falha ao comunicar com o serviço de IA.");
    }
}

/**
 * Sends Delphi code to Gemini API to simulate compilation.
 * @param code The Delphi code to compile.
 * @returns A string with the simulated compilation result.
 */
export async function compileDelphiCode(code: string): Promise<string> {
  const prompt = `
    Aja como um compilador Delphi experiente (compilador Free Pascal). Analise o seguinte código Delphi em busca de erros de sintaxe e problemas potenciais. Não execute o código.
    Se o código estiver sintaticamente correto, responda APENAS com "Compilação bem-sucedida.".
    Se houver erros, liste-os com os números de linha e uma breve descrição do erro, de forma concisa, em português.

    Código a ser analisado:
    \`\`\`delphi
    ${code}
    \`\`\`
  `;
  return callGemini(prompt);
}

/**
 * Sends Delphi code to Gemini API to simulate execution.
 * @param code The Delphi code to run.
 * @returns A string with the simulated program output.
 */
export async function runDelphiCode(code: string): Promise<string> {
  const prompt = `
    Aja como um ambiente de execução Delphi (runtime). Execute o seguinte código Delphi e retorne APENAS a saída final que seria impressa no console.
    Não explique o código, não adicione comentários sobre a saída, apenas forneça a saída do programa como se ele tivesse sido executado. Se o programa não produzir saída, retorne uma string vazia.

    Código a ser executado:
    \`\`\`delphi
    ${code}
    \`\`\`
  `;
  return callGemini(prompt);
}

/**
 * Sends Delphi code to Gemini API to be formatted.
 * @param code The Delphi code to format.
 * @returns A string with the formatted code.
 */
export async function formatDelphiCode(code: string): Promise<string> {
    const prompt = `
      Aja como um formatador de código Delphi especialista. Reformate o código a seguir para seguir as melhores práticas de indentação, espaçamento e capitalização de palavras-chave (ex: 'Begin', 'End.').
      Retorne APENAS o código formatado, sem \`\`\`delphi ou qualquer outra explicação ou texto adicional.

      Código a ser formatado:
      \`\`\`delphi
      ${code}
      \`\`\`
    `;
    return callGemini(prompt);
}

/**
 * Sends Delphi code to Gemini API for analysis.
 * @param code The Delphi code to analyze.
 * @returns A string with code analysis, suggestions, and potential bugs.
 */
export async function analyzeDelphiCode(code: string): Promise<string> {
    const prompt = `
      Aja como um desenvolvedor Delphi sênior e revisor de código. Analise o seguinte código Object Pascal.
      Forneça uma análise concisa focada em:
      1.  **Bugs Potenciais:** Qualquer lógica que possa levar a erros de tempo de execução, como referências nulas ou loops infinitos.
      2.  **Melhorias de Performance:** Sugestões para otimizar o código.
      3.  **Boas Práticas e Estilo:** Conformidade com as convenções do Delphi, legibilidade e manutenibilidade.

      Formate sua resposta de forma clara e organizada, usando títulos para cada seção. Seja direto e prático.

      Código para análise:
      \`\`\`delphi
      ${code}
      \`\`\`
    `;
    return callGemini(prompt);
}

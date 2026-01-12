
import { NextResponse } from 'next/server';
import { AzureOpenAI } from "openai";
import { angelPrompt } from '@/lib/prompts/angelPrompt';
import { devilPrompt } from '@/lib/prompts/devilPrompt';
import { judgePrompt } from '@/lib/prompts/judgePrompt';

// Initialize OpenAI Client
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const apiVersion = "2024-05-01-preview";
const client = new AzureOpenAI({
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    apiVersion: apiVersion,
    deployment: deployment,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { promptType, userInput } = body;

        if (!promptType || !userInput) {
            return NextResponse.json(
                { error: 'Missing promptType or userInput' },
                { status: 400 }
            );
        }

        let systemPrompt = "";
        switch (promptType) {
            case 'angel':
                systemPrompt = angelPrompt;
                break;
            case 'devil':
                systemPrompt = devilPrompt;
                break;
            case 'judge':
                systemPrompt = judgePrompt;
                break;
            default:
                return NextResponse.json({ error: 'Invalid prompt type' }, { status: 400 });
        }

        const result = await client.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userInput },
            ],
            model: deployment || "",
        });

        const responseContent = result.choices[0]?.message?.content || "No response generated.";

        return NextResponse.json({ result: responseContent });

    } catch (error) {
        console.error("Error in validate API:", error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

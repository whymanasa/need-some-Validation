
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AzureOpenAI } from "openai";
import { angelPrompt } from '@/lib/prompts/angelPrompt';
import { devilPrompt } from '@/lib/prompts/devilPrompt';
import { judgePrompt } from '@/lib/prompts/judgePrompt';
import { getOrSetCache } from '@/lib/cache';
import crypto from 'crypto';

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

        // Validate Validation Schema
        const schema = z.object({
            promptType: z.enum(['angel', 'devil', 'judge']),
            userInput: z.string().min(1).max(500),
        });

        const validation = schema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { promptType, userInput } = validation.data;

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
        }

        const cacheKey = `validate:v2:${promptType}:${crypto.createHash('sha256').update(userInput).digest('hex')}`;

        const responseContent = await getOrSetCache(cacheKey, async () => {
            const result = await client.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userInput },
                ],
                model: deployment || "",
            });
            return result.choices[0]?.message?.content || "No response generated.";
        }, 86400); // 24 hours cache



        return NextResponse.json({ result: responseContent });

    } catch (error) {
        console.error("Error in validate API:", error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}


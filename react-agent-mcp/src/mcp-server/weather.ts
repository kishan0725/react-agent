import { z } from 'zod';

export const weatherToolSchema = z.object({
  location: z
    .string()
    .describe('Location to get the weather for.')
});

class WeatherTool {
    async execute(args: { location: string }): Promise<string> {
        if (["sf", "san francisco"].includes(args.location.toLowerCase())) {
            return "It's 60 degrees and foggy.";
        } else {
            return "It's 90 degrees and sunny.";
        }
    }
}

export const weatherTool = new WeatherTool();
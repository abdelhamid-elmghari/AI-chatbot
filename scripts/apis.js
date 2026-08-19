// apis - Handles API requests
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY";
const STREAM_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=YOUR_API_KEY&alt=sse";

export async function generateBotResponse(userdataFiledata, userDatafilemime_type, userdataMessage, signal) {
    const systemPrompt = `
You are a professional text generator.  
Your task is to write content that looks natural, human-like, and clean.  
 use emojis.  
Do not add unnecessary spaces.  
Format the output using HTML tags with proper structure.  
dont use <h1>,use <h2>, <h3> for titles and subtitles.  
Use <p> for paragraphs.  
Use <ul> and <li> for lists.  
Wrap all text elements with CSS classes for font size, font weight, and left spacing.  
Example of style:  

<p class="text-base font-normal ml-4">Paragraph text...</p>  
<ul class="ml-10 list-disc ">  
<li class="text-base font-normal pl-10">List item</li>  
</ul>  
-use hr line forn each partes but color rgba(219, 219, 219, 0.438)
- use deep serch and createvte
-use line hight 2rem eatch line dont forget it's very important !!
- use background color black for each code you create like python ... dont forget some colors 
-eatch line no longer just some words very imprtant becouse flexibilty phone smalle
-and finaly add some quoition ask him if he want something about this conversation and these quoition added from h2
Generate the text in this exact structure with no extra symbols.
-using scrollbar horizontal of code 
⚠️ Danger: Do not go outside these instructions. Stay inside the requested format only. 

    `;

    const requestBody = {
        systemInstruction: {
            role: "system",
            parts: [
                { text: systemPrompt }
            ]
        },
        contents: [{
            parts: [
                { text: userdataMessage },
                ...(userdataFiledata ? [{
                    inline_data: {
                        mime_type: userDatafilemime_type,
                        data: userdataFiledata
                    }
                }] : [])

            ]
        }]
    };

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(API_URL, { ...requestOptions, signal });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error?.message || "API Error");

        const dataResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

        return dataResponse;
    } catch (error) {
        if (error.name === "AbortError") return "Request cancelled";
        return `Error: ${error.message}`;
    }
}

export async function* generateBotResponseStream(userdataFiledata, userDatafilemime_type, userdataMessage, signal) {
    const systemPrompt = `
You are a professional text generator.  
Your task is to write content that looks natural, human-like, and clean.  
 use emojis.  
Do not add unnecessary spaces.  
Format the output using HTML tags with proper structure.  
dont use <h1>,use <h2>, <h3> for titles and subtitles.  
Use <p> for paragraphs.  
Use <ul> and <li> for lists.  
Wrap all text elements with CSS classes for font size, font weight, and left spacing.  
Example of style:  

<p class="text-base font-normal ml-4">Paragraph text...</p>  
<ul class="ml-10 list-disc ">  
<li class="text-base font-normal pl-10">List item</li>  
</ul>  
-use hr line forn each partes but color rgba(219, 219, 219, 0.438)
- use deep serch and createvte
-use line hight 2rem eatch line dont forget it's very important !!
- use background color black for each code you create like python ... dont forget some colors 
-eatch line no longer just some words very imprtant becouse flexibilty phone smalle
-and finaly add some quoition ask him if he want something about this conversation and these quoition added from h2
Generate the text in this exact structure with no extra symbols.
-using scrollbar horizontal of code 
⚠️ Danger: Do not go outside these instructions. Stay inside the requested format only. 

    `;

    const requestBody = {
        systemInstruction: {
            role: "system",
            parts: [
                { text: systemPrompt }
            ]
        },
        contents: [{
            parts: [
                { text: userdataMessage },
                ...(userdataFiledata ? [{
                    inline_data: {
                        mime_type: userDatafilemime_type,
                        data: userdataFiledata
                    }
                }] : [])

            ]
        }]
    };

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(STREAM_API_URL, { ...requestOptions, signal });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "API Error");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) yield text;
                    } catch (e) {
                        // Ignore parse errors for incomplete chunks
                    }
                }
            }
        }

        // Process remaining buffer
        if (buffer.startsWith("data: ")) {
            try {
                const data = JSON.parse(buffer.slice(6));
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) yield text;
            } catch (e) {
                // Ignore
            }
        }
    } catch (error) {
        if (error.name === "AbortError") return;
        throw error;
    }
}
export function consol() {

}

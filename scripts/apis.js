// apis - Handles API requests
// ...existing code...
// API SETUP

const API_KEY = "AIzaSyDG-DkaM9f-m_D_XtcNTy7olFHJmt7MEMQ";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export async function generateBotResponse(userdataFiledata, userDatafilemime_type, userdataMessage) {
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
-use hr line forn each partes
- use deep serch and createvte
-use line hight 2rem eatch line dont forget it's very important !!
- use background color black for each code you create like python ... dont forget some colors 
-eatch line no longer just some words very imprtant becouse flexibilty phone smalle
-and finaly add some quoition ask him if he want something about this conversation and these quoition added from h2
Generate the text in this exact structure with no extra symbols.
-using scrollbar horizontal of code 
⚠️ Danger: Do not go outside these instructions. Stay inside the requested format only. 

    `;

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            systemInstruction: {
                role: "system",
                parts: [
                    { text: systemPrompt }
                ]
            },
            contents: [{
                parts: [
                    { text: userdataMessage }, // 📝 user text
                    ...(userdataFiledata ? [{
                        inline_data: {
                            mime_type: userDatafilemime_type, // e.g. "image/png"
                            data: userdataFiledata // base64 image string
                        }
                    }] : [])

                ]
            }]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();

        if (!response.ok) throw new Error("API Error");

        // ✅ Extract model’s text output

        const dataResponse = data.candidates[0].content.parts[0].text;

        return dataResponse
    } catch (error) {
        return Error(error.messag);
    }
}
export function consol() {

}
import os
from google import genai
from google.genai import types

def get_answer_from_gemini(question:str, context_chunks: list)-> str:
    """
    Takes a question and a list of relevant document chunks, 
    builds a prompt, calls Gemini and returns the answer.
    """

    #Combining all chunks into a single context string
    context= "\n\n".join([chunk.page_content for chunk in context_chunks])

    #Building the prompt

    prompt= f""" You are a helpful assisstant that answers questions based on the provided document context.

IMPORTANT RULES:
-Answer only based on  the context provided below.
-If the answer is not in the context, say "I couldn't find that information in the document."
-Be conside and accurate.
-Do not make up information.

CONTENT FROM DOCUMENT:
{context}

USER QUESTION:
{question}

ANSWER:"""

    #Initialising the GEMINI client
    client= genai.Client(
        api_key=os.getenv("GEMINI_API_KEY")
    )

    #Calling gemini
    response= client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.2, #lower means more factual and less creative
            max_output_tokens=500
        )
    )

    return response.text

   
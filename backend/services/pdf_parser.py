import fitz

def extract_text_from_pdf(file_path: str)-> str:

    """
    Opens a PDF file and extracts all text from it page by page.
    Returns the full text as a single string.
    """

    doc= fitz.open(file_path)
    full_text=""

    for page_num, page in enumerate(doc):
        text=page.get_text()
        full_text += f"\n--- Page {page_num+1} ---\n{text}"
    
    doc.close()
    return full_text
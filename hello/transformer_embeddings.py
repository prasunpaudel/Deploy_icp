!pip install -q sentence-transformers numpy

from sentence_transformers import SentenceTransformer, util
import torch
import numpy as np
import time
import sys

def initialize_model(model_name='all-MiniLM-L6-v2'):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    transformer = SentenceTransformer(model_name, device=device)
    return transformer, device

def build_knowledge_base(transformer_model, questions, batch_size=4, device='cpu'):
    embeddings_list = []
    for start_idx in range(0, len(questions), batch_size):
        batch_questions = questions[start_idx:start_idx + batch_size]
        batch_embeddings = transformer_model.encode(batch_questions, convert_to_tensor=True, device=device)
        embeddings_list.append(batch_embeddings)
    combined_embeddings = torch.cat(embeddings_list, dim=0)
    return combined_embeddings

def encode_text_to_embedding(transformer_model, text, device='cpu'):
    return transformer_model.encode([text], convert_to_tensor=True, device=device)[0]

def compute_cosine_scores(query_embedding, kb_embeddings):
    return util.pytorch_cos_sim(query_embedding.unsqueeze(0), kb_embeddings)[0]

def get_top_matches(scores_tensor, top_k=3):
    topk = torch.topk(scores_tensor, k=top_k)
    indices = topk.indices.cpu().numpy()
    scores = topk.values.cpu().numpy()
    return list(zip(indices.tolist(), scores.tolist()))

def format_answers(match_indices_scores, answers_list):
    formatted = []
    for idx, score in match_indices_scores:
        formatted.append((answers_list[idx], float(score)))
    return formatted

def clean_input_text(user_text):
    return user_text.strip()

def chat_loop(transformer_model, kb_embeddings, kb_answers, device):
    print("EmbeddingBot is now running.")
    print("Type your message (or 'exit' to quit) and press Enter.")
    while True:
        try:
            raw_input = input("You: ")
        except KeyboardInterrupt:
            print("\nEmbeddingBot: Ending session. Goodbye!")
            break

        if raw_input is None:
            continue

        user_message = clean_input_text(raw_input)
        if not user_message:
            print("EmbeddingBot: Please type a message or 'exit' to quit.")
            continue

        lower_msg = user_message.lower()
        if lower_msg in ("exit", "quit", "bye", "goodbye"):
            print("EmbeddingBot: Goodbye! Have a great day. 👋")
            break

        start_time = time.time()
        query_embedding = encode_text_to_embedding(transformer_model, user_message, device=device)
        similarity_scores = compute_cosine_scores(query_embedding, kb_embeddings)
        top_matches = get_top_matches(similarity_scores, top_k=3)
        candidate_answers = format_answers(top_matches, kb_answers)

        best_answer, best_score = candidate_answers[0]
        print(f"EmbeddingBot: {best_answer}  (score: {best_score:.4f})")

        if len(candidate_answers) > 1:
            print("Other suggestions:")
            for alt_answer, alt_score in candidate_answers[1:]:
                print(f"  • {alt_answer}  ({alt_score:.4f})")

        elapsed_time = time.time() - start_time
        print(f"[Response generated in {elapsed_time:.3f} sec]\n")
        sys.stdout.flush()

def main():
    knowledge_questions = [
        "Hello, how are you?",
        "What is your name?",
        "How do I reset my password?",
        "What time is it?",
        "Tell me a joke.",
        "Goodbye"
    ]

    knowledge_answers = [
        "Hi there! I'm a simple chatbot. I'm doing great, thanks for asking!",
        "I’m called EmbeddingBot. I use transformer embeddings and cosine similarity to find answers.",
        "To reset your password, go to the login page, click 'Forgot Password', and follow the steps.",
        "I don’t have real-time clock access, but you can check your local time on your device!",
        "Why did the scarecrow win an award? Because he was outstanding in his field! 🤣",
        "Bye! Have a nice day!"
    ]

    model_instance, compute_device = initialize_model()
    kb_embs = build_knowledge_base(model_instance, knowledge_questions, batch_size=4, device=compute_device)
    chat_loop(model_instance, kb_embs, knowledge_answers, device=compute_device)

if __name__ == "__main__":
    main()

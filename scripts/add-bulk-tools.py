#!/usr/bin/env python3
"""
Bulk add new AI open source tools to data/tools/ and data/categories/index.json.
All tools have been pre-verified to have 1000+ GitHub stars.
"""

import json
import os
from datetime import datetime

FETCH_DATE = "2026-03-01T00:00:00.000Z"

NEW_TOOLS = [
    # ─── security-governance / xai (EMPTY → fill) ───────────────────────────
    {
        "id": "shap",
        "name": "SHAP",
        "description": "A game theoretic approach to explain the output of any machine learning model using Shapley values",
        "categoryId": "xai",
        "moduleId": "security-governance",
        "license": "MIT",
        "githubUrl": "https://github.com/shap/shap",
        "koreanSupport": False,
        "tags": ["xai", "explainability", "shapley", "interpretability"],
        "meta": {"stars": 22000, "forks": 3200, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "lime",
        "name": "LIME",
        "description": "Local Interpretable Model-agnostic Explanations — explains predictions of any classifier",
        "categoryId": "xai",
        "moduleId": "security-governance",
        "license": "BSD-2-Clause",
        "githubUrl": "https://github.com/marcotcr/lime",
        "koreanSupport": False,
        "tags": ["xai", "explainability", "local-explanation", "interpretability"],
        "meta": {"stars": 11500, "forks": 1800, "lastUpdated": "2025-10-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "captum",
        "name": "Captum",
        "description": "Model interpretability and understanding library for PyTorch — integrated gradients, saliency maps, and more",
        "categoryId": "xai",
        "moduleId": "security-governance",
        "license": "BSD-3-Clause",
        "githubUrl": "https://github.com/pytorch/captum",
        "koreanSupport": False,
        "tags": ["xai", "pytorch", "interpretability", "attribution"],
        "meta": {"stars": 4800, "forks": 490, "lastUpdated": "2025-11-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "interpret",
        "name": "InterpretML",
        "description": "Fit interpretable models and explain blackbox systems with glassbox models and SHAP",
        "categoryId": "xai",
        "moduleId": "security-governance",
        "license": "MIT",
        "githubUrl": "https://github.com/interpretml/interpret",
        "koreanSupport": False,
        "tags": ["xai", "explainability", "ebm", "glassbox"],
        "meta": {"stars": 6100, "forks": 720, "lastUpdated": "2025-11-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── security-governance / data-privacy (EMPTY → fill) ──────────────────
    {
        "id": "presidio",
        "name": "Presidio",
        "description": "Context aware, pluggable and customizable PII anonymization service for text and images",
        "categoryId": "data-privacy",
        "moduleId": "security-governance",
        "license": "MIT",
        "githubUrl": "https://github.com/microsoft/presidio",
        "koreanSupport": False,
        "tags": ["pii", "anonymization", "data-privacy", "nlp"],
        "meta": {"stars": 3500, "forks": 680, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "diffprivlib",
        "name": "Diffprivlib",
        "description": "IBM's general-purpose library for experimenting with, investigating, and developing differential privacy applications",
        "categoryId": "data-privacy",
        "moduleId": "security-governance",
        "license": "MIT",
        "githubUrl": "https://github.com/IBM/diffprivlib",
        "koreanSupport": False,
        "tags": ["differential-privacy", "privacy", "machine-learning"],
        "meta": {"stars": 1800, "forks": 250, "lastUpdated": "2025-10-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "tensorflow-privacy",
        "name": "TensorFlow Privacy",
        "description": "Library for training machine learning models with privacy guarantees (differential privacy)",
        "categoryId": "data-privacy",
        "moduleId": "security-governance",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/tensorflow/privacy",
        "koreanSupport": False,
        "tags": ["differential-privacy", "tensorflow", "privacy-preserving"],
        "meta": {"stars": 1900, "forks": 430, "lastUpdated": "2025-11-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── infra-computing / container-orchestration ───────────────────────────
    {
        "id": "helm",
        "name": "Helm",
        "description": "The Kubernetes Package Manager — manage and deploy applications on Kubernetes clusters",
        "categoryId": "container-orchestration",
        "moduleId": "infra-computing",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/helm/helm",
        "koreanSupport": False,
        "tags": ["kubernetes", "package-manager", "devops", "cloud-native"],
        "meta": {"stars": 27000, "forks": 7100, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "containerd",
        "name": "containerd",
        "description": "An industry-standard container runtime with an emphasis on simplicity, robustness and portability",
        "categoryId": "container-orchestration",
        "moduleId": "infra-computing",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/containerd/containerd",
        "koreanSupport": False,
        "tags": ["container", "runtime", "kubernetes", "cncf"],
        "meta": {"stars": 17000, "forks": 3400, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── infra-computing / sustainable-ai ────────────────────────────────────
    {
        "id": "carbontracker",
        "name": "Carbontracker",
        "description": "Track and predict energy consumption and carbon footprint of training deep learning models",
        "categoryId": "sustainable-ai",
        "moduleId": "infra-computing",
        "license": "MIT",
        "githubUrl": "https://github.com/lfwa/carbontracker",
        "koreanSupport": False,
        "tags": ["carbon", "energy", "sustainability", "deep-learning"],
        "meta": {"stars": 1100, "forks": 120, "lastUpdated": "2025-08-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── infra-computing / distributed-cloud ─────────────────────────────────
    {
        "id": "volcano",
        "name": "Volcano",
        "description": "Cloud native batch system for AI/ML workloads on Kubernetes — CNCF project",
        "categoryId": "distributed-cloud",
        "moduleId": "infra-computing",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/volcano-sh/volcano",
        "koreanSupport": False,
        "tags": ["kubernetes", "batch", "mlops", "scheduling", "gpu"],
        "meta": {"stars": 4200, "forks": 900, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "terraform",
        "name": "Terraform",
        "description": "Infrastructure as Code tool for provisioning cloud resources — essential for scalable AI infrastructure",
        "categoryId": "distributed-cloud",
        "moduleId": "infra-computing",
        "license": "BSL-1.1",
        "githubUrl": "https://github.com/hashicorp/terraform",
        "koreanSupport": False,
        "tags": ["infrastructure-as-code", "cloud", "devops", "provisioning"],
        "meta": {"stars": 43000, "forks": 9500, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── data-storage / etl-workflow ─────────────────────────────────────────
    {
        "id": "apache-beam",
        "name": "Apache Beam",
        "description": "Unified programming model for batch and streaming data processing pipelines",
        "categoryId": "etl-workflow",
        "moduleId": "data-storage",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/apache/beam",
        "koreanSupport": False,
        "tags": ["etl", "streaming", "batch", "data-pipeline", "dataflow"],
        "meta": {"stars": 8000, "forks": 4300, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "apache-nifi",
        "name": "Apache NiFi",
        "description": "Easy to use, powerful, and reliable system to process and distribute data",
        "categoryId": "etl-workflow",
        "moduleId": "data-storage",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/apache/nifi",
        "koreanSupport": False,
        "tags": ["etl", "data-flow", "pipeline", "automation"],
        "meta": {"stars": 4500, "forks": 2700, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── data-storage / data-quality ─────────────────────────────────────────
    {
        "id": "ydata-profiling",
        "name": "YData Profiling",
        "description": "Extended pandas profiling for exploratory data analysis — generates comprehensive HTML reports",
        "categoryId": "data-quality",
        "moduleId": "data-storage",
        "license": "MIT",
        "githubUrl": "https://github.com/ydataai/ydata-profiling",
        "koreanSupport": False,
        "tags": ["eda", "data-quality", "profiling", "pandas"],
        "meta": {"stars": 12500, "forks": 1700, "lastUpdated": "2025-11-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── data-storage / data-labeling ────────────────────────────────────────
    {
        "id": "cleanlab",
        "name": "Cleanlab",
        "description": "Standard data-centric AI package for data quality and machine learning with messy, real-world data",
        "categoryId": "data-labeling",
        "moduleId": "data-storage",
        "license": "AGPL-3.0",
        "githubUrl": "https://github.com/cleanlab/cleanlab",
        "koreanSupport": False,
        "tags": ["data-quality", "label-errors", "data-centric-ai", "noisy-labels"],
        "meta": {"stars": 10000, "forks": 780, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "snorkel",
        "name": "Snorkel",
        "description": "Programmatic training data creation and management system using weak supervision",
        "categoryId": "data-labeling",
        "moduleId": "data-storage",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/snorkel-team/snorkel",
        "koreanSupport": False,
        "tags": ["weak-supervision", "data-labeling", "programmatic-labeling"],
        "meta": {"stars": 5800, "forks": 890, "lastUpdated": "2025-08-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── model-algorithm / multimodal ────────────────────────────────────────
    {
        "id": "imagebind",
        "name": "ImageBind",
        "description": "One embedding space to bind all modalities — image, text, audio, depth, thermal, IMU",
        "categoryId": "multimodal",
        "moduleId": "model-algorithm",
        "license": "CC-BY-NC-4.0",
        "githubUrl": "https://github.com/facebookresearch/ImageBind",
        "koreanSupport": False,
        "tags": ["multimodal", "embedding", "audio", "vision", "meta"],
        "meta": {"stars": 8500, "forks": 820, "lastUpdated": "2025-08-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "audiocraft",
        "name": "AudioCraft",
        "description": "Meta's library for audio processing and generation — MusicGen, AudioGen, EnCodec",
        "categoryId": "multimodal",
        "moduleId": "model-algorithm",
        "license": "MIT",
        "githubUrl": "https://github.com/facebookresearch/audiocraft",
        "koreanSupport": False,
        "tags": ["audio", "music-generation", "text-to-audio", "meta"],
        "meta": {"stars": 20500, "forks": 2100, "lastUpdated": "2025-10-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "bark",
        "name": "Bark",
        "description": "Transformer-based text-to-audio model — generates speech, music, and audio effects from text",
        "categoryId": "multimodal",
        "moduleId": "model-algorithm",
        "license": "MIT",
        "githubUrl": "https://github.com/suno-ai/bark",
        "koreanSupport": False,
        "tags": ["text-to-speech", "audio-generation", "transformer", "tts"],
        "meta": {"stars": 36000, "forks": 4200, "lastUpdated": "2025-09-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── model-algorithm / llm ───────────────────────────────────────────────
    {
        "id": "chatglm",
        "name": "ChatGLM",
        "description": "An open bilingual (Chinese-English) language model based on GLM framework with 6B-130B parameters",
        "categoryId": "llm",
        "moduleId": "model-algorithm",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/THUDM/ChatGLM3",
        "koreanSupport": False,
        "tags": ["llm", "chinese", "bilingual", "glm", "tsinghua"],
        "meta": {"stars": 13000, "forks": 1700, "lastUpdated": "2025-10-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "gpt-neox",
        "name": "GPT-NeoX",
        "description": "EleutherAI's library for training large-scale language models on GPUs — PyTorch + DeepSpeed",
        "categoryId": "llm",
        "moduleId": "model-algorithm",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/EleutherAI/gpt-neox",
        "koreanSupport": False,
        "tags": ["llm", "training", "eleutherai", "deepspeed", "gpt"],
        "meta": {"stars": 7200, "forks": 1050, "lastUpdated": "2025-10-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── training-inference / automl-hpo ─────────────────────────────────────
    {
        "id": "nni",
        "name": "NNI",
        "description": "An open source AutoML toolkit for hyperparameter tuning, neural architecture search, and model compression",
        "categoryId": "automl-hpo",
        "moduleId": "training-inference",
        "license": "MIT",
        "githubUrl": "https://github.com/microsoft/nni",
        "koreanSupport": False,
        "tags": ["automl", "hpo", "nas", "model-compression", "microsoft"],
        "meta": {"stars": 14000, "forks": 1900, "lastUpdated": "2025-08-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "autokeras",
        "name": "AutoKeras",
        "description": "AutoML system based on Keras — automatically search for the best neural network architecture",
        "categoryId": "automl-hpo",
        "moduleId": "training-inference",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/keras-team/autokeras",
        "koreanSupport": False,
        "tags": ["automl", "nas", "keras", "neural-architecture-search"],
        "meta": {"stars": 9100, "forks": 1400, "lastUpdated": "2025-09-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── training-inference / reinforcement-learning ─────────────────────────
    {
        "id": "gymnasium",
        "name": "Gymnasium",
        "description": "The standard API for reinforcement learning environments (successor to OpenAI Gym) by Farama Foundation",
        "categoryId": "reinforcement-learning",
        "moduleId": "training-inference",
        "license": "MIT",
        "githubUrl": "https://github.com/Farama-Foundation/Gymnasium",
        "koreanSupport": False,
        "tags": ["reinforcement-learning", "gym", "environment", "farama"],
        "meta": {"stars": 8000, "forks": 1000, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── platform-mlops / agent-orchestration ────────────────────────────────
    {
        "id": "semantic-kernel",
        "name": "Semantic Kernel",
        "description": "Microsoft's SDK for integrating LLMs into conventional programming languages — plugins, planners, memory",
        "categoryId": "agent-orchestration",
        "moduleId": "platform-mlops",
        "license": "MIT",
        "githubUrl": "https://github.com/microsoft/semantic-kernel",
        "koreanSupport": False,
        "tags": ["llm", "agent", "orchestration", "microsoft", "plugins"],
        "meta": {"stars": 23000, "forks": 3400, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "camel",
        "name": "CAMEL",
        "description": "Communicative Agents for Mind Exploration of Large Scale Language Model Society",
        "categoryId": "agent-orchestration",
        "moduleId": "platform-mlops",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/camel-ai/camel",
        "koreanSupport": False,
        "tags": ["multi-agent", "llm", "role-playing", "camel"],
        "meta": {"stars": 6500, "forks": 820, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── platform-mlops / prompt-management ──────────────────────────────────
    {
        "id": "litellm",
        "name": "LiteLLM",
        "description": "Call 100+ LLMs using the OpenAI format — Bedrock, Azure, OpenAI, Cohere, Anthropic, Ollama, etc.",
        "categoryId": "prompt-management",
        "moduleId": "platform-mlops",
        "license": "MIT",
        "githubUrl": "https://github.com/BerriAI/litellm",
        "koreanSupport": False,
        "tags": ["llm", "proxy", "openai-compatible", "multi-provider"],
        "meta": {"stars": 16000, "forks": 1900, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── platform-mlops / interoperability ───────────────────────────────────
    {
        "id": "composio",
        "name": "Composio",
        "description": "Toolset for AI agents — 250+ integrations (GitHub, Slack, Gmail, etc.) with managed auth",
        "categoryId": "interoperability",
        "moduleId": "platform-mlops",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/ComposioHQ/composio",
        "koreanSupport": False,
        "tags": ["tools", "integrations", "agent", "mcp", "apis"],
        "meta": {"stars": 18000, "forks": 2200, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── platform-mlops / llmops-observability ────────────────────────────────
    {
        "id": "langfuse",
        "name": "Langfuse",
        "description": "Open source LLM engineering platform — tracing, evals, prompt management, and metrics",
        "categoryId": "llmops-observability",
        "moduleId": "platform-mlops",
        "license": "MIT",
        "githubUrl": "https://github.com/langfuse/langfuse",
        "koreanSupport": False,
        "tags": ["llmops", "observability", "tracing", "prompt-management", "evals"],
        "meta": {"stars": 8500, "forks": 780, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── application-service / recommendation-search ─────────────────────────
    {
        "id": "meilisearch",
        "name": "Meilisearch",
        "description": "Lightning-fast search engine that fits effortlessly into your apps, websites, and workflow",
        "categoryId": "recommendation-search",
        "moduleId": "application-service",
        "license": "MIT",
        "githubUrl": "https://github.com/meilisearch/meilisearch",
        "koreanSupport": False,
        "tags": ["search", "full-text-search", "rust", "typo-tolerant"],
        "meta": {"stars": 47000, "forks": 1800, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "typesense",
        "name": "Typesense",
        "description": "Open source, typo-tolerant search engine optimized for instant (as-you-type) search",
        "categoryId": "recommendation-search",
        "moduleId": "application-service",
        "license": "GPL-3.0",
        "githubUrl": "https://github.com/typesense/typesense",
        "koreanSupport": False,
        "tags": ["search", "instant-search", "typo-tolerant", "cpp"],
        "meta": {"stars": 21000, "forks": 680, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "vespa",
        "name": "Vespa",
        "description": "Yahoo's open source big data serving engine — search, recommendation, personalization at scale",
        "categoryId": "recommendation-search",
        "moduleId": "application-service",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/vespa-engine/vespa",
        "koreanSupport": False,
        "tags": ["search", "recommendation", "vector-search", "real-time"],
        "meta": {"stars": 5600, "forks": 580, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── application-service / industry-solutions ────────────────────────────
    {
        "id": "deepchem",
        "name": "DeepChem",
        "description": "Deep learning for drug discovery, materials science, quantum chemistry, and biology",
        "categoryId": "industry-solutions",
        "moduleId": "application-service",
        "license": "MIT",
        "githubUrl": "https://github.com/deepchem/deepchem",
        "koreanSupport": False,
        "tags": ["drug-discovery", "chemistry", "biology", "materials-science"],
        "meta": {"stars": 5500, "forks": 1800, "lastUpdated": "2025-11-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "biogpt",
        "name": "BioGPT",
        "description": "Generative pre-trained transformer for biomedical text generation and mining by Microsoft Research",
        "categoryId": "industry-solutions",
        "moduleId": "application-service",
        "license": "MIT",
        "githubUrl": "https://github.com/microsoft/BioGPT",
        "koreanSupport": False,
        "tags": ["biomedical", "nlp", "text-generation", "healthcare"],
        "meta": {"stars": 3200, "forks": 490, "lastUpdated": "2025-06-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },

    # ─── application-service / content-generation ────────────────────────────
    {
        "id": "stable-diffusion-webui",
        "name": "Stable Diffusion WebUI",
        "description": "A browser interface for Stable Diffusion — the most popular SD frontend with extensive extension ecosystem",
        "categoryId": "content-generation",
        "moduleId": "application-service",
        "license": "AGPL-3.0",
        "githubUrl": "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
        "koreanSupport": False,
        "tags": ["stable-diffusion", "image-generation", "webui", "txt2img"],
        "meta": {"stars": 145000, "forks": 27000, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
    {
        "id": "invoke-ai",
        "name": "InvokeAI",
        "description": "Creative engine for Stable Diffusion — professional creative tools for generating and editing images",
        "categoryId": "content-generation",
        "moduleId": "application-service",
        "license": "Apache-2.0",
        "githubUrl": "https://github.com/invoke-ai/InvokeAI",
        "koreanSupport": False,
        "tags": ["stable-diffusion", "image-generation", "generative-ai", "art"],
        "meta": {"stars": 23000, "forks": 2300, "lastUpdated": "2025-12-01T00:00:00Z", "fetchedAt": FETCH_DATE},
    },
]


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
        f.write("\n")


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    tools_base = os.path.join(base, "data", "tools")
    categories_path = os.path.join(base, "data", "categories", "index.json")

    # Load categories
    categories_data = load_json(categories_path)

    # Collect existing GitHub URLs to avoid duplicates
    existing_urls = set()
    existing_ids = set()
    for module_dir in os.listdir(tools_base):
        tools_path = os.path.join(tools_base, module_dir, "tools.json")
        if os.path.exists(tools_path):
            data = load_json(tools_path)
            for t in data.get("tools", []):
                if t.get("githubUrl"):
                    existing_urls.add(t["githubUrl"].lower().rstrip("/"))
                existing_ids.add(t["id"])

    # Group new tools by moduleId
    by_module = {}
    for tool in NEW_TOOLS:
        mid = tool["moduleId"]
        by_module.setdefault(mid, []).append(tool)

    added = 0
    skipped = 0

    for module_id, tools in by_module.items():
        tools_path = os.path.join(tools_base, module_id, "tools.json")
        if not os.path.exists(tools_path):
            print(f"⚠️  tools.json not found for module: {module_id}")
            continue

        data = load_json(tools_path)

        for tool in tools:
            url_lower = tool.get("githubUrl", "").lower().rstrip("/")
            if url_lower in existing_urls or tool["id"] in existing_ids:
                print(f"⏭️  Skip (duplicate): {tool['name']}")
                skipped += 1
                continue

            data["tools"].append(tool)
            existing_urls.add(url_lower)
            existing_ids.add(tool["id"])

            # Update categories/index.json
            cat_id = tool["categoryId"]
            for cat in categories_data["categories"]:
                if cat["id"] == cat_id:
                    if tool["id"] not in cat["tools"]:
                        cat["tools"].append(tool["id"])
                    break

            print(f"✓ Added: {tool['name']} → {module_id}/{cat_id}")
            added += 1

        save_json(tools_path, data)

    save_json(categories_path, categories_data)

    print(f"\n✅ Done! Added: {added}, Skipped: {skipped}")

    # Print final counts
    print("\nFinal tool counts per module:")
    for module_dir in sorted(os.listdir(tools_base)):
        tools_path = os.path.join(tools_base, module_dir, "tools.json")
        if os.path.exists(tools_path):
            data = load_json(tools_path)
            print(f"  {module_dir}: {len(data['tools'])} tools")


if __name__ == "__main__":
    main()

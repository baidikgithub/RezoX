import joblib
import logging

from huggingface_hub import hf_hub_download

logger = logging.getLogger(__name__)


class ModelLoader:
    _model = None

    @classmethod
    def load_model(cls):
        if cls._model is None:
            logger.info("Downloading model from Hugging Face...")

            model_path = hf_hub_download(
                repo_id="baidikhuggingface/rezox-real-estate-model",
                filename="best_model.pkl",
            )

            cls._model = joblib.load(model_path)

            logger.info("Model loaded successfully.")

        return cls._model


def get_model():
    return ModelLoader.load_model()

import logging
"""
Handles logging for the application. Uncomment the file_handler to log to a file.    
"""

# Create a logger
logger = logging.getLogger("my_app")
logger.setLevel(logging.DEBUG)  # Set desired logging level here!

# Create handlers
console_handler = logging.StreamHandler()
# file_handler = logging.FileHandler("app.log")

# Set log levels for handlers
console_handler.setLevel(logging.DEBUG)
#file_handler.setLevel(logging.INFO)

# Create formatter
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

# Attach formatter to handlers
console_handler.setFormatter(formatter)
#file_handler.setFormatter(formatter)

# Attach handlers to logger
logger.addHandler(console_handler)
#logger.addHandler(file_handler)
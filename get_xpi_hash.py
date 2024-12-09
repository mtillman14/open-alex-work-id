import hashlib

def calculate_sha256(file_path):
    """
    Calculate the SHA256 hash of a file.

    Args:
        file_path (str): Path to the file.

    Returns:
        str: The SHA256 hash of the file in hexadecimal format.
    """
    sha256_hash = hashlib.sha256()
    try:
        with open(file_path, "rb") as file:
            # Read the file in chunks to handle large files
            for chunk in iter(lambda: file.read(4096), b""):
                sha256_hash.update(chunk)
        return sha256_hash.hexdigest()
    except FileNotFoundError:
        return "Error: File not found"
    except Exception as e:
        return f"Error: {e}"

# Example usage:
xpi_file_path = "build/openalex-workid.xpi"  # Replace with your .xpi file path
hash_value = calculate_sha256(xpi_file_path)
print(f"SHA256 Hash: {hash_value}")

import secrets

def generate_akma_key():
    return secrets.token_hex(16)

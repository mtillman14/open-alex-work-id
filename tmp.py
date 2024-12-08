import requests
import json

def update_zotero_item_openalex(item_id: int, openalex_value: str, library_type='user', library_id='', api_key=''):
    """
    Updates or adds an OpenAlex field to a Zotero item using the local Zotero API.
    
    Args:
        item_id (str): The Zotero item ID
        openalex_value (str): The value to set for the OpenAlex field
        library_type (str): Either 'user' or 'group'
        library_id (str): Your Zotero user ID or group ID
        api_key (str): Your Zotero API key
    
    Returns:
        bool: True if successful, False otherwise
    """
    # Construct the API URL
    base_url = "http://localhost:23119/zotero"
    endpoint = f"{base_url}/{library_type}/{library_id}/items/{item_id}"
    
    # Set up headers
    headers = {
        'Zotero-API-Version': '3',
        'Content-Type': 'application/json',
    }
    if api_key:
        headers['Zotero-API-Key'] = api_key

    try:
        # First, get the existing item data
        response = requests.get(endpoint, headers=headers)
        response.raise_for_status()
        item_data = response.json()
        
        # Update or add the OpenAlex field
        if 'extra' in item_data:
            # Check if OpenAlex field already exists
            extra_lines = item_data['extra'].split('\n')
            openalex_found = False
            
            for i, line in enumerate(extra_lines):
                if line.startswith('OpenAlex:'):
                    extra_lines[i] = f'OpenAlex: {openalex_value}'
                    openalex_found = True
                    break
            
            if not openalex_found:
                extra_lines.append(f'OpenAlex: {openalex_value}')
            
            item_data['extra'] = '\n'.join(extra_lines)
        else:
            item_data['extra'] = f'OpenAlex: {openalex_value}'
        
        # Create the version header required for updates
        if 'version' in response.headers:
            headers['If-Unmodified-Since-Version'] = response.headers['version']
        
        # Send the update request
        update_response = requests.put(
            endpoint,
            headers=headers,
            data=json.dumps(item_data)
        )
        update_response.raise_for_status()
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"Error updating Zotero item: {str(e)}")
        return False

# Example usage
if __name__ == "__main__":
    # Replace these with your actual values
    ITEM_ID = "YOUR_ITEM_ID"
    OPENALEX_VALUE = "https://openalex.org/W12345678"
    LIBRARY_TYPE = "user"  # or "group"
    LIBRARY_ID = "YOUR_LIBRARY_ID"
    API_KEY = "YOUR_API_KEY"
    
    success = update_zotero_item_openalex(
        ITEM_ID,
        OPENALEX_VALUE,
        library_type=LIBRARY_TYPE,
        library_id=LIBRARY_ID,
        api_key=API_KEY
    )
    
    if success:
        print("Successfully updated OpenAlex field")
    else:
        print("Failed to update OpenAlex field")
import yaml
import jsonschema
from jsonschema import validate

# Define the schema for validation
schema = {
    "type": "object",
    "properties": {
        "Name": {"type": "string"},
        "Description": {"type": "string"},
        # Add other properties according to your YAML structure
    },
    "required": ["Name", "Description"]  # List of required properties
}

# Function to validate the YAML data
def validate_yaml(yaml_data, schema):
    try:
        validate(instance=yaml_data, schema=schema)
        print("YAML file is valid.")
    except jsonschema.exceptions.ValidationError as err:
        print("YAML file is invalid.")
        print(err)

# Load YAML file
with open('your_yaml_file.yml', 'r') as file:
    yaml_data = yaml.safe_load(file)

# Validate the loaded YAML data
validate_yaml(yaml_data, schema)

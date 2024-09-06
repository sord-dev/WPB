// I'm so sorry rust devs...

use std::error::Error;
use std::fs::{self};
use std::io::Read;

/// Scans a user's documents directory for a specific folder, validates each file within to be of the JSON type, and returns the contents of the folder as an array of JSON objects.
pub fn scan_documents_directory(
    folder_name: &str,
) -> Result<Vec<serde_json::Value>, Box<dyn Error>> {
    // Get the user's documents directory path
    let documents_dir = dirs::document_dir().ok_or("Unable to find user's documents directory")?;
    let folder_path = documents_dir.join(folder_name);

    // Check if the folder exists
    if !folder_path.is_dir() {
        // if it doesn't exist, create it
        fs::create_dir(&folder_path)?;
    }

    // Read the contents of the folder
    let entries = fs::read_dir(&folder_path)?;

    // Iterate over the entries and validate/process JSON files
    let mut json_objects = Vec::new();
    for entry in entries {
        let entry = entry?;
        let path = entry.path();
        let metadata = entry.metadata()?;

        // Check if the file is a regular file and has a JSON extension
        if metadata.is_file() && path.extension().map(|ext| ext == "json").unwrap_or(false) {
            let mut file = fs::File::open(&path)?;
            let mut contents = String::new();

            // check if file is empty
            if metadata.len() == 0 {
                println!("File {} is empty", path.display());
                continue;
            }

            // Read the file contents
            file.read_to_string(&mut contents)?;

            // Parse the JSON contents with error handling
            let json_value = match serde_json::from_str(&contents) {
                Ok(value) => value,
                Err(e) => {
                    println!("Failed to parse JSON in {}: {}", path.display(), e);
                    continue; // Continue processing other files
                }
            };

            json_objects.push(json_value);
        }
    }

    Ok(json_objects)
}

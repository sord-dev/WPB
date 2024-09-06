// I'm so sorry rust devs...

use std::error::Error;
use std::fs::{self, OpenOptions};
use std::io::{Read, Write};

use serde_json::Value;


fn create_app_dir(folder_name: &str) -> Result<(), Box<dyn Error>> {
    // Get the user's documents directory path
    let documents_dir = dirs::document_dir().ok_or("Unable to find user's documents directory")?;
    let folder_path = documents_dir.join(folder_name);

    // Check if the folder exists
    if !folder_path.is_dir() {
        // if it doesn't exist, create it
        fs::create_dir(&folder_path)?;
    }

    Ok(())

}


/// Scans a user's documents directory for a specific folder, validates each file within to be of the JSON type, and returns the contents of the folder as an array of JSON objects.
pub fn scan_documents_directory(
    folder_name: &str,
) -> Result<Vec<Value>, Box<dyn Error>> {
    // Get the user's documents directory path
    let documents_dir = dirs::document_dir().ok_or("Unable to find user's documents directory")?;
    let folder_path = documents_dir.join(folder_name);
    create_app_dir(folder_name)?;

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
            let json_value: serde_json::Value = match serde_json::from_str(&contents) {
                Ok(value) => value,
                Err(e) => {
                    println!("Failed to parse JSON in {}: {}", path.display(), e);
                    continue; // Continue processing other files
                }
            };

            let mut modified_template = json_value.clone();
            modified_template.as_object_mut().unwrap().insert("file_path".to_string(), serde_json::Value::String(path.display().to_string()));

            json_objects.push(modified_template);
        }
    }

    Ok(json_objects)
}


// update a JSON object in a file


pub fn update_json_in_file(
    folder_name: &str,
    file_name: &str,
    json_object: &serde_json::Value,
) -> Result<String, Box<dyn Error>> {
    // Get the user's documents directory path
    let documents_dir = dirs::document_dir().ok_or("Unable to find user's documents directory")?;
    let folder_path = documents_dir.join(folder_name);
    create_app_dir(folder_name)?;

    // Create the file path
    let file_path = folder_path.join(file_name);

    // Open the file for writing with explicit permissions
    let mut file = OpenOptions::new()
        .write(true)
        .create(true) // Create the file if it doesn't exist
        .open(&file_path)
        .map_err(|e| format!("Failed to open file: {}", e))?;

    // Write the JSON object to the file
    serde_json::to_writer_pretty(&file, json_object)?;

    // Read the updated contents
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    Ok(contents)
}
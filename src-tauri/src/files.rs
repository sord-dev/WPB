// I'm so sorry rust devs...

use std::collections::HashMap;
use std::error::Error;
use std::fs::{self, OpenOptions};
use std::io::{Read, Write};

use serde::{Deserialize, Serialize};
use serde_json::Value;


#[derive(Serialize, Deserialize, Debug)]
pub struct Project {
    pub project_name: String,
    pub pages: HashMap<String, Page>,
    pub page_index: Vec<String>,
    pub active_page: String,
    pub file_path: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Page {
    pub name: String,
    pub content: HashMap<String, Component>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Component {
    pub item_type: String,
    pub props: serde_json::Value,
}


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

fn open_file_with_read_write_permissions(file_path: &str) -> Result<fs::File, Box<dyn Error>> {
    // Open the file for reading and writing with explicit permissions
    let file = OpenOptions::new()
        .read(true)
        .write(true)
        .open(file_path)
        .map_err(|e| format!("Failed to open file: {}", e))?;

    Ok(file)
}

/// Scans a user's documents directory for a specific folder, validates each file within to be of the JSON type, and returns the contents of the folder as an array of JSON objects.
pub fn scan_documents_directory(folder_name: &str) -> Result<Vec<Value>, Box<dyn Error>> {
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

            println!("Parsed JSON: {:?}", json_value.as_object());

            json_objects.push(json_value);
        }
    }

    Ok(json_objects)
}

// update a JSON object in a file
pub fn update_json_in_file(
    folder_name: &str,
    file_name: &str,
    project: &serde_json::Value,
) -> Result<Project, Box<dyn Error>> {
    // Get the user's documents directory path
    let documents_dir = dirs::document_dir().ok_or("Unable to find user's documents directory")?;
    let folder_path = documents_dir.join(folder_name);
    create_app_dir(folder_name)?;

    // Create the file path
    let file_path = folder_path.join(file_name);

    // Open the file for writing with explicit permissions
    let file = open_file_with_read_write_permissions(&file_path.to_str().unwrap())?;

    println!("Writing to file: {}", file_path.display());
    // clear the file
    file.set_len(0)?;
    serde_json::to_writer(&file, project)?;
    println!("successfully wrote to file");

   // Read the updated contents directly as a serde_json::Value
   let updated_project: Project = serde_json::from_reader(&file)?;
   print!("Updated project: {:?}", serde_json::to_string(&updated_project));

   Ok(updated_project)
}

pub fn create_new_json_file(
    folder_name: &str,
    project: &serde_json::Value,
) -> Result<Project, Box<dyn Error>> {

    // Get the user's documents directory path and create the folder
    let documents_dir = dirs::document_dir().ok_or("Unable to find user's documents directory")?;
    let folder_path = documents_dir.join(folder_name);
    let name = project["project_name"].as_str().unwrap();

    // Create the file path
    create_app_dir(folder_name)?;
    let file_path = folder_path.join(name);

    // Open the file for writing with explicit permissions
    let file = open_file_with_read_write_permissions(&file_path.to_str().unwrap())?;

    println!("Writing to file: {}", file_path.display());
    println!("{:?}", project);

    // clear the file
    file.set_len(0)?;
    serde_json::to_writer(&file, project)?;

   // Read the updated contents directly as a serde_json::Value
   let updated_project: Project = serde_json::from_reader(&file)?;

   print!("Updated project: {:?}", serde_json::to_string(&updated_project));

   Ok(updated_project)
}
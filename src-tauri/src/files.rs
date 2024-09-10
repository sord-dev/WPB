// I'm so sorry rust devs... I'm so sorry...

use std::error::Error;
use std::fs::{self, OpenOptions};
use std::io::Read;
use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use serde_json::Value;

const PROJECT_FOLDER_NAME: &str = "wpb-projects";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Project {
    pub project_name: String,
    pub pages: serde_json::Map<std::string::String, Value>,
    pub page_index: Vec<Value>,
    pub active_page: String,
    pub file_path: String,
}

fn log_error(error: &serde_json::Error) {
    // Log the error using your preferred logging library
    println!("Failed to parse JSON object: {}", error);
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

fn open_file_with_read_permissions(file_path: &str) -> Result<fs::File, Box<dyn Error>> {
    // Open the file for reading with explicit permissions
    let file = OpenOptions::new()
        .read(true)
        .open(file_path)
        .map_err(|e| format!("Failed to open file: {}", e))?;

    Ok(file)
}

/// Scans a user's documents directory for a specific folder, validates each file within to be of the JSON type
/// Then, returns the contents of the folder as an array of Project structs.
pub fn scan_documents_directory() -> Result<Vec<Project>, Box<dyn Error>> {
    // Get the user's documents directory path
    let documents_dir = dirs::document_dir().ok_or("Unable to find user's documents directory")?;
    let folder_path = documents_dir.join(PROJECT_FOLDER_NAME);
    create_app_dir(PROJECT_FOLDER_NAME)?;

    // Read the contents of the folder
    let entries = fs::read_dir(&folder_path)?;

    // Iterate over the entries and validate/process JSON files
    let mut json_objects: Vec<Project> = Vec::new();
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

            // Convert the JSON value to a Project struct
            let project = Project {
                pages: json_value["pages"].as_object().unwrap().clone(),
                page_index: json_value["page_index"].as_array().unwrap().clone(),
                active_page: json_value["active_page"].as_str().unwrap().to_string(),
                project_name: json_value["project_name"].as_str().unwrap().to_string(),
                file_path: json_value["file_path"]
                    .as_str()
                    .unwrap_or(&path.display().to_string())
                    .to_string(),
            };

            json_objects.push(project);
        }
    }

    Ok(json_objects)
}

pub fn read_project_file(file_name: &str) -> Result<Project, Box<dyn Error>> {
    // Get the user's documents directory path
    let documents_dir = dirs::document_dir().ok_or("Unable to find user's documents directory")?;
    let folder_path = documents_dir.join(PROJECT_FOLDER_NAME);
    create_app_dir(PROJECT_FOLDER_NAME)?;

    // Create the file path
    let file_path = folder_path.join(file_name);

    // Open the file for reading with explicit permissions
    let file = open_file_with_read_permissions(&file_path.to_str().unwrap())?;

    // Read the contents of the file
    let contents: Value = serde_json::from_reader(&file)?;

    // Convert the JSON value to a Project struct
    let project = Project {
        pages: contents["pages"].as_object().unwrap().clone(),
        page_index: contents["page_index"].as_array().unwrap().clone(),
        active_page: contents["active_page"].as_str().unwrap().to_string(),
        project_name: contents["project_name"].as_str().unwrap().to_string(),
        file_path: contents["file_path"]
            .as_str()
            .unwrap_or(&file_path.display().to_string())
            .to_string(),
    };

    Ok(project)
}

// update a JSON object in a file (BROKEN ATM)
pub fn update_json_in_file(file_name: &str, project: &String) -> Result<Project, Box<dyn Error>> {
    // Get the user's documents directory path
    let documents_dir: PathBuf = dirs::document_dir().ok_or("Unable to find user's documents directory")?;
    let folder_path: PathBuf = documents_dir.join(PROJECT_FOLDER_NAME);
    create_app_dir(PROJECT_FOLDER_NAME)?;

    // Create the file path & Open the file for writing with explicit permissions
    let file_path: PathBuf = folder_path.join(file_name);
    let file: fs::File = open_file_with_read_write_permissions(&file_path.to_str().unwrap())?;
    
    // clear the file
    file.set_len(0)?;
    println!("Clearing file");
    
    // Parse the JSON object into a Project struct, log any errors
    let parsed_project: Result<Project, _> = serde_json::from_str(&project);
    if let Err(e) = parsed_project {
        log_error(&e);
        return Err(Box::from(e));
    }
    
    // Write the parsed JSON object to the file
    println!("Writing to file: {}", file_path.display());
    serde_json::to_writer_pretty(&file, &parsed_project.unwrap())?;
    println!("Successfully wrote to file");

    // Return the updated project
    Ok(serde_json::from_str(&project).unwrap())
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

    print!(
        "Updated project: {:?}",
        serde_json::to_string(&updated_project)
    );

    Ok(updated_project)
}

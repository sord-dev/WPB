// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;

use files::Project;
mod files;


#[tauri::command]
async fn scan_for_projects() -> Result<String, String> {
  let projects: Vec<Project> = files::scan_documents_directory().map_err(|e| e.to_string())?;
  
  Ok(serde_json::json!(&projects).to_string())
}

#[tauri::command]
async fn update_project(project_path: String, updated_project_data: String) -> Result<String, String> {
  let project_file: &str = project_path.split("/").last().unwrap();
  println!("Updating project: {}", project_file);

  let project: Project = files::update_json_in_file(project_file, &updated_project_data).map_err(|e| e.to_string())?;

  Ok(serde_json::json!(&project).to_string())
}

#[tauri::command]
async fn get_project(project_path: String) -> Result<Project, String> {
    // Extract the filename safely using the `Path` type
    let project_file = Path::new(&project_path).file_name().unwrap().to_str().unwrap();
    println!("Getting project: {}", project_file);

    // Use `unwrap_or` to handle potential errors gracefully
    let project_result = files::read_project_file(project_file).map_err(|e| {
        eprintln!("Error reading project file: {}", e);
        "Error reading project file".to_string()
    })?;

    // Return the project or an error message
    Ok(project_result)
}

#[tauri::command]
fn get_projects_directory() -> Result<String, String> {
    let documents_dir = dirs::document_dir().ok_or("Documents directory not found")?;
    let project_folder_name = "wpb-projects"; // Replace with your actual folder name
    let path = documents_dir.join(project_folder_name);
    Ok(path.to_string_lossy().to_string())
}

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![scan_for_projects, update_project, get_project, get_projects_directory])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
